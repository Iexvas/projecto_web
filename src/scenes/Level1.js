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
        this.soldadoElegido = data.soldadoElegido ?? 0;

        const personajes = ['gabriel', 'abdala', 'eloy', 'jaime'];

        this.characterKey = personajes[this.soldadoElegido] || 'eloy';

        if (this.characterKey !== 'eloy') {
            this.characterKey = 'eloy';
        }

        this.score = data.score ?? 0;
        this.health = data.health ?? 3;
        this.nivelCompletado = false;

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
        
        this.player.health = this.health;
        this.player.maxHealth = 3;
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

        this.crearMetaNivel();
    }

    update() {

        if (this.nivelCompletado) return;


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

    // ------------Botón de mute para la música------------
    crearBotonMute() {
         // Iniciar el juego con sonido
        this.sound.mute = false;
        // Crear el botón de mute en la esquina superior derecha
        this.btnMute = this.add.image(750, 50, 'mute_button')
            .setInteractive()
            .setScrollFactor(0)
            .setScale(0.05)
            .setDepth(100);
        // Al inicio el boton es transparente para indicar que el sonido está activo
        this.btnMute.setAlpha(0.5);
        // Interracion con el boton
        this.btnMute.on('pointerdown', () => {
            this.sound.mute = !this.sound.mute;
            this.btnMute.setAlpha(this.sound.mute ? 0.5 : 1.0);
            // Guardar la nueva preferencia en el navegador
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

    crearMetaNivel() {
    this.metaNivel = this.add.rectangle(2300, 420, 80, 260, 0x00ff00, 0.25);
    this.physics.add.existing(this.metaNivel, true);

    this.physics.add.overlap(
        this.player,
        this.metaNivel,
        this.completarNivel,
        null,
        this
    );
}

    completarNivel() {
        if (this.nivelCompletado) return;

        this.nivelCompletado = true;

        this.player.setVelocity(0, 0);
        this.player.body.enable = false;

        this.add.text(400, 250, 'MISIÓN COMPLETADA', {
            fontSize: '42px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 10
            }
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1000);

        this.time.delayedCall(2500, () => {
            this.scene.start('LoadingScene', {
                nextScene: 'Level2',
                soldadoElegido: this.soldadoElegido,
                score: this.score,
                health: this.player.health,
                message: 'MISIÓN 1 COMPLETADA'
            });
        });
    }


    gameOver() {
    this.nivelCompletado = true;

    this.physics.pause();

    this.add.text(400, 230, 'GAME OVER', {
        fontSize: '52px',
        fontFamily: 'Arial',
        fill: '#ff3333',
        backgroundColor: '#000000',
        padding: {
            x: 18,
            y: 10
        }
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(2000);

    this.add.text(400, 310, `PUNTOS FINALES: ${this.score}`, {
        fontSize: '26px',
        fontFamily: 'Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: {
            x: 12,
            y: 8
        }
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(2000);

    this.time.delayedCall(3000, () => {
        this.scene.start('MenuScene');
    });
    }
}