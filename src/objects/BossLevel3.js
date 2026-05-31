import Phaser from 'phaser';

export class BossLevel3 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player, onDeathCallback) {
        super(scene, x, y, 'boss_idle_sheet', 0);

        this.scene = scene;
        this.player = player;
        this.onDeathCallback = onDeathCallback;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.55);
        this.setDepth(20);
        this.setCollideWorldBounds(true);

        this.body.setSize(300, 420);
        this.body.setOffset(105, 60);

        this.maxHealth = 25;
        this.health = this.maxHealth;

        this.isDead = false;
        this.isAttacking = false;
        this.isInvulnerable = false;

        this.attackCooldown = false;

        this.bossBullets = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 20
        });

        this.createBulletTexture();
        this.createHealthBar();

        scene.physics.add.overlap(
            this.bossBullets,
            this.player,
            this.bulletHitsPlayer,
            null,
            this
        );

        scene.physics.add.overlap(
            this,
            this.player,
            this.touchPlayer,
            null,
            this
        );

        this.play('boss_idle');

        this.attackTimer = scene.time.addEvent({
            delay: 2200,
            loop: true,
            callback: () => {
                if (!this.isDead && !this.isAttacking) {
                    this.chooseAttack();
                }
            }
        });
    }

    update() {
        if (this.isDead || !this.player) return;

        this.updateHealthBar();

        if (!this.isAttacking) {
            if (this.player.x < this.x) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }

            this.setVelocityX(0);
            this.play('boss_idle', true);
        }

        this.bossBullets.getChildren().forEach((bullet) => {
            if (!bullet.active) return;

            if (
                bullet.x < this.scene.cameras.main.scrollX - 100 ||
                bullet.x > this.scene.cameras.main.scrollX + 1000
            ) {
                bullet.disableBody(true, true);
            }
        });
    }

    chooseAttack() {
        if (!this.player || this.player.isDead) return;

        const distanceX = Math.abs(this.x - this.player.x);

        // Si el jugador está cerca, prioriza bastón
        if (distanceX < 260) {
            const randomClose = Phaser.Math.Between(1, 100);

            if (randomClose <= 70) {
                this.staffAttack();
            } else {
                this.jumpAttack();
            }

            return;
        }

        // A media distancia, mezcla bastón con salto si se acerca mucho
        if (distanceX < 430) {
            const randomMid = Phaser.Math.Between(1, 100);

            if (randomMid <= 35) {
                this.staffAttack();
            } else if (randomMid <= 70) {
                this.minigunAttack();
            } else {
                this.jumpAttack();
            }

            return;
        }

        // Lejos: metralleta o salto
        const randomFar = Phaser.Math.Between(1, 100);

        if (randomFar <= 65) {
            this.minigunAttack();
        } else {
            this.jumpAttack();
        }
    }

    staffAttack() {
        if (this.isDead || !this.player) return;

        this.isAttacking = true;
        this.setVelocityX(0);

        const direction = this.player.x < this.x ? -1 : 1;
        this.setFlipX(direction === -1);

        this.play('boss_staff', true);

        // Pequeño aviso visual del rango del golpe
        const warningX = this.x + (direction * 105);
        const warning = this.scene.add.rectangle(
            warningX,
            this.y + 45,
            180,
            170,
            0xffaa00,
            0.22
        );

        warning.setDepth(18);

        this.scene.tweens.add({
            targets: warning,
            alpha: 0,
            duration: 420,
            onComplete: () => warning.destroy()
        });

        // El daño ocurre después de la anticipación, para que sea esquivable
        this.scene.time.delayedCall(480, () => {
            if (this.isDead || !this.player || this.player.isDead) return;

            const distanceX = Math.abs(this.x - this.player.x);
            const distanceY = Math.abs(this.y - this.player.y);

            if (distanceX < 260 && distanceY < 190) {
                this.player.takeDamage(1);

                if (this.player.x < this.x) {
                    this.player.setVelocityX(-360);
                } else {
                    this.player.setVelocityX(360);
                }

                this.player.setVelocityY(-280);
            }
        });

        this.scene.time.delayedCall(950, () => {
            if (!this.isDead) {
                this.isAttacking = false;
            }
        });
    }

    minigunAttack() {
        if (this.isDead || !this.player) return;

        this.isAttacking = true;
        this.setVelocityX(0);
        this.play('boss_minigun', true);

        const direction = this.player.x < this.x ? -1 : 1;
        this.setFlipX(direction === -1);

        // Dispara una ráfaga, pero no todos van perfectos al jugador
        for (let i = 0; i < 7; i++) {
            this.scene.time.delayedCall(i * 155, () => {
                if (!this.isDead && this.player && !this.player.isDead) {
                    this.shootBullet(direction, i);
                }
            });
        }

        this.scene.time.delayedCall(1350, () => {
            if (!this.isDead) {
                this.isAttacking = false;
            }
        });
    }

    shootBullet(direction, bulletIndex = 0) {
        const bullet = this.bossBullets.get();

        if (!bullet || !this.player) return;

        const bulletX = this.x + (direction === 1 ? 115 : -115);

        // Antes estaba muy arriba. Ahora sale más cerca del centro del arma/cuerpo.
        const bulletY = this.y - 20;

        bullet.setTexture('boss_bullet');
        bullet.enableBody(true, bulletX, bulletY, true, true);
        bullet.body.allowGravity = false;

        bullet.setDepth(25);
        bullet.setScale(1.15);

        // Apunta hacia una zona aproximada del cuerpo del jugador.
        // No apunta perfecto para que sea esquivable.
        const targetX = this.player.x;

        // El player tiene sprite grande; este punto suele quedar entre torso/cadera.
        const targetY = this.player.y - 35;

        const dx = targetX - bulletX;
        const dy = targetY - bulletY;

        const angle = Math.atan2(dy, dx);

        // Variación controlada:
        // algunos tiros van al cuerpo, otros un poco arriba/abajo.
        const spreadPattern = [-0.10, 0.02, 0.12, -0.04, 0.08, -0.14, 0.00];
        const spread = spreadPattern[bulletIndex % spreadPattern.length];

        const finalAngle = angle + spread;

        const speed = 400;

        bullet.setVelocityX(Math.cos(finalAngle) * speed);
        bullet.setVelocityY(Math.sin(finalAngle) * speed);

        bullet.body.setSize(18, 8);

        // Rotar visualmente la bala hacia donde viaja
        bullet.setRotation(finalAngle);
    }

    jumpAttack() {
        if (this.isDead) return;

        this.isAttacking = true;
        this.play('boss_jump', true);

        const direction = this.player.x < this.x ? -1 : 1;
        this.setFlipX(direction === -1);

        this.setVelocityX(260 * direction);
        this.setVelocityY(-620);

        this.scene.time.delayedCall(850, () => {
            if (!this.isDead) {
                this.setVelocityY(750);
            }
        });

        this.scene.time.delayedCall(1350, () => {
            if (this.isDead) return;

            this.setVelocityX(0);
            this.createLandingImpact();

            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.player.x,
                this.player.y
            );

            if (distance < 260) {
                this.player.takeDamage(1);
                this.player.setVelocityY(-360);

                if (this.player.x < this.x) {
                    this.player.setVelocityX(-360);
                } else {
                    this.player.setVelocityX(360);
                }
            }

            this.scene.time.delayedCall(400, () => {
                this.isAttacking = false;
            });
        });
    }

    createLandingImpact() {
        const impact = this.scene.add.circle(this.x, this.y + 150, 25, 0xffaa00, 0.7);
        impact.setDepth(30);

        this.scene.tweens.add({
            targets: impact,
            scaleX: 7,
            scaleY: 1.4,
            alpha: 0,
            duration: 350,
            onComplete: () => {
                impact.destroy();
            }
        });

        this.scene.cameras.main.shake(250, 0.006);
    }

    bulletHitsPlayer(player, bullet) {
        if (!bullet.active || this.isDead) return;

        bullet.disableBody(true, true);

        if (player && !player.isDead) {
            player.takeDamage(1);
        }
    }

    touchPlayer(boss, player) {
        if (this.isDead || this.isAttacking) return;

        player.takeDamage(1);

        if (player.x < this.x) {
            player.setVelocityX(-250);
        } else {
            player.setVelocityX(250);
        }

        player.setVelocityY(-220);
    }

    takeDamage(amount = 1) {
        if (this.isDead || this.isInvulnerable) return;

        this.health -= amount;
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);
        this.updateHealthBar();

        this.isInvulnerable = true;
        this.setTint(0xff5555);

        this.scene.time.delayedCall(120, () => {
            this.clearTint();
        });

        this.scene.time.delayedCall(250, () => {
            this.isInvulnerable = false;
            this.clearTint();
        });

        if (this.health <= 0) {
            this.health = 0;
            this.updateHealthBar();
            this.die();
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.isAttacking = true;

        this.setVelocity(0, 0);
        this.play('boss_death', true);

        if (this.attackTimer) {
            this.attackTimer.remove(false);
        }

        this.bossBullets.clear(true, true);

        this.scene.time.delayedCall(1500, () => {
            this.disableBody(true, true);
            this.destroyHealthBar();

            if (this.onDeathCallback) {
                this.onDeathCallback();
            }
        });
    }

    createBulletTexture() {
        if (this.scene.textures.exists('boss_bullet')) return;

        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

        graphics.fillStyle(0xff3333, 1);
        graphics.fillRect(0, 0, 18, 8);

        graphics.generateTexture('boss_bullet', 18, 8);
        graphics.destroy();
    }

    createHealthBar() {
        this.healthBarMaxWidth = 350;

        this.healthBarBg = this.scene.add.rectangle(225, 35, 360, 22, 0x000000);
        this.healthBarBg.setOrigin(0, 0.5);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(3000);

        this.healthBar = this.scene.add.rectangle(230, 35, this.healthBarMaxWidth, 14, 0xff2222);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(3001);

        this.healthText = this.scene.add.text(400, 58, `BOSS FINAL ${this.health}/${this.maxHealth}`, {
            fontSize: '18px',
            fontFamily: 'Papyrus',
            fill: '#ffffff',
            backgroundColor: '#000000'
        });
        this.healthText.setOrigin(0.5);
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(3001);
    }

    updateHealthBar() {
        if (!this.healthBar) return;

        const currentHealth = Phaser.Math.Clamp(this.health, 0, this.maxHealth);
        const percentage = currentHealth / this.maxHealth;

        this.healthBar.setScale(percentage, 1);

        if (this.healthText) {
            this.healthText.setText(`BOSS FINAL ${currentHealth}/${this.maxHealth}`);
        }
    }

    destroyHealthBar() {
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthText) this.healthText.destroy();
    }
}