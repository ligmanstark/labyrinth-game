<script lang="ts">
import { Scene, GameObjects } from 'phaser';

export default class Authors extends Scene {
    authors: GameObjects.Text;
    text: GameObjects.Text;
    backToMainMenu: GameObjects.DOMElement;
    constructor() {
        super('Authors');
    }
    create() {
        this.authors = this.add
            .text(512, 120, 'Levis', {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.text = this.add
            .text(512, 180, 'Пока я тут один, но возможно нас станет больше', {
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.backToMainMenu = this.add
            .dom(512, 220, 'button', '', 'Назад в главное меню!')
            .setClassName('back-to-mainmenu')
            .addListener('click')
            .on('click', () => this.scene.start('MainMenu'));
    }
}
</script>
