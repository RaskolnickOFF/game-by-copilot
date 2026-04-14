export const levelData = [
    {
        level: 1,
        name: '🌲 Forest of Goblins',
        maxTime: 60,
        baseEnemySpawnRate: 1.5,
        maxEnemies: 5,
        enemyHealthMultiplier: 1.0,
        enemyDamageMultiplier: 1.0,
        enemySpeedMultiplier: 1.0,
        xpMultiplier: 1.0,
        description: 'Face off against weak goblins'
    },
    {
        level: 2,
        name: '🏰 Castle Ruins',
        maxTime: 75,
        baseEnemySpawnRate: 2.0,
        maxEnemies: 8,
        enemyHealthMultiplier: 1.2,
        enemyDamageMultiplier: 1.15,
        enemySpeedMultiplier: 1.1,
        xpMultiplier: 1.3,
        description: 'Orcs guard the ancient castle'
    },
    {
        level: 3,
        name: '⛰️ Mountain Stronghold',
        maxTime: 90,
        baseEnemySpawnRate: 2.5,
        maxEnemies: 12,
        enemyHealthMultiplier: 1.5,
        enemyDamageMultiplier: 1.3,
        enemySpeedMultiplier: 1.2,
        xpMultiplier: 1.6,
        description: 'Trolls have taken the mountains'
    },
    {
        level: 4,
        name: '🌑 Shadow Realm',
        maxTime: 120,
        baseEnemySpawnRate: 3.0,
        maxEnemies: 15,
        enemyHealthMultiplier: 1.8,
        enemyDamageMultiplier: 1.5,
        enemySpeedMultiplier: 1.3,
        xpMultiplier: 2.0,
        description: 'Demons plague the shadow realm'
    },
    {
        level: 5,
        name: '🔥 Dragon\'s Lair',
        maxTime: 150,
        baseEnemySpawnRate: 3.5,
        maxEnemies: 20,
        enemyHealthMultiplier: 2.0,
        enemyDamageMultiplier: 1.8,
        enemySpeedMultiplier: 1.4,
        xpMultiplier: 2.5,
        description: 'Face the legendary dragons!'
    }
];

export function getLevelConfig(level) {
    return levelData[Math.min(level - 1, levelData.length - 1)];
}
