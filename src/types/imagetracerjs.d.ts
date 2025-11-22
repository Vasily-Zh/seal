declare module 'imagetracerjs' {
  interface ImageTracerOptions {
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    desc?: boolean;
    viewbox?: boolean;
    scale?: number;
    roundcoords?: number;
  }

  interface ImageTracer {
    imageToSVG(
      imagedata: string,
      callback: (svgString: string) => void,
      options?: ImageTracerOptions
    ): void;
  }

  const ImageTracer: ImageTracer;
  export default ImageTracer;
}
