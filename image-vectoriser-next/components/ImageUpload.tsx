'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from './ui/progress'; 
import { Badge } from './ui/badge';
import Header from './Header';

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [vectorPreview, setVectorPreview] = useState<string>('');
  const [isVectorImage, setIsVectorImage] = useState<boolean>(false); // Track which image is displayed


  const [colorPrecision, setColorPrecision] = useState<number>(6);
  const [filterSpeckle, setFilterSpeckle] = useState<number>(4);
  const [spliceThreshold, setSpliceThreshold] = useState<number>(45);
  const [cornerThreshold, setCornerThreshold] = useState<number>(60);
  const [layerDifference, setLayerDifference] = useState<number>(5);
  const [lengthThreshold, setLengthThreshold] = useState<number>(5);
  const [maxIterations, setMaxIterations] = useState<number>(2);
  const [pathPrecision, setPathPrecision] = useState<number>(5);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : '');
    setSuccessMessage(''); // Clear success message on new file selection
    setIsVectorImage(false); // Reset to original image on new file selection

  };

  const handleImageClick = () => {
    if (vectorPreview) {
      setIsVectorImage((prev) => !prev); // Toggle between original and vector image
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('colorPrecision', colorPrecision.toString());
    formData.append('filterSpeckle', filterSpeckle.toString());
    formData.append('spliceThreshold', spliceThreshold.toString());
    formData.append('cornerThreshold', cornerThreshold.toString());
    formData.append('layerDifference', layerDifference.toString());
    formData.append('lengthThreshold', lengthThreshold.toString());
    formData.append('maxIterations', maxIterations.toString());
    formData.append('pathPrecision', pathPrecision.toString());

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        setVectorPreview(response.data.url); // Set vector image preview

        setSuccessMessage('Image uploaded and vectorized successfully');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-2 gap-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image to see the preview and convert it to a vector image.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
              {preview && (
                <div className="relative">
                <img
                  src={isVectorImage ? vectorPreview : preview}
                  alt="preview"
                  className="mb-4 w-full h-auto cursor-pointer"
                  onClick={handleImageClick} // Toggle image on click
                />
                <Badge className="absolute top-2 left-2">
                {isVectorImage ? 'Vectorized' : 'Original'}
              </Badge>
              </div>
              )}
              <Button type="submit" disabled={uploading || !file}>Upload Image</Button>
            </form>
            {uploading && uploadProgress > 0 && (
              <div className="mt-4">
                {/* <Progress value={uploadProgress} max={100} /> */}
                <Progress className="h-4 bg-gray-300 rounded" value={uploadProgress} max={100}>
                    <div
                      className="h-full bg-blue-500 rounded diagonal-stripes"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </Progress>

              </div>
            )}
            {successMessage && (
              <p className="mt-4 text-green-500">{successMessage}</p>
            )}
          </CardContent>
          <CardFooter>
            <p>Click the button to upload the selected image.</p>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Configure the parameters for vectorization.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <label>Color Precision</label>
              <Input
                type="number"
                value={colorPrecision}
                onChange={(e) => setColorPrecision(Number(e.target.value))}
                className="mb-4"
              />
              <label>Filter Speckle</label>
              <Input
                type="number"
                value={filterSpeckle}
                onChange={(e) => setFilterSpeckle(Number(e.target.value))}
                className="mb-4"
              />
              <label>Splice Threshold</label>
              <Input
                type="number"
                value={spliceThreshold}
                onChange={(e) => setSpliceThreshold(Number(e.target.value))}
                className="mb-4"
              />
              <label>Corner Threshold</label>
              <Input
                type="number"
                value={cornerThreshold}
                onChange={(e) => setCornerThreshold(Number(e.target.value))}
                className="mb-4"
              />
              <label>Layer Difference</label>
              <Input
                type="number"
                value={layerDifference}
                onChange={(e) => setLayerDifference(Number(e.target.value))}
                className="mb-4"
              />
              <label>Length Threshold</label>
              <Input
                type="number"
                value={lengthThreshold}
                onChange={(e) => setLengthThreshold(Number(e.target.value))}
                className="mb-4"
              />
              <label>Max Iterations</label>
              <Input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="mb-4"
              />
              <label>Path Precision</label>
              <Input
                type="number"
                value={pathPrecision}
                onChange={(e) => setPathPrecision(Number(e.target.value))}
                className="mb-4"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default ImageUpload;
