import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
//import { vectorize, ColorMode, Hierarchical, PathSimplifyMode } from '@neplex/vectorizer';
import { vectorizeImage, VectorizeOptions, ColorMode, Hierarchical, PathSimplifyMode } from '@/lib/vectorizerWrapper';
import { uploadImage } from '@/lib/cloudinaryWrapper'; // Use the abstracted Cloudinary wrapper
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const upload = multer({ dest: 'uploads/' });

const handler = async (req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse) => {
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

      const {
        colorPrecision = '6',
        filterSpeckle = '4',
        spliceThreshold = '45',
        cornerThreshold = '60',
        layerDifference = '5',
        lengthThreshold = '5',
        maxIterations = '2',
        pathPrecision = '5',
      } = req.body;

      const imageBuffer = await readFile(imagePath);

      const vectorizeConfig: VectorizeOptions = {
        colorMode: ColorMode.Color,
        colorPrecision: parseInt(req.body.colorPrecision, 10),
        filterSpeckle: parseInt(req.body.filterSpeckle, 10),
        spliceThreshold: parseInt(req.body.spliceThreshold, 10),
        cornerThreshold: parseInt(req.body.cornerThreshold, 10),
        hierarchical: Hierarchical.Stacked,
        mode: PathSimplifyMode.Spline,
        layerDifference: parseInt(req.body.layerDifference, 10),
        lengthThreshold: parseInt(req.body.lengthThreshold, 10),
        maxIterations: parseInt(req.body.maxIterations, 10),
        pathPrecision: parseInt(req.body.pathPrecision, 10),
      };

      const svg = await vectorizeImage(imageBuffer, vectorizeConfig);
      
      const vectorPath = path.join('uploads', `${path.basename(imagePath, path.extname(imagePath))}.svg`);
      await writeFile(vectorPath, svg);

       // Upload vector image to Cloudinary and remove from local storage
       const cloudinaryUrl = await uploadImage(vectorPath);
      //  await unlink(vectorPath); // Clean up local file after uploading
 
       res.status(200).json({ message: 'Image uploaded and vectorized successfully', url: cloudinaryUrl });

      // res.status(200).json({ message: 'Image uploaded and vectorized successfully', vectorPath });
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
