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
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
  </div>
  );
};

export default ImageUpload;
