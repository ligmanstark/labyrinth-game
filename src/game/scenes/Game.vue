<script lang="ts">
import labyrinthJSON from '../../assets/labyrinth.json';
import * as C from '../../utils/constants';
import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entity/player';

export default class Game extends Scene {
    private player?: Player;
    private vision?: Phaser.GameObjects.Image;
    private lootLayer?: Phaser.Tilemaps.TilemapLayer;
    private winGame?: GameObjects.Text;
    mobileUp: GameObjects.DOMElement;
    mobileDown: GameObjects.DOMElement;
    mobileLeft: GameObjects.DOMElement;
    mobileRight: GameObjects.DOMElement;
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    constructor(
        vision: Phaser.GameObjects.Image,
        lootLayer: Phaser.Tilemaps.TilemapLayer,
        winGame: GameObjects.Text
    ) {
        super('LabyrinthScene');
        this.vision = vision;
        this.lootLayer = lootLayer;
        this.winGame = winGame;
    }

    preload() {
        this.load.image(C.TILES.LABYRINTH, '/labyrinth.png');
        this.load.tilemapTiledJSON('map', '/labyrinth.json');
        this.load.spritesheet(C.SPRITES.PLAYER, '/FOXSPRITESHEET.png', {
            frameWidth: C.SIZES.PLAYER.WIDTH,
            frameHeight: C.SIZES.PLAYER.HEIGHT,
        });
    }

    create() {
        let tileset;
        const map = this.make.tilemap({ key: 'map' });
        if (labyrinthJSON.tilesets[0].name)
            tileset = map.addTilesetImage(
                labyrinthJSON.tilesets[0].name,
                C.TILES.LABYRINTH,
                C.SIZES.TILE,
                C.SIZES.TILE
            );
        //@ts-ignore
        const groundLayer = map.createLayer(
            C.LAYERS.AREA.GROUND,
            tileset,
            C.LAYERS.CORDS.X,
            C.LAYERS.CORDS.Y
        );

        const wallsLayer = map.createLayer(
            C.LAYERS.AREA.WALLS,
            tileset,
            C.LAYERS.CORDS.X,
            C.LAYERS.CORDS.Y
        );

        const subwallsLayer = map.createLayer(
            C.LAYERS.AREA.SUBWALLS,
            tileset,
            C.LAYERS.CORDS.X,
            C.LAYERS.CORDS.Y
        );

        this.lootLayer = map.createLayer(
            C.LAYERS.AREA.LOOT,
            tileset,
            C.LAYERS.CORDS.X,
            C.LAYERS.CORDS.Y
        );

        this.player = new Player({
            scene: this,
            x: 450,
            y: 320,
            texture: C.SPRITES.PLAYER,
        });

        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.player, subwallsLayer);
        subwallsLayer.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.player, this.lootLayer);
        this.lootLayer.setCollisionByExclusion([-1]);

        const renderTexture = this.make.renderTexture(
            {
                width: 4096,
                height: 4096,
            },
            true
        );

        renderTexture.fill(0x000000);
        renderTexture.draw(groundLayer);
        renderTexture.draw(wallsLayer);
        renderTexture.draw(subwallsLayer);
        renderTexture.setTint(0x0a2948);

        this.vision = this.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'vision',
            add: false,
        });
        this.vision.scale = 3;

        renderTexture.mask = new Phaser.Display.Masks.BitmapMask(
            this,
            this.vision
        );
        renderTexture.mask.invertAlpha = true;

        EventBus.emit('current-scene-ready', this);

        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;

        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            const heightView = window.screen.height /1.44
            const positionUp = heightView
            const positionDown=heightView+60
            const positionMiddle=heightView+30

             this.mobileUp = this.add
                .dom(512, positionUp, 'button', '', 'Up')
                .setClassName('controlls')
                .addListener('mouseup')
                .on('mouseup', () => {
                    this.moveUp = false;
                })
                .addListener('mousedown')
                .on('mousedown', () => {
                    this.moveUp = true;
                });
            this.mobileDown = this.add
                .dom(512, positionDown, 'button', '', 'Down')
                .setClassName('controlls')
                .addListener('mouseup')
                .on('mouseup', () => {
                    this.moveDown = false;
                })
                .addListener('mousedown')
                .on('mousedown', () => {
                    this.moveDown = true;
                });
            this.mobileLeft = this.add
                .dom(412, positionMiddle, 'button', '', 'Left')
                .setClassName('controlls')
                .addListener('mouseup')
                .on('mouseup', () => {
                    this.moveLeft = false;
                })
                .addListener('mousedown')
                .on('mousedown', () => {
                    this.moveLeft = true;
                });
            this.mobileRight = this.add
                .dom(612, positionMiddle, 'button', '', 'Right')
                .setClassName('controlls')
                .addListener('mouseup')
                .on('mouseup', () => {
                    this.moveRight = false;
                })
                .addListener('mousedown')
                .on('mousedown', () => {
                    this.moveRight = true;
                });
        } else {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setZoom(2);
            this.cameras.main.setBounds(
                0,
                0,
                map.widthInPixels,
                map.heightInPixels
            );
        }
    }

    update(_time: number, delta: number) {
        if (this.winGame) {
            console.log('win!');
        }

        const distanceToLoot = Phaser.Math.Distance.Between(
            this.lootLayer.x,
            this.lootLayer.y,
            this.player.x,
            this.player.y
        );
        this.player.update(
            delta,
            this.moveUp,
            this.moveDown,
            this.moveLeft,
            this.moveRight
        );
        if (this.vision) {
            this.vision.x = this.player.x;
            this.vision.y = this.player.y;
        }

        if (distanceToLoot < 110) {
            this.player.setVelocity(0, 0);
            this.winGame = this.add
                .text(220, 120, 'Победа!', {
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8,
                })
                .setOrigin(0.5)
                .setDepth(100);

            setTimeout(() => this.scene.start('MainMenu'), 2000);
        }
    }
}
</script>
<style>
.controlls {
    position: absolute;
    display: flex;
    width: 100px;
 }
</style>
