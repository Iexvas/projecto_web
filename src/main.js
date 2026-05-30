import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800, // Resolución base (luego la haremos responsiva)
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade', // Requisito obligatorio del proyecto
        arcade: {
            gravity: { y: 400 }, // Gravedad básica para nuestro plataformero
            debug: true // Muestra los cuadros de colisión azules/verdes en desarrollo
        }
    },
    scene: [MenuScene] // Cargamos la primera escena
};

const game = new Phaser.Game(config);