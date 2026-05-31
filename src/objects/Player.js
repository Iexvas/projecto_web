import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, characterKey = 'eloy') {
        super(scene, x, y, `${characterKey}_idle_sheet`, 0);

        this.scene = scene;
        this.characterKey = characterKey;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Tamaño visual del sprite
        this.setScale(0.30);
        this.setDepth(10);

        // Física
        this.setCollideWorldBounds(true);
        this.setBounce(0.02);

        // Caja de colisión
        this.body.setSize(145, 285);
        this.body.setOffset(185, 175);

        // Movimiento
        this.speed = 220;
        this.jumpForce = -520;
        this.facing = 1;

        // Estados
        this.isDead = false;
        this.isShooting = false;

        this.health = 3;
        this.maxHealth = 3;
        this.isInvulnerable = false;

        // Controles
        this.cursors = scene.input.keyboard.createCursorKeys();

        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.Z,
            shootAlt: Phaser.Input.Keyboard.KeyCodes.J,
            deathTest: Phaser.Input.Keyboard.KeyCodes.K
        });

        // Balas
        this.bullets = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 30
        });

        this.playAnim('idle');
    }

    playAnim(animName, ignoreIfPlaying = true) {
        const key = `${this.characterKey}_${animName}`;

        if (this.scene.anims.exists(key)) {
            this.anims.play(key, ignoreIfPlaying);
        }
    }

    update() {
        if (this.isDead) return;

        const leftPressed = this.cursors.left.isDown || this.keys.left.isDown;
        const rightPressed = this.cursors.right.isDown || this.keys.right.isDown;
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.up);
        const shootPressed = Phaser.Input.Keyboard.JustDown(this.keys.shoot) || Phaser.Input.Keyboard.JustDown(this.keys.shootAlt);
        const deathPressed = Phaser.Input.Keyboard.JustDown(this.keys.deathTest);

        if (deathPressed) {
            this.die();
            return;
        }

        if (leftPressed) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.facing = -1;
        } else if (rightPressed) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.facing = 1;
        } else {
            this.setVelocityX(0);
        }

        if (jumpPressed && this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
            this.playAnim('jump');
        }

        if (shootPressed) {
            this.shoot();
        }

        if (!this.isShooting) {
            if (!this.body.blocked.down) {
                this.playAnim('jump');
            } else if (leftPressed || rightPressed) {
                this.playAnim('run');
            } else {
                this.playAnim('idle');
            }
        }
    }

    shoot() {
        if (this.isShooting || this.isDead) return;

        this.isShooting = true;
        this.playAnim('shoot', true);

        const bulletX = this.x + (this.facing === 1 ? 65 : -65);
        const bulletY = this.y - 15;

        const bullet = this.bullets.get();

        if (bullet) {
            bullet.setTexture('bullet');

            bullet.enableBody(true, bulletX, bulletY, true, true);
            bullet.body.allowGravity = false;

            bullet.setDepth(20);
            bullet.setScale(1);
            bullet.setVelocityX(700 * this.facing);
            bullet.setVelocityY(0);

            bullet.body.setSize(16, 4);
        }

        this.scene.time.delayedCall(220, () => {
            this.isShooting = false;
        });
    }


    takeDamage(amount = 1) {
        if (this.isDead || this.isInvulnerable) return;

        this.health -= amount;

        console.log('Vida actual:', this.health);

        this.isInvulnerable = true;
        this.setTint(0xff5555);

        this.scene.time.delayedCall(120, () => {
            this.clearTint();
        });

        this.scene.time.delayedCall(240, () => {
            this.setTint(0xff5555);
        });

        this.scene.time.delayedCall(360, () => {
            this.clearTint();
        });

        this.scene.time.delayedCall(1000, () => {
            this.isInvulnerable = false;
            this.clearTint();
        });

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, 0);
        this.playAnim('death', true);

        this.scene.time.delayedCall(1500, () => {
            if (this.scene.gameOver) {
                this.scene.gameOver();
            } else {
                this.scene.scene.start('MainMenuScene');
            }
        });
    }
}