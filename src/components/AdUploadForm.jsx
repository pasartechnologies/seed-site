import React from "react";

const AdUploadForm = ({
  data,
  setData,
  onSubmit,
  onSkip,
  onFileUpload,
  uploadProgress,
  loading,
  error,
}) => {
  const PRODUCT_TYPES = ["product", "service"];
  const STOCK_TYPES = ["fmcg", "nonFmcg"];

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleBudgetChange = (field, value) => {
    setData({
      ...data,
      budget: {
        ...data.budget,
        [field]: value,
      },
    });
  };

  const handleFileChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file, type, index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate based on ad type
    if (data.adType === "adlisting") {
      const minBudget = parseFloat(data.budget.min);
      const maxBudget = parseFloat(data.budget.max);

      if (minBudget > maxBudget) {
        alert("Minimum budget cannot be greater than maximum budget");
        return;
      }
    } else if (data.adType === "stockad") {
      const mrp = parseFloat(data.mrp);
      const sellingPrice = parseFloat(data.sellingPrice);

      if (sellingPrice > mrp) {
        alert("Selling price cannot be greater than MRP");
        return;
      }

      // Validate stockExp for FMCG
      if (data.stockType === "fmcg" && !data.stockExp) {
        alert("Expiry date is required for FMCG products");
        return;
      }
    }

    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Create Your First Ad
      </h2>
      <p className="text-gray-600 mb-6">
        Optional: Post your first ad to get started (you can skip this step)
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ad Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ad Type *
          </label>
          <select
            name="adType"
            value={data.adType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="adlisting">Ad Listing (Services/Products)</option>
            <option value="stockad">Stock Ad (Inventory)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {data.adType === "adlisting"
              ? "For services or product requirements"
              : "For selling inventory/stock"}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ad Title *
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              data.adType === "adlisting"
                ? "What are you looking for?"
                : "What are you selling?"
            }
          />
        </div>

        {/* Conditional Fields for Ad Listing */}
        {data.adType === "adlisting" && (
          <>
            {/* Product Type (Tabs) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <div className="flex gap-2 mb-2">
                {PRODUCT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setData({ ...data, product: type })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      data.product === type
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Choose whether you're looking for a product or service
              </p>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (₹) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Minimum Budget
                  </label>
                  <input
                    type="number"
                    value={data.budget.min}
                    onChange={(e) => handleBudgetChange("min", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min amount"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Maximum Budget
                  </label>
                  <input
                    type="number"
                    value={data.budget.max}
                    onChange={(e) => handleBudgetChange("max", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Max amount"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your budget range for this product/service
              </p>
            </div>

            {/* Budget Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Frequency *
              </label>
              <select
                name="budgetFrequency"
                value={data.budgetFrequency}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How often this budget applies
              </p>
            </div>

            {/* Experience - Only for service type */}
            {data.product === "service" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience Required (Optional)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={data.experience}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 or 3.5 years"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter minimum years of experience required for service
                  providers
                </p>
              </div>
            )}
          </>
        )}

        {/* Conditional Fields for Stock Ad */}
        {data.adType === "stockad" && (
          <>
            {/* Stock Type (Tabs) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Type *
              </label>
              <div className="flex gap-2 mb-2">
                {STOCK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setData({ ...data, stockType: type })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      data.stockType === type
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                FMCG: Fast Moving Consumer Goods (food, beverages, etc.)
              </p>
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                name="brandName"
                value={data.brandName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Nestle, Samsung, etc."
              />
            </div>

            {/* MRP and Selling Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={data.mrp}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Maximum Retail Price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={data.sellingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your selling price"
                />
              </div>
            </div>

            {/* Stock Manufacturing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturing Date *
              </label>
              <input
                type="date"
                name="stockMfg"
                value={data.stockMfg}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Stock Expiry Date - Only for FMCG */}
            {data.stockType === "fmcg" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="stockExp"
                  value={data.stockExp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for FMCG products
                </p>
              </div>
            )}

            {/* Minimum Order Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity *
              </label>
              <input
                type="number"
                name="minOrderQty"
                value={data.minOrderQty}
                onChange={handleChange}
                required
                min="1"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10 units"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum quantity a customer must order
              </p>
            </div>
          </>
        )}

        {/* Category (Common for both) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={data.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              data.adType === "adlisting"
                ? "e.g., house maid, driver, electrician, laptop, mobile"
                : "e.g., beverages, electronics, clothing"
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the specific category
          </p>
        </div>

        {/* Description (Common for both) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              data.adType === "adlisting"
                ? "Describe what you're looking for in detail..."
                : "Describe your stock/product in detail..."
            }
          />
        </div>

        {/* Media Section (Common for both) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Media Attachments (Optional)
          </h3>

          {/* Video Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Presentation
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {data.media.video ? (
                  <span className="text-green-600 font-medium">
                    Video Uploaded ✓
                  </span>
                ) : (
                  <span className="text-gray-500">Click to upload video</span>
                )}
              </div>
              {uploadProgress["video"] > 0 && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress["video"]}%` }}
                />
              )}
            </div>
          </div>

          {/* Image Grid (Parallel Uploads) */}
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative group aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden hover:bg-gray-100 transition"
              >
                {data.media.images[i] ? (
                  <img
                    src={data.media.images[i]}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Image {i + 1}</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image", i)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {/* Progress Overlay */}
                {uploadProgress[`image_${i}`] > 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {uploadProgress[`image_${i}`]}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Creating Ad..." : "Create Ad & Complete"}
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdUploadForm;
