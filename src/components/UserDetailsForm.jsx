import ScheduleComponent from "./ScheduleComponent";
import ImageUploader from "./ImageUploader";

const AVAILABLE_LANGUAGES = [
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
  "Other",
];

const UserDetailsForm = ({ data, setData, onSubmit, loading, error }) => {
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLanguageToggle = (lang) => {
    const currentLanguages = data.languages || [];
    if (currentLanguages.includes(lang)) {
      setData({
        ...data,
        languages: currentLanguages.filter((l) => l !== lang),
      });
    } else {
      setData({
        ...data,
        languages: [...currentLanguages, lang],
      });
    }
  };

  const handleScheduleChange = (schedule) => {
    setData({ ...data, schedule });
  };

  const handleImageUpload = (secureUrl) => {
    setData({ ...data, profilePic: secureUrl });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Complete Your Profile
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <ImageUploader
            currentImage={data.profilePic}
            onImageUpload={handleImageUpload}
            folder="profile-pictures"
            disabled={loading}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={data.gender === "male"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={data.gender === "female"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={data.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Languages (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <label key={lang} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.languages?.includes(lang)}
                  onChange={() => handleLanguageToggle(lang)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <ScheduleComponent
          schedule={data.schedule || []}
          setSchedule={handleScheduleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? "Saving..." : "Continue to Address"}
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
