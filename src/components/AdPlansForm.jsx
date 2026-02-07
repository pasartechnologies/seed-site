import React, { useEffect, useState } from "react";

const AdPlansForm = ({ adId, plans, onSubmit, onSkip, loading, error }) => {
  const [selectedBasePlan, setSelectedBasePlan] = useState(null);
  const [selectedPrimePlan, setSelectedPrimePlan] = useState(null);

  const basePlans = plans?.find((p) => p.type === "basePlans")?.plans || [];
  const primePlans = plans?.find((p) => p.type === "primePlans")?.plans || [];

  // Auto-select highest duration base plan on mount
  useEffect(() => {
    if (basePlans.length > 0) {
      const highestDuration = basePlans.reduce((prev, current) =>
        current.duration > prev.duration ? current : prev,
      );
      setSelectedBasePlan(highestDuration);
    }
  }, [basePlans]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBasePlan) {
      alert("Please select a base plan");
      return;
    }

    onSubmit({
      basePlanDuration: selectedBasePlan.duration,
      primePlanDuration: selectedPrimePlan?.duration || null,
    });
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `₹${price}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Choose Your Ad Plans
      </h2>
      <p className="text-gray-600 mb-6">
        Select a base plan and optionally boost your ad with a prime plan
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Base Plans */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Base Plans *
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {basePlans.map((plan) => (
              <div
                key={plan._id}
                onClick={() => setSelectedBasePlan(plan)}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedBasePlan?._id === plan._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {selectedBasePlan?._id === plan._id && (
                  <div className="absolute top-2 right-2">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {plan.duration} days
                </p>
                <p className="text-xl font-bold text-blue-600 mt-2">
                  {formatPrice(plan.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prime Plans */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Prime Plans (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Boost your ad visibility with a prime plan
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {primePlans.map((plan) => (
              <div
                key={plan._id}
                onClick={() =>
                  setSelectedPrimePlan(
                    selectedPrimePlan?._id === plan._id ? null : plan,
                  )
                }
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPrimePlan?._id === plan._id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                {selectedPrimePlan?._id === plan._id && (
                  <div className="absolute top-2 right-2">
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {plan.duration} days
                </p>
                <p className="text-xl font-bold text-purple-600 mt-2">
                  {formatPrice(plan.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedBasePlan && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Plan Summary</h4>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span>Base Plan ({selectedBasePlan.name}):</span>
                <span className="font-medium">
                  {formatPrice(selectedBasePlan.price)}
                </span>
              </p>
              {selectedPrimePlan && (
                <p className="flex justify-between">
                  <span>Prime Plan ({selectedPrimePlan.name}):</span>
                  <span className="font-medium">
                    {formatPrice(selectedPrimePlan.price)}
                  </span>
                </p>
              )}
              <div className="pt-2 border-t border-gray-300 mt-2">
                <p className="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {formatPrice(
                      selectedBasePlan.price + (selectedPrimePlan?.price || 0),
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !selectedBasePlan}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Applying Plans..." : "Confirm & Complete"}
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

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
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
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Base plans determine how long your ad stays
              active. Prime plans boost your ad's visibility for a shorter
              period. You can always upgrade later!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPlansForm;
