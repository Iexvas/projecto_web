import Phaser from 'phaser';

export class Intro extends Phaser.Scene {
    constructor() {
        super({ key: 'Intro' });
    }

    preload() {
        // Cargar el video de introducción
        this.load.video('introVideo', '/src/assets/ui/intro.mp4', 'loadeddata', false, false);
        // Cargar el audio del video de introducción
        this.load.audio('introAudio', '/src/assets/audio/intro.aac');
    
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        const video = this.add.video(this.scale.width / 2, this.scale.height / 2, 'introVideo');
        video.setOrigin(0.5);

        video.play(false);

        video.once('play', () => {
            // Ajustar el video a la pantalla sin deformarlo
            const scale = Math.min(
                this.scale.width / video.width,
                this.scale.height / video.height
            );
            video.setScale(scale);
        });

        video.once('complete', () => {
            this.scene.start('MainMenuScene');
        });

        // Reproducir el audio de introducción sincronizado con el video
        const introAudio = this.sound.add('introAudio', { volume: 0.7 });
        introAudio.play();

        // Opcional: permitir saltar con Enter o clic
        this.input.keyboard.once('keydown-ENTER', () => {
            video.stop();
            introAudio.stop();
            this.scene.start('MainMenuScene');
        });
    }
}