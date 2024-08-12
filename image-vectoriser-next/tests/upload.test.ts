import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/upload';
import multer from 'multer';
import { createMocks } from 'node-mocks-http';
import { readFile, writeFile } from 'fs/promises';
import { vectorize } from '@neplex/vectorizer';
import { Readable } from 'stream';
import { describe, it, expect, vi, afterAll } from 'vitest';

// Mocking multer
vi.mock('multer', () => {
    return {
      default: () => {
        return {
          single: () => (req: any, res: any, next: any) => {
            req.file = {
              path: 'uploads/test-image.png',
              originalname: 'test-image.png',
              mimetype: 'image/png',
              size: 1024,
              buffer: Buffer.from('test image data'),
              stream: new Readable(),
              destination: 'uploads/',
              filename: 'test-image.png',
              fieldname: 'image',
            };
            next();
          },
        };
      },
      diskStorage: vi.fn(),
    };
  });

// Mocking fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve(Buffer.from('test image data'))),
  writeFile: vi.fn(() => Promise.resolve()),
}));

// Mocking @neplex/vectorizer
vi.mock('@neplex/vectorizer', () => ({
  vectorize: vi.fn(() => Promise.resolve('<svg></svg>')),
  ColorMode: { Color: 'color' },
  Hierarchical: { Stacked: 'stacked' },
  PathSimplifyMode: { Spline: 'spline' },
}));

describe('/api/upload', () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should upload and vectorize an image', async () => {
    const { req, res } = createMocks<NextApiRequest & { file?: Express.Multer.File }, NextApiResponse>({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Adding the file property to the request object
    (req as NextApiRequest & { file: Express.Multer.File }).file = {
      path: 'uploads/test-image.png',
      originalname: 'test-image.png',
      mimetype: 'image/png',
      size: 1024,
      buffer: Buffer.from('test image data'),
      stream: new Readable(),
      destination: 'uploads/',
      filename: 'test-image.png',
      fieldname: 'image',
    };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Image uploaded and vectorized successfully',
      vectorPath: 'uploads/test-image.svg',
    });
  });

  it('should return an error if no file is uploaded', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'No file uploaded' });
  });
});
