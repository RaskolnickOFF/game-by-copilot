export const weaponData = {
    sword: {
        name: '⚔️ Sword',
        emoji: '⚔️',
        damage: 15,
        attackSpeed: 0.8,
        range: 80,
        area: 360, // degrees
        cost: 0, // starting weapon
        description: 'Knight\'s sword. Strikes all enemies in 360° area.'
    },
    bow: {
        name: '🏹 Bow',
        emoji: '🏹',
        damage: 20,
        attackSpeed: 1.2,
        range: 400,
        area: 0, // single target
        cost: 100,
        description: 'Long-range bow. Shoots single target from afar.'
    },
    axe: {
        name: '🪓 Axe',
        emoji: '🪓',
        damage: 25,
        attackSpeed: 1.5,
        range: 60,
        area: 180, // degrees
        cost: 150,
        description: 'Battle axe. Hits enemies in 180° arc, high damage.'
    },
    staff: {
        name: '🔮 Magic Staff',
        emoji: '🔮',
        damage: 18,
        attackSpeed: 1.0,
        range: 300,
        area: 360, // degrees
        cost: 200,
        description: 'Magic staff. AoE magic damage in 360° area.'
    },
    hammer: {
        name: '🔨 War Hammer',
        emoji: '🔨',
        damage: 35,
        attackSpeed: 2.5,
        range: 50,
        area: 120, // degrees
        cost: 250,
        description: 'Heavy war hammer. Massive damage, very slow.'
    }
};

export const potionData = {
    healthPotion: {
        name: 'Health Potion',
        emoji: '❤️',
        effect: { type: 'instant', heal: 50 },
        cost: 30,
        description: 'Restore 50 HP instantly'
    },
    speedPotion: {
        name: 'Speed Potion',
        emoji: '💨',
        effect: { type: 'buff', stat: 'speed', multiplier: 1.5, duration: 30 },
        cost: 40,
        description: '+50% speed for 30 seconds'
    },
    damagePotion: {
        name: 'Damage Potion',
        emoji: '💪',
        effect: { type: 'buff', stat: 'damage', multiplier: 1.25, duration: 30 },
        cost: 50,
        description: '+25% damage for 30 seconds'
    },
    armorPotion: {
        name: 'Armor Potion',
        emoji: '🛡️',
        effect: { type: 'buff', stat: 'armor', value: 0.2, duration: 30 },
        cost: 45,
        description: '+20% damage reduction for 30 seconds'
    },
    slowPotion: {
        name: 'Slow Potion',
        emoji: '🐌',
        effect: { type: 'debuff', stat: 'speed', multiplier: 0.7, duration: 20 },
        cost: 60,
        description: 'Slow all enemies by 30% for 20 seconds'
    },
    weaknessPotion: {
        name: 'Weakness Potion',
        emoji: '💔',
        effect: { type: 'debuff', stat: 'damage', multiplier: 0.75, duration: 20 },
        cost: 70,
        description: 'Reduce enemy damage by 25% for 20 seconds'
    },
    confusionPotion: {
        name: 'Confusion Potion',
        emoji: '🌀',
        effect: { type: 'debuff', stat: 'confusion', duration: 15 },
        cost: 80,
        description: 'Enemies move randomly for 15 seconds'
    }
};

export const perkData = {
    sharpBlade: {
        name: 'Sharp Blade 🔪',
        description: '+15% Damage',
        effect: { damageMultiplier: 1.15 },
        cost: 50
    },
    swiftStrike: {
        name: 'Swift Strike ⚡',
        description: '+20% Attack Speed',
        effect: { attackSpeedMultiplier: 1.2 },
        cost: 60
    },
    longReach: {
        name: 'Long Reach 📍',
        description: '+30% Range',
        effect: { rangeMultiplier: 1.3 },
        cost: 70
    },
    mightySwing: {
        name: 'Mighty Swing 💪',
        description: '+25% Area Damage',
        effect: { areaMultiplier: 1.25 },
        cost: 80
    },
    lifeSteal: {
        name: 'Life Steal 🩸',
        description: 'Heal 25% of damage dealt',
        effect: { lifeStealPercent: 0.25 },
        cost: 100
    },
    armorBreaker: {
        name: 'Armor Breaker ⛓️',
        description: 'Ignore 30% of enemy armor',
        effect: { armorPenetration: 0.3 },
        cost: 90
    },
    doubleStrike: {
        name: 'Double Strike 🎯',
        description: '20% chance to attack twice',
        effect: { doubleStrikeChance: 0.2 },
        cost: 120
    },
    bloodlust: {
        name: 'Bloodlust 🔥',
        description: '+5% Damage per enemy killed (stacks, resets on death)',
        effect: { bloodlustPerKill: 0.05 },
        cost: 110
    }
};
