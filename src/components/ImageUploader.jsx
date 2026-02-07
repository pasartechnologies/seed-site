import React, { useState, useRef } from "react";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageUploader = ({
  currentImage,
  onImageUpload,
  folder = "profile-pictures",
  className = "",
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(currentImage || "");
  const [error, setError] = useState(null);

  // Cropper states
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 80,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const getCloudinarySignature = async (folder) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/media/cloudinary-signature/${folder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "Failed to get upload signature",
      );
    }
  };

  const uploadToCloudinary = async (file, signatureData) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      return response.data.secure_url;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95,
      );
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError(null);

    // Load image for cropping - automatically opens cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get cropped image blob
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);

      // Create preview
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreview(previewUrl);

      // Step 1: Get signature from backend
      const signatureData = await getCloudinarySignature(folder);

      // Step 2: Upload to Cloudinary
      const secureUrl = await uploadToCloudinary(croppedBlob, signatureData);

      // Step 3: Call parent callback with the secure URL
      if (onImageUpload) {
        onImageUpload(secureUrl);
      }

      setPreview(secureUrl);
      setUploadProgress(100);
      setSelectedImage(null);
      setCompletedCrop(null);
    } catch (err) {
      setError(err.message);
      setPreview(currentImage || "");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleCancelCrop = () => {
    setSelectedImage(null);
    setCompletedCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setPreview("");
    if (onImageUpload) {
      onImageUpload("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cropper Modal - Automatically opens when image is selected */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[95vh] overflow-auto">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Crop Your Profile Picture
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag to adjust the square crop area. Your photo will be displayed
              as a circle.
            </p>

            <div className="relative mb-6 flex justify-center">
              <div className="relative inline-block">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop={false}
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Crop preview"
                    className="max-w-full max-h-[55vh]"
                    style={{ display: "block" }}
                  />
                </ReactCrop>

                {/* Circular Overlay Effect */}
                {completedCrop && imgRef.current && (
                  <svg
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{
                      width: imgRef.current.width,
                      height: imgRef.current.height,
                    }}
                  >
                    <defs>
                      <mask id="circleMask">
                        <rect width="100%" height="100%" fill="white" />
                        <circle
                          cx={completedCrop.x + completedCrop.width / 2}
                          cy={completedCrop.y + completedCrop.height / 2}
                          r={completedCrop.width / 2}
                          fill="black"
                        />
                      </mask>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="rgba(0, 0, 0, 0.6)"
                      mask="url(#circleMask)"
                    />
                    <circle
                      cx={completedCrop.x + completedCrop.width / 2}
                      cy={completedCrop.y + completedCrop.height / 2}
                      r={completedCrop.width / 2}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Preview */}
            {completedCrop && imgRef.current && (
              <div className="mb-6 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gray-100">
                  <div
                    style={{
                      width: completedCrop.width,
                      height: completedCrop.height,
                      transform: `scale(${96 / completedCrop.width})`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{
                        transform: `translate(${-completedCrop.x}px, ${-completedCrop.y}px)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCropComplete}
                disabled={uploading || !completedCrop}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Crop & Upload"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelCrop}
                disabled={uploading}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload UI */}
      <div className="flex items-center space-x-4">
        {/* Image Preview */}
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-2 overflow-hidden ${
              preview ? "border-blue-500" : "border-gray-300"
            } bg-gray-100 flex items-center justify-center`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          {/* Upload Progress Overlay */}
          {uploading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white font-semibold text-sm">
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />

          <button
            type="button"
            onClick={triggerFileInput}
            disabled={disabled || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {preview ? "Change Image" : "Upload Image"}
              </>
            )}
          </button>

          {preview && !uploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && uploadProgress > 0 && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-start">
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
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Supported: JPG, PNG, GIF. Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUploader;
