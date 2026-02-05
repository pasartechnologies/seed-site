import React from "react";
import { useRegistration } from "./hooks/useRegistration";
import RegistrationForm from "./components/RegistrationForm";
import OTPVerificationForm from "./components/OTPVerificationForm";
import UserDetailsForm from "./components/UserDetailsForm";
import AddressForm from "./components/AddressForm";
import CompletionScreen from "./components/CompletionScreen";
import JsonDataImporter from "./components/JsonDataImporter";

function App() {
  const {
    step,
    loading,
    error,
    successMessage,
    otpFromServer,
    registrationData,
    setRegistrationData,
    otpData,
    setOtpData,
    userDetails,
    setUserDetails,
    addressData,
    setAddressData,
    handleRegistration,
    handleOTPVerification,
    handleResendOTP,
    handleUserDetailsSubmit,
    handleAddressSubmit,
  } = useRegistration();

  const handleJsonImport = (importedData) => {
    // Update registration data
    if (importedData.registration) {
      setRegistrationData((prev) => ({
        ...prev,
        ...importedData.registration,
      }));
    }

    // Update user details
    if (importedData.userDetails) {
      setUserDetails((prev) => ({
        ...prev,
        ...importedData.userDetails,
      }));
    }

    // Update address data
    if (importedData.address) {
      setAddressData((prev) => ({
        ...prev,
        ...importedData.address,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* JSON Data Importer - Only show before completing registration */}
        {step !== "complete" && (
          <JsonDataImporter onImport={handleJsonImport} />
        )}

        {/* Success Message - Global */}
        {successMessage && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div
              className={`flex flex-col items-center ${step !== "initial" ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step !== "initial"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step !== "initial" ? "✓" : "1"}
              </div>
              <span className="text-xs mt-2 font-medium">Register</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                step === "otp" ||
                step === "userDetails" ||
                step === "address" ||
                step === "complete"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                step === "otp" ||
                step === "userDetails" ||
                step === "address" ||
                step === "complete"
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "userDetails" ||
                  step === "address" ||
                  step === "complete"
                    ? "bg-green-500 text-white"
                    : step === "otp"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {step === "userDetails" ||
                step === "address" ||
                step === "complete"
                  ? "✓"
                  : "2"}
              </div>
              <span className="text-xs mt-2 font-medium">Verify</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                step === "userDetails" ||
                step === "address" ||
                step === "complete"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                step === "userDetails" ||
                step === "address" ||
                step === "complete"
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "address" || step === "complete"
                    ? "bg-green-500 text-white"
                    : step === "userDetails"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {step === "address" || step === "complete" ? "✓" : "3"}
              </div>
              <span className="text-xs mt-2 font-medium">Profile</span>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                step === "address" || step === "complete"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                step === "address" || step === "complete"
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === "complete"
                    ? "bg-green-500 text-white"
                    : step === "address"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {step === "complete" ? "✓" : "4"}
              </div>
              <span className="text-xs mt-2 font-medium">Address</span>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        {step === "initial" && (
          <RegistrationForm
            data={registrationData}
            setData={setRegistrationData}
            onSubmit={handleRegistration}
            loading={loading}
            error={error}
          />
        )}

        {step === "otp" && (
          <OTPVerificationForm
            data={otpData}
            setData={setOtpData}
            onSubmit={handleOTPVerification}
            onResend={handleResendOTP}
            loading={loading}
            error={error}
            phone={registrationData.phone}
            otpFromServer={otpFromServer}
          />
        )}

        {step === "userDetails" && (
          <UserDetailsForm
            data={userDetails}
            setData={setUserDetails}
            onSubmit={handleUserDetailsSubmit}
            loading={loading}
            error={error}
          />
        )}

        {step === "address" && (
          <AddressForm
            data={addressData}
            setData={setAddressData}
            onSubmit={handleAddressSubmit}
            loading={loading}
            error={error}
          />
        )}

        {step === "complete" && <CompletionScreen />}
      </div>
    </div>
  );
}

export default App;
