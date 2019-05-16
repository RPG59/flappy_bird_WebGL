import { VertexArray } from '../Graphics/vertexArray';
import { Texture } from '../Graphics/texture';
import { float3, float4x4 } from '../Math/math';
import { DISPLAY_HEIGHT } from '../common';

export class Barrier {
	public static mesh: VertexArray;
	public static texture: Texture;

	private static height = 2 * DISPLAY_HEIGHT - 3;

	private position: float3;
	private ml_matrix: float4x4;


	constructor(x: number, y: number) {
		this.position = new float3(x, y);
		this.ml_matrix = new float4x4().translate(this.position);
	}

	static create(): Promise<void> {
		const vertices = new Float32Array([
			0.0, 0.0, 0.1,
			0.0, this.height, 0.1,
			1.5, this.height, 0.1,
			1.5, 0.0, 0.1,
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
		this.texture = new Texture('res/pipe.png');
		return this.texture.create();
	}

	public static getHeight(): number {
		return this.height;
	}

	public static render(): void {
		
	}
	
	public getModelMatrix(): float4x4 {
		return this.ml_matrix;
	}

}