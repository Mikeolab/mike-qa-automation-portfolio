const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
          <div className="w-16 h-16 mx-auto mb-4">
            <svg
              className="text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-300 mb-8">
            Oops! The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
