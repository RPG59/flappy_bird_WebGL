export let GL: WebGL2RenderingContext = null;
export const DISPLAY_WIDTH = 10;
export const DISPLAY_HEIGHT = 9 / 16 * DISPLAY_WIDTH; 

export function initWebGL() {
	const canvas: any = document.querySelector('#glCanvas');
	try {
		GL = canvas.getContext('webgl2');
	} catch (e) {
		console.error('WebGL is not ok!');
	}
}

export class IGameObject {
}

interface WebGL2RenderingContext extends WebGLRenderingContext {
	/* Vertex Array Objects */
	createVertexArray(): WebGLVertexArrayObject | null;
	deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void;
	isVertexArray(vertexArray: WebGLVertexArrayObject | null): boolean;
	bindVertexArray(array: WebGLVertexArrayObject | null): void;
}

interface WebGLVertexArrayObject extends WebGLObject {
}



