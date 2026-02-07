import { useState } from "react";
import { apiService } from "../services/api";
import { cloudinaryService } from "../services/cloudinaryService";

export const useRegistration = () => {
  const [step, setStep] = useState("initial"); // initial, otp, userDetails, address, adlisting, complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [otpFromServer, setOtpFromServer] = useState(null);
  const [createdAddressId, setCreatedAddressId] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState("adlisting");

  const [createdAdId, setCreatedAdId] = useState(null);
  const [adPlans, setAdPlans] = useState(null);

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

    const count = Math.random() < 0.5 ? 2 : 3;
    const shuffled = [...availableLanguages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    accountType: "individual",
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

  const [uploadProgress, setUploadProgress] = useState({});

  const [adListingData, setAdListingData] = useState({
    adType: "adlisting",
    title: "",
    category: "",
    product: "",
    budget: {
      min: "",
      max: "",
    },
    budgetFrequency: "daily",
    description: "",
    experience: "",
    media: {
      video: "",
      images: [],
    },

    // Stock ad fields
    stockType: "",
    mrp: "",
    sellingPrice: "",
    stockMfg: "",
    stockExp: "", // Added for FMCG
    brandName: "",
    minOrderQty: "",
  });

  const handleRegistration = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.register(registrationData);

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

      const personalData = {};
      if (userDetails.profilePic)
        personalData.profilePic = userDetails.profilePic;
      if (userDetails.gender) personalData.gender = userDetails.gender;
      if (userDetails.dob) personalData.dob = userDetails.dob;

      if (Object.keys(personalData).length > 0) {
        await apiService.updatePersonalInfo(personalData);
      }

      if (userDetails.languages.length > 0) {
        await apiService.updateLanguages(userDetails.languages);
      }

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

      const response = await apiService.createAddress(addressData);

      // Store the created address ID for adlisting creation
      if (response.data && response.data._id) {
        setCreatedAddressId(response.data._id);
      }

      setSuccessMessage("Address saved successfully!");
      setStep("adlisting");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to create address",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdListingSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const adData = {
        addressId: createdAddressId,
        geoLocation: addressData.geoLocation,
        title: adListingData.title,
        category: adListingData.category,
        description: adListingData.description,
        media: {
          video: adListingData.media.video || "",
          images: adListingData.media.images.filter((img) => img),
        },
      };

      // Add fields based on ad type
      if (adListingData.adType === "adlisting") {
        adData.product = adListingData.product;
        adData.budget = {
          min: parseFloat(adListingData.budget.min),
          max: parseFloat(adListingData.budget.max),
        };
        adData.budgetFrequency = adListingData.budgetFrequency;

        // Only add experience if product type is service and experience is provided
        if (
          adListingData.product === "service" &&
          adListingData.experience &&
          adListingData.experience !== ""
        ) {
          adData.experience = parseFloat(adListingData.experience);
        }
      } else if (adListingData.adType === "stockad") {
        adData.stockType = adListingData.stockType;
        adData.mrp = parseFloat(adListingData.mrp);
        adData.sellingPrice = parseFloat(adListingData.sellingPrice);
        adData.stockMfg = adListingData.stockMfg;
        adData.brandName = adListingData.brandName;
        adData.minOrderQty = parseInt(adListingData.minOrderQty);

        // Only add stockExp if stockType is fmcg
        if (
          adListingData.stockType === "fmcg" &&
          adListingData.stockExp &&
          adListingData.stockExp !== ""
        ) {
          adData.stockExp = adListingData.stockExp;
        }
      }

      const response = await apiService.createAd(adListingData.adType, adData);

      // Store the created ad ID
      if (response.data && response.data._id) {
        setCreatedAdId(response.data._id);

        // Fetch available plans
        const plansResponse = await apiService.getAdPlans(
          adListingData.adType,
          response.data._id,
        );
        setAdPlans(plansResponse.data);
      }

      setSuccessMessage("Ad created successfully! Now choose your plan.");
      setStep("adplans");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to create ad listing",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type, index = null) => {
    const progressKey = index !== null ? `${type}_${index}` : type;

    try {
      setError(null);
      setUploadProgress((prev) => ({ ...prev, [progressKey]: 1 }));

      // 1. Get Signature from backend
      const folder = type === "video" ? "ad-videos" : "ad-images";
      const sigData = await cloudinaryService.getSignature(folder);

      // 2. Upload to Cloudinary with progress callback
      const secureUrl = await cloudinaryService.uploadFile(
        file,
        sigData,
        (percent) => {
          setUploadProgress((prev) => ({ ...prev, [progressKey]: percent }));
        },
      );

      // 3. Update state based on type
      setAdListingData((prev) => {
        if (type === "video") {
          return { ...prev, media: { ...prev.media, video: secureUrl } };
        } else {
          const newImages = [...prev.media.images];
          newImages[index] = secureUrl;
          return { ...prev, media: { ...prev.media, images: newImages } };
        }
      });
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      // Clear progress bar after brief delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[progressKey];
          return next;
        });
      }, 2000);
    }
  };

  const handleAdPlansSubmit = async (plansData) => {
    try {
      setLoading(true);
      setError(null);

      await apiService.applyAdPlans(
        adListingData.adType,
        createdAdId,
        plansData,
      );

      setSuccessMessage("Plans applied successfully! Registration complete.");
      setStep("complete");
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Failed to apply plans",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAdListing = () => {
    setStep("complete");
  };

  return {
    step,
    loading,
    error,
    successMessage,
    handleResendOTP,
    otpData,
    setOtpData,
    handleFileUpload,
    otpFromServer,
    registrationData,
    setRegistrationData,
    userDetails,
    setUserDetails,
    addressData,
    setAddressData,
    adListingData,
    setAdListingData,
    uploadProgress,
    handleRegistration,
    handleOTPVerification,
    handleUserDetailsSubmit,
    handleAddressSubmit,
    handleAdListingSubmit,
    handleSkipAdListing,
    createdAdId,
    adPlans,
    handleAdPlansSubmit,
    selectedAdType,
    setSelectedAdType,
  };
};
