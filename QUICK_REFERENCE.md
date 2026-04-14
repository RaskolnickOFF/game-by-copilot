# 📖 Quick Reference - Epic Dungeon Slayer

## 🎮 Quick Controls
| Action | Key |
|--------|-----|
| Move Up/Down/Left/Right | W/S/A/D or Arrow Keys |
| Pause/Resume | ESC |
| Attack | Automatic when in range |
| Switch Weapons | Number Keys 1-6 |
| Confirm Menu | Click Button |

## ⚔️ All Weapons Quick Reference

| Emoji | Name | DMG | SPD | RNG | Area | Best For |
|-------|------|-----|-----|-----|------|----------|
| ⚔️ | Sword | 15 | 0.8 | 60 | 50 | Learning |
| 🏹 | Bow | 20 | 1.2 | 400 | 30 | Kiting |
| ✨ | Wand | 25 | 1.5 | 300 | 80 | Groups |
| 🔨 | Hammer | 30 | 2.0 | 40 | 100 | Tough mobs |
| 🗡️ | Daggers | 10 | 0.3 | 45 | 35 | Burst |
| 🔮 | Staff | 22 | 1.0 | 250 | 60 | Balanced |

## 🎭 All Enemies Quick Reference

| Emoji | Name | HP | SPD | DMG | ARM | XP | Gold | Rarity |
|-------|------|----|----|-----|-----|----|----|---------|
| 🧌 | Goblin | 15 | 150 | 3 | 0 | 10 | 15 | Common |
| 👹 | Orc | 30 | 120 | 6 | 2 | 30 | 40 | Uncommon |
| 🗻 | Troll | 60 | 90 | 8 | 4 | 60 | 80 | Rare |
| 🐉 | Dragon | 120 | 100 | 12 | 6 | 150 | 200 | Epic |
| 🧙 | Necromancer | 40 | 110 | 7 | 1 | 75 | 100 | Epic |
| 🕷️ | Spider | 20 | 180 | 4 | 0 | 20 | 25 | Uncommon |
| 💀 | Skeleton | 25 | 130 | 5 | 1 | 25 | 30 | Uncommon |
| 😈 | Demon | 80 | 140 | 10 | 3 | 120 | 150 | Epic |

## ⭐ All Perks Quick Reference

| Icon | Name | Effect | Cost |
|------|------|--------|------|
| 🔪 | Sharp Blade | +15% Damage | 50 |
| ⚡ | Swift Strike | +20% Attack Speed | 60 |
| 📍 | Long Reach | +30% Range | 70 |
| 💪 | Mighty Swing | +25% Area Damage | 80 |
| 🩸 | Life Steal | Heal 25% of damage | 100 |
| ⛓️ | Armor Breaker | Ignore 30% armor | 90 |
| 🎯 | Double Strike | 20% chance double hit | 120 |
| 🔥 | Bloodlust | +5% damage per kill | 110 |

## 📍 All Levels Quick Reference

| # | Name | Time | Max Enemies | Difficulty | Goal |
|---|------|------|-------------|------------|------|
| 1 | 🌲 Forest | 60s | 5 | 1.0x | Learn |
| 2 | 🏰 Castle | 75s | 8 | 1.2x | Practice |
| 3 | ⛰️ Mountain | 90s | 12 | 1.5x | Strategy |
| 4 | 🌑 Shadow | 120s | 15 | 1.8x | Focus |
| 5 | 🔥 Dragon's Lair | 150s | 20 | 2.0x | Master |

## 💡 Quick Tips

### Getting Started
1. Click Play - Start at Level 1
2. Use WASD to move
3. Get close to enemies - auto-attack
4. Defeat 5-10 goblins to level to 2
5. Each level increases challenge

### Combat Tips
- **Stay Mobile**: Constant movement = less damage taken
- **Range Matters**: Use Bow/Staff if overwhelmed
- **Group Control**: Avoid getting surrounded
- **Level Up**: Increases max health, essential for survival
- **Damage Multiplier**: +5% per kill (Bloodlust) - don't die!

### Best Builds
- **New Players**: Sword (learn) → Daggers (faster) → Staff (safe)
- **Aggressive**: Daggers + Sharp Blade + Double Strike + Bloodlust
- **Defensive**: Bow + Long Reach + Life Steal + Armor Breaker
- **Balanced**: Staff + Sharp Blade + Swift Strike + Long Reach

### Survival Tips
- End Level 1 with full health
- Stock up on health pickups (future feature)
- Use Life Steal perk for sustain
- Range weapons = safer play
- Attack speed > raw damage for most situations

## 📊 Progression Checklist

- [ ] Level 1: Defeat 20+ goblins, reach Level 3
- [ ] Level 2: Survive 75 seconds, reach Level 4
- [ ] Level 3: Get comfortable with mixed spawns
- [ ] Level 4: Handle demons without dying
- [ ] Level 5: Defeat at least one dragon!

## 🔧 For Modders

### Edit Player Balance
`js/data/playerData.js` → change `speed` value

### Edit Weapon Stats
`js/data/weaponData.js` → modify weapon properties

### Edit Enemy Difficulty
`js/data/enemyData.js` → adjust enemy stats

### Edit Level Difficulty
`js/data/levelData.js` → change multipliers and spawn rates

### Edit Perk Effects
`js/data/weaponData.js` → modify perk effect values

## 📈 Game Statistics in HUD

| Stat | Source | Location |
|------|--------|----------|
| Level | Player progression | Top-left |
| XP | Enemy defeats | Top-left (bar) |
| HP | Starting + equipment | Top-left |
| Gold | Enemy rewards | Top-left |
| Weapon | Current equipped | Top-left |
| Kills | Enemy defeats | Top-right |
| Damage | Combat dealt | Top-right |
| Bloodlust | Kill streaks | Top-right |

## 🎯 Difficulty Reference

| Level | Enemy Strength | Time Pressure | Crowd Size | Difficulty |
|-------|---|---|---|---|
| 1 | 1.0x | Low | 5 | ⭐ Very Easy |
| 2 | 1.2x | Medium | 8 | ⭐⭐ Easy |
| 3 | 1.5x | Medium | 12 | ⭐⭐⭐ Medium |
| 4 | 1.8x | High | 15 | ⭐⭐⭐⭐ Hard |
| 5 | 2.0x | Very High | 20 | ⭐⭐⭐⭐⭐ Expert |

## 🚀 Advanced Mechanics

### Damage Calculation
```
Damage = (Base × Perk Mult) × Weapon Mult × Bloodlust × Random(0.8-1.2)
```

### XP to Next Level
```
Current Level XP × 1.2 for Next Level
Example: Level 1 needs 100, Level 2 needs 120, Level 3 needs 144...
```

### Enemy Scaling (per level)
```
Level 1: No multiplier
Level 2: Health ×1.2, Damage ×1.15, Speed ×1.1
Level 3: Health ×1.5, Damage ×1.3, Speed ×1.2
Level 4: Health ×1.8, Damage ×1.5, Speed ×1.3
Level 5: Health ×2.0, Damage ×1.8, Speed ×1.4
```

### Gold & XP Rewards
```
XP = Enemy XP × Level Multiplier
Gold = Enemy Gold × Level Multiplier
```

## 🎨 Color Coding Guide

| Color | Meaning | Context |
|-------|---------|---------|
| 🟢 Green | High health | Health bar ≥ 66% |
| 🟡 Yellow | Medium health | Health bar 25%-66% |
| 🔴 Red | Low health | Health bar < 25% |
| 🔵 Blue | Player stat | HUD text |
| 🟠 Orange | Upgrade/Perk | Multiplier/bonus |
| 🟡 Gold | Important | Level/weapon info |

---

**Save this for quick reference while playing!** ⚔️🎮
