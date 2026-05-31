import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('main_menu_bg', '/src/assets/menu/main_menu_bg.png');
        this.load.audio('menu_music', '/src/assets/audio/menu.mp3');
        this.load.audio('select_sound', '/src/assets/audio/seleccion.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        // Fondo
        this.add.image(400, 300, 'main_menu_bg').setOrigin(0.5).setDisplaySize(850, 590);

        // Opciones del menú
        this.opciones = [
            { texto: 'JUGAR', accion: 'jugar' },
            { texto: 'PUNTAJES', accion: 'puntajes' },
            { texto: 'SALIR', accion: 'salir' }
        ];

        this.seleccionActual = 0;
        this.textosOpciones = [];

        // Crear textos de opciones
        const posicionYInicial = 200;
        const espacioEntreOpciones = 90;

        this.opciones.forEach((opcion, index) => {
            const posY = posicionYInicial + (index * espacioEntreOpciones);
            const texto = this.add.text(400, posY, opcion.texto, {
                fontSize: '32px',
                fontFamily: 'Papyrus',
                fill: '#C9D1D9',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.textosOpciones.push(texto);
        });

        // Indicador visual (selector)
        this.indicador = this.add.text(280, posicionYInicial, '▶', {
            fontSize: '32px',
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.actualizarSeleccion();

        // Música
        this.musicaMenu = this.sound.add('menu_music', {
            loop: true,
            volume: 0.5
        });
        this.musicaMenu.play();

        // Sonido de selección
        this.sonidoSeleccion = this.sound.add('select_sound', {
            volume: 0.8
        });

        // Controles
        this.input.keyboard.on('keydown-UP', () => this.navegarArriba());
        this.input.keyboard.on('keydown-DOWN', () => this.navegarAbajo());
        this.input.keyboard.on('keydown-ENTER', () => this.seleccionar());
    }

    navegarArriba() {
        this.seleccionActual = (this.seleccionActual - 1 + this.opciones.length) % this.opciones.length;
        this.actualizarSeleccion();
    }

    navegarAbajo() {
        this.seleccionActual = (this.seleccionActual + 1) % this.opciones.length;
        this.actualizarSeleccion();
    }

    actualizarSeleccion() {
        this.textosOpciones.forEach((texto, index) => {
            if (index === this.seleccionActual) {
                texto.setFill('#ffaa00');
                texto.setFontSize(36);
            } else {
                texto.setFill('#C9D1D9');
                texto.setFontSize(32);
            }
        });

        const posicionYInicial = 200;
        const espacioEntreOpciones = 90;
        const nuevaY = posicionYInicial + (this.seleccionActual * espacioEntreOpciones);
        this.indicador.setY(nuevaY);
    }

    seleccionar() {
        const accion = this.opciones[this.seleccionActual].accion;
        this.musicaMenu.stop();

        if (accion === 'jugar') {
            this.scene.start('PlayerNameScene');
        } else if (accion === 'puntajes') {
            this.scene.start('ScoresScene');
        } else if (accion === 'salir') {
            this.game.destroy(true);
        }
    }
}
