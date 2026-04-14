import { perkData, potionData } from "../data/weaponData.js";

export class UIManager {
    constructor(game) {
        this.game = game;
        this.timerEl = document.getElementById('timer');
        this.mainMenuEl = document.getElementById('mainMenu');
        this.pauseMenuEl = document.getElementById('pauseMenu');
        this.loadingScreenEl = document.getElementById('loadingScreen');
        this.playBtnEl = document.getElementById('playBtn');
        this.resumeBtnEl = document.getElementById('resumeBtn');
        this.quitBtnEl = document.getElementById('quitBtn');

        // Check if new elements exist, create them if they don't
        this.gameOverEl = document.getElementById('gameOverMenu');
        this.levelCompleteEl = document.getElementById('levelCompleteMenu');

        // Shop elements
        this.shopBtnEl = document.getElementById('shopBtn');
        this.closeShopBtnEl = document.getElementById('closeShopBtn');
        this.shopMenuEl = document.getElementById('shopMenu');
        this.playerGoldEl = document.getElementById('playerGold');
        this.continueLevelBtnEl = document.getElementById('continueLevelBtn');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.playBtnEl.addEventListener('click', () => this.game.startGame());
        this.resumeBtnEl.addEventListener('click', () => this.game.resume());
        this.quitBtnEl.addEventListener('click', () => this.game.returnToMenu());

        // Game Over button
        if (document.getElementById('restartBtn')) {
            document.getElementById('restartBtn').addEventListener('click', () => this.game.startGame());
        }
        if (document.getElementById('quitGameOverBtn')) {
            document.getElementById('quitGameOverBtn').addEventListener('click', () => this.game.returnToMenu());
        }

        // Level Complete button
        if (document.getElementById('nextLevelBtn')) {
            document.getElementById('nextLevelBtn').addEventListener('click', () => this.game.nextLevel());
        }

        // Shop buttons
        if (this.shopBtnEl) {
            this.shopBtnEl.addEventListener('click', () => this.showShop());
        }
        if (this.closeShopBtnEl) {
            this.closeShopBtnEl.addEventListener('click', () => this.hideShop());
        }
        if (this.continueLevelBtnEl) {
            this.continueLevelBtnEl.addEventListener('click', () => this.continueToNextLevel());
        }

        // Shop buy buttons
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.dataset.item;
                this.buyItem(item);
            });
        });

        [
            this.playBtnEl,
            this.resumeBtnEl,
            this.quitBtnEl,
            this.shopBtnEl,
            this.closeShopBtnEl,
            this.continueLevelBtnEl
        ].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', () => this.game.playSound('button_hover'));
            }
        })
    }

    hideAllPanels() {
        const panels = [
            this.mainMenuEl,
            this.pauseMenuEl,
            this.loadingScreenEl,
            this.gameOverEl,
            this.levelCompleteEl,
            this.shopMenuEl
        ];

        panels.forEach(p => p?.classList.remove('active'));
    }

    showPanel(panelId) {
        this.hideAllPanels();
        const panelEl = document.getElementById(panelId);
        if (panelEl) {
            panelEl.classList.add('active');
        }
    }

    showTimer() {
        if (this.timerEl) this.timerEl.style.display = 'block';
    }

    hideTimer() {
        if (this.timerEl) this.timerEl.style.display = 'none';
    }

    updateTimer(time) {
        if (!this.timerEl) return;
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        this.timerEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    }

    showGameOver(player) {
        this.showPanel('gameOverMenu');
        const statsEl = document.getElementById('gameOverStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <p>Level Reached: <strong>${player.level}</strong></p>
                <p>Total XP Gained: <strong>${player.xp}</strong></p>
                <p>Enemies Killed: <strong>${player.enemiesKilled}</strong></p>
                <p>Gold Earned: <strong>${player.gold}</strong></p>
                <p>Damage Dealt: <strong>${player.totalDamageDealt}</strong></p>
            `;
        }
    }

    showLevelComplete(player) {
        // Show shop instead of level complete menu
        this.showShop();
        // Update shop header to show level complete message
        const shopTitle = document.querySelector('#shopMenu h2');
        if (shopTitle) {
            shopTitle.innerHTML = '🎉 LEVEL COMPLETE! - SHOP 🎉<br><small>XP Earned: +${Math.round(player.xp * 0.5)} | Gold Earned: +${Math.round(player.gold * 1.5)}</small>';
        }
    }

    showShop() {
        this.updateShopDisplay();
        this.showPanel('shopMenu');
    }

    hideShop() {
        this.showPanel('pauseMenu');
    }

    updateShopDisplay() {
        if (this.playerGoldEl) {
            this.playerGoldEl.textContent = this.game.player.gold;
        }

        // Update buy buttons based on affordability and ownership
        document.querySelectorAll('.buy-btn').forEach(btn => {
            const item = btn.dataset.item;
            const cost = this.getItemCost(item);
            const canAfford = this.game.player.gold >= cost;
            const alreadyOwns = this.checkOwnership(item);

            btn.disabled = !canAfford || alreadyOwns;
            if (alreadyOwns) {
                btn.textContent = 'OWNED';
            } else if (!canAfford) {
                btn.textContent = 'CAN\'T AFFORD';
            } else {
                btn.textContent = 'BUY';
            }
        });
    }

    getItemCost(item) {
        const weaponCosts = {
            bow: 100,
            axe: 150,
            staff: 200,
            hammer: 250
        };

        const potionCosts = {
            healthPotion: 30,
            speedPotion: 40,
            damagePotion: 50,
            armorPotion: 45,
            slowPotion: 60,
            weaknessPotion: 70,
            confusionPotion: 80
        };

        const perkCosts = {
            sharpBlade: 50,
            swiftStrike: 60,
            longReach: 70,
            mightySwing: 80,
            lifeSteal: 100,
            armorBreaker: 90,
            doubleStrike: 120,
            bloodlust: 110
        };

        return weaponCosts[item] || potionCosts[item] || perkCosts[item] || 0;
    }

    checkOwnership(item) {
        if (item === 'bow' || item === 'axe' || item === 'staff' || item === 'hammer') {
            return this.game.player.availableWeapons.includes(item);
        } else if (potionData[item]) {
            // Potions are consumable, always available to buy
            return false;
        } else {
            // Check if perk effect is already applied
            const effect = perkData[item].effect;
            return this.game.player.perks.some(existingPerk => {
                return Object.keys(effect).every(key => existingPerk[key] === effect[key]);
            });
        }
    }

    buyItem(item) {
        const cost = this.getItemCost(item);
        if (this.game.player.gold >= cost && !this.checkOwnership(item)) {
            this.game.player.gold -= cost;

            if (item === 'bow' || item === 'axe' || item === 'staff' || item === 'hammer') {
                this.game.player.availableWeapons.push(item);
            } else if (potionData[item]) {
                // Apply potion effect
                this.applyPotionEffect(item);
            } else {
                // Apply perk
                if (perkData[item]) {
                    this.game.player.addPerk(perkData[item].effect);
                }
            }

            this.updateShopDisplay();
            this.game.playSound('button_click');
        }
    }

    continueToNextLevel() {
        this.hideShop();
        this.game.nextLevel();
    }

    applyPotionEffect(potionType) {
        const potion = potionData[potionType];
        if (!potion) return;

        if (potion.effect.type === 'instant') {
            if (potion.effect.heal) {
                this.game.player.heal(potion.effect.heal);
            }
        } else if (potion.effect.type === 'buff') {
            // Apply buff to player
            this.game.player.applyBuff(potion.effect);
        } else if (potion.effect.type === 'debuff') {
            // Apply debuff to all enemies
            this.game.enemyManager.applyDebuffToAll(potion.effect);
        }
    }
}