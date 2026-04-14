import { enemyData, enemySpawnWeights } from "../data/enemyData.js";
import { Enemy } from "../entities/Enemy.js";
import { ObjectPooler } from "../utils/ObjectPooler.js";

export class EnemyManager {
    constructor() {
        const ENEMY_POOL_SIZE = 30;
        this.pools = {};

        // Create pools for each enemy type
        Object.keys(enemyData).forEach(enemyType => {
            this.pools[enemyType] = new ObjectPooler(() => {
                return new Enemy(enemyData[enemyType]);
            }, ENEMY_POOL_SIZE);
        });

        this.allActive = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1.0;
        this.spawnRate = 1.0;
        this.maxEnemies = 5;
        this.currentLevel = 1;

        // Difficulty multipliers
        this.healthMultiplier = 1.0;
        this.damageMultiplier = 1.0;
        this.speedMultiplier = 1.0;
    }

    setDifficulty(healthMult, damageMult, speedMult) {
        this.healthMultiplier = healthMult;
        this.damageMultiplier = damageMult;
        this.speedMultiplier = speedMult;
    }

    setSpawnRate(rate) {
        this.spawnRate = rate;
        this.spawnInterval = 1.0 / rate;
    }

    setMaxEnemies(max) {
        this.maxEnemies = max;
    }

    setLevel(level) {
        this.currentLevel = level;
    }

    getWeightedEnemyType() {
        // Filter enemies based on level
        const availableEnemies = Object.entries(enemySpawnWeights).filter(([enemyType]) => {
            const enemy = enemyData[enemyType];
            // Allow common enemies from level 1
            if (enemy.rarity === 'common') return true;
            // Allow uncommon from level 2
            if (enemy.rarity === 'uncommon' && this.currentLevel >= 2) return true;
            // Allow rare from level 3
            if (enemy.rarity === 'rare' && this.currentLevel >= 3) return true;
            // Allow epic from level 4
            if (enemy.rarity === 'epic' && this.currentLevel >= 4) return true;
            return false;
        });

        if (availableEnemies.length === 0) return 'goblin'; // fallback

        const totalWeight = availableEnemies.reduce((sum, [, weight]) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (const [enemyType, weight] of availableEnemies) {
            random -= weight;
            if (random <= 0) {
                return enemyType;
            }
        }

        return availableEnemies[0][0]; // fallback
    }

    spawn(x, y, enemyType = null) {
        if (this.allActive.length >= this.maxEnemies) return null;

        const type = enemyType || this.getWeightedEnemyType();
        const pool = this.pools[type];

        if (!pool) return null;

        const enemy = pool.get();

        // Apply difficulty scaling
        enemy.healthMultiplier = this.healthMultiplier;
        enemy.damageMultiplier = this.damageMultiplier;
        enemy.speedMultiplier = this.speedMultiplier;

        enemy.spawn(x, y);
        this.allActive.push(enemy);
        return enemy;
    }

    getActiveEnemies() {
        return this.allActive;
    }

    update(dt, player, corpses = [], tileMap = null) {
        // Spawn new enemies
        this.spawnTimer += dt;
        while (this.spawnTimer >= this.spawnInterval && this.allActive.length < this.maxEnemies) {
            this.spawnTimer -= this.spawnInterval;
            const angle = Math.random() * Math.PI * 2;
            const distance = 400;
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            this.spawn(x, y);
        }

        // Update all enemies
        for (let i = this.allActive.length - 1; i >= 0; i--) {
            const enemy = this.allActive[i];
            if (!enemy.active) {
                this.allActive.splice(i, 1);
                continue;
            }
            enemy.update(dt, player, corpses, tileMap);
        }
    }

    removeEnemy(enemy) {
        const index = this.allActive.indexOf(enemy);
        if (index > -1) {
            this.allActive.splice(index, 1);
        }
        enemy.reset();
    }

    applyDebuffToAll(debuffEffect) {
        this.allActive.forEach(enemy => {
            enemy.applyDebuff(debuffEffect);
        });
    }

    reset() {
        this.allActive = [];
        Object.values(this.pools).forEach(pool => pool.releaseAll());
    }
}