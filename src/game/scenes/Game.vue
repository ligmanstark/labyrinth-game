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
        this.load.image(C.TILES.LABYRINTH, 'src/assets/tilesets/labyrinth.png');
        this.load.tilemapTiledJSON('map', 'src/assets/labyrinth.json');
        this.load.spritesheet(
            C.SPRITES.PLAYER,
            'src/assets/characters/FOXSPRITESHEET.png',
            {
                frameWidth: C.SIZES.PLAYER.WIDTH,
                frameHeight: C.SIZES.PLAYER.HEIGHT,
            }
        );
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

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

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
    }

    update(_time: number, delta: number) {
if(this.winGame){
    console.log('win!');
}

        const distanceToLoot = Phaser.Math.Distance.Between(
            this.lootLayer.x,
            this.lootLayer.y,
            this.player.x,
            this.player.y
        );
        this.player.update(delta);
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
