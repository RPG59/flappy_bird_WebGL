import { VertexArray } from '../Graphics/vertexArray';
import { Texture } from '../Graphics/texture';
import { float3, float4x4 } from '../Math/math';
import { Shader } from '../Graphics/shader';
import { Input } from '../Input/input';

export class Bird {
    public static mesh: VertexArray;
    public static texture: Texture;

    private position: float3 = new float3();
    private gravity: number = 0;
    private rotationAngle: number = 0;

    static create(): Promise<void> {
        const vertices = new Float32Array([
            -0.5, -0.5, 0.2,
            -0.5, 0.5, 0.2,
            0.5, 0.5, 0.2,
            0.5, -0.5, 0.2,
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
        this.texture = new Texture('res/bird.png');
        return this.texture.create();
    }

    public getPositionY(): number {
        return this.position.y;
    }

    public update(): void {
        this.position.y -= this.gravity;

        if (Input.isKeyDown('Space')) {
            this.gravity = -0.1;
        } else {
            this.gravity += 0.01
        }


        this.rotationAngle = -this.gravity * 100;
    }

    public updateGravity(): void {
        // this.gravity = -0.1;
    }

    public render(): void {
        const translate = new float4x4().translate(this.position);
        const rotate = new float4x4().rotate(this.rotationAngle);

        Shader.bird.enable();
        Shader.bird.setUniformMatrix4f('u_modelMatrix', translate.multiply(rotate));
        Bird.texture.bind();
        Bird.mesh.render();
        Shader.bird.disable();
    }


}