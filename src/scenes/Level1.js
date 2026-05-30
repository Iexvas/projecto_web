import Phaser from 'phaser';
import { Player } from '../objects/Player.js';

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    // El método init se ejecuta antes de preload y sirve para recibir datos de otras escenas
    init(data) {
        // Aquí capturamos el índice del soldado seleccionado (0, 1, 2 o 3)
        this.soldadoElegido = data.soldadoElegido || 0; 
        console.log("Iniciando misión con el comando tipo:", this.soldadoElegido);
    }

    preload() {
        // Cargar el fondo desde la carpeta
        this.load.image('fondo_selva', '/src/assets/levels/selva.png');

        // Marcador de posicion temporal para el jugador
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2ecc71'; // Verde Iwia militar
        ctx.fillRect(0, 0, 32, 48);
        
        this.textures.addCanvas('player_placeholder', canvas);
    }

    create() {

        // Renderizar el fondo de la selva
        this.background = this.add.image(100, 220, 'fondo_selva');

        // Instanciamos a nuestro jugador en el centro superior de la pantalla
        this.player = new Player(this, 100, 400);

        // Creamos un suelo rápido con físicas estáticas para que no se caiga al vacío
        this.platforms = this.physics.add.staticGroup();
        
        // Creamos una plataforma invisible o visible en la base (X: 400, Y: 550, Ancho: 800, Alto: 40)
        let ground = this.add.rectangle(400, 550, 800, 40, 0x34495e);
        ground.setAlpha(0.6); // Opcional: hazlo semitransparente para ver el fondo debajo
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