import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Aquí se gestionará la carga de imágenes y audio más adelante
    }

    create() {
        // Texto temporal para verificar que la escena corre perfectamente
        this.add.text(400, 300, 'Iwia: Operación Cenepa', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}