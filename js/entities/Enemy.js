import { GAME_HEIGHT, GAME_WIDTH, ENEMY_DESPAWN_MARGIN } from "../core/constants.js";

export class Enemy {
    constructor(data) {
        this.data = data;
        this.emoji = data.emoji;

        //Position and dimensions
        this.x = 0;
        this.y = 0;
        this.width = data.width;
        this.height = data.height;

        //Stats
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.speed = data.speed;
        this.damage = data.damage;
        this.armor = data.armor;
        this.collisionRadius = data.collisionRadius;

        //State
        this.active = false;
        this.lastDamageTime = 0;
        this.damageFlashDuration = 0.2;

        // Multipliers for scaling
        this.healthMultiplier = 1.0;
        this.damageMultiplier = 1.0;
        this.speedMultiplier = 1.0;

        // Behavior system
        this.behavior = data.behavior || 'normal'; // 'normal', 'aggressive', 'scavenger', 'coward'
        this.targetCorpse = null;
        this.searchRadius = 300;

        // Debuff system
        this.activeDebuffs = [];
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.health = this.data.maxHealth * this.healthMultiplier;
        this.active = true;
        this.lastDamageTime = 0;
        this.targetCorpse = null;
    }

    reset() {
        this.active = false;
        this.health = this.data.maxHealth;
        this.targetCorpse = null;
    }

    takeDamage(damage, armorPenetration = 0) {
        // Apply armor reduction
        const effectiveArmor = Math.max(0, this.armor * (1 - armorPenetration));
        const actualDamage = Math.round(Math.max(1, damage - effectiveArmor));
        this.health -= actualDamage;
        this.lastDamageTime = this.damageFlashDuration; // For damage flash effect
        return actualDamage;
    }

    getEffectiveDamage() {
        return Math.round(this.data.damage * this.damageMultiplier);
    }

    isDead() {
        return this.health <= 0;
    }

    applyDebuff(debuffEffect) {
        const debuff = {
            ...debuffEffect,
            startTime: Date.now(),
            endTime: Date.now() + (debuffEffect.duration * 1000)
        };
        this.activeDebuffs.push(debuff);
    }

    updateDebuffs() {
        const now = Date.now();
        this.activeDebuffs = this.activeDebuffs.filter(debuff => now < debuff.endTime);

        // Reset multipliers
        this.speedMultiplier = 1.0;
        this.damageMultiplier = 1.0;

        // Apply active debuffs
        this.activeDebuffs.forEach(debuff => {
            if (debuff.stat === 'speed') {
                this.speedMultiplier *= debuff.multiplier;
            } else if (debuff.stat === 'damage') {
                this.damageMultiplier *= debuff.multiplier;
            } else if (debuff.stat === 'confusion') {
                // Confusion is handled in movement logic
            }
        });
    }

    // Find nearest corpse
    findNearestCorpse(corpses) {
        let nearest = null;
        let nearestDist = this.searchRadius;

        for (let corpse of corpses) {
            if (!corpse.active || corpse.consumed) continue;

            const dx = corpse.x - this.x;
            const dy = corpse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = corpse;
            }
        }

        return nearest;
    }

    update(dt, player, corpses = [], tileMap = null) {
        if (!this.active) return;

        this.updateDebuffs();

        // Update damage flash timer
        if (this.lastDamageTime > 0) {
            this.lastDamageTime -= dt;
        }

        //despawn if too far offscreen
        if (this.x < -ENEMY_DESPAWN_MARGIN ||
            this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN ||
            this.y < -ENEMY_DESPAWN_MARGIN ||
            this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN
        ) {
            this.active = false;
            return;
        }

        // Behavior-based movement
        let targetX = player.x;
        let targetY = player.y;

        if (this.behavior === 'scavenger' && corpses.length > 0) {
            // Look for corpses instead of attacking player
            const corpse = this.findNearestCorpse(corpses);
            if (corpse && this.health < this.maxHealth * this.healthMultiplier * 0.8) {
                // Go eat corpse if we're wounded
                targetX = corpse.x;
                targetY = corpse.y;
                this.targetCorpse = corpse;
            }
        } else if (this.behavior === 'coward') {
            // Run away if health is low
            if (this.health < this.maxHealth * this.healthMultiplier * 0.3) {
                targetX = this.x - (player.x - this.x) * 2;
                targetY = this.y - (player.y - this.y) * 2;
            }
        } else if (this.behavior === 'aggressive') {
            // Always charge at player, no hesitation
        }

        // Check for confusion debuff
        const hasConfusion = this.activeDebuffs.some(debuff => debuff.stat === 'confusion');
        if (hasConfusion) {
            // Move in random direction
            const randomAngle = Math.random() * Math.PI * 2;
            targetX = this.x + Math.cos(randomAngle) * 100;
            targetY = this.y + Math.sin(randomAngle) * 100;
        }

        //calculate direction to target
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > 0) {
            const normalizedDX = dx / len;
            const normalizedDY = dy / len;

            // Calculate tile position for speed modifier
            let tileSpeedModifier = 1.0;
            if (tileMap) {
                const tileX = Math.floor((this.x + this.width / 2) / 32); // Assuming 32px tile size
                const tileY = Math.floor((this.y + this.height / 2) / 32);
                tileSpeedModifier = tileMap.getSpeedModifierAt(tileX, tileY);
            }

            const totalSpeedModifier = this.speedMultiplier * tileSpeedModifier;

            // Move towards target
            this.x += normalizedDX * this.speed * totalSpeedModifier * dt;
            this.y += normalizedDY * this.speed * totalSpeedModifier * dt;
        }
    }
}