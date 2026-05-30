import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_machete');

        this.scene = scene;
        this.health = 1;
        this.speed = 45;
        this.isDead = false;
        this.direction = -1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.32);
        this.setDepth(8);

        this.setCollideWorldBounds(false);
        this.body.setAllowGravity(true);

        // Caja grande para que las balas lo detecten fácil
        this.body.setSize(300, 390);
        this.body.setOffset(105, 90);

        this.setVelocityX(this.speed * this.direction);
        this.setFlipX(true);
    }

    update() {
        if (this.isDead) return;

        this.setVelocityX(this.speed * this.direction);

        // Movimiento simple entre dos zonas
        if (this.x < 700) {
            this.direction = 1;
            this.setFlipX(false);
        }

        if (this.x > 1900) {
            this.direction = -1;
            this.setFlipX(true);
        }
    }
    
    takeDamage() {
        if (this.isDead) return false;

        this.health--;

        if (this.health <= 0) {
            this.die();
            return true;
        }

        return false;
    }

    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.disableBody(true, true);
    }
}