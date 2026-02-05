import React, { useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const AddressForm = ({ data, setData, onSubmit, loading, error }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      // Handle nested address fields
      const field = name.split(".")[1];
      setData({
        ...data,
        [field]: value,
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData({
          ...data,
          geoLocation: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        });
        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
        setGettingLocation(false);
      },
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!data.city || !data.state) {
      alert("City and State are required");
      return;
    }

    // Validate coordinates
    if (
      data.geoLocation.coordinates[0] === 0 &&
      data.geoLocation.coordinates[1] === 0
    ) {
      alert("Please get your current location or enter coordinates manually");
      return;
    }

    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add Your Address
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* House/Flat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House/Flat Number
          </label>
          <input
            type="text"
            name="houseOrFlat"
            value={data.houseOrFlat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter house or flat number"
          />
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street
          </label>
          <input
            type="text"
            name="street"
            value={data.street}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter street name"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area/Locality
          </label>
          <input
            type="text"
            name="area"
            value={data.area}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter area or locality"
          />
        </div>

        {/* City and District */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              name="district"
              value={data.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter district"
            />
          </div>
        </div>

        {/* State and Pincode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              name="state"
              value={data.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={data.pincode}
              onChange={handleChange}
              maxLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            placeholder="India"
            readOnly
          />
        </div>

        {/* Geolocation */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Location Coordinates *
          </label>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="mb-3 w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {gettingLocation ? "Getting Location..." : "Get Current Location"}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={data.geoLocation.coordinates[0]}
                onChange={(e) =>
                  setData({
                    ...data,
                    geoLocation: {
                      ...data.geoLocation,
                      coordinates: [
                        parseFloat(e.target.value) || 0,
                        data.geoLocation.coordinates[1],
                      ],
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Longitude"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={data.geoLocation.coordinates[1]}
                onChange={(e) =>
                  setData({
                    ...data,
                    geoLocation: {
                      ...data.geoLocation,
                      coordinates: [
                        data.geoLocation.coordinates[0],
                        parseFloat(e.target.value) || 0,
                      ],
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Latitude"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? "Saving Address..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
