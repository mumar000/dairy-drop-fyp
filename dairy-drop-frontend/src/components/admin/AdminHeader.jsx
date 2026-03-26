import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationsReadMutation,
} from "../../api/adminApi.js";
import { getSocket } from "../../lib/socket.js";

const AdminHeader = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isOpen, setIsOpen] = useState(false);
  const previousUnreadCountRef = useRef(0);
  const { data, refetch } = useGetAdminNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const [markAdminNotificationsRead] = useMarkAdminNotificationsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  useEffect(() => {
    if (
      previousUnreadCountRef.current > 0 &&
      unreadCount > previousUnreadCountRef.current
    ) {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.05;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.12);
    }

    previousUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (window.location.hostname !== "localhost") return;

    const socket = getSocket();

    socket.emit("join-admin-room");

    const handleAdminNotification = async (payload) => {
      console.log("Realtime admin notification:", payload);

      try {
        await refetch();
      } catch (error) {
        console.error("Failed to refetch notifications", error);
      }
    };

    socket.on("admin-notification", handleAdminNotification);
    socket.on("admin-notification-update", handleAdminNotification);

    return () => {
      socket.off("admin-notification", handleAdminNotification);
      socket.off("admin-notification-update", handleAdminNotification);
    };
  }, [refetch]);

  const handleBellClick = async () => {
    setIsOpen((value) => !value);

    if (unreadCount > 0) {
      try {
        await markAdminNotificationsRead().unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to mark notifications read", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm p-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800 pr-4">
        Hey, {userInfo?.user?.name || "Admin"}!
      </h1>
      <span className="flex-1 text-sm text-blue-600">Manage Your Dairy</span>
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-xs text-gray-500">
                  Refund requests and review updates
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-500 text-center">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`px-4 py-3 border-b border-gray-100 ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {userInfo?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {userInfo?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">{userInfo?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
