import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center p-8  rounded-lg shadow-xl max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
          <div className="w-16 h-16 mx-auto mb-4">
            <svg
              className="text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-300 mb-8">
            Sorry, you don't have permission to access this page or your session
            has expired.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
