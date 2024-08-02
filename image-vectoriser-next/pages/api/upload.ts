// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { vectorize, ColorMode, Hierarchical, PathSimplifyMode } from '@neplex/vectorizer';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const upload = multer({ dest: 'uploads/' });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await new Promise((resolve, reject) => {
        upload.single('image')(req, res, (err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      const imagePath = req.file?.path;
      if (!imagePath) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageBuffer = await readFile(imagePath);
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

      const vectorPath = path.join('uploads', `${path.basename(imagePath, path.extname(imagePath))}.svg`);
      await writeFile(vectorPath, svg);

      res.status(200).json({ message: 'Image uploaded and vectorized successfully', vectorPath });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ message: 'Failed to process image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
