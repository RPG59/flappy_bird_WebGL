import { Shader } from '../Graphics/shader';
import { Background } from '../GameObjects/background';
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, GL, IGameObject } from '../common';
import { float4x4 } from '../Math/math';
import { Bird } from '../GameObjects/bird';
import { Scene } from '../Scene/scene';
import { Input } from '../Input/input';
import { Barrier } from '../GameObjects/barrier';

export class Game {
    scene: Scene;
    gameObjectsArray: IGameObject[] = [Bird, Background, Barrier];
    count: number = 0;

    public init(): Promise<void> {
        GL.enable(GL.DEPTH_TEST);
        GL.activeTexture(GL.TEXTURE0);
        this.loadShaders();
        this.setUniforms();
        Input.init();
        this.scene = new Scene();
        
        return this.loadObjects();
    }

    public run(): void {
        if (!this.scene.isEndGame) {
            this.count++;
            this.render();
            this.update();
            requestAnimationFrame(this.run.bind(this));
        }
    }

    private loadShaders(): void {
        Shader.background = new Shader('backgroundVS', 'backgroundFS');
        Shader.bird = new Shader('birdVS', 'birdFS');
        Shader.barrier = new Shader('barrierVS', 'barrierFS');
    }

    private async loadObjects(): Promise<void> {
        return new Promise(res => {
            let counter = this.gameObjectsArray.length;

            this.gameObjectsArray.forEach(x => {
                x.create().then(() => {
                    if (!--counter) {
                        res();
                    }
                });
            });
        });
    }

    private setUniforms(): void {
        const projMatrix = new float4x4();
        projMatrix.orthographic(-DISPLAY_WIDTH, DISPLAY_WIDTH, -DISPLAY_HEIGHT, DISPLAY_HEIGHT, -1, 1);
        Shader.background.setUniformMatrix4f('u_projectionMatrix', projMatrix);
        Shader.background.setUniform1i('u_tex', 0);
        Shader.bird.setUniformMatrix4f('u_projectionMatrix', projMatrix);
        Shader.bird.setUniform1i('u_tex', 0);
        Shader.barrier.setUniformMatrix4f('u_projectionMatrix', projMatrix);
        Shader.barrier.setUniform1i('u_tex', 0);
    }

    private update(): void {
        this.scene.update();
    }

    private render(): void {
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.scene.render();

        const GL_ERROR = GL.getError();
        if (GL_ERROR != GL.NO_ERROR) {
            console.error(GL_ERROR);
        }
    }

}
