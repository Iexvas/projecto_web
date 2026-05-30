import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { Level1 } from './scenes/Level1.js';
import { Pause } from './scenes/Pause.js';

const config = {
    type: Phaser.AUTO,
    //width: 800, 
    //height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },

    parent: 'game-container',
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 600 }, // Gravedad básica para nuestro plataformero
            debug: true // Muestra los cuadros de colisión azules/verdes en desarrollo
        }
    },
    scene: [MenuScene, Level1, Pause] // Cargamos la primera escena
};

const game = new Phaser.Game(config);