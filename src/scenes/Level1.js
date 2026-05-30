import { BaseLevel } from './BaseLevel.js';
import fondoSelva from '../assets/levels/selva.png';
import nivel1Music from '../assets/audio/theme_level1.mp3';

export class Level1 extends BaseLevel {
    constructor() {
        super({
            key: 'Level1',
            backgroundKey: 'fondo_selva',
            backgroundImage: fondoSelva,
            musicFile: nivel1Music,  
            nextScene: 'Level2',
            levelTitle: 'NIVEL 1 - ATERRIZAJE EN LA SELVA',
            completeMessage: 'MISIÓN COMPLETADA',
            loadingMessage: 'MISIÓN 1 COMPLETADA',
            metaX: 2300,
            enemyPositions: [
                { x: 850, y: 430 },
                { x: 1300, y: 430 },
                { x: 1750, y: 430 }
            ]
        });
    }
}