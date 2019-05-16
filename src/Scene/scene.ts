import { Bird } from '../GameObjects/bird';
import { Shader } from '../Graphics/shader';
import { Background } from '../GameObjects/background';
import { float3, float4x4 } from '../Math/math';
import { Barrier } from '../GameObjects/barrier';
import { DISPLAY_HEIGHT } from '../common';

export class Scene {
	bird: Bird;
	barriers: Barrier[] = [];
	XOffset: number = 0;
	barrierOffset: number = 2;
	index: number = 10;
	map: number = 0;
	time: number = 0;

	constructor() {
		this.bird = new Bird();
		this.createBarriers();
	}

	public update(): void {
		this.XOffset--;
		if (-this.XOffset % 335 === 0) this.map++;
		if (-this.XOffset > 250 && -this.XOffset % 120 === 0) this.updateBarriers();

		this.bird.update();
		this.time += 0.01;


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
		
		for (let i = this.map; i < this.map + 4; ++i){
			Shader.background.setUniformMatrix4f('u_viewMatrix',
				new float4x4().translate(new float3(i * 10 + this.XOffset * 0.03, 0, 0)));
			Background.mesh.render();
		}
		
		Shader.background.disable();
		Background.texture.unbind();
	}

	private renderBird(): void {
		this.bird.render();
	}

	private renderBarriers(): void {
		Shader.barrier.enable();
		Shader.barrier.setUniform2f('u_bird', 0, this.bird.getPositionY());
		Shader.barrier.setUniformMatrix4f('vw_matrix', new float4x4().translate(new float3(this.XOffset * 0.05, 0, 0)));
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
		const offset = 2;
		while (i--) {
			const x = offset * i * 3;
			const y = Math.random() * DISPLAY_HEIGHT;
			this.barriers.push(new Barrier(x, y));
			this.barriers.push(new Barrier(x, y - DISPLAY_HEIGHT * 2));
		}
	}

	private updateBarriers(): void {
		const x = this.barrierOffset + this.index * 3;
		const y = Math.random() * DISPLAY_HEIGHT;
		this.barriers[this.index++ % 10] = new Barrier(x, y);
		this.barriers[this.index++ % 10] = new Barrier(x, y - DISPLAY_HEIGHT * 2);
	}

}