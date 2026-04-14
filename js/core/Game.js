import { GAME_WIDTH, GAME_HEIGHT, ASPECT_RATIO, CANVAS_MARGIN, GAME_STATES } from "./constants.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { Player } from "../entities/Player.js";
import { ImageManager } from "../managers/ImageManager.js";
import { AudioManager } from "../managers/AudioManager.js";
import { UIManager } from "../managers/UIManager.js";
import { EnemyManager } from "../managers/EnemyManager.js";
import { CorpseManager } from "../managers/CorpseManager.js";
import { TileMap, BIOME_TYPES } from "../systems/TileMap.js";
import { getLevelConfig } from "../data/levelData.js";
import { AttackEffect } from "../entities/AttackEffect.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");

        this.imageManager = new ImageManager();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this);
        this.enemyManager = new EnemyManager();
        this.corpseManager = new CorpseManager();

        // Tile map system
        this.tileMap = new TileMap(50, 30); // 50x30 grid for the level

        this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
        this.player = new Player();
        this.keys = {};
        this.lastTime = 0;
        this.time = 0;
        this.state = GAME_STATES.MENU;

        // Level system
        this.currentLevel = 1;
        this.levelConfig = getLevelConfig(1);
        this.levelTime = 0;

        // Attack effects
        this.attackEffects = [];

        this.init();
    }

    async init() {
        await Promise.all([
            this.imageManager.loadAll(),
            this.audioManager.loadAll()
        ]);

        this.uiManager.showPanel('mainMenu');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupInput();

        // start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameLoop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if (this.state === GAME_STATES.PLAYING) {
            this.time += dt;
            this.levelTime += dt;
            this.uiManager.updateTimer(this.levelTime);
        }

        this.update(dt);
        this.renderSystem.render(
            this.state,
            this.player,
            this.enemyManager.getActiveEnemies(),
            this.corpseManager.getActiveCorpses(),
            this.levelConfig.name,
            this.currentLevel,
            this.tileMap
        );

        // Render attack effects on top
        this.renderAttackEffects();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== GAME_STATES.PLAYING) return;

        this.player.update(dt, this.keys, this.tileMap);
        this.corpseManager.update(dt);
        this.enemyManager.update(dt, this.player, this.corpseManager.getActiveCorpses(), this.tileMap);
        this.updateAttackEffects(dt);

        // Handle combat and collision
        this.checkCollisions();

        // Handle corpse looting by player
        this.handleCorpseLoot();

        // Check win condition (time spent on level)
        if (this.levelTime >= this.levelConfig.maxTime) {
            this.levelComplete();
        }

        // Check lose condition (player dead)
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    checkCollisions() {
        const enemies = this.enemyManager.getActiveEnemies();

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (!enemy.active) continue;

            // Check if enemy hit player
            const dx = (this.player.x + this.player.width / 2) - (enemy.x + enemy.width / 2);
            const dy = (this.player.y + this.player.height / 2) - (enemy.y + enemy.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.player.collisionRadius + enemy.collisionRadius) {
                // Player takes damage
                const weaponData = this.player.currentWeapon.data;
                const finalDamage = enemy.getEffectiveDamage();
                this.player.takeDamage(finalDamage);
                this.playSound('hit');
            }

            // Check if player attacks enemy
            // REMOVED: Auto-attack on collision, now click-to-attack
        }
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Esc toggles pause
            if (e.key === 'Escape') {
                if (this.state === GAME_STATES.PLAYING) {
                    this.pause();
                } else if (this.state === GAME_STATES.PAUSED) {
                    this.resume();
                }
            }

            // Number keys to switch weapons
            if (e.key >= '1' && e.key <= '5') {
                const weaponIndex = parseInt(e.key) - 1;
                const weapons = ['sword', 'bow', 'axe', 'staff', 'hammer'];
                if (weaponIndex < this.player.availableWeapons.length) {
                    const weaponType = this.player.availableWeapons[weaponIndex];
                    if (weaponType) {
                        this.player.switchWeapon(weaponType);
                    }
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Clear all keys when context menu opens
        window.addEventListener('contextmenu', () => {
            this.keys = {};
        });

        // Clear all keys when window loses focus
        window.addEventListener('blur', () => {
            this.keys = {};
        });

        // Mouse click for attacks
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === GAME_STATES.PLAYING) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.handlePlayerAttack(x, y);
            }
        });
    }
    handlePlayerAttack(clickX, clickY) {
        if (!this.player.currentWeapon.canAttack(this.time)) return;

        const enemies = this.enemyManager.getActiveEnemies();
        const weapon = this.player.currentWeapon;
        const weaponRange = weapon.getEffectiveRange();

        // Calculate direction from player to click
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const dirX = clickX - playerCenterX;
        const dirY = clickY - playerCenterY;
        const clickDistance = Math.sqrt(dirX * dirX + dirY * dirY);

        // Normalize direction; if click is exactly on player, default to right
        const normDirX = clickDistance === 0 ? 1 : dirX / clickDistance;
        const normDirY = clickDistance === 0 ? 0 : dirY / clickDistance;

        let attacked = false;

        // Check if weapon is projectile-based
        const isProjectile = weapon.type === 'bow' || weapon.type === 'staff';

        if (isProjectile) {
            // Single target projectile (bow, staff)
            let closestEnemy = null;
            let closestDist = Infinity;

            for (const enemy of enemies) {
                if (!enemy.active) continue;

                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const dx = enemyCenterX - playerCenterX;
                const dy = enemyCenterY - playerCenterY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= weaponRange && dist < closestDist) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            }

            if (closestEnemy) {
                // Create projectile effect that will hit the enemy
                const enemyCenterX = closestEnemy.x + closestEnemy.width / 2;
                const enemyCenterY = closestEnemy.y + closestEnemy.height / 2;

                // Create callback to attack enemy when projectile hits
                const attackCallback = () => {
                    this.attackEnemy(closestEnemy);
                };

                this.addAttackEffect(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY, weapon.type, 0.45, attackCallback);
                attacked = true;
            }
        } else {
            // Melee attack (sword, axe, hammer) - calculate hit immediately, draw the zone briefly
            if (!attacked) {
                const effectTargetX = playerCenterX + normDirX * weaponRange * 0.7;
                const effectTargetY = playerCenterY + normDirY * weaponRange * 0.7;

                this.attackEnemiesInArea(playerCenterX, playerCenterY, normDirX, normDirY, weapon);
                this.addAttackEffect(playerCenterX, playerCenterY, effectTargetX, effectTargetY, weapon.type, 0.12, null, weapon.data);
                attacked = true;
            }
        }

        if (attacked) {
            weapon.recordAttack(this.time);
            this.playSound('attack');
        }
    }

    attackEnemy(enemy) {
        const damage = this.player.currentWeapon.getEffectiveDamage(0, this.player.bloodlustMultiplier, this.player.damageBuffMultiplier);
        const actualDamage = enemy.takeDamage(damage, this.player.currentWeapon.armorPenetration);

        this.player.totalDamageDealt += actualDamage;

        // Life steal
        if (this.player.currentWeapon.lifeStealPercent > 0) {
            const healed = Math.round(actualDamage * this.player.currentWeapon.lifeStealPercent);
            this.player.heal(healed);
        }

        // Check double strike
        if (Math.random() < this.player.currentWeapon.doubleStrikeChance) {
            const damage2 = this.player.currentWeapon.getEffectiveDamage(0, this.player.bloodlustMultiplier, this.player.damageBuffMultiplier);
            const actualDamage2 = enemy.takeDamage(damage2, this.player.currentWeapon.armorPenetration);
            this.player.totalDamageDealt += actualDamage2;
        }

        if (enemy.isDead()) {
            const goldReward = Math.round(enemy.data.goldReward * this.levelConfig.xpMultiplier);
            const xpReward = Math.round(enemy.data.xpReward * this.levelConfig.xpMultiplier);

            // Create corpse instead of removing immediately
            this.corpseManager.createCorpse(enemy.x, enemy.y, enemy.data, goldReward);

            this.player.gainXp(xpReward);
            this.player.gainGold(goldReward);
            this.player.recordKill();
            this.enemyManager.removeEnemy(enemy);
            this.playSound('kill');
        }
    }

    addAttackEffect(startX, startY, targetX, targetY, weaponType, duration = undefined, onHit = null, weaponData = null) {
        const effect = new AttackEffect(startX, startY, targetX, targetY, weaponType, duration, onHit, weaponData);
        this.attackEffects.push(effect);
    }

    updateAttackEffects(dt) {
        for (let i = this.attackEffects.length - 1; i >= 0; i--) {
            const effect = this.attackEffects[i];
            effect.update(dt);
            if (!effect.active) {
                this.attackEffects.splice(i, 1);
            }
        }
    }

    renderAttackEffects() {
        for (const effect of this.attackEffects) {
            effect.render(this.renderSystem.ctx);
        }
    }

    attackEnemiesInArea(centerX, centerY, dirX, dirY, weapon) {
        const enemies = this.enemyManager.getActiveEnemies();
        const weaponRange = weapon.getEffectiveRange();
        const attackAngle = weapon.data.area * Math.PI / 180; // convert to radians

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            const dx = enemyCenterX - centerX;
            const dy = enemyCenterY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= weaponRange) {
                // Check if enemy is within the attack angle
                let enemyDirX = 0;
                let enemyDirY = 0;
                if (dist > 0) {
                    enemyDirX = dx / dist;
                    enemyDirY = dy / dist;
                }
                const dot = dirX * enemyDirX + dirY * enemyDirY;
                const angle = dist === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, dot)));

                if (angle <= attackAngle / 2) {
                    this.attackEnemy(enemy);
                }
            }
        }
    }

    startGame() {
        this.playSound('button_click');
        this.state = GAME_STATES.PLAYING;
        this.uiManager.hideAllPanels();
        this.levelTime = 0;
        this.uiManager.showTimer();

        this.player.reset();
        this.enemyManager.reset();
        this.corpseManager.reset();

        // Setup level
        this.currentLevel = 1;
        this.levelConfig = getLevelConfig(this.currentLevel);
        this.setupLevel();

        this.lastTime = performance.now();
    }

    setupLevel() {
        // Configure enemy manager for this level
        this.enemyManager.setLevel(this.currentLevel);
        this.enemyManager.setSpawnRate(this.levelConfig.baseEnemySpawnRate);
        this.enemyManager.setMaxEnemies(this.levelConfig.maxEnemies);

        // Set difficulty multipliers
        this.enemyManager.setDifficulty(
            this.levelConfig.enemyHealthMultiplier,
            this.levelConfig.enemyDamageMultiplier,
            this.levelConfig.enemySpeedMultiplier
        );

        // Generate terrain based on level
        this.generateLevelTerrain();

        // Reset corpses for new level
        this.corpseManager.reset();
    }

    generateLevelTerrain() {
        // Map levels to biomes
        const levelBiomes = [
            'PLAINS',    // Level 1
            'DESERT',    // Level 2
            'SWAMP',     // Level 3
            'FOREST',    // Level 4
            'MOUNTAINS'  // Level 5
        ];

        const biomeIndex = Math.min(this.currentLevel - 1, levelBiomes.length - 1);
        const biomeType = levelBiomes[biomeIndex];

        this.tileMap.generateBiome(biomeType);
    }

    nextLevel() {
        this.currentLevel += 1;

        // Award bonus for completing level
        this.player.gainXp(Math.round(this.player.nextLevelXp * 0.3));
        this.player.gainGold(Math.round(500 * this.currentLevel));

        // Heal player for next level
        this.player.health = this.player.maxHealth * this.player.healthMultiplier;

        this.levelConfig = getLevelConfig(this.currentLevel);
        this.levelTime = 0;

        this.state = GAME_STATES.PLAYING;
        this.uiManager.hideAllPanels();
        this.uiManager.showTimer();

        this.enemyManager.reset();
        this.setupLevel();

        this.playSound('level_complete');
        this.lastTime = performance.now();
    }

    levelComplete() {
        this.state = GAME_STATES.LEVEL_COMPLETE;
        this.uiManager.hideTimer();
        this.uiManager.showLevelComplete(this.player);
        this.playSound('level_complete');
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        this.uiManager.hideTimer();
        this.uiManager.showGameOver(this.player);
        this.playSound('game_over');
    }

    pause() {
        this.playSound('pause');
        this.state = GAME_STATES.PAUSED;
        this.uiManager.showPanel('pauseMenu');
    }

    resume() {
        this.playSound('unpause');
        this.state = GAME_STATES.PLAYING;
        this.uiManager.hideAllPanels();
        this.uiManager.showTimer();
    }

    returnToMenu() {
        this.playSound('button_click');
        this.state = GAME_STATES.MENU;
        this.uiManager.hideAllPanels();
        this.uiManager.hideTimer();
        this.uiManager.showPanel('mainMenu');
        this.levelTime = 0;
        this.player.bloodlustMultiplier = 1.0;
    }

    playSound(name) {
        this.audioManager.play(name);
    }

    handleCorpseLoot() {
        const corpses = this.corpseManager.getActiveCorpses();
        const lootRadius = 80;

        for (let i = corpses.length - 1; i >= 0; i--) {
            const corpse = corpses[i];
            if (corpse.consumed) continue;

            // Check if player is near corpse
            const dx = this.player.x - corpse.x;
            const dy = this.player.y - corpse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < lootRadius) {
                // Automatically loot corpse
                const loot = corpse.getLoot();
                this.player.heal(loot.health);
                this.player.gainGold(Math.round(loot.gold * 0.2)); // Extra gold from corpse
                corpse.consume();
                this.playSound('hit');
            }

            // Check if scavenger enemies eat corpses
            const enemies = this.enemyManager.getActiveEnemies();
            for (let enemy of enemies) {
                if (!enemy.active) continue;
                if (enemy.behavior !== 'scavenger') continue;

                const edx = enemy.x - corpse.x;
                const edy = enemy.y - corpse.y;
                const edist = Math.sqrt(edx * edx + edy * edy);

                if (edist < 50) {
                    // Enemy eats corpse to heal
                    enemy.health = Math.min(enemy.maxHealth * enemy.healthMultiplier, enemy.health + 20);
                    corpse.consume();
                    this.playSound('hit'); // Eating sound
                }
            }
        }
    }

    resizeCanvas() {
        let w, h;

        const availableWidth = window.innerWidth - CANVAS_MARGIN * 2;
        const availableHeight = window.innerHeight - CANVAS_MARGIN * 2;

        if (availableWidth / availableHeight > ASPECT_RATIO) {
            h = availableHeight;
            w = h * ASPECT_RATIO;
        } else {
            w = availableWidth;
            h = w / ASPECT_RATIO;
        }

        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.style.margin = `${CANVAS_MARGIN}px`;
    }
}