declare module 'opentype.js' {
  export class Font {
    parse(buffer: ArrayBuffer): Font;
    getPath(text: string, x: number, y: number, fontSize: number): Path;
    getAdvanceWidth(text: string, fontSize: number): number;
    commands: any[];
    getBoundingBox(): { x1: number; y1: number; x2: number; y2: number };
  }

  export class Path {
    commands: any[];
    getBoundingBox(): { x1: number; y1: number; x2: number; y2: number };
  }

  export function parse(buffer: ArrayBuffer): Font;
}