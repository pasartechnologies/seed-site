import React, { useEffect } from "react";

const RegistrationForm = ({ data, setData, onSubmit, loading, error }) => {
  // Generate email from full name
  const generateEmail = (fullName) => {
    if (!fullName) return "";

    // Extract first name (first word)
    const firstName = fullName.trim().split(" ")[0].toLowerCase();

    // Generate random 2-3 digit number
    const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999

    // Randomly choose email provider
    const providers = ["gmail.com", "outlook.com"];
    const provider = providers[Math.floor(Math.random() * providers.length)];

    return `${firstName}${randomDigits}@${provider}`;
  };

  // Auto-generate email when fullName changes
  useEffect(() => {
    if (data.fullName && !data.email) {
      const generatedEmail = generateEmail(data.fullName);
      setData({ ...data, email: generatedEmail, password: "Abc@123" });
    }
  }, [data.fullName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      // Auto-generate email when full name changes
      const generatedEmail = generateEmail(value);
      setData({
        ...data,
        fullName: value,
        email: generatedEmail,
        password: "Abc@123",
      });
    } else if (name === "phone") {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Type - Display Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
            Individual
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This is an individual account for personal use
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter 10-digit phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Auto-generated)
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            placeholder="Will be generated from your name"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email is automatically generated from your first name
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password (Default)
          </label>
          <input
            type="text"
            name="password"
            value={data.password || "Abc@123"}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Default password: Abc@123 (cannot be changed during registration)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
