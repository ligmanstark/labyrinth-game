import { Entity } from './entity';

import * as T from '../../types/index';

export class Player extends Entity {
    textureKey: string;
    private ignoringAnotherSprites: boolean;
    private moveSpeed: number;

    constructor({ scene, x, y, texture }: T.TGameObjects) {
        super({ scene, texture, x, y });

        const anims = this.scene.anims;
        const animsFrameRate = 9;

        this.textureKey = texture;
        this.moveSpeed = 2;
        this.ignoringAnotherSprites = true;

        this.setSize(16, 16);
        this.setScale(0.9);

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 23,
                end: 27,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 28,
                end: 32,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 36,
                end: 39,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 47,
                end: 51,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });
    }
    update(delta: number): void {
        const keys = this.scene.input.keyboard.createCursorKeys();
        if (keys.up.isDown) {
            this.play('up', this.ignoringAnotherSprites);
            this.setVelocity(0, -delta * this.moveSpeed);
        } else if (keys.down.isDown) {
            this.play('down', this.ignoringAnotherSprites);
            this.setVelocity(0, delta * this.moveSpeed);
        } else if (keys.left.isDown) {
            this.play('left', this.ignoringAnotherSprites);
            this.setVelocity(-delta * this.moveSpeed, 0);
        } else if (keys.right.isDown) {
            this.play('right', this.ignoringAnotherSprites);
            this.setVelocity(delta * this.moveSpeed, 0);
        } else {
            this.setVelocity(0, 0);
            this.stop();
        }
    }
}
