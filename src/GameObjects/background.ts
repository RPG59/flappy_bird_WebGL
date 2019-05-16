import { VertexArray } from '../Graphics/vertexArray';
import { Texture } from '../Graphics/texture';
import { IGameObject } from '../common';
import { Shader } from '../Graphics/shader';

export class Background implements IGameObject{
	public static mesh: VertexArray;
	public static texture: Texture;
	
	public static create(): Promise<void> {
		const vertices = new Float32Array([
			-10.0, -10.0 * 9.0 / 16.0, 0.0,
			-10.0, 10.0 * 9.0 / 16.0, 0.0,
			0.0, 10.0 * 9.0 / 16.0, 0.0,
			0.0, -10.0 * 9.0 / 16.0, 0.0
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