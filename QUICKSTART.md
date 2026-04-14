# Quick Start Guide

## 🚀 Getting Started

### 1. Run the Game
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Or use any local server of your choice
```

Then open: `http://localhost:8000`

### 2. First Game Session
1. Click **▶️ PLAY** on the title screen
2. Use **WASD** or **Arrow Keys** to move around
3. Get close to enemies and automatic attack will trigger
4. The **⚔️ Sword** weapon starts automatically
5. Defeat enemies to gain **XP** and **💰 Gold**
6. Level up to increase health and unlock new weapons

### 3. Understanding the HUD

```
Top-Left: Level name and player status
- Level: Current progression level
- 🎯 XP: Experience progress bar, leveling up
- ❤️ HP: Current health / Max health
- 💰 Gold: Currency for buying perks
- ⚔️ Weapon: Current equipped weapon and stats

Top-Right: Combat statistics
- Enemies Killed: Number defeated
- Damage Dealt: Total cumulative damage
- 🔥 Bloodlust: Damage multiplier bonus (resets on death)
```

### 4. Winning a Level
- Survive until the timer completes
- When the level timer ends, you'll advance to the next level
- Each level is progressively harder but rewards more XP

### 5. Game Over
- If your health reaches 0, you die
- Game Over screen shows your stats
- You can restart from Level 1 or return to menu

## 🎮 Basic Strategy Tips

### Weapon Selection
- **Early Game**: Use Sword (balanced, reliable)
- **Ranged**: Use Bow or Staff if overwhelmed
- **Melee**: Hammer or Daggers for close combat
- **Magic**: Wand for AoE crowd control

### Combat Tips
1. **Kiting**: Move while attacking to avoid hits
2. **Group Management**: Don't get surrounded
3. **Range**: Use weapons with longer range to stay safe
4. **Movement**: Always keep moving
5. **Health Management**: Try to end level with full health

### Perk Combinations
- **Damage Build**: Sharp Blade + Bloodlust + Double Strike
- **Speed Build**: Swift Strike + Long Reach
- **Survival Build**: Life Steal on any weapon
- **Balanced**: One offensive + one defensive perk

## ⌨️ Advanced Controls

### Menu Navigation
- **ESC** - Pause game (full game pause)
- **Numbers 1-6** - Switch between unlocked weapons (if available)

### Debug/Development
- Console (F12) shows loading status and errors
- No image files needed (uses emojis!)

## 📊 Game Progression

### Levels Overview
| Level | Enemies | Difficulty | Boss |
|-------|---------|-----------|------|
| 1 | Goblins | ⭐ Easy | - |
| 2 | Orcs | ⭐⭐ Medium | - |
| 3 | Trolls | ⭐⭐⭐ Hard | - |
| 4 | Demons | ⭐⭐⭐⭐ Expert | - |
| 5 | Dragons | ⭐⭐⭐⭐⭐ Legendary | 🐉 |

### Enemy Rewards
- **🧌 Goblin**: 10 XP, 15 Gold
- **👹 Orc**: 30 XP, 40 Gold
- **🗻 Troll**: 60 XP, 80 Gold
- **🐉 Dragon**: 150 XP, 200 Gold
- **Others**: Proportional to difficulty

## 🔧 Customization

To modify game balance, edit these files:

### Player Stats
`js/data/playerData.js`
- Change starting speed, size, collision radius

### Weapon Properties
`js/data/weaponData.js`
- Adjust damage, attack speed, range
- Modify perk effects and costs

### Enemy Properties
`js/data/enemyData.js`
- Change enemy stats, spawn weights
- Adjust rewards

### Level Configuration
`js/data/levelData.js`
- Modify level duration, difficulty scaling
- Adjust enemy spawn rates

## ❓ Troubleshooting

### Game won't load?
- Check browser console (F12) for errors
- Ensure local server is running
- Try a different browser

### No audio?
- Audio files in `audio/` folder are optional
- Game works without sound
- Check if browser allows audio

### Enemies too fast/slow?
- Edit enemy speed in `js/data/enemyData.js`
- Adjust level multipliers in `js/data/levelData.js`

### Can't switch weapons?
- Weapons are unlocked through progression
- Currently only Sword is available at start
- Future: Gold shop to unlock more weapons

## 📚 Further Learning

The code demonstrates:
- Entity Component System patterns
- Game loop architecture
- Collision detection algorithms
- Object pooling optimization
- Data-driven game design
- Modular JavaScript structure

Enjoy! ⚔️ 🎮
