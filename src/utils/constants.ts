export const TILES = {
    LABYRINTH: 'labyrinth',
};

export const SIZES = {
    TILE: 32,
    PLAYER: {
        WIDTH: 32,
        HEIGHT: 32,
    },
    ENEMY: {
        WIDTH: 32,
        HEIGHT: 32,
    },
};

enum Area {
    GROUND = 'ground',
    WALLS = 'walls',
    SUBWALLS = 'subwalls',
    LOOT = 'loot',
}

export const LAYERS = {
    AREA: Area,
    CORDS: {
        X: 0,
        Y: 0,
    },
};

export const SPRITES = {
    PLAYER: 'Player',
    BOAR: {
        BASE: 'Base Boar',
    },
};

export enum SPEED {
    SLOW = 0.5,
    NORMAL = 0.15,
    FAST = 0.25,
}
