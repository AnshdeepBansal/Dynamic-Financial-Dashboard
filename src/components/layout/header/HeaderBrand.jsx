export default function HeaderBrand({ isDark, activeWidgetsCount }) {
    const hasActiveWidgetsCount =
      typeof activeWidgetsCount === 'number' && activeWidgetsCount >= 0;
  
    return (
      <>
        <div className="flex items-center gap-2 sm:gap-3">
          <svg
            className="h-6 w-6 sm:h-7 sm:w-7 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Finance Dashboard
          </h1>
        </div>
  
        {hasActiveWidgetsCount && (
          <div
            className={`text-xs sm:text-sm font-medium px-2 py-1 rounded ${
              isDark
                ? 'text-gray-400 bg-gray-800'
                : 'text-gray-600 bg-gray-100'
            } hidden sm:block`}
          >
            {activeWidgetsCount} active widget
            {activeWidgetsCount !== 1 ? 's' : ''}
          </div>
        )}
      </>
    );
  }
  