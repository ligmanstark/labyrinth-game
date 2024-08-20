<script setup lang="ts">
import Phaser from 'phaser';
import { ref, toRaw } from 'vue';
import type { MainMenu } from './game/scenes/MainMenu.vue';
import PhaserGame from './game/PhaserGame.vue';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

// Event emitted from the PhaserGame component
const currentScene = (scene: MainMenu) => {
    canMoveSprite.value = scene.scene.key !== 'MainMenu';
};
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
