# Image Vectorization and Upload Tool

This project is a web-based application that allows users to upload images, convert them to vector format, and upload them to a CDN (Cloudinary). It includes a user-friendly interface for uploading images, adjusting vectorization settings, and visualizing the results using a before/after slider.

## Features

- **Image Upload**: Upload an image in various formats (JPG, PNG, etc.).
- **Image Vectorization**: Convert raster images to vector format using customizable settings.
- **Before/After Slider**: Compare the original and vectorized images side by side with an interactive slider.
- **Cloudinary Integration**: Upload the vectorized images to Cloudinary for storage and delivery.
- **Download Option**: Download the vectorized image in SVG format.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/image-vectorization-tool.git
   cd image-vectorization-tool
   ```

2. Install the dependencies:
 ```bash
npm install

3. Configure environment variables by creating a .env.local file in the root of the project and adding the following:
 ```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

4. Run the development server
 ```bash
npm run dev

5. Usage
**Upload an Image**: Click on the "Upload Image" button and select an image file from your device.
**Adjust Vectorization Settings**: Customize settings like color precision, filter speckle, and more.
**Vectorize and Preview**: Submit the form to vectorize the image. Use the before/after slider to compare the original and vectorized images.
**Download the SVG**: If satisfied with the result, click the "Download SVG" button to save the vectorized image.

6. Technologies Used
**Next.js**: React framework for server-side rendering and static site generation.
**Tailwind CSS**: Utility-first CSS framework for styling.
**ShadCN**: UI components for a consistent and polished interface.
**Multer**: Middleware for handling multipart/form-data, used for uploading files.
**@neplex/vectorizer**: Library for converting raster images to vector format.
**Cloudinary**: CDN for storing and serving the vectorized images.

