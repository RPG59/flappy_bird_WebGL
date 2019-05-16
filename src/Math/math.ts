export class float3 {
	x: number;
	y: number;
	z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

export class float4x4 {
	elements: Float32Array;

	constructor() {
		this.elements = new Float32Array(16);
		this.identity();
	}

	identity(): float4x4 {
		for (let i = 0; i < 16; ++i) {
			this.elements[i] = 0;
		}
		this.elements[0 + 0 * 4] = 1.0;
		this.elements[1 + 1 * 4] = 1.0;
		this.elements[2 + 2 * 4] = 1.0;
		this.elements[3 + 3 * 4] = 1.0;

		return this;
	}

	translate(vector: float3): float4x4 {
		this.elements[0 + 3 * 4] = vector.x;
		this.elements[1 + 3 * 4] = vector.y;
		this.elements[2 + 3 * 4] = vector.z;

		return this;
	}

	rotate(angle: number): float4x4 {
		const rad = Math.PI * angle / 180;

		this.elements[0 + 0 * 4] = Math.cos(rad);
		this.elements[1 + 0 * 4] = Math.sin(rad);

		this.elements[0 + 1 * 4] = -Math.sin(rad);
		this.elements[1 + 1 * 4] = Math.cos(rad);

		return this;
	}

	multiply(matrix: float4x4): float4x4 {
		const result = new Array(16).fill(0);

		for (let y = 0; y < 4; ++y) {
			for (let x = 0; x < 4; ++x) {
				let sum = 0;
				for (let e = 0; e < 4; ++e) {
					sum += this.elements[x + e * 4] * matrix.elements[e + y * 4];
				}
				result[x + y * 4] = sum;
			}
		}
		this.elements = new Float32Array(result);

		return this;
	}

	orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): float4x4 {
		this.elements[0 + 0 * 4] = 2 / (right - left);
		this.elements[1 + 1 * 4] = 2 / (top - bottom);
		this.elements[2 + 2 * 4] = 2 / (near - far);

		this.elements[0 + 3 * 4] = (right + left) / (left - right);
		this.elements[1 + 3 * 4] = (bottom + top) / (bottom - top);
		this.elements[2 + 3 * 4] = (far + near) / (far - near);

		return this;
	}
}