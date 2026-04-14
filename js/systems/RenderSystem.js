import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, GAME_STATES } from "../core/constants.js";

export class RenderSystem {
    constructor(canvas, imageManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.imageManager = imageManager;
    }

    render(state, player, enemies = [], corpses = [], levelName = '', currentLevel = 1, tileMap = null) {
        if (state === GAME_STATES.MENU) {
            this.renderMenuBackground();
        } else {
            this.ctx.fillStyle = "#0f3460";
            this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            this.renderTiles(tileMap);
            this.renderGrid();
            this.renderCorpses(corpses);
            this.renderEnemies(enemies);
            this.renderPlayer(player);
            this.renderHUD(player, levelName, currentLevel);
        }
    }

    renderPlayer(player) {
        // Draw player
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(player.emoji, player.x + player.width / 2, player.y + player.height / 2);

        // Draw health bar
        const barWidth = player.width + 20;
        const barHeight = 8;
        const barX = player.x - 10;
        const barY = player.y - 20;

        // Background bar
        this.ctx.fillStyle = "#666";
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health bar
        const healthPercent = Math.max(0, player.health / (player.maxHealth * player.healthMultiplier));
        this.ctx.fillStyle = `hsl(${healthPercent * 120}, 100%, 50%)`;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        this.ctx.strokeStyle = "#fff";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    renderEnemies(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (!enemy.active) continue;

            // Damage flash effect
            if (enemy.lastDamageTime > 0) {
                const alpha = (enemy.lastDamageTime / enemy.damageFlashDuration) * 0.8;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = "#ff0000";
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                this.ctx.globalAlpha = 1.0;
            }

            // Draw enemy emoji
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(enemy.emoji, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

            // Draw health bar
            const barWidth = enemy.width + 10;
            const barHeight = 5;
            const barX = enemy.x - 5;
            const barY = enemy.y - 12;

            // Background bar
            this.ctx.fillStyle = "#333";
            this.ctx.fillRect(barX, barY, barWidth, barHeight);

            // Health bar
            const healthPercent = Math.max(0, enemy.health / enemy.maxHealth);
            this.ctx.fillStyle = healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffaa00" : "#ff0000";
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

            // Border
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
    }

    renderCorpses(corpses) {
        for (let corpse of corpses) {
            if (!corpse.active) continue;

            // Corpse fades out as it decays
            this.ctx.globalAlpha = corpse.getAlpha();

            // Draw corpse emoji with rarity color
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Color based on rarity
            if (corpse.rarity === 'epic') {
                this.ctx.fillStyle = '#ff00ff';
            } else if (corpse.rarity === 'rare') {
                this.ctx.fillStyle = '#ffaa00';
            } else if (corpse.rarity === 'uncommon') {
                this.ctx.fillStyle = '#00ff00';
            } else {
                this.ctx.fillStyle = '#aaaaaa';
            }

            this.ctx.fillText(corpse.emoji, corpse.x + corpse.width / 2, corpse.y + corpse.height / 2);

            // Draw loot icon if gold was dropped
            if (corpse.goldDropped > 0) {
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillStyle = '#ffdd00';
                this.ctx.fillText('💰', corpse.x + corpse.width / 2 + 15, corpse.y + corpse.height / 2 - 15);
            }

            this.ctx.globalAlpha = 1.0;
        }
    }

    renderHUD(player, levelName, currentLevel) {
        const padding = 15;
        const lineHeight = 24;
        let y = padding;

        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#4a9eff';

        // Level info
        this.ctx.font = 'bold 16px Courier New';
        this.ctx.fillText(`📍 ${levelName}`, padding, y);
        y += lineHeight;

        // Player level and XP
        this.ctx.font = '14px Courier New';
        const xpPercent = Math.round((player.xp / player.nextLevelXp) * 100);
        this.ctx.fillText(`Level: ${player.level} 🎯 XP: ${player.xp}/${player.nextLevelXp} (${xpPercent}%)`, padding, y);
        y += lineHeight;

        // XP Bar
        const barWidth = 200;
        const barHeight = 6;
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(padding, y, barWidth, barHeight);
        this.ctx.fillStyle = "#ffaa00";
        this.ctx.fillRect(padding, y, barWidth * (player.xp / player.nextLevelXp), barHeight);
        this.ctx.strokeStyle = "#4a9eff";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(padding, y, barWidth, barHeight);
        y += lineHeight + 2;

        // Health
        this.ctx.fillStyle = player.health <= player.maxHealth * player.healthMultiplier * 0.25 ? '#ff4444' : '#4a9eff';
        this.ctx.font = '14px Courier New';
        this.ctx.fillText(`❤️ HP: ${Math.max(0, Math.round(player.health))}/${Math.round(player.maxHealth * player.healthMultiplier)}`, padding, y);
        y += lineHeight;

        // Gold
        this.ctx.fillStyle = '#ffdd00';
        this.ctx.fillText(`💰 Gold: ${player.gold}`, padding, y);
        y += lineHeight;

        // Current weapon
        this.ctx.fillStyle = '#4a9eff';
        const weaponName = player.currentWeapon.data.name;
        this.ctx.fillText(`⚔️ Weapon: ${weaponName}`, padding, y);
        y += lineHeight;

        // Weapon stats
        this.ctx.font = '12px Courier New';
        const weapDmg = player.currentWeapon.getEffectiveDamage();
        const weapSpd = (player.currentWeapon.getEffectiveAttackSpeed()).toFixed(1);
        this.ctx.fillText(`DMG: ${weapDmg} | SPD: ${weapSpd}/s | RNG: ${Math.round(player.currentWeapon.getEffectiveRange())}`, padding + 10, y);
        y += lineHeight;

        // Perks
        if (player.perks.length > 0) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = '12px Courier New';
            this.ctx.fillText(`⭐ Perks: ${player.perks.length}`, padding, y);
        }

        // Stats on right side
        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'right';

        let ry = padding;
        this.ctx.fillStyle = '#4a9eff';
        this.ctx.fillText(`Enemies Killed: ${player.enemiesKilled}`, GAME_WIDTH - padding, ry);
        ry += lineHeight;

        this.ctx.fillText(`Damage Dealt: ${player.totalDamageDealt}`, GAME_WIDTH - padding, ry);
        ry += lineHeight;

        if (player.bloodlustMultiplier > 1.0) {
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillText(`🔥 Bloodlust: ${(player.bloodlustMultiplier * 100).toFixed(0)}%`, GAME_WIDTH - padding, ry);
        }
    }

    renderTiles(tileMap) {
        if (!tileMap) return;

        const tileSize = 32; // Assuming 32px tiles
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Different tree emojis for variety
        const treeEmojis = ['🌲', '🌳', '🌴', '🎄', '🌿'];

        for (let y = 0; y < tileMap.height; y++) {
            for (let x = 0; x < tileMap.width; x++) {
                const tile = tileMap.getTileAt(x, y);
                if (tile && tile.color) {
                    // Draw tile background color
                    this.ctx.fillStyle = tile.color;
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                    // Add tree emojis for forest tiles
                    if (tile.name === 'Forest') {
                        const screenX = x * tileSize + tileSize / 2;
                        const screenY = y * tileSize + tileSize / 2;
                        // Use position-based pseudo-random selection for consistent trees
                        const emojiIndex = (x * 7 + y * 13) % treeEmojis.length;
                        this.ctx.fillStyle = '#000';
                        this.ctx.fillText(treeEmojis[emojiIndex], screenX, screenY);
                    }
                }
            }
        }
    }

    renderGrid() {
        this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        const tileSize = 32; // Match tile size
        for (let i = 0; i < GAME_WIDTH; i += tileSize) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, GAME_HEIGHT);
        }
        for (let i = 0; i < GAME_HEIGHT; i += tileSize) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(GAME_WIDTH, i);
        }
        this.ctx.stroke();
    }

    renderMenuBackground() {
        this.ctx.fillStyle = "#0f3460";
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}