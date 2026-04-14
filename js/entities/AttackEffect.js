export class AttackEffect {
    constructor(startX, startY, targetX, targetY, weaponType, duration = 0.5, onHit = null, weaponData = null) {
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.weaponType = weaponType;
        this.duration = duration;
        this.elapsed = 0;
        this.active = true;
        this.onHit = onHit; // Callback function when attack hits
        this.weaponData = weaponData; // Weapon data for area calculations

        // Calculate direction and distance
        const dx = targetX - startX;
        const dy = targetY - startY;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        if (this.distance === 0) {
            this.dirX = 1;
            this.dirY = 0;
        } else {
            this.dirX = dx / this.distance;
            this.dirY = dy / this.distance;
        }

        // Effect-specific properties
        this.setupEffect();

        if (this.isAreaEffect && this.onHit && !this.hitTriggered) {
            this.onHit();
            this.hitTriggered = true;
        }
    }

    setupEffect() {
        switch (this.weaponType) {
            case 'bow':
                // Arrow effect - travels from player to target
                this.speed = this.distance / this.duration; // Travel full distance in duration
                this.emoji = '➵';
                this.needsRotation = true;
                break;
            case 'sword':
            case 'axe':
            case 'hammer':
                // Melee area effect - show damage zone
                this.emoji = this.getMeleeEmoji();
                this.radius = this.weaponData ? this.weaponData.range : 80;
                this.angle = Math.atan2(this.dirY, this.dirX);
                this.arcAngle = this.weaponData ? (this.weaponData.area * Math.PI / 180) : Math.PI; // Convert to radians
                this.isAreaEffect = true;
                break;
            case 'staff':
                // Magic projectile effect
                this.speed = this.distance / this.duration;
                this.emoji = '✨';
                this.needsRotation = false;
                break;
            default:
                this.emoji = '💥';
        }
    }

    getMeleeEmoji() {
        switch (this.weaponType) {
            case 'sword': return '⚔️';
            case 'axe': return '🪓';
            case 'hammer': return '🔨';
            default: return '⚔️';
        }
    }

    update(dt) {
        this.elapsed += dt;

        if (this.elapsed >= this.duration) {
            this.active = false;
            return;
        }

        // Update effect position based on type
        const progress = this.elapsed / this.duration;

        if (this.isAreaEffect) {
            // Area effects don't move, they show the zone
            this.currentX = this.startX;
            this.currentY = this.startY;
        } else {
            switch (this.weaponType) {
                case 'bow':
                case 'staff':
                    // Linear movement
                    this.currentX = this.startX + this.dirX * this.speed * this.elapsed;
                    this.currentY = this.startY + this.dirY * this.speed * this.elapsed;
                    break;
            }
        }
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();

        if (this.isAreaEffect) {
            // Draw damage zone
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow semi-transparent

            if (this.arcAngle >= Math.PI * 2) {
                // Full circle for 360° weapons
                ctx.beginPath();
                ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Arc for limited angle weapons
                ctx.beginPath();
                ctx.moveTo(this.startX, this.startY);
                ctx.arc(this.startX, this.startY, this.radius, this.angle - this.arcAngle / 2, this.angle + this.arcAngle / 2);
                ctx.closePath();
                ctx.fill();
            }

            ctx.globalAlpha = 1.0;
        } else {
            // Draw projectile effect
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (this.needsRotation) {
                // Rotate towards movement direction
                const angle = Math.atan2(this.dirY, this.dirX);
                ctx.translate(this.currentX, this.currentY);
                ctx.rotate(angle);
                ctx.fillText(this.emoji, 0, 0);
            } else {
                ctx.fillText(this.emoji, this.currentX, this.currentY);
            }
        }

        ctx.restore();
    }
}