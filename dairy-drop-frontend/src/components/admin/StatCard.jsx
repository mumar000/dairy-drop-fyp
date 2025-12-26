const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div className="bg-white shadow-sm border border-gray-300 p-6 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl ${colorClasses[color] || colorClasses.blue} flex items-center justify-center flex-shrink-0`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

export default StatCard