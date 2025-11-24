declare module 'potrace-wasm' {
  export interface PotraceImage {
    width: number;
    height: number;
  }

  export interface PosterizeOptions {
    threshold?: number;
    turdSize?: number;
    optCurve?: boolean;
    color?: string;
  }

  export function loadImage(imageData: Uint8Array): Promise<PotraceImage>;

  export function posterize(
    image: PotraceImage,
    options?: PosterizeOptions
  ): Promise<string>;
}
