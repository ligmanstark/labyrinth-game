import { scenes } from './scenes';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 640,
    url: import.meta.env.URL || '',
    version: import.meta.env.VERSION || '0.0.1',
    fps: {
        limit: 30,
    },
    title: 'Labyrinth',
    dom: {
        createContainer: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: scenes,
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
