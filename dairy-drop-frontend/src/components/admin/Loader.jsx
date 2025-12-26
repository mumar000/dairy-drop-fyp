export default function Loader({ text }) {
    return (
        <div className="flex items-center justify-center mt-20">
            <div className="text-center">
                {/* Animated spinner */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                </div>

                {/* Loading text with pulse animation */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        {text || 'Loading...'}
                    </h2>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-slate-500 text-sm">Please wait while we prepare your data</p>
                </div>

                {/* Optional: Progress bar */}
                <div className="mt-8 w-64 mx-auto">
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}