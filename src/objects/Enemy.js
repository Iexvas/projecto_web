import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy_machete');

        this.scene = scene;

        this.spawnX = x;
        this.spawnY = y;

        this.health = 1;
        this.speed = 55;
        this.chaseSpeed = 105;
        this.jumpForce = -430;

        this.isDead = false;
        this.direction = -1;

        this.state = 'patrol';
        this.detectionRange = 420;
        this.attackRange = 85;
        this.maxChaseDistance = 650;

        this.canAttack = true;
        this.canJump = true;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.32);
        this.setDepth(8);

        this.setCollideWorldBounds(false);
        this.body.setAllowGravity(true);

        this.body.setSize(230, 340);
        this.body.setOffset(135, 115);

        this.setVelocityX(this.speed * this.direction);
        this.setFlipX(true);
    }

    update() {
        if (this.isDead) return;

        const player = this.scene.player;

        if (!player || player.isDead) {
            this.patrol();
            return;
        }

        const distanceX = Math.abs(player.x - this.x);
        const distanceY = Math.abs(player.y - this.y);
        const directionToPlayer = player.x < this.x ? -1 : 1;

        if (distanceX < this.attackRange && distanceY < 140) {
            this.attack(player, directionToPlayer);
            return;
        }

        if (distanceX < this.detectionRange && distanceY < 230) {
            this.chase(player, directionToPlayer, distanceX, distanceY);
            return;
        }

        if (Math.abs(this.x - this.spawnX) > this.maxChaseDistance) {
            this.returnToSpawn();
            return;
        }

        this.patrol();
    }

    patrol() {
        this.state = 'patrol';

        this.setVelocityX(this.speed * this.direction);

        if (this.direction === -1) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }

        // Patrulla cerca de su punto inicial, no cruza todo el mapa
        if (this.x < this.spawnX - 160) {
            this.direction = 1;
        }

        if (this.x > this.spawnX + 160) {
            this.direction = -1;
        }
    }

    chase(player, directionToPlayer, distanceX, distanceY) {
        this.state = 'chase';

        this.direction = directionToPlayer;
        this.setFlipX(directionToPlayer === -1);

        this.setVelocityX(this.chaseSpeed * directionToPlayer);

        // Si el jugador está más arriba o hay distancia, intenta saltar
        const playerIsAbove = player.y < this.y - 45;
        const shouldJumpForward = distanceX > 130 && distanceX < 360;

        if (
            this.canJump &&
            this.body.blocked.down &&
            (playerIsAbove || shouldJumpForward)
        ) {
            this.jumpTowardPlayer(directionToPlayer);
        }
    }

    jumpTowardPlayer(directionToPlayer) {
        this.canJump = false;

        this.setVelocityY(this.jumpForce);
        this.setVelocityX(this.chaseSpeed * 1.25 * directionToPlayer);

        this.scene.time.delayedCall(1300, () => {
            this.canJump = true;
        });
    }

    attack(player, directionToPlayer) {
        this.state = 'attack';

        this.setVelocityX(0);
        this.setFlipX(directionToPlayer === -1);

        if (!this.canAttack) return;

        this.canAttack = false;

        // Pequeña anticipación para que no sea daño instantáneo injusto
        this.setTint(0xffcc66);

        this.scene.time.delayedCall(180, () => {
            if (this.isDead || !player || player.isDead) return;

            const distanceX = Math.abs(player.x - this.x);
            const distanceY = Math.abs(player.y - this.y);

            if (distanceX < this.attackRange + 25 && distanceY < 150) {
                player.takeDamage(1);

                if (player.x < this.x) {
                    player.setVelocityX(-260);
                } else {
                    player.setVelocityX(260);
                }

                player.setVelocityY(-180);
            }

            this.clearTint();
        });

        this.scene.time.delayedCall(900, () => {
            this.canAttack = true;
            this.clearTint();
        });
    }

    returnToSpawn() {
        this.state = 'return';

        const directionToSpawn = this.spawnX < this.x ? -1 : 1;

        this.direction = directionToSpawn;
        this.setFlipX(directionToSpawn === -1);
        this.setVelocityX(this.speed * directionToSpawn);

        if (Math.abs(this.x - this.spawnX) < 30) {
            this.state = 'patrol';
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