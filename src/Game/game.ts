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

    constructor() {
        document.getElementById('new-game-button').addEventListener('click', () => {
            this.newGame();
        });
    }

    public init(): Promise<void[]> {
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

    private newGame(): void {
        document.querySelector('.game-over').classList.remove('show'); 
        document.querySelector('.score-counter').innerHTML = '0000';
        this.scene = new Scene();
        this.run();
    }

    private loadShaders(): void {
        Shader.background = new Shader('backgroundVS', 'backgroundFS');
        Shader.bird = new Shader('birdVS', 'birdFS');
        Shader.barrier = new Shader('barrierVS', 'barrierFS');
    }

    private loadObjects(): Promise<void[]> {
        return Promise.all(this.gameObjectsArray.map(x => x.create()));
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
        // TODO: frametime controller
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.scene.render();

        const GL_ERROR = GL.getError();
        if (GL_ERROR != GL.NO_ERROR) {
            console.error(GL_ERROR);
        }
    }

}
