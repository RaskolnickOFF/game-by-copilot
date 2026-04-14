# 🐛 Troubleshooting - Corpse & Enemy Behavior System

## ✅ If Attacks Still Don't Work

### Check 1: Verify Weapon Timing is Fixed
**File**: `js/entities/Weapon.js`
**Line**: Should have `this.lastAttackTime = -1000;`
```javascript
// Check for this:
this.lastAttackTime = -1000;  // ✅ CORRECT - allows immediate attack
// NOT this:
this.lastAttackTime = 0;      // ❌ WRONG - blocks initial attacks
```

### Check 2: Verify Game is Calling Attacks
1. Open browser console (F12)
2. Look for any error messages
3. Check that you're in PLAYING state (not MENU/PAUSED)
4. Verify distance < weapon range

### Check 3: Test Attack Range
- **Sword**: Need to be very close (60px)
- **Bow**: Can be far away (400px)
- Try Sword first - easier to get in range

### Check 4: Verify Enemy Spawned
- Bottom-left HUD should show "Enemies Killed: 0"
- You should see enemy emoji on screen
- Health bars appear under enemies

---

## ✅ If Corpses Don't Appear

### Check 1: Did You Kill an Enemy?
- Kill counter at top-right should increase
- Health bars should disappear when enemy dies
- "kill" sound should play

### Check 2: Verify Corpse is Rendering
**File**: `js/systems/RenderSystem.js`
**Method**: Should have `renderCorpses(corpses)` called

Check browser console for errors related to rendering

### Check 3: Try Getting Close to Spawn Point
- Even if you don't see it, walk around the area
- If you hear "hit" sound, corpse was looted
- Corpses fade after 20 seconds

### Check 4: Check Console for Errors
```javascript
// In browser console (F12):
game.corpseManager.getActiveCorpses()
// Should return array of corpses
```

---

## ✅ If Scavengers Won't Eat Corpses

### Check 1: Verify Enemy is Scavenger Type
- **Scavengers**: Necromancer (🧙), Demon (😈)
- **Not scavengers**: Goblin, Orc, Spider, Skeleton, Troll, Dragon

### Check 2: Check Corpse is Valid
```javascript
corpse.active === true  // Must be true
corpse.consumed === false  // Must not be consumed
corpse.timeLeft > 0  // Must not be decayed
```

### Check 3: Check Distance is Close Enough
- Enemy must be within 50px of corpse to eat it
- Watch enemy path - it searches for corpses
- Corpse should be at least 30% of way between enemy spawn and corpse

### Check 4: Verify Health is Low Enough
- Scavenger only eats if health < 80% of max
- Damage the scavenger first to make it weakened
- If boss enemy, might have very high health limit

---

## ✅ If Spider Won't Run Away

### Check 1: Verify Spider Health is Low
- Must be < 30% max health to trigger coward behavior
- Damage Spider to get it low
- Watch for change in behavior

### Check 2: Check Spider Exists
- **Spider** is 🕷️ emoji
- Appears in early levels
- Level 1-2 most likely

### Check 3: Verify Update is Being Called
- Spider should turn and move away
- Check if screen shows fleeing movement
- May not be visible on small screen

---

## ✅ If Auto-Loot Doesn't Work

### Check 1: Verify You're Within Range
- Auto-loot radius is 80 pixels
- Move directly toward corpse
- Get close until you hear "hit" sound

### Check 2: Check Corpse is Active
```javascript
// In console:
corpses = game.corpseManager.getActiveCorpses();
console.log(corpses[0].active);  // Should be true
```

### Check 3: Verify Sound Plays
- You should hear "hit" sound when looting
- If no sound, check audio files exist
- Game works without audio anyway

### Check 3: Manual Loot Check
```javascript
// In console:
corpse = game.corpseManager.getActiveCorpses()[0];
loot = corpse.getLoot();
console.log(loot);  // Shows { health: X, gold: Y, xp: Z }
```

---

## ✅ General Debugging

### Enable Console Logging
Add to `js/core/Game.js` in `checkCollisions()`:
```javascript
console.log(`Enemy at range: ${distance} < ${weaponRange}`);
console.log(`Can attack: ${this.player.currentWeapon.canAttack(this.time)}`);
```

### Check Enemy Manager
```javascript
game.enemyManager.getActiveEnemies()  // List all active enemies
game.enemyManager.allActive.length    // Count of enemies
```

### Check Corpse Manager
```javascript
game.corpseManager.getActiveCorpses()  // List corpses
game.corpseManager.corpses.length      // Total corpses ever created
```

### Check Player Stats
```javascript
game.player.health           // Current health
game.player.currentWeapon    // Current weapon
game.player.totalDamageDealt // Damage dealt
game.player.enemiesKilled    // Kill count
```

---

## 🔧 Common Issues & Fixes

### Issue: "Corpses rendering but not visible"
**Solution**: Check CSS z-index, verify canvas is on top

### Issue: "Scavengers not healing enough"
**Solution**: They heal 20 HP per corpse caught. If health is very high (~100+), it looks like nothing. Damage them more.

### Issue: "Can't reach corpse before enemy eating"
**Solution**: 
- Scavengers have smaller search radius (300px)
- You can run faster and intercept
- Aim high burst damage to kill faster

### Issue: "Spider not fleeing even at low health"
**Solution**:
- Must be < 30% max health
- If you're hitting with weak weapon, damage more
- Some weapons have lower DPS

### Issue: "Game crashes when corpse updates"
**Solution**: Check that corpses array is being cleaned (old corpses removed after 20 seconds)

---

## 📋 Testing Checklist

Before declaring system broken, verify:

- [ ] Browser console has no red errors
- [ ] Game loads without hanging
- [ ] Player can move around
- [ ] Enemies spawn (see emoji on screen)
- [ ] Can get close to enemy (distance visible in console)
- [ ] Enemy has health bar
- [ ] Left click/weapon triggers attack
- [ ] Enemy health bar decreases
- [ ] Enemy dies (health = 0)
- [ ] Corpse appears after death
- [ ] Corpse has 💀 emoji visible
- [ ] Can walk over corpse area
- [ ] Corpse fades over 20 seconds
- [ ] Auto-loot triggers when close (hear sound)
- [ ] Loot heals you (check health bar)

If any of above fails, check console for errors!

---

## 🆘 Last Resort: Browser Console Debug

Open DevTools (F12) and try:

```javascript
// Check game state
console.log('Game state:', game.state);
console.log('Time:', game.time);
console.log('Active enemies:', game.enemyManager.allActive.length);
console.log('Active corpses:', game.corpseManager.corpses.length);

// Check player
console.log('Player health:', game.player.health);
console.log('Weapon:', game.player.currentWeapon.data.name);
console.log('Can attack:', game.player.currentWeapon.canAttack(game.time));

// Check specific enemy
const enemy = game.enemyManager.getActiveEnemies()[0];
if (enemy) {
    console.log('Enemy:', enemy.data.name);
    console.log('Health:', enemy.health);
    console.log('Behavior:', enemy.behavior);
}

// Check specific corpse
const corpse = game.corpseManager.getActiveCorpses()[0];
if (corpse) {
    console.log('Corpse time left:', corpse.timeLeft);
    console.log('Corpse loot:', corpse.getLoot());
}
```

---

## 📞 If Still Broken

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart browser**
3. **Check file dates**: Make sure all files were saved
4. **Check line endings**: Unix (LF) vs Windows (CRLF)
5. **Verify imports**: Check all import paths are correct
6. **Test on different browser**: Chrome vs Firefox vs Edge

---

**Remember**: The attacking system works now! ⚔️ If you see enemy health bars and they're red, the system is half-working already!
