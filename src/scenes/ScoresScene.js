import Phaser from 'phaser';

export class ScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScoresScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 100, 'PUNTAJES ACUMULADOS', {
            fontSize: '36px',
            fontFamily: 'Papyrus',
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const scores = this.registry.get('highScores') || [];

        if (scores.length === 0) {
            this.add.text(400, 300, 'Aún no hay puntajes en esta sesión', {
                fontSize: '24px',
                fontFamily: 'Papyrus',
                fill: '#C9D1D9'
            }).setOrigin(0.5);
        } else {
            let startY = 200;
            const maxScores = Math.min(scores.length, 10);
            
            for (let i = 0; i < maxScores; i++) {
                const entry = scores[i];
                this.add.text(200, startY + (i * 30), `${i + 1}. ${entry.name}`, {
                    fontSize: '24px',
                    fontFamily: 'Papyrus',
                    fill: '#ffffff'
                }).setOrigin(0, 0.5);
                
                this.add.text(600, startY + (i * 30), `${entry.score}`, {
                    fontSize: '24px',
                    fontFamily: 'Papyrus',
                    fill: '#ffaa00'
                }).setOrigin(1, 0.5);
            }
        }

        this.add.text(400, 550, 'Presiona ENTER para volver al menú', {
            fontSize: '18px',
            fontFamily: 'Papyrus',
            fill: '#ffaa00'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
