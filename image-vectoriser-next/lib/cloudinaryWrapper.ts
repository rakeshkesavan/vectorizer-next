import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});
console.log ('cloudinary', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

export const uploadImage = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Vectorizer', // Optional: Set a folder in Cloudinary
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};


// export const uploadImage = (
//     file: File,
//     onProgress: (progress: number) => void
//   ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
     
//     return new Promise((resolve, reject) => {

//       const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  
//       const xhr = new XMLHttpRequest();
//       xhr.open('POST', url, true);
  
//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded * 100) / event.total);
//           onProgress(progress);
//         }
//       };
  
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           resolve(JSON.parse(xhr.responseText));
//         } else {
//           reject(JSON.parse(xhr.responseText));
//         }
//       };
  
//       xhr.onerror = () => {
//         reject(xhr.responseText);
//       };
  
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
//       xhr.send(formData);
//     });
//   };


// export const uploadImage = (filePath: string, onProgress: (progress: number) => void): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(filePath, {
//       resource_type: "image"
//     }, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     }).on('progress', (progressEvent: any) => {
//       const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//       onProgress(progress);
//     });
//   });
// };