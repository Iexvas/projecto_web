import Phaser from 'phaser';
import { Player } from '../objects/Player.js';

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        // TRUCO DE PROTOTIPADO: Creamos un rectángulo verde texturizado de 32x48 píxeles
        // Así no necesitas descargar ninguna imagen para probar el código hoy mismo.
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2ecc71'; // Verde Iwia militar
        ctx.fillRect(0, 0, 32, 48);
        
        this.textures.addCanvas('player_placeholder', canvas);
    }

    create() {
        // Instanciamos a nuestro jugador en el centro superior de la pantalla
        this.player = new Player(this, 400, 100);

        // Creamos un suelo rápido con físicas estáticas para que no se caiga al vacío
        this.platforms = this.physics.add.staticGroup();
        
        // Creamos una plataforma invisible o visible en la base (X: 400, Y: 550, Ancho: 800, Alto: 40)
        let ground = this.add.rectangle(400, 550, 800, 40, 0x34495e);
        this.platforms.add(ground);

        // REQUISITO OBLIGATORIO: Detección de colisiones 
        // Hacemos que el jugador colisione con el suelo
        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        // Ejecutamos el ciclo de actualización del jugador en cada frame
        this.player.update();
    }
}