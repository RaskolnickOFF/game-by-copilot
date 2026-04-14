import { GAME_WIDTH, GAME_HEIGHT } from "../core/constants.js";
import { playerData } from "../data/playerData.js";
import { Weapon } from "./Weapon.js";
import { weaponData } from "../data/weaponData.js";

export class Player {
    constructor() {
        this.width = playerData.width;
        this.height = playerData.height;
        this.collisionRadius = playerData.collisionRadius;
        this.emoji = '🏇';

        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = (GAME_HEIGHT - this.height) / 2;

        this.speed = playerData.speed;

        // Progression
        this.level = 1;
        this.xp = 0;
        this.nextLevelXp = 100;
        this.gold = 0;

        // Health system
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.damageReduction = 0;

        // Weapons and Perks
        this.currentWeapon = new Weapon('sword', weaponData.sword);
        this.availableWeapons = ['sword', 'bow', 'axe', 'staff', 'hammer'];
        this.perks = [];
        this.availablePerks = [];

        // Combat stats
        this.totalDamageDealt = 0;
        this.enemiesKilled = 0;
        this.bloodlustMultiplier = 1.0;

        // Multipliers (for upgrades)
        this.speedMultiplier = 1;
        this.healthMultiplier = 1;

        // Buff system
        this.activeBuffs = [];
    }

    reset() {
        this.x = (GAME_WIDTH - this.width) / 2;
        this.y = (GAME_HEIGHT - this.height) / 2;
        this.speed = playerData.speed;
        this.speedMultiplier = 1;
        this.health = this.maxHealth * this.healthMultiplier;
        this.bloodlustMultiplier = 1.0;
        this.totalDamageDealt = 0;
        this.enemiesKilled = 0;
        this.activeBuffs = []; // Reset buffs on level start
    }

    update(dt, keys, tileMap = null) {
        this.updateBuffs();

        // Movement
        let dx = 0, dy = 0;
        if (keys.w || keys.W || keys.ArrowUp) dy -= 1;
        if (keys.s || keys.S || keys.ArrowDown) dy += 1;
        if (keys.a || keys.A || keys.ArrowLeft) dx -= 1;
        if (keys.d || keys.D || keys.ArrowRight) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;

            // Calculate tile position for speed modifier
            let tileSpeedModifier = 1.0;
            if (tileMap) {
                const tileX = Math.floor((this.x + this.width / 2) / 32); // Assuming 32px tile size
                const tileY = Math.floor((this.y + this.height / 2) / 32);
                tileSpeedModifier = tileMap.getSpeedModifierAt(tileX, tileY);
            }

            const totalSpeedModifier = this.speedMultiplier * tileSpeedModifier;

            this.x += dx * this.speed * totalSpeedModifier * dt;
            this.y += dy * this.speed * totalSpeedModifier * dt;

            // Keep player in bounds
            this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
            this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y));
        }
    }

    takeDamage(damage) {
        const actualDamage = Math.max(1, Math.round(damage * (1 - this.damageReduction)));
        this.health -= actualDamage;
        return actualDamage;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth * this.healthMultiplier, this.health + amount);
    }

    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.nextLevelXp) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level += 1;
        this.xp = 0;
        this.nextLevelXp = Math.round(this.nextLevelXp * 1.2);
        this.maxHealth = Math.round(100 + (this.level - 1) * 15);
        this.health = this.maxHealth * this.healthMultiplier;
    }

    gainGold(amount) {
        this.gold += amount;
    }

    addPerk(perkEffect) {
        this.perks.push(perkEffect);
        this.currentWeapon.applyPerk(perkEffect);
    }

    applyBuff(buffEffect) {
        const buff = {
            ...buffEffect,
            startTime: Date.now(),
            endTime: Date.now() + (buffEffect.duration * 1000)
        };
        this.activeBuffs.push(buff);
    }

    updateBuffs() {
        const now = Date.now();
        this.activeBuffs = this.activeBuffs.filter(buff => now < buff.endTime);

        // Reset multipliers
        this.speedMultiplier = 1;
        this.damageReduction = 0;
        this.damageBuffMultiplier = 1.0;

        // Apply active buffs
        this.activeBuffs.forEach(buff => {
            if (buff.stat === 'speed') {
                this.speedMultiplier *= buff.multiplier;
            } else if (buff.stat === 'damage') {
                this.damageBuffMultiplier *= buff.multiplier;
            } else if (buff.stat === 'armor') {
                this.damageReduction += buff.value;
            }
        });
    }

    switchWeapon(weaponType) {
        if (this.availableWeapons.includes(weaponType)) {
            this.currentWeapon = new Weapon(weaponType, weaponData[weaponType]);
            // Reapply all perks to the new weapon
            this.perks.forEach(perk => {
                this.currentWeapon.applyPerk(perk);
            });
        }
    }

    recordKill() {
        this.enemiesKilled += 1;
        this.bloodlustMultiplier += 0.05; // Max 5% per kill
    }

    update(dt, keys) {
        let dx = 0, dy = 0;

        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        // Normalize diagonal movement
        if (dx || dy) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            this.x += dx * this.speed * this.speedMultiplier * dt;
            this.y += dy * this.speed * this.speedMultiplier * dt;
        }
        // Keep player in bounds
        this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y));
    }
}