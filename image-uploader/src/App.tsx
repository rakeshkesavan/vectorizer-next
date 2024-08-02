// src/App.tsx
import React from 'react';
import './App.css';
import './theme.css';
import ImageUpload from './components/ImageUpload';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <ImageUpload />
    </div>
  );
};

export default App;