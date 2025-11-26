declare module 'opentype.js' {
  export interface PathCommand {
    type: 'M' | 'L' | 'C' | 'Q' | 'Z';
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
  }

  export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  export interface Path {
    commands: PathCommand[];
    fill: string | null;
    stroke: string | null;
    strokeWidth: number;
    getBoundingBox(): BoundingBox;
    toPathData(decimalPlaces?: number): string;
    toSVG(decimalPlaces?: number): string;
  }

  export interface Glyph {
    name: string;
    unicode: number;
    unicodes: number[];
    index: number;
    advanceWidth: number;
    leftSideBearing: number;
    path: Path;
    getPath(x?: number, y?: number, fontSize?: number): Path;
    getBoundingBox(): BoundingBox;
  }

  export interface Font {
    names: {
      fontFamily: { en: string };
      fontSubfamily: { en: string };
      fullName: { en: string };
      postScriptName: { en: string };
    };
    unitsPerEm: number;
    ascender: number;
    descender: number;
    glyphs: {
      length: number;
      get(index: number): Glyph;
    };
    charToGlyph(char: string): Glyph;
    stringToGlyphs(text: string): Glyph[];
    getPath(text: string, x: number, y: number, fontSize: number, options?: object): Path;
    getPaths(text: string, x: number, y: number, fontSize: number, options?: object): Path[];
    getAdvanceWidth(text: string, fontSize: number, options?: object): number;
    draw(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: object): void;
    drawPoints(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: object): void;
    drawMetrics(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, options?: object): void;
  }

  export function parse(buffer: ArrayBuffer, options?: object): Font;
  export function load(url: string, callback?: (err: Error | null, font?: Font) => void): Promise<Font>;
  export function loadSync(url: string): Font;
}
