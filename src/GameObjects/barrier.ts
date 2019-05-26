import { VertexArray } from '../Graphics/vertexArray';
import { Texture } from '../Graphics/texture';
import { float3, float4x4 } from '../Math/math';
import { DISPLAY_HEIGHT } from '../common';

export const BARRIER_GAP = DISPLAY_HEIGHT / 100 * 2 * 30; // 30 %

//--------------------   DISPLAY_HEIGHT
//                    |
//                    |
//                    |  0
//                    |
//                    |
//--------------------  -DISPLAY_HEIGHT



export class Barrier {
	public static mesh: VertexArray;
	public static texture: Texture;

	private static height = 2 * DISPLAY_HEIGHT - BARRIER_GAP;
	private static width = 1.5;

	private position: float3;
	private u_modelMatrix: float4x4;


	constructor(x: number, y: number) {
		this.position = new float3(x, y);
		this.u_modelMatrix = new float4x4().translate(this.position);
	}

	static create(): Promise<void> {
		const vertices = new Float32Array([
			0.0, 0.0, 0.1,
			0.0, this.height, 0.1,
			this.width, this.height, 0.1,
			this.width, 0.0, 0.1,
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
	
	public static getWidth(): number {
		return this.width;
	}

	public static render(): void {
		
	}
	
	public getModelMatrix(): float4x4 {
		return this.u_modelMatrix;
	}
	
	public getX(): number {
		return this.position.x;
	}
	
	public getY(): number {
		return this.position.y;
	}
	
	

}