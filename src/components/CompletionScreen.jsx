import React from "react";

const CompletionScreen = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <div className="text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Registration Complete!
        </h2>

        <p className="text-gray-600 mb-8">
          Your account has been successfully created and verified.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
          >
            Create Another Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
