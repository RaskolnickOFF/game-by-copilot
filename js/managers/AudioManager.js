export class AudioManager {
    constructor() {
        this.sounds = {};
    }

    load(name, path) {
        return new Promise((resolve) => {
            const audio = new Audio(path);
            this.sounds[name] = { audio, loaded: false };

            audio.onloadeddata = () => {
                this.sounds[name].loaded = true;
                console.log(` [DEV] Audio loaded: ${name}`);
                resolve();
            }
            audio.onerror = () => {
                console.log(` [DEV] Audio failed: ${name} (will skip)`);
                resolve();
            }
        })
    }

    play(name) {
        const sound = this.sounds[name]?.loaded ? this.sounds[name] : null;
        if (sound) {
            try {
                sound.audio.currentTime = 0;
                sound.audio.play().catch(err => {
                    console.log(`Could not play ${name}:`, err);
                })
            } catch (e) {
                // Ignore audio errors
            }
        }
    }

    async loadAll() {
        await Promise.all([
            this.load('pause', './audio/pause.mp3'),
            this.load('unpause', './audio/unpause.mp3'),
            this.load('button_hover', './audio/button_hover.mp3'),
            this.load('button_click', './audio/button_click.mp3'),
            this.load('attack', './audio/attack.mp3'),
            this.load('hit', './audio/hit.mp3'),
            this.load('kill', './audio/kill.mp3'),
            this.load('level_complete', './audio/level_complete.mp3'),
            this.load('game_over', './audio/game_over.mp3'),
        ]);

        // TODO: Remove before shipping
        const DEBUG_LOAD_DELAY = 500;
        await new Promise(resolve => setTimeout(resolve, DEBUG_LOAD_DELAY));
    }
}