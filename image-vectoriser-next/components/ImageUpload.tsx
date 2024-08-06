// components/ImageUpload.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
// import { Input, Button } from '@shadcn/ui';
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './ui/card';  // Adjust the path if necessary
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import { Progress } from './ui/progress'; // Import the Progress component


const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

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

      const vectorizeConfig = {
        colorMode: ColorMode.Color,
        colorPrecision,
        filterSpeckle,
        spliceThreshold,
        cornerThreshold,
        hierarchical: Hierarchical.Stacked,
        mode: PathSimplifyMode.Spline,
        layerDifference,
        lengthThreshold,
        maxIterations,
        pathPrecision,
      };

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
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
              {preview && <img src={preview} alt="preview" className="mb-4 w-full h-auto" />}
              <Button type="submit">Upload Image</Button>
            </form>
            {uploadProgress > 0 && (
              <div className="mt-4">
                <Progress value={uploadProgress} max={100} />
              </div>
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
  );
};

export default ImageUpload;
