import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    init(data) {
        this.nextScene = data.nextScene;
        this.soldadoElegido = data.soldadoElegido ?? 2;
        this.score = data.score ?? 0;
        this.health = data.health ?? 3;
        this.message = data.message || 'CARGANDO MISIÓN...';
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 220, this.message, {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 285, `VIDA: ${this.health}    PUNTOS: ${this.score}`, {
            fontSize: '22px',
            fontFamily: 'Arial',
            fill: '#ffaa00'
        }).setOrigin(0.5);

        this.add.text(400, 335, 'Preparando siguiente zona...', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#cccccc'
        }).setOrigin(0.5);

        this.time.delayedCall(1800, () => {
            this.scene.start(this.nextScene, {
                soldadoElegido: this.soldadoElegido,
                score: this.score,
                health: this.health
            });
        });
    }
}