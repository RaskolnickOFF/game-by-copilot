# 🪦 Corpse & Enemy Behavior System - Complete Implementation

## ✅ What Was Fixed & Added

### 1. **Attack System Fixed** ⚔️
**Problem**: Players couldn't attack enemies - weapon cooldown was blocking all attacks
**Solution**: Changed weapon's `lastAttackTime` initialization from `0` to `-1000` so attacks can happen immediately

### 2. **Corpse System** 💀
Created a complete corpse mechanic system with:
- **Corpse Class** (`js/entities/Corpse.js`):
  - Corpses remain on battlefield for 20 seconds
  - Fade out as time passes (visual decay effect)
  - Color-coded by enemy rarity (Purple=Epic, Orange=Rare, Green=Uncommon, Gray=Common)
  - Display gold icon if corpse had gold reward
  - Can be looted for healing or consumed by enemies

### 3. **Enemy Behaviors** 👹
Each enemy type now has distinct AI behavior:

#### **Normal Behavior** (Goblin, Skeleton)
- Simply chase the player
- Basic forward movement toward player

#### **Aggressive Behavior** (Orc, Troll, Dragon)
- Always charge at player without hesitation
- No retreating or tactical movement
- Dangerous opponents

#### **Scavenger Behavior** (Necromancer, Demon)
- Eat corpses to heal themselves!
- If health < 80%, they search for nearby bodies
- Can consume player's kills to become stronger
- Strategic challenge: must prevent them from healing

#### **Coward Behavior** (Spider)
- Runs away when health drops below 30%
- Tries to create distance from player
- Still dangerous at full health, but retreats when wounded

### 4. **Corpse Looting System** 🏆
**Automatic Looting**:
- When player gets within 80 pixels of corpse, automatically loot it
- Get health restoration (30% of enemy's max health)
- Get bonus gold (20% of dropped gold)
- Corpse disappears after consumption

**Enemy Scavenging**:
- Scavenger enemies can eat corpses
- Gain 20 health per corpse consumed
- Creates interesting tactical situation:
  - Let corpses spawn dangerous enemies
  - Or rush to corpses before enemies eat them?

### 5. **Visual Feedback** 🎨
- **Corpses**: 💀 emoji that fades over 20 seconds
- **Rarity Colors**: Different colors based on enemy type
- **Gold Indicator**: 💰 icon shows if gold is being dropped
- **Auto-loot**: Corpse disappears with satisfying feedback

## 📊 Updated Files

### New Files:
- `js/entities/Corpse.js` - Corpse class with decay system
- `js/managers/CorpseManager.js` - Manages all corpses on field

### Modified Files:
1. **`js/entities/Weapon.js`**
   - Fixed: `lastAttackTime` initialization (-1000 instead of 0)
   - ✅ Attacks now work immediately!

2. **`js/entities/Enemy.js`**
   - Added: Behavior system (normal, aggressive, scavenger, coward)
   - Added: Corpse detection and eating
   - Added: Different movement logic per behavior type
   - Updated: `update()` method accepts corpses parameter

3. **`js/data/enemyData.js`**
   - Added: `behavior` field to each enemy type
   - Goblin: 'normal'
   - Orc: 'aggressive'
   - Troll: 'aggressive'
   - Dragon: 'aggressive'
   - Necromancer: 'scavenger'
   - Spider: 'coward'
   - Skeleton: 'normal'
   - Demon: 'scavenger'

4. **`js/managers/EnemyManager.js`**
   - Updated: `update()` accepts corpses and passes to enemies
   - All enemies now aware of corpses

5. **`js/core/Game.js`**
   - Added: CorpseManager instance
   - Added: Corpse creation when enemies die
   - Added: `handleCorpseLoot()` method for looting mechanics
   - Updated: `checkCollisions()` creates corpses instead of removing enemies
   - Updated: Render call passes corpses
   - Updated: `update()` calls corpse loot handler

6. **`js/systems/RenderSystem.js`**
   - Added: `renderCorpses()` method with fade effect
   - Added: Rarity-based coloring
   - Added: Gold indicator rendering
   - Updated: Main `render()` accepts and processes corpses

## 🎮 New Gameplay Mechanics

### Player Strategy
1. **Corpse Management**: Decide when to loot vs let enemies eat
2. **Damage Output**: More enemies spawn initially → corpse mountains
3. **Health Sustain**: Use corpses as healing supply
4. **Enemy Feeding**: Prevent scavengers from healing

### Enemy Strategy
**Scavengers (Necromancer, Demon)**
- Become harder to kill if allowed to eat corpses
- Must be killed quickly before they heal
- Creates interesting "prevent healing" mechanic

**Aggressive (Orc, Troll, Dragon)**
- Ignore corpses, focus on player
- Pure damage threat

**Cowards (Spider)**
- Tactical retreat when wounded
- Can be kited to corpses to escape

**Normal (Goblin, Skeleton)**
- Balanced threat, straightforward

## 💡 Tactical Considerations

**If you let scavengers eat corpses:**
- ❌ Enemies get stronger
- ❌ Hard to kill them later
- ❌ Compound effect: more healed = more health overall
- ✅ But corpses disappear (less clutter)

**If you loot all corpses quickly:**
- ✅ You heal/get gold
- ✅ Enemies can't eat them
- ✅ Scavengers stay weak
- ❌ Have to get close to bodies
- ❌ Risky with enemies chasing

**Strategy Balance:**
- Use as healing source when low HP
- Prevent scavengers from healing up
- Let aggressive enemies walk past corpses
- Use corpse density to control enemy positions

## 🎯 How to Play with New System

1. **Start Fight**: Enemies spawn normally
2. **Kill Enemy**: Corpse appears on ground (fading 💀)
3. **Loot Corpse**: Get within 80px → automatic loot → health restored
4. **Scavenger Arrives**: Necromancer/Demon might eat corpse
5. **Strategic Moment**: 
   - If corpse available → loot it (heal yourself)
   - If scavenger approaching → rush it first
   - Or let corpse stay → deny them healing

## 🚀 Future Enhancements

Possible additions using this system:
- Corpse explosions (AoE damage when loot)
- Powered-up weapons from rare corpses
- Cursed corpses (deal damage when looting)
- Necromancer raises corpses as minions
- Corpse barricades to block enemies
- Corpse bombs (throw them at enemies)

## 📝 Code Examples

### Checking Corpse Availability
```javascript
const corpses = this.corpseManager.getActiveCorpses();
corpses.forEach(corpse => {
    console.log(`Corpse with ${corpse.goldDropped} gold`);
});
```

### Adding New Behavior
```javascript
// In enemyData.js
myEnemy: {
    emoji: '👾',
    behavior: 'my_behavior', // New type!
    // ... other stats
}

// In Enemy.js update()
if (this.behavior === 'my_behavior') {
    // Custom movement logic
}
```

### Creating Custom Corpse Effect
```javascript
const loot = corpse.getLoot();
// loot = { health: X, gold: Y, xp: Z }
// Apply custom effect before consuming
corpse.consume();
```

## ✨ Summary

The game now has:
- ✅ **Working combat** (attacks fixed)
- ✅ **Corpse persistence** (bodies stay 20 seconds)
- ✅ **Smart enemies** (4 behavior types)
- ✅ **Looting system** (automatic near corpses)
- ✅ **Enemy feeding** (scavengers eat bodies)
- ✅ **Visual feedback** (fading, colored corpses)
- ✅ **Strategic depth** (corpse management gameplay)

Enjoy the battle! ⚔️💀🏆
