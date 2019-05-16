import { GL } from '../common';

export class Texture {
	private texture: WebGLTexture;
	private image: HTMLImageElement;

	constructor(path: string) {
		this.image = new Image();
		this.texture = GL.createTexture();
		this.image.src = path;
	}
	
	public create(): Promise<void> {
		return new Promise(res => {
			this.image.addEventListener('load', () => {
				GL.bindTexture(GL.TEXTURE_2D, this.texture);
				GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
				GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
				GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
				res();
			});
		});
	}

	public bind(): void {
		GL.bindTexture(GL.TEXTURE_2D, this.texture);
	}

	public unbind(): void {
		GL.bindTexture(GL.TEXTURE_2D, null);
	}

}