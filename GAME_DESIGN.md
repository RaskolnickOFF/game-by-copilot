# 🎮 Game Design Document - Epic Dungeon Slayer

## High Concept
A fast-paced, emoji-based dungeon crawler where players defeat increasingly challenging enemies to level up, acquire weapons and perks, and progress through 5 levels of increasing difficulty.

## Core Gameplay Loop
```
Start Game → Move/Attack → Defeat Enemies → Gain XP → Level Up → Survive Level Timer → Next Level
```

## Game Progression Structure

```
LEVEL 1 (Tutorial)
├─ Duration: 60 seconds
├─ Enemies: Goblins (mainly)
├─ Difficulty: 1.0x
├─ Max Enemies: 5
└─ Goal: Survive and learn mechanics

LEVEL 2
├─ Duration: 75 seconds
├─ Enemies: Mixed with Orcs
├─ Difficulty: 1.2-1.3x
├─ Max Enemies: 8
└─ Goal: Get comfortable with combat

LEVEL 3
├─ Duration: 90 seconds
├─ Enemies: Trolls appear
├─ Difficulty: 1.5-1.8x
├─ Max Enemies: 12
└─ Goal: Start using strategy

LEVEL 4
├─ Duration: 120 seconds
├─ Enemies: Demons introduced
├─ Difficulty: 1.8-2.0x
├─ Max Enemies: 15
└─ Goal: Test mastery

LEVEL 5
├─ Duration: 150 seconds
├─ Enemies: Dragons included
├─ Difficulty: 2.0-2.5x
├─ Max Enemies: 20
└─ Goal: Ultimate challenge - survive!
```

## Combat System Flow

```
Player in Range?
    │
    ├─ YES → Weapon Cooldown Ready?
    │         │
    │         ├─ YES → Generate Damage
    │         │         │
    │         │         ├─ Base Damage × Weapon Multiplier × Bloodlust
    │         │         ├─ Apply Double Strike Chance
    │         │         ├─ Apply Enemy Armor Reduction
    │         │         ├─ Deal Damage to Enemy
    │         │         ├─ Check if Life Steal → Heal
    │         │         ├─ Check Enemy Death
    │         │         │  ├─ YES → Award XP/Gold
    │         │         │  └─ NO → Continue
    │         │         └─ Record Attack Time
    │         │
    │         └─ NO → Wait for cooldown
    │
    └─ NO → No damage
```

## Player Attributes & Growth

```
Initial Stats
├─ Level: 1
├─ Health: 100
├─ Speed: 300 px/s
├─ XP: 0 / 100
├─ Gold: 0
└─ Weapon: Sword

After Level Up
├─ Level: +1
├─ Health: +15 base
├─ XP Threshold: × 1.2 multiplier
├─ Weapon Stats: Can improve (future perks)
└─ Available Weapons: Unlock new types

At Level 5
├─ Health: ~160 base
├─ XP Threshold: 195 (from 100)
├─ Speed: 300 px/s (unchanged)
└─ Potential: 8 perks applied
```

## Weapon Damage Calculation

```
Final Damage = (Base Damage + Perk Bonus) × Damage Multiplier × Bloodlust Multiplier

Example - Sword with Sharp Blade + Level 3 Bloodlust:
= (15 + 2.25) × 1.15 × (1 + 0.05×3)
= 17.25 × 1.15 × 1.15
= 22.8 damage per hit (rounded to 23)
```

## Enemy Armor Reduction

```
Effective Armor = Max(0, Base Armor × (1 - Armor Penetration))
Actual Damage = Max(1, Player Damage - Effective Armor)

Example - Dragon with Armor Breaker perk:
= Max(0, 6 × (1 - 0.3))
= 6 × 0.7 = 4.2 armor
Actual Damage = Player Damage (25+) - 4 = 21+
```

## Level Difficulty Scaling

```
Level 1: 1.0x all multipliers
Level 2: 
├─ Enemy Health: ×1.2
├─ Enemy Damage: ×1.15
├─ Enemy Speed: ×1.1
└─ XP Reward: ×1.3

Level 3:
├─ Enemy Health: ×1.5
├─ Enemy Damage: ×1.3
├─ Enemy Speed: ×1.2
└─ XP Reward: ×1.6

Level 5:
├─ Enemy Health: ×2.0
├─ Enemy Damage: ×1.8
├─ Enemy Speed: ×1.4
└─ XP Reward: ×2.5
```

## Weapon Comparison Matrix

```
┌─────────────┬────────┬───────┬────────┬─────────┬─────────┐
│ Weapon      │ DMG    │ SPD   │ Range  │ Area    │ Use     │
├─────────────┼────────┼───────┼────────┼─────────┼─────────┤
│ ⚔️ Sword    │ 15     │ 0.8   │ 60     │ 50      │ Game    │
│ 🏹 Bow      │ 20     │ 1.2   │ 400    │ 30      │ Kiting  │
│ ✨ Wand     │ 25     │ 1.5   │ 300    │ 80      │ Groups  │
│ 🔨 Hammer   │ 30     │ 2.0   │ 40     │ 100     │ Bosses  │
│ 🗡️ Daggers  │ 10     │ 0.3   │ 45     │ 35      │ Burst   │
│ 🔮 Staff    │ 22     │ 1.0   │ 250    │ 60      │ Balanced│
└─────────────┴────────┴───────┴────────┴─────────┴─────────┘

SPD = Attacks per second
```

## Enemy Threat Assessment

```
Threat Level Analysis:

LOW THREAT (Early Game)
├─ 🧌 Goblin: 15 HP, 80 speed, 3 damage
├─ 🕷️ Spider: 20 HP, 180 speed, 4 damage
└─ 💀 Skeleton: 25 HP, 130 speed, 5 damage

MEDIUM THREAT (Mid Game)
├─ 👹 Orc: 30 HP, 120 speed, 6 damage
├─ 🧙 Necromancer: 40 HP, 110 speed, 7 damage
└─ Goal: No longer one-shottable

HIGH THREAT (Victory Conditions)
├─ 🗻 Troll: 60 HP, 90 speed, 8 damage
├─ 😈 Demon: 80 HP, 140 speed, 10 damage
└─ 🐉 Dragon: 120 HP, 100 speed, 12 damage
```

## Perk Synergies

```
OFFENSIVE BUILD (Maximum Damage)
1. Sharp Blade (+15% damage)
2. Bloodlust (+5% per kill, stacks)
3. Double Strike (20% double hit)
Real Damage: 15 × 1.15 × 1.3+ × 1.2 average = 27-35 DPS

DEFENSIVE BUILD (Survival)
1. Long Reach (+30% range, safer)
2. Life Steal (25% heal from damage)
3. Armor Breaker (30% enemy armor reduction)
Role: Tank/Sustain, fewer kills but longer survival

SPEED BUILD (Kiting)
1. Swift Strike (+20% attack speed)
2. Long Reach (+30% range)
3. Double Strike (20% bonus hits)
Role: Fast attacker, hit and run

BALANCED BUILD (Recommended for New Players)
1. Sharp Blade (damage boost)
2. Swift Strike (attack speed boost)
3. Life Steal (survival tool)
```

## HUD Information Hierarchy

```
TOP LEFT - Player Status
├─ Level Name (Navigation)
├─ Level & XP Progress
├─ Health Bar + Number
├─ Gold Counter
├─ Current Weapon Stats
└─ Weapon Modifiers

TOP RIGHT - Combat Statistics
├─ Enemies Defeated Count
├─ Total Damage Dealt
└─ Bloodlust Multiplier (if active)

BOTTOM CENTER - Game Timer
└─ Minutes : Seconds
```

## Victory/Defeat Conditions

```
VICTORY (Complete Level)
├─ Survive until level timer reaches 0
├─ No enemy requirement
├─ Bonus: Heal player 100% for next level
└─ Next Level Available

DEFEAT (Player Death)
├─ Player Health ≤ 0
├─ Stats Recorded
├─ Unlock: Restart or Return to Menu
└─ Stats Reset (except unlocks potentially)
```

## Customization Options

### Difficulty Tuning Knobs
```javascript
// js/data/levelData.js
baseEnemySpawnRate: 1.5    // Enemies/second
maxEnemies: 5              // Simultaneous enemies
maxTime: 60                // Level duration (seconds)
enemyHealthMultiplier: 1.0 // Enemy durability
enemyDamageMultiplier: 1.0 // Enemy threat
enemySpeedMultiplier: 1.0  // Enemy speed
xpMultiplier: 1.0          // Reward scaling
```

### Weapon Balance Knobs
```javascript
// js/data/weaponData.js
damage: 15           // Damage per hit
attackSpeed: 0.8     // Hits per second
range: 60            // Attack range (pixels)
area: 50             // AoE damage radius
cost: 0              // Gold cost (if shop purchased)
```

### Player Settings
```javascript
// js/data/playerData.js
speed: 300           // Movement speed px/s
width: 64            // Hitbox width
height: 64           // Hitbox height
collisionRadius: 28  // Effective collision radius
```

## Future Enhancement Possibilities

```
TIER 1 (Easy to implement)
├─ Sound effects
├─ Particle effects on hit
├─ Enemy knockback
├─ Screen shake on mega hits
└─ Power-ups

TIER 2 (Medium complexity)
├─ Gold shop to unlock weapons
├─ Skill tree with permanent upgrades
├─ Boss encounters
├─ Multiple difficulty settings
└─ High score leaderboard

TIER 3 (Complex systems)
├─ Procedurally generated levels
├─ New enemy types with special mechanics
├─ Active abilities beyond attacks
├─ Inventory system
├─ Co-op multiplayer
└─ Story/Campaign progression
```

## Balance Philosophy

The game balances:
1. **Accessibility**: Start easy (Level 1), learn mechanics
2. **Progression**: Each level 20-30% harder
3. **Variety**: Multiple viable weapons/builds
4. **Skill Expression**: Timing and positioning matter
5. **Replayability**: Different runs feel different

---

This design document serves as the foundation for the Epic Dungeon Slayer game. All mechanics, values, and systems are data-driven and easily customizable through the configuration files.
