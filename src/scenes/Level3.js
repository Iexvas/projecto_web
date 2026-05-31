import { BaseLevel } from './BaseLevel.js';
import fondoCueva from '../assets/levels/cueva.png';
import nivel3Music from '../assets/audio/theme_level3.mp3';
//  Importar las texturas y el portal
import groundLevel3 from '../assets/tiles/ground_level3.jpg';
import portalLevel3 from '../assets/tiles/portal_level3.png';

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
                { x: 1700, y: 430 },
                { x: 2100, y: 430 }
            ]
        });
    }
}