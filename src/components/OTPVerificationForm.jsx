import React, { useState, useEffect, useRef } from "react";
import { DEV_CONFIG } from "../config/config";

const OTPVerificationForm = ({
  data,
  setData,
  onSubmit,
  onResend,
  loading,
  error,
  phone,
  otpFromServer, // For development - shows OTP in UI
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);
  const inputRefs = useRef([]);
  const hasAutoFilled = useRef(false);

  // Auto-fill OTP when it's received from server (development mode)
  useEffect(() => {
    if (
      otpFromServer &&
      !hasAutoFilled.current &&
      !loading &&
      DEV_CONFIG.AUTO_VERIFY_OTP
    ) {
      hasAutoFilled.current = true;

      // First update the OTP state
      setData({ ...data, otp: otpFromServer });
    }
  }, [otpFromServer, loading]);

  // Separate effect to trigger auto-verification after OTP is filled
  useEffect(() => {
    let timer;

    if (
      hasAutoFilled.current &&
      data.otp.length === 6 &&
      !loading &&
      !autoVerifying &&
      DEV_CONFIG.AUTO_VERIFY_OTP
    ) {
      // Auto-verify after configured delay
      console.log("Starting auto-verify for OTP:", data.otp);
      setAutoVerifying(true);

      timer = setTimeout(() => {
        console.log("Calling onSubmit with OTP:", data.otp);
        onSubmit();
        // Reset auto-verifying after a short delay
        setTimeout(() => setAutoVerifying(false), 300);
      }, DEV_CONFIG.AUTO_VERIFY_DELAY);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [data.otp]);

  // Reset hasAutoFilled when OTP changes (for resend functionality)
  useEffect(() => {
    if (!otpFromServer) {
      hasAutoFilled.current = false;
    }
  }, [otpFromServer]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update the OTP data
    const otpArray = data.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setData({ ...data, otp: newOtp });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !data.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    setData({ ...data, otp: pastedData });

    const focusIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.otp.length === 6) {
      onSubmit();
    }
  };

  const handleResend = async () => {
    if (canResend && !loading && onResend) {
      setCanResend(false);
      setCountdown(60);
      setData({ ...data, otp: "" });
      hasAutoFilled.current = false;
      await onResend();
    }
  };

  // Split OTP into individual digits for display
  const otpDigits = data.otp.padEnd(6, " ").split("");

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-gray-800">{phone}</span>
        </p>
      </div>

      {/* Development Helper - Shows OTP from server */}
      {otpFromServer && DEV_CONFIG.SHOW_OTP_IN_UI && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Development Mode{" "}
                {DEV_CONFIG.AUTO_VERIFY_OTP && "- Auto-Verify Enabled"}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                OTP:{" "}
                <span className="font-mono font-bold">{otpFromServer}</span>
              </p>
              {DEV_CONFIG.AUTO_VERIFY_OTP && (
                <p className="text-xs text-yellow-600 mt-1">
                  ✨ OTP will be auto-filled and verified in{" "}
                  {DEV_CONFIG.AUTO_VERIFY_DELAY / 1000} second(s)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter OTP
          </label>
          <div className="flex justify-center gap-2 mb-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit.trim()}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                disabled={loading}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Paste the 6-digit code or enter it manually
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || data.otp.length !== 6 || autoVerifying}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {loading || autoVerifying ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {autoVerifying ? "Auto-Verifying..." : "Verifying..."}
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend available in{" "}
              <span className="font-semibold text-gray-700">{countdown}s</span>
            </p>
          )}
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Having trouble? Make sure you entered the correct phone number and
          check your messages.
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
