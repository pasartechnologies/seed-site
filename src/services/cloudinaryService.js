import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const cloudinaryService = {
  getSignature: async (folder) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${API_BASE_URL}/media/cloudinary-signature/${folder}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  uploadFile: async (file, signatureData, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/upload`, // Note: /upload for general assets
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          if (onProgress) onProgress(percent);
        },
      },
    );
    return response.data.secure_url;
  },
};
