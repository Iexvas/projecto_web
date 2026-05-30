import Phaser from 'phaser';
import { Player } from '../objects/Player.js';
import { Enemy } from '../objects/Enemy.js';

// import nivelMusic from '../assets/audio/theme_level1.mp3';
import muteButton from '../assets/ui/mute.png';
import enemyMachete from '../assets/enemies/enemy_machete.png';

import eloyIdle from '../assets/characters/eloy/eloy_idle.png';
import eloyRun from '../assets/characters/eloy/eloy_run.png';
import eloyJump from '../assets/characters/eloy/eloy_jump.png';
import eloyShoot from '../assets/characters/eloy/eloy_shoot.png';
import eloyDeath from '../assets/characters/eloy/eloy_death.png';

// Efectos de sonido mission complete, mission y game over
import sfxInicio from '../assets/audio/mission.mp3';
import sfxCompletado from '../assets/audio/mission_complete.mp3';
import sfxGameOver from '../assets/audio/grito.mp3';

export class BaseLevel extends Phaser.Scene {
    constructor(config) {
        super({ key: config.key });

        this.levelKey = config.key;
        this.backgroundKey = config.backgroundKey;
        this.backgroundImage = config.backgroundImage;

        // Archivo de musica
        this.musicFile = config.musicFile;

        this.nextScene = config.nextScene;
        this.levelTitle = config.levelTitle;
        this.enemyPositions = config.enemyPositions || [];
        this.metaX = config.metaX || 2300;
    }

    init(data) {
        this.soldadoElegido = data.soldadoElegido ?? 2;

        const personajes = ['gabriel', 'abdala', 'eloy', 'jaime'];
        this.characterKey = personajes[this.soldadoElegido] || 'eloy';

        this.characterKey = 'eloy';

        this.score = data.score ?? 0;
        this.health = data.health ?? 3;
        this.nivelCompletado = false;
        
        this.soldadoElegido = data.soldadoElegido ?? 2;
        this.message = data.message || 'CARGANDO MISIÓN...';

        
    }

    preload() {
        this.load.image(this.backgroundKey, this.backgroundImage);

        // Cargar la musica del nivel
        this.musicKey = this.levelKey.toLowerCase() + '_music'; 
        this.load.audio(this.musicKey, this.musicFile);
        
        // Cargar efectos de sonido
        this.load.audio('sfx_inicio', sfxInicio);
        this.load.audio('sfx_completado', sfxCompletado);
        this.load.audio('sfx_gameover', sfxGameOver);

        // Cargar botones y enemigos
        this.load.image('mute_button', muteButton);
        this.load.image('enemy_machete', enemyMachete);

        this.load.spritesheet('eloy_idle_sheet', eloyIdle, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_run_sheet', eloyRun, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_jump_sheet', eloyJump, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_shoot_sheet', eloyShoot, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('eloy_death_sheet', eloyDeath, {
            frameWidth: 512,
            frameHeight: 512
        });
    }

    create() {
        this.crearTexturaBala();
        this.crearAnimaciones();

        this.physics.world.setBounds(0, 0, 2400, 600);

        this.add.image(0, 0, this.backgroundKey)
            .setOrigin(0, 0)
            .setDisplaySize(2400, 600);

        this.crearTextoNivel();

        this.musicaNivel = this.sound.add(this.musicKey, {
            loop: true,
            volume: 0.35
        });

        this.time.delayedCall(7000, () => {
            this.musicaNivel.play();
        });
        // this.musicaNivel.play();

        // Reproducir efectos de sonido
        // Al iniciar el nivel
        this.time.delayedCall(500, () => {
            this.sound.play('sfx_inicio', { volume: 0.6 });
        });

        this.platforms = this.physics.add.staticGroup();

        const ground = this.add.rectangle(1200, 555, 2400, 40, 0x34495e);
        ground.setAlpha(0);
        this.platforms.add(ground);

        this.player = new Player(this, 180, 400, this.characterKey);
        this.physics.add.collider(this.player, this.platforms);

        this.crearHUD();
        this.crearEnemigos();
        this.crearMetaNivel();

        this.cameras.main.setBounds(0, 0, 2400, 600);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(180, 80);

        this.crearBotonMute();
        this.configurarPausa();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.musicaNivel) {
                this.musicaNivel.stop();
                this.musicaNivel.destroy();
            }
        });
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

    crearTextoNivel() {
        this.add.text(400, 115, this.levelTitle, {
            fontSize: '30px',
            fontFamily: 'Papyrus',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 14,
                y: 8
            }
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1000);

        this.time.delayedCall(8000, () => {
            this.children.list.forEach((child) => {
                if (child.text === this.levelTitle) {
                    child.destroy();
                }
            });
        });
    }

    crearEnemigos() {
        this.enemies = this.physics.add.group();

        this.enemyPositions.forEach((pos) => {
            const enemy = new Enemy(this, pos.x, pos.y);
            this.enemies.add(enemy);
        });

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

    crearMetaNivel() {
        this.metaNivel = this.add.rectangle(this.metaX, 420, 80, 260, 0x00ff00, 0);
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

        // Reproducir efecto de sonido de misión completada
        this.sound.play('sfx_completado', { volume: 0.7 });

        this.player.setVelocity(0, 0);
        this.player.body.enable = false;

        const mensaje = this.nextScene ? 'MISIÓN COMPLETADA' : 'CAMPAÑA COMPLETADA';

        this.add.text(400, 250, mensaje, {
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
            if (this.nextScene) {
                this.scene.start('LoadingScene', {
                    nextScene: this.nextScene,
                    soldadoElegido: this.soldadoElegido,
                    score: this.score,
                    health: this.player.health,
                    message: this.loadingMessage || 'MISIÓN COMPLETADA'
                });
            } else {
                this.scene.start('MenuScene');
            }
        });
    }

    balaGolpeaEnemigo(bullet, enemy) {
        if (!bullet.active || !enemy.active || enemy.isDead) return;

        bullet.disableBody(true, true);

        const enemyKilled = enemy.takeDamage();

        if (enemyKilled) {
            this.score += 100;
            this.actualizarHUD();
        }
    }

    enemigoTocaJugador(player, enemy) {
        if (!player || !enemy || enemy.isDead) return;

        player.takeDamage(1);

        if (player.x < enemy.x) {
            player.setVelocityX(-220);
        } else {
            player.setVelocityX(220);
        }

        player.setVelocityY(-180);

        this.actualizarHUD();
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

        this.hudPuntos = this.add.text(20, 55, `PUNTOS: ${this.score}`, {
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

    crearAnimaciones() {
        this.crearAnimacionSiNoExiste('eloy_idle', 'eloy_idle_sheet', 0, 3, 5, -1);
        this.crearAnimacionSiNoExiste('eloy_run', 'eloy_run_sheet', 0, 5, 10, -1);
        this.crearAnimacionSiNoExiste('eloy_jump', 'eloy_jump_sheet', 0, 2, 8, 0);
        this.crearAnimacionSiNoExiste('eloy_shoot', 'eloy_shoot_sheet', 0, 3, 14, 0);
        this.crearAnimacionSiNoExiste('eloy_death', 'eloy_death_sheet', 0, 3, 6, 0);
    }

    crearAnimacionSiNoExiste(key, texture, start, end, frameRate, repeat) {
        if (this.anims.exists(key)) return;

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

    crearTexturaBala() {
        if (this.textures.exists('bullet')) return;

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        graphics.fillStyle(0xffdd55, 1);
        graphics.fillRect(0, 0, 16, 4);

        graphics.generateTexture('bullet', 16, 4);
        graphics.destroy();
    }

    crearBotonMute() {
        this.sound.mute = false;

        this.btnMute = this.add.image(750, 50, 'mute_button')
            .setInteractive()
            .setScrollFactor(0)
            .setScale(0.05)
            .setDepth(100);

        this.btnMute.setAlpha(0.5);

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
                soldadoElegido: this.soldadoElegido,
                // agregar desde que menu se viene
                nivelOrigen: this.levelKey 
            });
        });
    }

    gameOver() {
    this.nivelCompletado = true;

    // Reproducir efecto de sonido de game over
    this.sound.play('sfx_gameover', { volume: 0.8 });

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