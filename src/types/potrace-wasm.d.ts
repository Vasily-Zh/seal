declare module 'esm-potrace-wasm' {
  export interface PotraceOptions {
    turdsize?: number;
    turnpolicy?: number;
    alphamax?: number;
    opticurve?: number;
    opttolerance?: number;
    pathonly?: boolean;
    extractcolors?: boolean;
    posterizelevel?: number;
    posterizationalgorithm?: number;
  }

  export function init(): Promise<void>;

  export function potrace(
    imageBitmapSource: HTMLImageElement | SVGImageElement | HTMLVideoElement |
                       HTMLCanvasElement | ImageData | ImageBitmap | Blob,
    options?: PotraceOptions
  ): Promise<string>;
}
