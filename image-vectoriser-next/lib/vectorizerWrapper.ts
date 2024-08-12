// lib/vectorizerWrapper.ts
import { vectorize as neplexVectorize, ColorMode as NeplexColorMode, Hierarchical as NeplexHierarchical, PathSimplifyMode as NeplexPathSimplifyMode } from '@neplex/vectorizer';

export const ColorMode = NeplexColorMode;
export const Hierarchical = NeplexHierarchical;
export const PathSimplifyMode = NeplexPathSimplifyMode;

export interface VectorizeOptions {
  colorMode: typeof ColorMode;
  colorPrecision: number;
  filterSpeckle: number;
  spliceThreshold: number;
  cornerThreshold: number;
  hierarchical: typeof Hierarchical;
  mode: typeof PathSimplifyMode;
  layerDifference: number;
  lengthThreshold: number;
  maxIterations: number;
  pathPrecision: number;
}

export async function vectorizeImage(buffer: Buffer, options: VectorizeOptions): Promise<string> {
  // Use the neplex vectorizer as the default
  return neplexVectorize(buffer, options);
}
