import { VertexArray } from '../Graphics/vertexArray';
import { Texture } from '../Graphics/texture';
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from '../common';

export class Background {
	public static mesh: VertexArray;
	public static texture: Texture;

	public static create(): Promise<void> {
		const vertices = new Float32Array([
			-DISPLAY_WIDTH, -DISPLAY_HEIGHT, 0.0,
			-DISPLAY_WIDTH, DISPLAY_HEIGHT, 0.0,
			0.0, DISPLAY_HEIGHT, 0.0,
			0.0, -DISPLAY_HEIGHT, 0.0
		]);
		const indices = new Uint8Array([
			0, 1, 2,
			2, 3, 0
		]);
		const texIndices = new Float32Array([
			0, 1,
			0, 0,
			1, 0,
			1, 1
		]);

		this.mesh = new VertexArray(vertices, indices, texIndices);
		this.texture = new Texture('res/background.jpg');
		return this.texture.create();
	}
}