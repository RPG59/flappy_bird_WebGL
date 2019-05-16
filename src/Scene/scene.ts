import { Bird } from '../GameObjects/bird';
import { Shader } from '../Graphics/shader';
import { Background } from '../GameObjects/background';
import { float3, float4x4 } from '../Math/math';
import { Barrier } from '../GameObjects/barrier';

export class Scene {
	bird: Bird;
	barriers: Barrier[] = [];
	XOffset: number = 0;

	constructor() {
		this.bird = new Bird();
		this.createBarriers();
	}

	public update(): void {
		this.bird.update();
		this.bird.updateGravity();
	}

	public render(): void {
		// const mat = new float4x4();
		// for (let i = 0; i < 22; ++i) {
		// 	Shader.background
		// 		.setUniformMatrix4f('u_viewMatrix', mat.translate(new float3(i * 10 * 0.03, 0, 0)));
		// 	Background.render();
		// }
		this.renderBackground();
		this.renderBird();
		this.renderBarriers();
	}

	private renderBackground(): void {
		Shader.background.enable();
		Shader.background.setUniform2f('u_bird', 0, this.bird.getPositionY());
		Background.texture.bind();
		Background.mesh.render();
		Shader.background.disable();
		Background.texture.unbind();
	}

	private renderBird(): void {
		this.bird.render();
	}

	private renderBarriers(): void {
		Shader.barrier.enable();
		Shader.barrier.setUniform2f('u_bird', 0, this.bird.getPositionY());
		Shader.barrier.setUniformMatrix4f('vw_matrix', new float4x4().translate(new float3(this.XOffset * 0.1, 0, 0)));
		Barrier.texture.bind();
		Barrier.mesh.bind();

		for (let i = 0; i < 10; ++i) {
			Shader.barrier.setUniformMatrix4f('ml_matrix', this.barriers[i].getModelMatrix());
			Shader.barrier.setUniform1i('u_top', i % 2 === 0 ? 1 : 0);
			Barrier.mesh.draw();
		}
		Barrier.mesh.unbind();
		Barrier.texture.unbind();
	}

	private createBarriers(): void {
		let i = 5; // TODO: create config 
		const offset = -5; // config

		while (i--) {
			const x = offset - i;
			const random = 4;
			this.barriers.push(new Barrier(x, random));
			this.barriers.push(new Barrier(x, random - 11.5));
		}
	}

}