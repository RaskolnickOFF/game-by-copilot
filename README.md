# ⚔️ Epic Dungeon Slayer - Enhanced Game

A comprehensive vanilla JavaScript roguelike action game with progression, multiple enemy types, diverse weapons, and perks.

## 🎮 Game Features

### Player Progression
- **Leveling System**: Gain XP from defeated enemies to level up
- **Health Scaling**: Max health increases with each level
- **Gold System**: Collect gold from defeated enemies
- **Bloodlust Bonus**: +5% damage multiplier per consecutive enemy kill (resets on player death)

### Weapons (6 Types)
1. **⚔️ Sword** - Balanced weapon, quick strikes
   - Damage: 15 | Speed: 0.8/s | Range: 60
2. **🏹 Bow** - Long-range projectile weapon
   - Damage: 20 | Speed: 1.2/s | Range: 400
3. **✨ Wand** - AoE magic damage
   - Damage: 25 | Speed: 1.5/s | Range: 300 | Area: 80
4. **🔨 Hammer** - Massive slow damage with huge area
   - Damage: 30 | Speed: 2.0/s | Range: 40 | Area: 100
5. **🗡️ Dual Daggers** - Rapid rapid-fire strikes
   - Damage: 10 | Speed: 0.3/s | Range: 45
6. **🔮 Staff** - Balanced magic option
   - Damage: 22 | Speed: 1.0/s | Range: 250

### Enemy Types (8 Varieties)
- **🧌 Goblin** - Common weak enemy
- **👹 Orc** - Uncommon stronger threat
- **🗻 Troll** - Rare heavy tank
- **🐉 Dragon** - Epic powerful boss
- **🧙 Necromancer** - Epic spellcaster
- **🕷️ Spider** - Uncommon fast enemy
- **💀 Skeleton** - Uncommon undead
- **😈 Demon** - Epic dangerous threat

### Weapon Perks (8 Available)
Perks can be gained to enhance weapons:
- **Sharp Blade 🔪** - +15% Damage (50 gold)
- **Swift Strike ⚡** - +20% Attack Speed (60 gold)
- **Long Reach 📍** - +30% Range (70 gold)
- **Mighty Swing 💪** - +25% Area Damage (80 gold)
- **Life Steal 🩸** - Heal 25% of damage dealt (100 gold)
- **Armor Breaker ⛓️** - Ignore 30% of enemy armor (90 gold)
- **Double Strike 🎯** - 20% chance to attack twice (120 gold)
- **Bloodlust 🔥** - +5% damage per enemy killed (110 gold)

### Levels (5 Progressively Difficult)
1. **🌲 Forest of Goblins** - Tutorial level with weak enemies
2. **🏰 Castle Ruins** - Orc invasion
3. **⛰️ Mountain Stronghold** - Troll territory
4. **🌑 Shadow Realm** - Demon realm
5. **🔥 Dragon's Lair** - Ultimate challenge

### Combat System
- **Range-based Combat**: Each weapon has effective range
- **Area Damage**: Weapons deal area damage at impact
- **Armor System**: Enemies have armor to reduce damage
- **Life Steal**: Some perks can heal from damage dealt
- **Double Strike**: Chance to attack twice with perks
- **Collision-based**: Simple hitbox collision detection

### HUD Display
- Real-time player stats (HP, XP, Level)
- Current weapon and stats
- Enemies killed counter
- Total damage dealt
- Bloodlust multiplier display
- XP progress bar

## 🎮 How to Play

###  Controls
- **⬆️⬇️⬅️➡️ / WASD** - Move character
- **ESC** - Pause/Resume
- **Numbers 1-6** - Switch weapons (if unlocked)

### Objective
Survive for the level timer to complete each level and advance. Defeat enemies to gain XP and gold. Level up to increase stats and unlock new weapons/perks.

### Strategy
1. Start with the Sword (balanced, easy to use)
2. Defeat enemies to earn XP and gold
3. Use range weapons to kite incoming enemies
4. Collect gold to purchase perks
5. Combine perks strategically (e.g., Attack Speed + Double Strike)
6. Progress through levels with increasing difficulty

## 📁 Project Structure

```
the-game/
├── index.html                    # Main HTML file
├── css/
│   └── styles.css               # Game styling
├── js/
│   ├── main.js                  # Entry point
│   ├── core/
│   │   ├── Game.js              # Main game loop & logic
│   │   └── constants.js         # Game constants
│   ├── entities/
│   │   ├── Player.js            # Player class with progression
│   │   ├── Enemy.js             # Enemy entity with armor system
│   │   └── Weapon.js            # Weapon class with perks
│   ├── data/
│   │   ├── playerData.js        # Player stats config
│   │   ├── enemyData.js         # Enemy types & spawn weights
│   │   ├── weaponData.js        # Weapons & perks config
│   │   └── levelData.js         # Level configurations
│   ├── managers/
│   │   ├── Game.js              # Main game controller
│   │   ├── EnemyManager.js      # Enemy spawning & AI
│   │   ├── AudioManager.js      # Sound effects
│   │   ├── ImageManager.js      # Image loading
│   │   └── UIManager.js         # UI state management
│   ├── systems/
│   │   └── RenderSystem.js      # Canvas rendering with emojis
│   └── utils/
│       └── ObjectPooler.js      # Object pooling for performance
└── audio/                        # Sound effects (optional)
```

## 🔧 Technical Highlights

### Performance Optimizations
- **Object Pooling**: Efficiently reuse enemy objects
- **Emoji Rendering**: No image assets required
- **Optimized Collisions**: Only active enemies checked
- **Delta Time**: Frame-rate independent gameplay

### Modular Architecture
- **Data-driven**: All game values in config files
- **Manager Pattern**: Separate managers for game systems
- **Entity System**: Clean Player/Enemy classes
- **Event-based**: Audio and UI through manager calls

## 🎨 Visual Features
- Emoji-based graphics (no image dependencies)
- Health bars for player and enemies
- Damage flash effects on hit
- Dynamic HUD with real-time stats
- Color-coded UI elements

## 📊 Game Difficulty Scaling
Each level multiplies:
- Enemy Health: 1.0x → 2.0x
- Enemy Damage: 1.0x → 1.8x
- Enemy Speed: 1.0x → 1.4x
- XP Rewards: 1.0x → 2.5x

## 🚀 Future Enhancement Ideas
- Shop system to purchase perks with gold
- Skill trees for character progression
- Boss battles with unique mechanics
- Procedurally generated maps
- Leaderboard system
- Sound effects and music
- Particle effects for attacks
- Status effects (poison, freeze, etc.)
- Consumable items (potions, buffs)
- Multiplayer support

## 📝 Development Notes

### Adding New Weapons
Edit `js/data/weaponData.js`:
```javascript
newWeapon: {
    name: '🆕 New Weapon',
    damage: 20,
    attackSpeed: 1.0,
    range: 150,
    area: 60,
    cost: 100
}
```

### Adding New Enemies
Edit `js/data/enemyData.js`:
```javascript
newEnemy: {
    emoji: '👹',
    name: 'New Enemy',
    health: 50,
    damage: 5,
    armor: 1,
    // ... other properties
}
```

### Adding New Levels
Edit `js/data/levelData.js` and add to the `levelData` array.

## 🎓 Learning Goals
This project demonstrates:
- Object-oriented game design in JavaScript
- Game loops and delta time
- Collision detection
- Entity management and pooling
- Audio/UI management
- Canvas rendering
- Game progression systems
- Difficulty scaling

Enjoy the game! ⚔️
