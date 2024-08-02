import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { vectorize, ColorMode, Hierarchical, PathSimplifyMode } from '@neplex/vectorizer';
import path from 'path';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const port = 5000;

// Use the CORS middleware
app.use(cors());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends the file extension
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Read the file using readFile
    const imageBuffer = await readFile(imagePath);

    // Vectorize the image using the correct usage of vectorizer
    const svg = await vectorize(imageBuffer, {
      colorMode: ColorMode.Color,
      colorPrecision: 6,
      filterSpeckle: 4,
      spliceThreshold: 45,
      cornerThreshold: 60,
      hierarchical: Hierarchical.Stacked,
      mode: PathSimplifyMode.Spline,
      layerDifference: 5,
      lengthThreshold: 5,
      maxIterations: 2,
      pathPrecision: 5,
    });

    const vectorPath = path.join(uploadsDir, `${path.basename(imagePath, path.extname(imagePath))}.svg`);

    // Write the vectorized SVG to a file using writeFile
    await writeFile(vectorPath, svg);

    res.json({ message: 'Image uploaded and vectorized successfully', vectorPath });
  } catch (error) {
    console.error('Error vectorizing image:', error);
    res.status(500).json({ message: 'Failed to process image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
