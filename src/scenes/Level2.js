import { BaseLevel } from './BaseLevel.js';
import fondoRuinas from '../assets/levels/ruinas.png';
import groundLevel2 from '../assets/tiles/ground_level2.jpg';
import portalLevel2 from '../assets/tiles/portal_level2.png';
import nivel2Music from '../assets/audio/theme_level2.mp3';

export class Level2 extends BaseLevel {
    constructor() {
        super({
            key: 'Level2',
            backgroundKey: 'fondo_ruinas',
            backgroundImage: fondoRuinas,
            groundKey: 'ground_level2',
            groundImage: groundLevel2,
            portalKey: 'portal_level2',
            portalImage: portalLevel2,
            musicFile: nivel2Music,
            nextScene: 'Level3',
            levelTitle: 'NIVEL 2 - RUINAS EN LA SELVA',
            completeMessage: 'RUINAS ASEGURADAS',
            loadingMessage: 'MISIÓN 2 COMPLETADA',
            metaX: 2300,
            enemyPositions: [
                { x: 700, y: 430 },
                { x: 1050, y: 430 },
                { x: 1450, y: 430 },
                { x: 1900, y: 430 }
            ]
        });
    }
}