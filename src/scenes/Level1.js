import Phaser from 'phaser';
import { Player } from '../objects/Player.js';

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    // Sirve para recibir datos de otras escenas
    init(data) {
        // Se captura el índice del soldado seleccionado (0, 1, 2 o 3)
        this.soldadoElegido = data.soldadoElegido || 0; 
        console.log("Iniciando misión con el comando tipo:", this.soldadoElegido);
    }

    preload() {
        // ----------------Cargar el fondo desde la carpeta----------------
        this.load.image('fondo_selva', '/src/assets/levels/selva.png');

        // ----------------Cargar el sonido de fondo para el nivel-----------
        this.load.audio('nivel1_music', '/src/assets/audio/theme_level1.mp3');

        // ----------------Cargar boton de mute-----------------------
        this.load.image('mute_button', '/src/assets/ui/mute.png');

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
        this.background = this.add.image(800, 360, 'fondo_selva');

        // ----------Reproducir música de fondo para el nivel----------------
        this.musicaNivel1 = this.sound.add('nivel1_music', {
            loop: true,
            volume: 0.5
        });
        // Iniciar la reproducción de la música del nivel
        this.musicaNivel1.play();

        //----------Crear el jugador y las plataformas----------------
        // Instanciamos a nuestro jugador en el centro superior de la pantalla
        this.player = new Player(this, 100, 400);

        // Creamos un suelo rápido con físicas estáticas para que no se caiga al vacío
        this.platforms = this.physics.add.staticGroup();
        
        // Creamos una plataforma invisible o visible en la base (X: 400, Y: 550, Ancho: 800, Alto: 40)
        let ground = this.add.rectangle(400, 550, 800, 40, 0x34495e);
        ground.setAlpha(0.6); // Opcional: hazlo semitransparente para ver el fondo debajo
        this.platforms.add(ground);

        // Hacemos que el jugador colisione con el suelo
        this.physics.add.collider(this.player, this.platforms);

        // ------------Botón de mute para la música------------
        // Iniciar el juego con sonido
        this.sound.mute = false;

        // Crear el botón de mute en la esquina superior derecha
        this.btnMute = this.add.image(750, 50, 'mute_button').setInteractive();
        // Mantener el botón fijo en la pantalla aunque el jugador se mueva
        this.btnMute.setScrollFactor(0);
        // Ajustar escala del boton
        this.btnMute.setScale(0.05);
        // Al inicio el boton es transparente para indicar que el sonido está activo
        this.btnMute.setAlpha(0.5);
        // Interracion con el boton
        this.btnMute.on('pointerdown', () => {
            // Invertir el estado global del sonido en todo el juego
            this.sound.mute = !this.sound.mute;
            
            // Cambiar la transparencia de la imagen para el usuario
            this.btnMute.setAlpha(this.sound.mute ? 0.5 : 1.0);

            // Guardar la nueva preferencia en el navegador
            localStorage.setItem('isMuted', this.sound.mute);
        });

        // ----------------Pausa del juego----------------------
        this.input.keyboard.on('keydown-ESC', () => {
            // Pausamos la escena actual
            this.scene.pause();
            
            // Lanzamos la escena de pausa encima, enviándole el soldado actual
            this.scene.launch('Pause', { soldadoElegido: this.soldadoElegido });
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.musicaNivel1) {
                this.musicaNivel1.stop();
                this.musicaNivel1.destroy();
            }
        });
    }

    update() {
        // Ejecutamos el ciclo de actualización del jugador en cada frame
        this.player.update();
    }
}