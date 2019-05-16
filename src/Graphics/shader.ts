import { GL } from '../common';
import { float4x4 } from '../Math/math';


export class Shader {
	public static background: Shader;
	public static bird: Shader;
	public static barrier: Shader;

	private vsId: WebGLShader;
	private fsId: WebGLShader;
	private program: WebGLProgram;

	private locationHashMap: { [key: string]: WebGLUniformLocation } = {};

	constructor(vsPath: string, fsPath: string) {
		this.vsId = this.createShader(GL.VERTEX_SHADER, vsPath);
		this.fsId = this.createShader(GL.FRAGMENT_SHADER, fsPath);

		if (!this.compileShader(this.vsId)) return;
		if (!this.compileShader(this.fsId)) return;

		this.createProgram();
	}

	public enable(): void {
		GL.useProgram(this.program);
	}

	public disable(): void {
		GL.useProgram(null);
	}

	public setUniform1i(uniformName: string, value: number): void {
		const location = this.getLocation(uniformName);

		if (location === null) {
			console.error('SET UNIFORM INT ERROR: ' + uniformName + ' not found!');
			return;
		}

		this.enable();
		GL.uniform1i(location, value);
	}

	public setUniformMatrix4f(uniformName: string, matrix: float4x4): void {
		const location = this.getLocation(uniformName);

		if (location === null) {
			console.error('SET UNIFORM MATRIX4 FLOAT ERROR: ' + uniformName + ' not found!');
			return;
		}

		this.enable();
		GL.uniformMatrix4fv(location, false, matrix.elements);
	}
	
	public setUniform2f(uniformName: string, x: number, y: number): void {
		const location = this.getLocation(uniformName);

		if (location === null) {
			console.error('SET UNIFORM FLOAT2 ERROR: ' + uniformName + ' not found!');
			return;
		}

		this.enable();
		GL.uniform2f(location, x, y);
	}

	private createProgram(): void {
		this.program = GL.createProgram();

		GL.attachShader(this.program, this.vsId);
		GL.attachShader(this.program, this.fsId);

		GL.linkProgram(this.program);
		GL.deleteShader(this.vsId);
		GL.deleteShader(this.fsId);
	}

	private createShader(shaderType: number, shaderPath: string): WebGLShader {
		const shaderSource = document.getElementById(shaderPath).innerHTML;
		const shaderId = GL.createShader(shaderType);

		GL.shaderSource(shaderId, shaderSource);
		return shaderId;
	}

	private compileShader(shaderId: WebGLShader): boolean {
		GL.compileShader(shaderId);

		if (GL.getShaderParameter(shaderId, GL.COMPILE_STATUS)) {
			return true;
		}
		console.log('SHADER COMPILE ERROR: ' + GL.getShaderInfoLog(shaderId));
		return false;
	}

	private getLocation(name: string): WebGLUniformLocation | null {
		if (name in this.locationHashMap) {
			return this.locationHashMap[name];
		}

		const location = GL.getUniformLocation(this.program, name);

		if (location !== null) {
			this.locationHashMap[name] = location;
			return location;
		}

		return null;
	}
}


