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
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        if (distance < 180) {
            this.staffAttack();
            return;
        }

        const randomAttack = Phaser.Math.Between(1, 2);

        if (randomAttack === 1) {
            this.minigunAttack();
        } else {
            this.jumpAttack();
        }
    }

    staffAttack() {
        if (this.isDead) return;

        this.isAttacking = true;
        this.setVelocityX(0);
        this.play('boss_staff', true);

        this.scene.time.delayedCall(450, () => {
            if (this.isDead || !this.player || this.player.isDead) return;

            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.player.x,
                this.player.y
            );

            if (distance < 210) {
                this.player.takeDamage(1);

                if (this.player.x < this.x) {
                    this.player.setVelocityX(-300);
                } else {
                    this.player.setVelocityX(300);
                }

                this.player.setVelocityY(-250);
            }
        });

        this.scene.time.delayedCall(900, () => {
            this.isAttacking = false;
        });
    }

    minigunAttack() {
        if (this.isDead) return;

        this.isAttacking = true;
        this.setVelocityX(0);
        this.play('boss_minigun', true);

        const direction = this.player.x < this.x ? -1 : 1;
        this.setFlipX(direction === -1);

        for (let i = 0; i < 6; i++) {
            this.scene.time.delayedCall(i * 170, () => {
                if (!this.isDead) {
                    this.shootBullet(direction);
                }
            });
        }

        this.scene.time.delayedCall(1300, () => {
            this.isAttacking = false;
        });
    }

    shootBullet(direction) {
        const bullet = this.bossBullets.get();

        if (!bullet) return;

        const bulletX = this.x + (direction === 1 ? 130 : -130);
        const bulletY = this.y - 70 + Phaser.Math.Between(-18, 18);

        bullet.setTexture('boss_bullet');
        bullet.enableBody(true, bulletX, bulletY, true, true);
        bullet.body.allowGravity = false;
        bullet.setDepth(25);
        bullet.setVelocityX(520 * direction);
        bullet.setVelocityY(Phaser.Math.Between(-20, 20));
        bullet.body.setSize(18, 8);
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
        this.healthBarBg = this.scene.add.rectangle(400, 35, 360, 22, 0x000000);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(3000);

        this.healthBar = this.scene.add.rectangle(400, 35, 350, 14, 0xff2222);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(3001);

        this.healthText = this.scene.add.text(400, 58, 'BOSS FINAL', {
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

        const percentage = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
        this.healthBar.width = 350 * percentage;
    }

    destroyHealthBar() {
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthText) this.healthText.destroy();
    }
}