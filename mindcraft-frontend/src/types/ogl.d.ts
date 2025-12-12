declare module 'ogl' {
  export class Renderer {
    gl: WebGLRenderingContext & { canvas: HTMLCanvasElement };
    canvas: HTMLCanvasElement;
    constructor(options?: { canvas?: HTMLCanvasElement; width?: number; height?: number });
    setSize(width: number, height: number): void;
    render(options: { scene: Mesh }): void;
  }

  export class Program {
    gl: WebGLRenderingContext;
    uniforms: Record<string, { value: any }>;
    constructor(gl: WebGLRenderingContext, options: {
      vertex: string;
      fragment: string;
      uniforms?: Record<string, { value: any }>;
    });
  }

  export class Mesh {
    gl: WebGLRenderingContext;
    geometry: any;
    program: Program;
    constructor(gl: WebGLRenderingContext, options: {
      geometry: any;
      program: Program;
    });
  }

  export class Color {
    r: number;
    g: number;
    b: number;
    constructor(r?: number, g?: number, b?: number);
    constructor(color: [number, number, number]);
  }

  export class Triangle {
    gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
  }
}

