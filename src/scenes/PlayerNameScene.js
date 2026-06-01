import Phaser from 'phaser';

export class PlayerNameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerNameScene' });
    }

    preload() {
        this.load.image('player_name_screen', '/src/assets/ui/player_name_screen.jpg');
        this.load.audio('select_sound', '/src/assets/audio/seleccion.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        // Fondo
        this.add.image(400, 300, 'player_name_screen').setOrigin(0.5).setScale(0.8);

        // Variable para almacenar el nombre
        this.nombre = '';
        this.maxCaracteres = 15;

        // Texto del nombre que va escribiendo
        this.textoNombre = this.add.text(400, 240, '', {
            fontSize: '36px',
            fontFamily: 'Papyrus',
            fill: '#C9D1D9',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instrucciones
        this.add.text(400, 450, 'Presiona ENTER para continuar', {
            fontSize: '18px',
            fontFamily: 'Papyrus',
            fill: '#ffaa00'
        }).setOrigin(0.5);

        // Sonido de selección
        this.sonidoSeleccion = this.sound.add('select_sound', {
            volume: 0.8
        });

        // Configurar entrada de teclado
        this.input.keyboard.on('keydown', (event) => {
            const tecla = event.key;

            // Si es Enter y hay nombre, ir a MenuScene
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                if (this.nombre.trim().length > 0) {
                    // Guardar el nombre en el registry para acceder después
                    this.registry.set('playerName', this.nombre.trim());
                    this.time.delayedCall(300, () => {
                        this.scene.start('MenuScene');
                    });
                }
                return;
            }

            // Si es Backspace, eliminar último carácter
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
                if (this.nombre.length > 0) {
                    this.nombre = this.nombre.slice(0, -1);
                    this.actualizarNombre();
                }
                return;
            }

            // Si es un carácter válido (letra, número, espacio), añadir
            if (this.nombre.length < this.maxCaracteres) {
                // Permitir letras, números, espacios y algunos caracteres
                if (/^[a-zA-Z0-9\s\-_]$/.test(tecla)) {
                    this.nombre += tecla.toUpperCase();
                    this.actualizarNombre();
                }
            }
        });
    }

    actualizarNombre() {
        this.textoNombre.setText(this.nombre);
    }
}
