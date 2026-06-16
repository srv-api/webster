import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://103.150.227.223:2090/d/batch";

export const submitAssessment = async (questions, imageFiles = []) => {
  const token = Cookies.get("refresh_token");
  
  const formData = new FormData();
  
  // Kirim questions
  formData.append('questions', JSON.stringify({ questions: questions }));
  
  // Kirim file jika ada
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((imageFile, index) => {
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        formData.append(`image_${index}`, imageFile);
        console.log(`Appending image_${index}: ${imageFile.name} (${imageFile.size} bytes)`);
      }
    });
  } else {
    console.log("No images to upload");
  }
  
  console.log("Questions being sent:", JSON.stringify({ questions: questions }, null, 2));
  
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
  });
  
  return response.data;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // Base URL untuk image dari backend
  const BASE_URL = "http://103.150.227.223:2090";
  return `${BASE_URL}${imagePath}`;
};