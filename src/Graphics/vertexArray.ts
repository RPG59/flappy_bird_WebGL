import { GL } from '../common';

export class VertexArray {
	private VAO: WebGLVertexArrayObjectOES;
	private VBO: WebGLBuffer;
	private IBO: WebGLBuffer;
	private TBO: WebGLBuffer;
	private count: number;

	constructor(vertices: Float32Array, indices: Uint8Array, texIndices: Float32Array) {
		this.count = indices.length;
		
		this.VAO = GL.createVertexArray();
		GL.bindVertexArray(this.VAO);

		this.VBO = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER, this.VBO);
		GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);
		GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
		GL.enableVertexAttribArray(0);

		this.TBO = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER, this.TBO);
		GL.bufferData(GL.ARRAY_BUFFER, texIndices, GL.STATIC_DRAW);
		GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 0, 0);
		GL.enableVertexAttribArray(1);

		this.IBO = GL.createBuffer();
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IBO);
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);
		
		this.unbind();
	}

	public bind(): void {
		GL.bindVertexArray(this.VAO);
		GL.bindBuffer(GL.ARRAY_BUFFER, this.VBO);
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IBO);
	}

	public unbind(): void {
		GL.bindVertexArray(null);
		GL.bindBuffer(GL.ARRAY_BUFFER, null);
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
	}

	public render(): void {
		this.bind();
		this.draw();
	}

	public draw(): void {
		GL.drawElements(GL.TRIANGLES, this.count, GL.UNSIGNED_BYTE, 0)
	}

}