import { useState } from "react";
import { apiService } from "../services/api";

export const useRegistration = () => {
  const [step, setStep] = useState("initial"); // initial, otp, userDetails, address, complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [otpFromServer, setOtpFromServer] = useState(null); // For development/testing

  // Function to select random languages
  const getRandomLanguages = () => {
    const availableLanguages = [
      "English",
      "Hindi",
      "Bengali",
      "Telugu",
      "Marathi",
      "Tamil",
      "Gujarati",
      "Urdu",
      "Kannada",
      "Malayalam",
      "Punjabi",
    ];

    // Randomly select 2 or 3 languages
    const count = Math.random() < 0.5 ? 2 : 3;
    const shuffled = [...availableLanguages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    accountType: "individual", // Always individual
  });

  const [otpData, setOtpData] = useState({
    otp: "",
  });

  const [userDetails, setUserDetails] = useState({
    profilePic: "",
    gender: "",
    dob: "",
    languages: getRandomLanguages(),
    schedule: [
      {
        day: "Monday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Tuesday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Wednesday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Thursday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Friday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Saturday",
        isOpen: true,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
      {
        day: "Sunday",
        isOpen: false,
        start: { hour: 9, minute: 0 },
        end: { hour: 17, minute: 0 },
      },
    ],
  });

  const [addressData, setAddressData] = useState({
    houseOrFlat: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",
    geoLocation: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const handleRegistration = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.register(registrationData);

      // Store OTP from response (for development/testing)
      if (response.otp) {
        setOtpFromServer(response.otp);
        console.log("OTP received:", response.otp);
      }

      setSuccessMessage(
        response.msg || "OTP sent successfully! Please check your phone.",
      );
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.verifyRegister({
        phone: registrationData.phone,
        otp: otpData.otp,
      });

      setSuccessMessage("OTP verified successfully!");
      setStep("userDetails");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.register(registrationData);

      if (response.otp) {
        setOtpFromServer(response.otp);
        console.log("New OTP received:", response.otp);
      }

      setSuccessMessage("OTP resent successfully!");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to resend OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Update personal info
      const personalData = {};
      if (userDetails.profilePic)
        personalData.profilePic = userDetails.profilePic;
      if (userDetails.gender) personalData.gender = userDetails.gender;
      if (userDetails.dob) personalData.dob = userDetails.dob;

      if (Object.keys(personalData).length > 0) {
        await apiService.updatePersonalInfo(personalData);
      }

      // Update languages
      if (userDetails.languages.length > 0) {
        await apiService.updateLanguages(userDetails.languages);
      }

      // Update schedule
      if (userDetails.schedule.length > 0) {
        await apiService.updateSchedule(userDetails.schedule);
      }

      setSuccessMessage("Profile details saved successfully!");
      setStep("address");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.message ||
          "Failed to update user details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiService.createAddress(addressData);
      setSuccessMessage("Address saved successfully! Registration complete.");
      setStep("complete");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to create address",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    error,
    successMessage,
    otpFromServer, // Expose for development/testing
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
  };
};
