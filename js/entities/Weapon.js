export class Weapon {
    constructor(weaponType, data) {
        this.type = weaponType;
        this.data = data;

        // Base stats from weapon data
        this.damage = data.damage;
        this.attackSpeed = data.attackSpeed;
        this.range = data.range;
        this.area = data.area;

        // Modifiers from perks
        this.damageMultiplier = 1.0;
        this.attackSpeedMultiplier = 1.0;
        this.rangeMultiplier = 1.0;
        this.areaMultiplier = 1.0;
        this.lifeStealPercent = 0;
        this.armorPenetration = 0;
        this.doubleStrikeChance = 0;

        // Attack cooldown - set to negative so we can attack immediately on game start
        this.lastAttackTime = -1000;
    }

    applyPerk(perkEffect) {
        if (perkEffect.damageMultiplier) this.damageMultiplier *= perkEffect.damageMultiplier;
        if (perkEffect.attackSpeedMultiplier) this.attackSpeedMultiplier *= perkEffect.attackSpeedMultiplier;
        if (perkEffect.rangeMultiplier) this.rangeMultiplier *= perkEffect.rangeMultiplier;
        if (perkEffect.areaMultiplier) this.areaMultiplier *= perkEffect.areaMultiplier;
        if (perkEffect.lifeStealPercent) this.lifeStealPercent += perkEffect.lifeStealPercent;
        if (perkEffect.armorPenetration) this.armorPenetration += perkEffect.armorPenetration;
        if (perkEffect.doubleStrikeChance) this.doubleStrikeChance = Math.max(this.doubleStrikeChance, perkEffect.doubleStrikeChance);
    }

    getEffectiveDamage(baseDamage = 0, bloodlustMultiplier = 1.0, damageBuffMultiplier = 1.0) {
        const totalDamage = (this.data.damage + baseDamage) * this.damageMultiplier * bloodlustMultiplier * damageBuffMultiplier;
        return Math.round(totalDamage);
    }

    getEffectiveAttackSpeed() {
        return this.attackSpeed * this.attackSpeedMultiplier;
    }

    getEffectiveRange() {
        return this.range * this.rangeMultiplier;
    }

    getEffectiveArea() {
        return this.area * this.areaMultiplier;
    }

    canAttack(currentTime) {
        const cooldown = 1 / this.getEffectiveAttackSpeed();
        return (currentTime - this.lastAttackTime) >= cooldown;
    }

    recordAttack(currentTime) {
        this.lastAttackTime = currentTime;
    }
}
