import { Corpse } from "../entities/Corpse.js";

export class CorpseManager {
    constructor() {
        this.corpses = [];
    }

    createCorpse(x, y, enemyData, goldDropped = 0) {
        const corpse = new Corpse(x, y, enemyData, goldDropped);
        this.corpses.push(corpse);
        return corpse;
    }

    getActiveCorpses() {
        return this.corpses.filter(c => c.active);
    }

    update(dt) {
        for (let i = this.corpses.length - 1; i >= 0; i--) {
            this.corpses[i].update(dt);
            if (!this.corpses[i].active) {
                this.corpses.splice(i, 1);
            }
        }
    }

    getCorpsesNear(x, y, radius) {
        return this.corpses.filter(c => {
            if (!c.active) return false;
            const dx = c.x - x;
            const dy = c.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < radius;
        });
    }

    reset() {
        this.corpses = [];
    }
}
