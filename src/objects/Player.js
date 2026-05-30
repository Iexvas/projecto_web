import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // 'player_placeholder' será la clave de la imagen temporal que cargaremos
        super(scene, x, y, 'player_placeholder');
        
        // Añadir el objeto a la escena y al sistema de físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configuraciones físicas del Iwia
        this.setCollideWorldBounds(true); // Evita que se salga de la pantalla
        this.setBounce(0.05); // Un rebote mínimo al caer
        
        // Variables de movimiento configurables
        this.speed = 200;
        this.jumpForce = -450;

        // Configurar las teclas de control (Flechas del teclado)
        this.cursors = scene.input.keyboard.createCursorKeys();

        // configurar WSAD como teclas alternativas
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        const leftPressed = this.cursors.left.isDown || this.keys.left.isDown;
        const rightPressed = this.cursors.right.isDown || this.keys.right.isDown;
        const jumpPressed = this.cursors.up.isDown || this.keys.up.isDown;
        if (leftPressed) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        } else if (rightPressed) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }
    
        if (jumpPressed && this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
        }
    }
}