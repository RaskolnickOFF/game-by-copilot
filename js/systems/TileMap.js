export const TILE_TYPES = {
    GRASS: {
        emoji: '🌱',
        name: 'Grass',
        speedModifier: 1.0,
        color: '#4a7c59'
    },
    DIRT: {
        emoji: '🌿',
        name: 'Dirt',
        speedModifier: 0.9,
        color: '#8b4513'
    },
    SAND: {
        emoji: '🏜️',
        name: 'Sand',
        speedModifier: 0.7,
        color: '#f4e4bc'
    },
    MUD: {
        emoji: '💩',
        name: 'Mud',
        speedModifier: 0.5,
        color: '#654321'
    },
    WATER: {
        emoji: '🌊',
        name: 'Water',
        speedModifier: 0.3,
        color: '#4682b4'
    },
    ROAD: {
        emoji: '🛤️',
        name: 'Road',
        speedModifier: 1.3,
        color: '#696969'
    },
    SNOW: {
        emoji: '❄️',
        name: 'Snow',
        speedModifier: 0.8,
        color: '#ffffff'
    },
    ICE: {
        emoji: '🧊',
        name: 'Ice',
        speedModifier: 1.5,
        color: '#e0f6ff'
    },
    FOREST: {
        emoji: '🌲',
        name: 'Forest',
        speedModifier: 0.85,
        color: '#228b22'
    },
    MOUNTAIN: {
        emoji: '⛰️',
        name: 'Mountain',
        speedModifier: 0.6,
        color: '#708090'
    }
};

export const BIOME_TYPES = {
    PLAINS: {
        name: 'Plains',
        tiles: ['GRASS', 'DIRT', 'ROAD', 'FOREST'],
        weights: [65, 25, 5, 5],
        primaryColor: '#90EE90'
    },
    DESERT: {
        name: 'Desert',
        tiles: ['SAND', 'DIRT', 'ROAD'],
        weights: [80, 15, 5],
        primaryColor: '#F4A460'
    },
    SWAMP: {
        name: 'Swamp',
        tiles: ['MUD', 'WATER', 'GRASS'],
        weights: [50, 30, 20],
        primaryColor: '#556B2F'
    },
    FOREST: {
        name: 'Forest',
        tiles: ['FOREST', 'GRASS', 'DIRT'],
        weights: [60, 30, 10],
        primaryColor: '#228B22'
    },
    MOUNTAINS: {
        name: 'Mountains',
        tiles: ['MOUNTAIN', 'DIRT', 'SNOW'],
        weights: [50, 40, 10],
        primaryColor: '#708090'
    },
    TUNDRA: {
        name: 'Tundra',
        tiles: ['SNOW', 'ICE', 'DIRT'],
        weights: [60, 20, 20],
        primaryColor: '#F0F8FF'
    }
};

export class TileMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.biome = null;
        this.initializeEmpty();
    }

    initializeEmpty() {
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 'GRASS'; // Default tile
            }
        }
    }

    generateBiome(biomeType) {
        this.biome = BIOME_TYPES[biomeType];
        if (!this.biome) return;

        // Generate base terrain
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.getWeightedRandomTile();
            }
        }

        // Add some roads
        this.generateRoads();

        // Add water features
        if (biomeType === 'SWAMP') {
            this.generateWaterFeatures();
        }

        // Add forest clusters
        if (biomeType === 'FOREST' || biomeType === 'PLAINS') {
            this.generateForestClusters();
        }

        // Add mountain ranges
        if (biomeType === 'MOUNTAINS') {
            this.generateMountains();
        }
    }

    getWeightedRandomTile() {
        const random = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < this.biome.tiles.length; i++) {
            cumulative += this.biome.weights[i];
            if (random <= cumulative) {
                return this.biome.tiles[i];
            }
        }

        return this.biome.tiles[0]; // fallback
    }

    generateRoads() {
        // Generate straight roads with occasional turns
        const numRoads = Math.floor(Math.random() * 4) + 3;

        for (let i = 0; i < numRoads; i++) {
            // Start road from edge
            let startX, startY, direction;

            if (Math.random() < 0.5) {
                // Start from left or right edge
                startX = Math.random() < 0.5 ? 0 : this.width - 1;
                startY = Math.floor(Math.random() * this.height);
                direction = startX === 0 ? 'right' : 'left';
            } else {
                // Start from top or bottom edge
                startX = Math.floor(Math.random() * this.width);
                startY = Math.random() < 0.5 ? 0 : this.height - 1;
                direction = startY === 0 ? 'down' : 'up';
            }

            this.generateRoadPath(startX, startY, direction, Math.floor(Math.random() * 25) + 15);
        }
    }

    generateRoadPath(startX, startY, initialDirection, length) {
        let x = startX;
        let y = startY;
        let direction = initialDirection;
        let steps = 0;
        let straightSteps = 0;
        const minStraight = 5; // Minimum steps before turn
        const maxStraight = 12; // Maximum steps before turn

        while (steps < length && x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Place road tile
            this.tiles[y][x] = 'ROAD';

            // Check if we should turn
            if (straightSteps >= minStraight && (straightSteps >= maxStraight || Math.random() < 0.1)) {
                // Turn 90 degrees
                const possibleTurns = this.getPerpendicularDirection(direction);
                direction = possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
                straightSteps = 0;
            } else {
                straightSteps++;
            }

            // Move in current direction
            switch (direction) {
                case 'up': y--; break;
                case 'down': y++; break;
                case 'left': x--; break;
                case 'right': x++; break;
            }

            steps++;
        }
    }

    getPerpendicularDirection(direction) {
        switch (direction) {
            case 'up':
            case 'down':
                return ['left', 'right'];
            case 'left':
            case 'right':
                return ['up', 'down'];
        }
        return ['up', 'down'];
    }

    getPossibleDirections(currentDirection) {
        const allDirections = ['up', 'down', 'left', 'right'];
        return allDirections.filter(dir => dir !== this.getOppositeDirection(currentDirection));
    }

    getOppositeDirection(direction) {
        switch (direction) {
            case 'up': return 'down';
            case 'down': return 'up';
            case 'left': return 'right';
            case 'right': return 'left';
        }
        return 'down';
    }

    generateWaterFeatures() {
        // Generate winding rivers instead of ponds
        const numRivers = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < numRivers; i++) {
            // Start river from top edge
            const startX = Math.floor(Math.random() * this.width);
            const startY = 0;

            this.generateRiverPath(startX, startY, 'down', Math.floor(Math.random() * 30) + 20);
        }

        // Add some ponds
        const numPonds = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numPonds; i++) {
            const centerX = Math.floor(Math.random() * this.width);
            const centerY = Math.floor(Math.random() * this.height);
            const radius = Math.floor(Math.random() * 2) + 1;

            for (let y = Math.max(0, centerY - radius); y <= Math.min(this.height - 1, centerY + radius); y++) {
                for (let x = Math.max(0, centerX - radius); x <= Math.min(this.width - 1, centerX + radius); x++) {
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    if (distance <= radius) {
                        this.tiles[y][x] = Math.random() < 0.8 ? 'WATER' : 'MUD';
                    }
                }
            }
        }
    }

    generateRiverPath(startX, startY, initialDirection, length) {
        let x = startX;
        let y = startY;
        let direction = initialDirection;
        let steps = 0;
        let width = 1;

        while (steps < length && x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Place river tiles with some width
            for (let wx = -width; wx <= width; wx++) {
                for (let wy = -width; wy <= width; wy++) {
                    const rx = x + wx;
                    const ry = y + wy;

                    if (rx >= 0 && rx < this.width && ry >= 0 && ry < this.height) {
                        const distance = Math.sqrt(wx * wx + wy * wy);
                        if (distance <= width + 0.5) {
                            this.tiles[ry][rx] = Math.random() < 0.9 ? 'WATER' : 'MUD';
                        }
                    }
                }
            }

            // Occasionally change width
            if (Math.random() < 0.1) {
                width = Math.max(1, width + (Math.random() < 0.5 ? -1 : 1));
            }

            // Chance to change direction
            if (Math.random() < 0.4) {
                const newDirections = this.getPossibleDirections(direction);
                direction = newDirections[Math.floor(Math.random() * newDirections.length)];
            }

            // Move in current direction
            switch (direction) {
                case 'up': y--; break;
                case 'down': y++; break;
                case 'left': x--; break;
                case 'right': x++; break;
            }

            steps++;
        }
    }

    generateForestClusters() {
        // Generate large forest areas instead of small clusters
        const numForests = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < numForests; i++) {
            const centerX = Math.floor(Math.random() * this.width);
            const centerY = Math.floor(Math.random() * this.height);
            const width = Math.floor(Math.random() * 8) + 6;
            const height = Math.floor(Math.random() * 8) + 6;

            // Create rectangular forest area with some irregularity
            for (let dy = -height / 2; dy <= height / 2; dy++) {
                for (let dx = -width / 2; dx <= width / 2; dx++) {
                    const x = centerX + Math.floor(dx + Math.sin(dy * 0.5) * 2);
                    const y = centerY + Math.floor(dy + Math.cos(dx * 0.5) * 2);

                    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                        // Add some randomness to forest edges
                        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
                        const maxDistance = Math.max(width, height) / 2;
                        const density = 1 - (distanceFromCenter / maxDistance);

                        if (Math.random() < density * 0.9) {
                            this.tiles[y][x] = 'FOREST';
                        }
                    }
                }
            }
        }
    }

    generateMountains() {
        // Create mountain ranges
        const numRanges = Math.floor(Math.random() * 2) + 1;

        for (let range = 0; range < numRanges; range++) {
            const startY = Math.floor(Math.random() * (this.height - 10)) + 5;
            const length = Math.floor(Math.random() * 20) + 10;

            for (let i = 0; i < length; i++) {
                const y = startY + Math.floor(Math.sin(i * 0.5) * 3);
                const x = Math.floor((this.width / length) * i);

                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    // Create mountain cluster
                    for (let dy = -2; dy <= 2; dy++) {
                        for (let dx = -2; dx <= 2; dx++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                if (distance <= 2 && Math.random() < 0.7) {
                                    this.tiles[ny][nx] = Math.random() < 0.8 ? 'MOUNTAIN' : 'DIRT';
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    getTileAt(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return TILE_TYPES[this.tiles[y][x]];
    }

    getSpeedModifierAt(x, y) {
        const tile = this.getTileAt(x, y);
        return tile ? tile.speedModifier : 1.0;
    }

    getTileEmojiAt(x, y) {
        const tile = this.getTileAt(x, y);
        return tile ? tile.emoji : '🌱';
    }
}