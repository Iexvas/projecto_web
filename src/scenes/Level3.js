import { BaseLevel } from './BaseLevel.js';
import { BossLevel3 } from '../objects/BossLevel3.js';

import fondoCueva from '../assets/levels/cueva.png';
import nivel3Music from '../assets/audio/theme_level3.mp3';

import groundLevel3 from '../assets/tiles/ground_level3.jpg';
import portalLevel3 from '../assets/tiles/portal_level3.png';

import bossIdle from '../assets/boss/level3/boss_idle.png';
import bossStaff from '../assets/boss/level3/boss_staff.png';
import bossMinigun from '../assets/boss/level3/boss_minigun.png';
import bossJump from '../assets/boss/level3/boss_jump.png';
import bossDeath from '../assets/boss/level3/boss_death.png';

export class Level3 extends BaseLevel {
    constructor() {
        super({
            key: 'Level3',
            backgroundKey: 'fondo_cueva',
            backgroundImage: fondoCueva,
            groundKey: 'ground_level3',
            groundImage: groundLevel3,
            portalKey: 'portal_level3',
            portalImage: portalLevel3,
            musicFile: nivel3Music,
            nextScene: null,
            levelTitle: 'NIVEL 3 - CUEVA DE LOS TAYOS',
            completeMessage: 'CAMPAÑA COMPLETADA',
            loadingMessage: 'MISIÓN FINAL COMPLETADA',
            metaX: 2300,
            enemyPositions: [
                { x: 650, y: 430 },
                { x: 950, y: 430 },
                { x: 1300, y: 430 },
                { x: 1600, y: 430 }
            ]
        });
    }

    preload() {
        super.preload();

        this.load.spritesheet('boss_idle_sheet', bossIdle, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('boss_staff_sheet', bossStaff, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('boss_minigun_sheet', bossMinigun, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('boss_jump_sheet', bossJump, {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet('boss_death_sheet', bossDeath, {
            frameWidth: 512,
            frameHeight: 512
        });
    }

    create() {
        super.create();

        this.crearAnimacionesBoss();

        this.bossDerrotado = false;

        // Ocultar portal hasta matar al boss
        if (this.metaNivel) {
            this.metaNivel.setVisible(false);

            if (this.metaNivel.body) {
                this.metaNivel.body.enable = false;
            }
        }

        this.boss = new BossLevel3(this, 2050, 380, this.player, () => {
            this.bossDerrotado = true;
            this.mostrarPortalFinal();
        });

        this.physics.add.collider(this.boss, this.platforms);

        this.physics.add.overlap(
            this.player.bullets,
            this.boss,
            this.balaGolpeaBoss,
            null,
            this
        );

        this.mostrarAvisoBoss();
    }

    update() {
        super.update();

        if (this.boss && this.boss.active && this.boss.update) {
            this.boss.update();
        }
    }

    crearAnimacionesBoss() {
        this.crearAnimacionBossSiNoExiste('boss_idle', 'boss_idle_sheet', 0, 3, 5, -1);
        this.crearAnimacionBossSiNoExiste('boss_staff', 'boss_staff_sheet', 0, 5, 10, 0);
        this.crearAnimacionBossSiNoExiste('boss_minigun', 'boss_minigun_sheet', 0, 3, 12, -1);
        this.crearAnimacionBossSiNoExiste('boss_jump', 'boss_jump_sheet', 0, 5, 8, 0);
        this.crearAnimacionBossSiNoExiste('boss_death', 'boss_death_sheet', 0, 5, 7, 0);
    }

    crearAnimacionBossSiNoExiste(key, texture, start, end, frameRate, repeat) {
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

    balaGolpeaBoss(obj1, obj2) {
        const bullet = obj1.texture?.key === 'bullet' ? obj1 : obj2;
        const boss = obj1.texture?.key === 'bullet' ? obj2 : obj1;

        if (!bullet || !boss) return;
        if (!bullet.active || !boss.active || boss.isDead) return;
        if (typeof boss.takeDamage !== 'function') return;

        bullet.disableBody(true, true);
        boss.takeDamage(1);

        this.score += 10;
        this.actualizarHUD();
    }

    mostrarPortalFinal() {
        this.score += 500;
        this.actualizarHUD();

        this.add.text(400, 180, 'BOSS DERROTADO', {
            fontSize: '34px',
            fontFamily: 'Papyrus',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 10
            }
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(3000);

        if (this.metaNivel) {
            this.metaNivel.setVisible(true);

            if (this.metaNivel.body) {
                this.metaNivel.body.enable = true;
            }
        }
    }

    mostrarAvisoBoss() {
        this.add.text(400, 130, '¡JEFA FINAL!', {
            fontSize: '36px',
            fontFamily: 'Papyrus',
            fill: '#ff3333',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 10
            }
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(3000);

        this.time.delayedCall(2200, () => {
            this.children.list.forEach((child) => {
                if (child.text === '¡JEFA FINAL!') {
                    child.destroy();
                }
            });
        });
    }
}