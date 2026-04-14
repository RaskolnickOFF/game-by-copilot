export class Corpse {
    constructor(x, y, enemyData, goldDropped = 0) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.enemyData = enemyData;
        this.emoji = `💀`; // Dead body emoji
        this.goldDropped = goldDropped;
        this.decayTime = 20; // Seconds until corpse disappears
        this.timeLeft = this.decayTime;
        this.active = true;

        // Whether this corpse has been looted/eaten
        this.consumed = false;

        // Rarity affects visual
        this.rarity = enemyData.rarity || 'common';
    }

    getAlpha() {
        // Fade out as corpse decays
        return this.timeLeft / this.decayTime;
    }

    update(dt) {
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
            this.active = false;
        }
    }

    consume() {
        this.consumed = true;
        this.active = false;
    }

    getLoot() {
        // Return loot based on enemy type
        return {
            health: Math.round(this.enemyData.maxHealth * 0.3),
            gold: this.goldDropped,
            xp: Math.round(this.enemyData.xpReward * 0.1) // Small XP from corpse
        };
    }
}
