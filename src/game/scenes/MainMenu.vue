<script lang="ts">
import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export default class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    startgame: GameObjects.DOMElement;
    credits: GameObjects.DOMElement;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.startgame = this.add
            .dom(512, 160, 'button', '', 'Пройти лабиринт')
            .setClassName('start-game')
            .addListener('click')
            .on('click', () => this.scene.start('LabyrinthScene'));

        this.title = this.add
            .text(512, 120, 'Лабиринт', {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.credits = this.add
            .dom(512, 200, 'button', '', 'Авторы')
            .setClassName('credits')
            .addListener('click')
            .on('click', () => this.scene.start('Authors'));

        EventBus.emit('current-scene-ready', this);
    }
}
</script>

<style>
button {
    width: 200px;
    height: 25px;
    border-radius: 0.5rem;
    background-color: sienna;
}
</style>
