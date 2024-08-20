import * as T from '../../types/index';

export class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor({ scene, texture, x, y }: T.TGameObjects) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}
