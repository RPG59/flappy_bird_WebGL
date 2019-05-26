import { Bird } from '../GameObjects/bird';
import { Shader } from '../Graphics/shader';
import { Background } from '../GameObjects/background';
import { float3, float4x4 } from '../Math/math';
import { Barrier, BARRIER_GAP } from '../GameObjects/barrier';
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, GL } from '../common';

const BACKGROUND_OFFSET_MULTIPLIER = 0.03;
const BARRIERS_OFFSET_MULTIPLIER = 0.05;

export class Scene {
    private bird: Bird;
    private barriers: Barrier[] = [];
    private barrierOffset: number = 5;
    private currentBarrierIndex: number = 0;
    private time: number = 0;
    private XOffset: number = 0;
    private bgXOffset: number = 0;
    
    public isEndGame: boolean = false;

    constructor() {
        this.bird = new Bird();
        this.createBarriers();
    }

    public update(): void {
        this.XOffset -= 2;
        // if (XOffset * MULTIPLIER -> DISPLAY_WIDTH)  bgXOffset++
        if (this.XOffset % Math.ceil(DISPLAY_WIDTH / BACKGROUND_OFFSET_MULTIPLIER) === 0)
            this.bgXOffset++;

        if (-this.XOffset > 250 && -this.XOffset % 120 === 0)
            this.updateBarriers();

        if (this.collisionDetection()) {
            this.endGame();
        }

        this.bird.update();
        this.time += 0.01;
    }

    public render(): void {
        this.renderBackground();
        this.renderBird();
        this.renderBarriers();
    }

    private renderBackground(): void {

        Shader.background.enable();
        Background.texture.bind();

        // |----------|----------|
        // | display  |//////////|
        // |          |//////////|
        // |----------|----------|
        // -10   0    10   20   30

        for (let i = this.bgXOffset; i < this.bgXOffset + 4; ++i) {
            Shader.background.setUniformMatrix4f('u_viewMatrix',
                new float4x4().translate(new float3(i * 10 + this.XOffset * BACKGROUND_OFFSET_MULTIPLIER, 0, 0)));
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
        Shader.barrier.setUniformMatrix4f(
            'u_viewMatrix',
            new float4x4().translate(new float3(this.XOffset * BARRIERS_OFFSET_MULTIPLIER, 0, 0)));
        Barrier.texture.bind();
        Barrier.mesh.bind();

        for (let i = 0; i < 10; ++i) {
            Shader.barrier.setUniformMatrix4f('u_modelMatrix', this.barriers[i].getModelMatrix());
            Shader.barrier.setUniform1i('u_top', i % 2 === 0 ? 1 : 0);
            Barrier.mesh.draw();
        }
        Barrier.mesh.unbind();
        Barrier.texture.unbind();
    }

    private createBarriers(): void {
        for (let i = 0; i < 5 * 2; i += 2) {
            const x = this.barrierOffset + this.currentBarrierIndex * 3;
            const random = Math.random() * DISPLAY_HEIGHT;
            this.barriers.push(new Barrier(x, random));
            this.barriers.push(new Barrier(x, random - DISPLAY_HEIGHT * 2));
            this.currentBarrierIndex += 2;
        }
    }

    private updateBarriers(): void {
        const x = this.barrierOffset + this.currentBarrierIndex * 3;
        const y = Math.random() * DISPLAY_HEIGHT;

        this.barriers[this.currentBarrierIndex++ % 10] = new Barrier(x, y);
        this.barriers[this.currentBarrierIndex++ % 10] = new Barrier(x, y - DISPLAY_HEIGHT * 2);

    }

    private collisionDetection(): boolean {

        const birdX = -this.XOffset * BARRIERS_OFFSET_MULTIPLIER;
        const birdY = this.bird.getPositionY();

        for (let i = 0; i < 10; i += 2) {
            const barrierX = this.barriers[i].getX();
            const barrierY = this.barriers[i].getY();
            const xCollision = birdX >= barrierX && birdX <= barrierX + Barrier.getWidth();
            const yCollision = birdY < barrierY - BARRIER_GAP || birdY > barrierY;

            if (xCollision && yCollision)
                return true;
        }
    }
    
    private endGame(): void {
        this.isEndGame = true;       
        document.querySelector('.game-over').classList.add('show'); 
    }
    
    

}