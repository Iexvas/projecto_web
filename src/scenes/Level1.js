import Phaser from 'phaser';
import { Player } from '../objects/Player.js';

import fondoSelva from '../assets/levels/selva.png';
import nivel1Music from '../assets/audio/theme_level1.mp3';
import muteButton from '../assets/ui/mute.png';

import eloyIdle from '../assets/characters/eloy/eloy_idle.png';
import eloyRun from '../assets/characters/eloy/eloy_run.png';
import eloyJump from '../assets/characters/eloy/eloy_jump.png';
import eloyShoot from '../assets/characters/eloy/eloy_shoot.png';
import eloyDeath from '../assets/characters/eloy/eloy_death.png';

import { Enemy } from '../objects/Enemy.js';
import enemyMachete from '../assets/enemies/enemy_machete.png';

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    init(data) {
        this.soldadoElegido = data.soldadoElegido || 0;

        const personajes = ['gabriel', 'abdala', 'eloy', 'jaime'];

        this.characterKey = personajes[this.soldadoElegido] || 'eloy';

        // De momento solo tenemos spritesheet real de Eloy.
        // Si seleccionan otro personaje, usamos Eloy temporalmente.
        if (this.characterKey !== 'eloy') {
            this.characterKey = 'eloy';
        }

        console.log('Iniciando misión con:', this.characterKey);
    }

    preload() {
        this.load.image('fondo_selva', fondoSelva);
        this.load.audio('nivel1_music', nivel1Music);
        this.load.image('mute_button', muteButton);
        this.load.image('enemy_machete', enemyMachete);

        this.load.spritesheet('eloy_idle', eloyIdle, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_run', eloyRun, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_jump', eloyJump, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_shoot', eloyShoot, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_death', eloyDeath, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.crearTexturaBala();
    }

    create() {
        this.crearAnimaciones();

        this.physics.world.setBounds(0, 0, 2400, 600);

        this.background = this.add.image(0, 0, 'fondo_selva')
            .setOrigin(0, 0)
            .setDisplaySize(2400, 600);

        this.musicaNivel1 = this.sound.add('nivel1_music', {
            loop: true,
            volume: 0.5
        });

        this.musicaNivel1.play();

        this.platforms = this.physics.add.staticGroup();

        const ground = this.add.rectangle(1200, 555, 2400, 40, 0x34495e);
        ground.setAlpha(0);
        this.platforms.add(ground);

        this.player = new Player(this, 140, 430, this.characterKey);
        this.physics.add.collider(this.player, this.platforms);
        this.score = 0;
        this.crearHUD();

        this.enemies = this.physics.add.group();

        this.cameras.main.setBounds(0, 0, 2400, 600);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(180, 80);

        this.crearBotonMute();
        this.configurarPausa();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.musicaNivel1) {
                this.musicaNivel1.stop();
                this.musicaNivel1.destroy();
            }
        });

        

        const enemy1 = new Enemy(this, 850, 430);
        const enemy2 = new Enemy(this, 1300, 430);
        const enemy3 = new Enemy(this, 1750, 430);

        this.enemies.add(enemy1);
        this.enemies.add(enemy2);
        this.enemies.add(enemy3);

        this.physics.add.collider(this.enemies, this.platforms);

        this.physics.add.overlap(
            this.player.bullets,
            this.enemies,
            this.balaGolpeaEnemigo,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.enemigoTocaJugador,
            null,
            this
        );
    }

    update() {
        if (this.player) {
            this.player.update();
            this.actualizarHUD();
        }

        if (this.player && this.player.bullets) {
            this.player.bullets.getChildren().forEach((bullet) => {
                if (!bullet.active) return;

                if (
                    bullet.x < this.cameras.main.scrollX - 100 ||
                    bullet.x > this.cameras.main.scrollX + 900
                ) {
                    bullet.disableBody(true, true);
                }
            });
        }

        if (this.enemies) {
            this.enemies.getChildren().forEach((enemy) => {
                if (enemy.active && enemy.update) {
                    enemy.update();
                }
            });
        }
    }

    crearHUD() {
    this.hudVida = this.add.text(20, 20, 'VIDA: 3', {
        fontSize: '22px',
        fontFamily: 'Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: {
            x: 8,
            y: 4
        }
    })
    .setScrollFactor(0)
    .setDepth(999);

    this.hudPuntos = this.add.text(20, 55, 'PUNTOS: 0', {
        fontSize: '22px',
        fontFamily: 'Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: {
            x: 8,
            y: 4
        }
    })
    .setScrollFactor(0)
    .setDepth(999);
    }

    actualizarHUD() {
        if (this.hudVida && this.player) {
            this.hudVida.setText(`VIDA: ${this.player.health}`);
        }

        if (this.hudPuntos) {
            this.hudPuntos.setText(`PUNTOS: ${this.score}`);
        }
    }

    balaGolpeaEnemigo(bullet, enemy) {
        if (!bullet.active || !enemy.active || enemy.isDead) return;

        bullet.disableBody(true, true);

        const enemyKilled = enemy.takeDamage();

        if (enemyKilled) {
            this.score += 100;
            this.actualizarHUD();
            console.log('Puntos:', this.score);
        }
    }

    enemigoTocaJugador(player, enemy) {
        if (!player || !enemy || enemy.isDead) return;

        player.takeDamage(1);

        // Empujón leve tipo knockback
        if (player.x < enemy.x) {
            player.setVelocityX(-220);
        } else {
            player.setVelocityX(220);
        }

        player.setVelocityY(-180);

        this.actualizarHUD();
    }

    balaGolpeaEnemigo(bullet, enemy) {
        bullet.disableBody(true, true);

        if (enemy && enemy.takeDamage) {
            enemy.takeDamage();
        }
    }

    crearAnimaciones() {
        const crearSiNoExiste = (key, texture, start, end, frameRate, repeat) => {
            if (!this.anims.exists(key)) {
                this.anims.create({
                    key,
                    frames: this.anims.generateFrameNumbers(texture, {
                        start,
                        end
                    }),
                    frameRate,
                    repeat
                });
            }
        };

        crearSiNoExiste('eloy_idle', 'eloy_idle', 0, 3, 5, -1);
        crearSiNoExiste('eloy_run', 'eloy_run', 0, 5, 10, -1);
        crearSiNoExiste('eloy_jump', 'eloy_jump', 0, 2, 8, 0);
        crearSiNoExiste('eloy_shoot', 'eloy_shoot', 0, 3, 14, 0);
        crearSiNoExiste('eloy_death', 'eloy_death', 0, 3, 6, 0);
    }

    crearTexturaBala() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        graphics.fillStyle(0xffdd55, 1);
        graphics.fillRect(0, 0, 16, 4);

        graphics.generateTexture('bullet', 16, 4);
        graphics.destroy();
    }

    crearBotonMute() {
        this.sound.mute = localStorage.getItem('isMuted') === 'true';

        this.btnMute = this.add.image(750, 50, 'mute_button')
            .setInteractive()
            .setScrollFactor(0)
            .setScale(0.05)
            .setDepth(100);

        this.btnMute.setAlpha(this.sound.mute ? 0.5 : 1.0);

        this.btnMute.on('pointerdown', () => {
            this.sound.mute = !this.sound.mute;
            this.btnMute.setAlpha(this.sound.mute ? 0.5 : 1.0);
            localStorage.setItem('isMuted', this.sound.mute);
        });
    }

    configurarPausa() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('Pause', {
                soldadoElegido: this.soldadoElegido
            });
        });
    }
}