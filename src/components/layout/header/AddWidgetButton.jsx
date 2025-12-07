export default function AddWidgetButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 cursor-pointer rounded-lg bg-green-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-green-700 transition-all hover:scale-105 shadow-sm flex-1 sm:flex-initial justify-center"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Widget
      </button>
    );
  }
  