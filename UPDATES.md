# 🎮 Corpse & Enemy Behavior Update - What's New

## 🔥 CRITICAL FIX: Attacks Now Work!
Your attack problem is solved! Changed weapon initialization so attacks work from the start.

**What was wrong:** The weapon cooldown system was preventing all attacks
**What's fixed:** Attacks now fire immediately when you get close to enemies

---

## 👹 Enemy Behaviors - 4 Different Types

### 🧌 **NORMAL Enemies** (Goblin, Skeleton)
- Simply walk toward you
- Predictable, straightforward threat
- No special tactics

### 👹 **AGGRESSIVE Enemies** (Orc, Troll, Dragon)
- Charge at you relentlessly
- No retreat, no hesitation
- Most dangerous type
- **Tip:** Keep distance with ranged weapons

### 😈 **SCAVENGER Enemies** (Necromancer, Demon)
- They EAT CORPSES TO HEAL! 🍽️💀
- If wounded, they search for bodies
- Can become stronger by eating your kills
- **Tip:** Kill them fast or loot corpses before they do!

### 🕷️ **COWARD Enemies** (Spider)
- Runs away when health < 30%
- Stays aggressive at full health
- Can be kited to different areas
- **Tip:** Chase them when they flee - easy kills!

---

## 🪦 Corpse System - Bodies Persist!

### What Happens When You Kill:
1. Enemy dies → **Corpse appears** (💀 emoji)
2. Corpse stays for **20 seconds** (fades over time)
3. **Auto-loot when close** (< 80 pixels):
   - Restore ~30% health from corpse
   - Get bonus gold
   - Corpse disappears
4. **Scavengers might eat it** first! ⚠️

### Corpse Colors = Enemy Rarity:
- 🟣 **Purple** = Epic (Dragon, Demon, Necromancer)
- 🟠 **Orange** = Rare (Troll)
- 🟢 **Green** = Uncommon (Orc, Spider, Skeleton)
- 🟤 **Gray** = Common (Goblin)

### Gold Indicator 💰:
- Shows **💰** on corpse if gold was dropped
- Extra gold reward for looting corpse

---

## 🎯 NEW STRATEGIC GAMEPLAY

### Decision Points:
```
Enemy Dies → Corpse Appears
     ↓
Should I:
├─ Loot it now? (get healing + gold)
├─ Let it stay? (deny scavengers, maybe get more later)
├─ Rush it before scavenger? (race mechanics)
└─ Use as marker? (know where enemies came from)
```

### Scavenger Mind Game:
- **Problem:** Necromancers and Demons heal by eating corpses
- **Solution:** Either:
  1. Loot fast (race them to the body)
  2. Kill them before they reach corpses
  3. Area denial (don't let them near your kills)

### Dynamic Encounters:
- Level fills with **corpse mountains** after battle
- Scavengers strategically position near them
- You decide: heal now or deny them health?

---

## 🕹️ How to Test It

### Test 1: Attack System Works ✅
1. Start game
2. Move close to any enemy
3. **Attack button should trigger automatically!**
4. Enemy should take damage and show red flash
5. Health bar should decrease

### Test 2: Corpse Persistence ✅
1. Kill a goblin (should be easy now)
2. **Corpse stays on ground** (💀 emoji)
3. Walk around it, corpse fades slowly
4. After 20 seconds, it disappears

### Test 3: Auto-Looting ✅
1. Kill enemy, leave corpse
2. Walk within 80 pixels of corpse
3. **Corpse automatically loots**
4. You see health restored
5. Corpse disappears with "hit" sound

### Test 4: Scavenger Behavior ✅
1. Play until Necromancer or Demon spawns (Level 2+)
2. Kill enemy, create corpse
3. Let scavenger approach corpse
4. Watch as **scavenger eats the body** and heals
5. Now the enemy is stronger! Build challenge.

### Test 5: Coward Spider ✅
1. Find a Spider (🕷️) 
2. Damage it heavily (< 30% health)
3. Watch it **run away** instead of attacking
4. Chase it, it retreats
5. Easy kill while it escapes

---

## 🎮 Updated Controls

- **WASD / Arrow Keys** = Move (as before)
- **ESC** = Pause
- **1-6** = Switch weapons
- **Close to corpse** = Auto-loot (automatic!)
- **Near scavenger** = They eat corpse automatically

---

## 📊 Enemy Difficulty by Behavior

| Behavior | How to Fight | Difficulty |
|----------|-------------|-----------|
| **Normal** | Direct combat | ⭐⭐ Easy |
| **Aggressive** | Keep distance, use range | ⭐⭐⭐ Medium |
| **Scavenger** | Kill fast, protect corpses | ⭐⭐⭐⭐ Hard |
| **Coward** | Chase when fleeing, avoid full health | ⭐ Very Easy |

---

## 🔧 What's Changed Under the Hood

### Fixed:
- ✅ Weapon attack cooldown (now allows immediate attack)
- ✅ Attack system (now functional from game start)

### Added:
- ✅ Corpse system with 20-second persistence
- ✅ Corpse Manager (tracks all bodies)
- ✅ Four enemy behavior types
- ✅ Scavenger eating corpses to heal
- ✅ Auto-loot when near corpses
- ✅ Colored corpse rendering by rarity
- ✅ Visual corpse fade effect
- ✅ Gold indicator on corpses

### Files Modified:
- `js/entities/Weapon.js` - Fixed attack timing
- `js/entities/Enemy.js` - Behaviors + corpse interaction
- `js/entities/Corpse.js` - NEW! Corpse class
- `js/data/enemyData.js` - Added behavior field
- `js/managers/CorpseManager.js` - NEW! Corpse management
- `js/managers/EnemyManager.js` - Corpse awareness
- `js/core/Game.js` - Corpse creation + looting
- `js/systems/RenderSystem.js` - Corpse rendering

---

## 💡 Tips for Success

1. **Learn to kite** - Keep distance from aggressive enemies
2. **Race for corpses** - Get to them before scavengers
3. **Use healing** - Loot corpses when low on health
4. **Plan spawns** - Corpses show where enemies came from
5. **Target scavengers** - Kill them before they heal
6. **Let cowards flee** - They're easy kills when running

---

## 🚀 What's Next?

This system enables future mechanics:
- Powered-up weapons from epic corpses
- Corpse explosions (AoE damage when looted)
- Corpse traps/mines
- Necromancer resurrection mechanics
- Corpse-based boss fights
- Advanced enemy AI coordination

---

## ⚠️ Known Behaviors

- **Corpses can overlap**: Multiple can be in same area (creates piles)
- **Gold indicator**: Only shows if enemy dropped gold
- **Scavenger priority**: Will prioritize eating over attacking if near corpse
- **Cowards flee instantly**: At < 30% health, they turn and run immediately

---

**Enjoy the enhanced game!** Now you can actually fight! ⚔️🪦🎮

The corpse system adds tactical depth - manage the battlefield, control resources, and outsmart your enemies!
