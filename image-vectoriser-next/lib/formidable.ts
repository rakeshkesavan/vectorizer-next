import formidable, { Fields, Files } from 'formidable';
import { IncomingMessage } from 'http';

export const parseForm = (req: IncomingMessage): Promise<{ fields: Fields; files: Files }> => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './uploads';
  form.keepExtensions = true;

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};