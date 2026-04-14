# 🛠️ Developer's Notes & Extension Guide

## Architecture Overview

```
Game Loop (requestAnimationFrame)
    ↓
Update Phase
    ├─ Player.update(dt, keys) → handles input & movement
    ├─ EnemyManager.update(dt, player) → spawns & updates enemies
    └─ Game.checkCollisions() → handles combat
        ├─ Weapon attacks
        ├─ Enemy damage
        ├─ XP/Gold rewards
        └─ Death/Level complete checks
    ↓
Render Phase
    ├─ RenderSystem.render() → clears canvas
    ├─ renderGrid() → visual aid
    ├─ renderEnemies() → all active enemies with health bars
    ├─ renderPlayer() → player with health bar
    └─ renderHUD() → stats, weapon info, combat stats

State Management: Game.state → MENU/PLAYING/PAUSED/LEVEL_COMPLETE/GAME_OVER
```

## Adding New Features

### 1. Adding a New Weapon

**Step 1**: Edit `js/data/weaponData.js`
```javascript
export const weaponData = {
    // ... existing weapons
    newWeapon: {
        name: '💫 Plasma Cannon',
        emoji: '💫',
        damage: 35,
        attackSpeed: 1.8,
        range: 350,
        area: 120,
        cost: 250,
        description: 'High-tech plasma weapon with massive area'
    }
};
```

**Step 2**: Add perks if needed (optional)
```javascript
export const perkData = {
    // ... existing perks
    plasmaBurst: {
        name: 'Plasma Burst 💥',
        description: '+20% Area Damage for plasma weapons',
        effect: { areaMultiplier: 1.2 },
        cost: 140
    }
};
```

**Step 3**: Update player to unlock weapon
Edit `js/entities/Player.js` constructor:
```javascript
// When player reaches certain level
if (this.level >= 5) {
    this.availableWeapons.push('newWeapon');
}
```

### 2. Adding a New Enemy Type

**Step 1**: Edit `js/data/enemyData.js`
```javascript
export const enemyData = {
    // ... existing enemies
    phoenix: {
        emoji: '🔥',
        name: 'Phoenix',
        width: 56,
        height: 56,
        speed: 160,
        health: 90,
        maxHealth: 90,
        damage: 9,
        armor: 2,
        collisionRadius: 28,
        xpReward: 100,
        goldReward: 120,
        rarity: 'epic'
    }
};

// Update spawn weights
export const enemySpawnWeights = {
    // ... existing weights
    phoenix: 4
};
```

**Step 2**: Enemy is automatically available
The EnemyManager uses weighted random selection, so new enemies spawn automatically!

### 3. Adding a New Level

**Step 1**: Edit `js/data/levelData.js`
```javascript
export const levelData = [
    // ... existing levels
    {
        level: 6,
        name: '🌌 Cosmic Void',
        maxTime: 180,
        baseEnemySpawnRate: 4.0,
        maxEnemies: 25,
        enemyHealthMultiplier: 2.2,
        enemyDamageMultiplier: 2.0,
        enemySpeedMultiplier: 1.5,
        xpMultiplier: 3.0,
        description: 'The final frontier - cosmic horrors await'
    }
];
```

### 4. Adding a New Perk

**Step 1**: Edit `js/data/weaponData.js`
```javascript
export const perkData = {
    // ... existing perks
    ricochet: {
        name: 'Ricochet 🎯',
        description: 'Attacks bounce to nearby enemies',
        effect: { 
            ricochetchance: 0.5,
            ricochetRange: 150
        },
        cost: 150
    }
};
```

**Step 2**: Implement perk effect in `js/core/Game.js` checkCollisions()
```javascript
// In checkCollisions, after dealing damage:
if (this.player.currentWeapon.ricochetChance && 
    Math.random() < this.player.currentWeapon.ricochetchance) {
    // Find nearby enemy and hit it
}
```

## Modification Examples

### Change Game Difficulty

Edit `js/data/levelData.js`:
```javascript
// Make level 1 harder
{
    level: 1,
    baseEnemySpawnRate: 2.5,  // was 1.5
    maxEnemies: 8,             // was 5
    enemyHealthMultiplier: 1.3 // was 1.0
}
```

### Adjust Player Stats

Edit `js/data/playerData.js`:
```javascript
export const playerData = {
    width: 64,
    height: 64,
    speed: 400,  // was 300 - faster player
    collisionRadius: 28
};
```

### Change Weapon Balance

Edit `js/data/weaponData.js`:
```javascript
bow: {
    damage: 25,          // was 20
    attackSpeed: 1.0,    // was 1.2
    range: 500,          // was 400
    // ...
}
```

### Tweak Enemy Difficulty

Edit `js/data/enemyData.js`:
```javascript
troll: {
    speed: 110,          // was 90
    health: 50,          // was 60
    damage: 12,          // was 8
    // ...
}
```

## Performance Tips

### Object Pooling
The EnemyManager uses object pools to recycle enemy instances:
```javascript
// Efficient - reuses objects
const poolSize = 30;
this.pools[type] = new ObjectPooler(() => new Enemy(...), poolSize);
```

### Collision Optimization
Only check active enemies:
```javascript
// Good - only checks active
const enemies = this.enemyManager.getActiveEnemies();
for (let i = enemies.length - 1; i >= 0; i--) {
    // Only active enemies here
}
```

### Render Optimization
Use efficient rendering:
```javascript
// Drawing emojis is faster than images
ctx.fillText('🧌', x, y);

// Simple rectangles for shapes
ctx.fillRect(x, y, w, h);
```

## Common Issues & Solutions

### Weapon attacks not hitting?
Check weapon range calculation:
```javascript
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < this.player.currentWeapon.getEffectiveRange()) {
    // Attack code
}
```

### Enemies not appearing?
Check spawn parameters:
```javascript
// EnemyManager.spawn(x, y, enemyType)
// x, y should be within or near game bounds
this.enemyManager.spawn(player.x + 400, player.y, 'goblin');
```

### UI not showing?
Check HTML element IDs:
```javascript
// Element IDs must match HTML
document.getElementById('gameOverMenu')  // Check exists
document.getElementById('levelCompleteMenu')
```

### Audio not playing?
Audio files are optional - game works without them:
```javascript
// AudioManager gracefully handles missing files
audio.onerror = () => {
    console.log(`Audio failed (optional)`);
    resolve();  // Don't fail the game
}
```

## Extension Ideas

### Difficulty Settings
Add pre-defined difficulty presets:
```javascript
const difficulties = {
    easy: { healthMult: 0.7, damageMult: 0.8, ... },
    normal: { healthMult: 1.0, damageMult: 1.0, ... },
    hard: { healthMult: 1.5, damageMult: 1.5, ... },
    insane: { healthMult: 2.0, damageMult: 2.0, ... }
};
```

### Skill Trees
Implement permanent upgrades:
```javascript
class SkillTree {
    constructor() {
        this.skills = {
            health: { level: 0, maxLevel: 5, cost: (level) => level * 100 },
            damage: { level: 0, maxLevel: 3, cost: (level) => level * 150 },
            // ...
        };
    }
    
    upgrade(skillName) {
        if (this.player.gold >= this.skills[skillName].cost(...)) {
            this.skills[skillName].level++;
        }
    }
}
```

### Shop System
Allow permanent weapon/perk purchases:
```javascript
class Shop {
    purchasePerk(perkName, player) {
        if (player.gold >= perkData[perkName].cost) {
            player.gold -= perkData[perkName].cost;
            player.addPerk(perkData[perkName].effect);
            return true;
        }
        return false;
    }
}
```

### Status Effects
Add temporary buffs/debuffs:
```javascript
class StatusEffect {
    constructor(name, duration, effect) {
        this.name = name;
        this.duration = duration;
        this.effect = effect;
    }
    
    update(dt) {
        this.duration -= dt;
        return this.duration > 0;
    }
    
    apply(entity) {
        // Apply effect to entity
    }
}
```

### Boss Encounters
Special level-ending boss battle:
```javascript
class Boss extends Enemy {
    constructor(data) {
        super(data);
        this.phase = 1;
        this.attackPattern = [];
    }
    
    update(dt, player) {
        super.update(dt, player);
        
        if (this.health < this.maxHealth / 2) {
            this.phase = 2;
            this.speed *= 1.2; // Faster in phase 2
        }
    }
}
```

## Code Style Guide

### Naming Conventions
```javascript
// Classes: PascalCase
class EnemyManager { }
class RenderSystem { }

// Functions/Methods: camelCase
function updateGame() { }
enemy.takeDamage(10);

// Constants: SNAKE_CASE
const GAME_WIDTH = 1280;
const MAX_LEVEL = 5;

// Private: _camelCase
function _internalHelper() { }
```

### File Organization
```javascript
// 1. Imports
import { Game } from './Game.js';

// 2. Constants
const MAX_SIZE = 100;

// 3. Class definition
export class MyClass {
    constructor() { }
    method1() { }
    method2() { }
}

// 4. Exports
export { MyClass };
```

## Testing

### Manual Testing Checklist
- [ ] Game starts from menu
- [ ] Player can move in all directions
- [ ] Enemies spawn correctly
- [ ] Combat deals damage
- [ ] XP system works
- [ ] Leveling up increases health
- [ ] Level complete on timer
- [ ] Game over when health = 0
- [ ] Pause/resume works
- [ ] Return to menu works
- [ ] Stats display correctly
- [ ] Weapon switching works (if implemented)

### Performance Testing
```javascript
// Check FPS in console
console.time('frameTime');
// ... one frame ...
console.timeEnd('frameTime');

// Monitor enemy count
console.log('Active enemies:', game.enemyManager.getActiveEnemies().length);
```

## Git Commit Messages

```
✨ Add new weapon type: Plasma Cannon
🔧 Balance level 2 difficulty
🐛 Fix weapon range calculation
📚 Add documentation for shop system
♻️ Refactor collision system
🎨 Update HUD styling
🚀 Optimize enemy pooling
```

Have fun extending the game! ⚔️
