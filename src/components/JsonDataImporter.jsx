import React, { useState } from "react";

const JsonDataImporter = ({ onImport }) => {
  const [showImporter, setShowImporter] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState(null);

  const DEFAULT_SCHEDULE = [
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
  ];

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

  const handleImport = () => {
    try {
      setError(null);
      const data = JSON.parse(jsonInput);

      // Validate schedule data if provided
      let scheduleData = DEFAULT_SCHEDULE;
      if (data.schedule && Array.isArray(data.schedule)) {
        scheduleData = data.schedule.map((daySchedule, index) => ({
          day: daySchedule.day || DEFAULT_SCHEDULE[index].day,
          isOpen: daySchedule.isOpen ?? DEFAULT_SCHEDULE[index].isOpen,
          start: {
            hour: daySchedule.start?.hour ?? DEFAULT_SCHEDULE[index].start.hour,
            minute:
              daySchedule.start?.minute ?? DEFAULT_SCHEDULE[index].start.minute,
          },
          end: {
            hour: daySchedule.end?.hour ?? DEFAULT_SCHEDULE[index].end.hour,
            minute:
              daySchedule.end?.minute ?? DEFAULT_SCHEDULE[index].end.minute,
          },
        }));
      }

      // Normalize address data - handle both nested and flat structures
      const addressFields = {
        houseOrFlat: data.address?.houseOrFlat || data.houseOrFlat || "",
        street: data.address?.street || data.street || "",
        area: data.address?.area || data.area || "",
        city: data.address?.city || data.city || "",
        district: data.address?.district || data.district || "",
        state: data.address?.state || data.state || "",
        pincode: data.address?.pincode || data.pincode || "",
        country: data.address?.country || data.country || "India",
      };

      // Normalize geoLocation
      const geoLocation = data.address?.geoLocation ||
        data.geoLocation || {
          type: "Point",
          coordinates: [0, 0],
        };

      // Ensure geoLocation has proper structure
      if (geoLocation.coordinates && geoLocation.coordinates.length === 2) {
        geoLocation.coordinates = [
          parseFloat(geoLocation.coordinates[0]) || 0,
          parseFloat(geoLocation.coordinates[1]) || 0,
        ];
      }

      // Determine ad type from data
      const adType =
        data.adType ||
        data.adlisting?.adType ||
        data.stockad?.adType ||
        "adlisting";

      // Normalize ad listing data based on type
      let adListingFields = {
        adType: adType,
        title: data.title || data.adlisting?.title || data.stockad?.title || "",
        category:
          data.category ||
          data.adlisting?.category ||
          data.stockad?.category ||
          "",
        description:
          data.description ||
          data.adlisting?.description ||
          data.stockad?.description ||
          "",
      };

      // Add fields based on ad type
      if (adType === "adlisting") {
        // Ad Listing specific fields
        adListingFields.product = data.product || data.adlisting?.product || "";
        adListingFields.budgetFrequency =
          data.budgetFrequency || data.adlisting?.budgetFrequency || "daily";
        adListingFields.experience =
          data.experience || data.adlisting?.experience || "";

        // Handle budget - support both object and legacy single value
        adListingFields.budget = { min: "", max: "" };
        const budgetData = data.budget || data.adlisting?.budget;
        if (budgetData) {
          if (typeof budgetData === "object" && budgetData.min !== undefined) {
            adListingFields.budget = {
              min: budgetData.min?.toString() || "",
              max: budgetData.max?.toString() || "",
            };
          } else if (
            typeof budgetData === "string" ||
            typeof budgetData === "number"
          ) {
            const budgetValue = budgetData.toString();
            adListingFields.budget = {
              min: budgetValue,
              max: budgetValue,
            };
          }
        }
      } else if (adType === "stockad") {
        // Stock Ad specific fields
        adListingFields.stockType =
          data.stockType || data.stockad?.stockType || "";
        adListingFields.mrp = data.mrp || data.stockad?.mrp || "";
        adListingFields.sellingPrice =
          data.sellingPrice || data.stockad?.sellingPrice || "";
        adListingFields.stockMfg =
          data.stockMfg || data.stockad?.stockMfg || "";
        adListingFields.stockExp =
          data.stockExp || data.stockad?.stockExp || "";
        adListingFields.brandName =
          data.brandName || data.stockad?.brandName || "";
        adListingFields.minOrderQty =
          data.minOrderQty || data.stockad?.minOrderQty || "";
      }

      // Structure the import data
      const importData = {
        registration: {
          fullName: data.fullName || "",
          phone: data.phone || "",
          email: data.email || "",
          password: data.password || "",
          accountType: "individual", // Always individual
        },
        userDetails: {
          profilePic: data.profilePic || "",
          gender: data.gender || "",
          dob: data.dob || "",
          languages:
            Array.isArray(data.languages) && data.languages.length > 0
              ? data.languages
              : getRandomLanguages(), // Use random if not provided
          schedule: scheduleData,
        },
        address: {
          ...addressFields,
          geoLocation,
        },
        adlisting: adListingFields,
      };

      onImport(importData);
      setShowImporter(false);
      setJsonInput("");
      setError(null);
    } catch (err) {
      setError(
        "Invalid JSON format. Please check your input and try again.\n" +
          err.message,
      );
    }
  };

  const sampleAdListingJson = {
    fullName: "John Doe",
    phone: "9876543210",
    gender: "male",
    dob: "1990-01-15",
    address: {
      houseOrFlat: "Apt 101",
      street: "MG Road",
      area: "Koramangala",
      city: "Bangalore",
      district: "Bangalore Urban",
      pincode: "560034",
    },
    geoLocation: {
      type: "Point",
      coordinates: [77.6117, 12.9352],
    },
    adType: "adlisting",
    title: "Looking for Experienced Plumber",
    category: "home services",
    product: "service",
    budget: {
      min: 500,
      max: 1000,
    },
    budgetFrequency: "hourly",
    description: "Need a professional plumber for bathroom renovation work.",
    experience: "3.5",
  };

  const sampleStockAdJson = {
    fullName: "Jane Smith",
    phone: "9876543211",
    gender: "female",
    dob: "1992-05-20",
    address: {
      houseOrFlat: "Shop 5, Ground Floor",
      street: "Brigade Road",
      area: "Central Business District",
      city: "Bangalore",
      district: "Bangalore Urban",
      pincode: "560025",
    },
    geoLocation: {
      type: "Point",
      coordinates: [77.6094, 12.9716],
    },
    adType: "stockad",
    title: "Nestle Maggi Noodles - Bulk Stock Available",
    category: "food & beverages",
    stockType: "fmcg",
    mrp: 12,
    sellingPrice: 10,
    stockMfg: "2025-01-15",
    stockExp: "2025-12-31",
    brandName: "Nestle",
    minOrderQty: 100,
    description:
      "Fresh stock of Nestle Maggi noodles. Perfect for retailers and wholesalers.",
  };

  const copySampleJson = (type) => {
    const sample = type === "stockad" ? sampleStockAdJson : sampleAdListingJson;
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonInput(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-6 max-w-2xl mx-auto">
      {!showImporter ? (
        <button
          onClick={() => setShowImporter(true)}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Import JSON Data (Ad Listing / Stock Ad)
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Import JSON Data
            </h3>
            <button
              onClick={() => {
                setShowImporter(false);
                setError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Paste your JSON data or upload a JSON file to automatically fill all
            form fields. Supports both Ad Listing and Stock Ad formats.
          </p>

          {/* Sample JSON Buttons */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => copySampleJson("adlisting")}
              className="flex-1 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 py-2 px-3 rounded-lg font-medium text-sm transition duration-200"
            >
              📋 Ad Listing Sample
            </button>
            <button
              onClick={() => copySampleJson("stockad")}
              className="flex-1 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 py-2 px-3 rounded-lg font-medium text-sm transition duration-200"
            >
              📦 Stock Ad Sample
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded whitespace-pre-wrap text-sm">
              {error}
            </div>
          )}

          {/* File Upload Button */}
          <div className="mb-4">
            <label className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-200">
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Upload JSON File
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            placeholder='{"fullName": "John Doe", "phone": "9876543210", "adType": "adlisting", ...}'
          />

          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleImport}
              disabled={!jsonInput.trim()}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              Import Data
            </button>
            <button
              onClick={() => {
                setShowImporter(false);
                setJsonInput("");
                setError(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
              📋 View Ad Listing JSON Example
            </summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto border border-gray-200">
              {JSON.stringify(sampleAdListingJson, null, 2)}
            </pre>
          </details>

          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
              📦 View Stock Ad JSON Example
            </summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto border border-gray-200">
              {JSON.stringify(sampleStockAdJson, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default JsonDataImporter;
