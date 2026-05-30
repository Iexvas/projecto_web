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
    }

    update() {
        // Lógica de movimiento horizontal (Izquierda / Derecha)
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true); // Voltea el sprite a la izquierda
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false); // Voltea el sprite a la derecha
        } else {
            this.setVelocityX(0); // Detenerse si no se presiona nada
        }

        // Lógica de salto: Solo si está tocando el suelo o una plataforma
        if (this.cursors.up.isDown && this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
        }
    }
}