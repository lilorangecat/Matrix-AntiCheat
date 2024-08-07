import { world, system, Player, Vector3, Entity, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityDamageCause } from "@minecraft/server";
import { flag, isAdmin, getPing, isSpawning, toFixed } from "../../Assets/Util.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags, DisableTags } from "../../Data/EnumData.js";
import { isSpikeLagging } from "../../Assets/Public.js";

/**
 * @author ravriv & jasonlaubb & RaMiGamerDev
 * @description This checks if the player is hitting another player from a impossible angle.
 */

interface KillAuraData {
    hitLength: string[];
    lastFlag: number;
    invalidPitch: number;
    kAFlags: number;
}

const killauradata = new Map<string, KillAuraData>();

function doubleEvent(config: configi, player: Player, hitEntity: Entity, onFirstHit: boolean) {
    if (isAdmin(player)) return;
    const data = killauradata.get(player.id) ?? {
        hitLength: [],
        lastFlag: 0,
        invalidPitch: 0,
        kAFlags: 0,
    };
    if (player.hasTag(DisableTags.pvp)) return;
    //constant the infomation
    const playerHitEntity = data.hitLength;
    let flagged = false;
    const direction: Vector3 = calculateVector(player.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    //if the player hit a target that is not in the list, add it to the list
    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        data.hitLength = playerHitEntity;
    }

    //if the player hit more than 1 targets in 2 ticks, flag the player
    if (getPing(player) < 4 && playerHitEntity.length > config.antiKillAura.maxEntityHit) {
        data.hitLength = [];
        //A - false positive: very low, efficiency: high
        flag(player, "Kill Aura", "A", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["HitLength" + ":" + playerHitEntity.length]);
        flagged = true;
    }

    player.lastTouchEntity = Date.now();

    const state = hitEntity instanceof Player && onFirstHit == true;
    //stop false positive
    if (state && distance > 3) {
        //get the angle
        const angle: number = calculateAngle(player.location, hitEntity.location, player.getVelocity(), hitEntity.getVelocity(), player.getRotation().y);
        const rotationFloat: number = Math.abs(player.getRotation().x);
        const velocity = player.getVelocity().y;

        //if the angle is higher than the max angle, flag the player
        if (!isSpikeLagging(player) && angle > config.antiKillAura.minAngle && rotationFloat < 79 && !(player.threwTridentAt && Date.now() - player.threwTridentAt < 3000)) {
            //B - false positive: low, efficiency: mid
            flag(player, "Kill Aura", "B", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["Angle" + ":" + `${angle.toFixed(2)}°`]);
            flagged = true;
        }

        //calulate the limit of xz, also Math lol
        const limitOfXZ = Math.cos((rotationFloat * Math.PI) / 180) * 6.1 + 2.4;
        //if player attack higher than the limit, flag him
        if (distance > limitOfXZ && velocity >= 0) {
            const lastflag = data.lastFlag;
            if (lastflag && Date.now() - lastflag < 4000) {
                flag(player, "Kill Aura", "C", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["distance" + ":" + distance.toFixed(2), "Limit" + ":" + limitOfXZ.toFixed(2)]);
                flagged = true;
            }
            data.lastFlag = Date.now();
        }
    }

    if (onFirstHit == true) {
        /* Just an idea
        const entityInDirection = player.getEntitiesFromViewDirection
        if (!entityInDirection.some(({ id } => id == hitEntity.id)) {
            flag (player, 'Kill Aura', 'D', config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined)
            flagged = true
        }*/
        // bad packet -w-
        if (player.isSleeping) {
            flag(player, "Kill Aura", "E", config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined);
            flagged = true;
        }
        // Check for tool box no swinging type killaura
        if (player.hasTag(AnimationControllerTags.alive) && !player.hasTag(AnimationControllerTags.attackTime) && !isSpikeLagging(player) && !player.isInWater) {
            const startDetectingTime = Date.now();
            new Promise<boolean>((resolve) => {
                let tick = 0;
                const id = system.runInterval(() => {
                    tick++;
                    if (tick > 10) {
                        system.clearRun(id);
                        resolve(true);
                    }
                    if (player.hasTag(AnimationControllerTags.attackTime)) {
                        system.clearRun(id);
                        resolve(false);
                    }
                }, 1);
            }).then((noSwinging) => {
                if (noSwinging) {
                    flag(player, "Kill Aura", "J", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["DetectingMs:" + (Date.now() - startDetectingTime)]);
                }
            });
        }
    }

    if (flagged) {
        player.addTag(DisableTags.pvp);
        system.runTimeout(() => {
            player.removeTag(DisableTags.pvp);
        }, config.antiKillAura.timeout);
    }
}

interface LastRotateData {
    horizonR: number;
    verticalR: number;
    lastVel: Vector3;
    lastPitch: number;
    kAFlags: number | string;
    invalidPitch: number;
}
const lastRotateData = new Map<string, LastRotateData>();
function intickEvent(config: configi, player: Player) {
    const data = lastRotateData.get(player.id);
    const PlayerRota = player.getRotation();
    const verticalRotation = PlayerRota.x;
    const horizontalRotation = PlayerRota.y;

    if (!data) {
        initializeRotationData(player, horizontalRotation, verticalRotation);
        return;
    }

    const raycast = player.getEntitiesFromViewDirection()[0];
    if (!raycast || !(raycast.entity instanceof Player) || raycast.distance > 7.5 || player.hasTag(DisableTags.pvp)) return;

    updateRotationData(player, data, horizontalRotation, verticalRotation);
    if (!checkInstantRotation(config, player, data, horizontalRotation)) return;
    if (!checkSmoothRotation(config, player, data, verticalRotation)) return;
    if (!checkSuspiciousRotation(config, player, data, horizontalRotation, verticalRotation)) return;
}

function initializeRotationData(player: Player, horizontalRotation: number, verticalRotation: number) {
    lastRotateData.set(player.id, {
        horizonR: horizontalRotation,
        verticalR: verticalRotation,
        lastVel: player.getVelocity(),
        lastPitch: 0,
        kAFlags: 0,
        invalidPitch: 0,
    });
}

function updateRotationData(player: Player,  LastRotateData, horizontalRotation: number, verticalRotation: number) {
    const playerVelocity = player.getVelocity();
    const yPitch = Math.abs(data.verticalR - verticalRotation);

    data.horizonR = horizontalRotation;
    data.verticalR = verticalRotation;
    data.lastVel = playerVelocity;
    data.lastPitch = yPitch;
}

function checkInstantRotation(config: configi, player: Player,  LastRotateData, horizontalRotation: number): boolean {
    const nearestPlayer = player.getEntitiesFromViewDirection()[0].entity as Player;
    const horizontalAngle = calculateHorizontalAngle(player, nearestPlayer, horizontalRotation);
    const rotatedMove = Math.abs(data.horizonR - horizontalRotation);
    const move = calculateHorizontalMovement(nearestPlayer);

    if (rotatedMove > 60) {
        flag(player, "Kill Aura", "G", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["RotatedMove:" + toFixed(rotatedMove, 5, true)]);
        return false;
    }

    if (data.kAFlags === "G" && rotatedMove === 0 && data.verticalR !== 0) {
        flag(player, "Kill Aura", "G", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["RotatedMove:" + toFixed(rotatedMove, 5, true)]);
        data.kAFlags = 0;
        return false;
    }

    if ((rotatedMove > 0 && rotatedMove < 60 && move > 0) || rotatedMove > 60) {
        data.kAFlags++;
        if (rotatedMove > 60) data.kAFlags = "G";
    } else if ((rotatedMove === 0 && move > 0) || (rotatedMove > 0 && move === 0) || rotatedMove > 40) {
        data.kAFlags = 0;
    }

    if (data.kAFlags >= 40) {
        flag(player, "Kill Aura", "F", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["Angle" + ":" + toFixed(horizontalAngle, 5, true)]);
        data.kAFlags = 0;
        return false;
    }

    return true;
}

function checkSmoothRotation(config: configi, player: Player,  LastRotateData, verticalRotation: number): boolean {
    const nearestPlayer = player.getEntitiesFromViewDirection()[0].entity as Player;
    const move = calculateHorizontalMovement(nearestPlayer);
    const yPitch = Math.abs(data.verticalR - verticalRotation);
    const floatY = player.getVelocity().y;
    const moveY = nearestPlayer.getVelocity().y;

    if (Math.abs(yPitch - data.lastPitch) > 1 && Math.abs(yPitch - data.lastPitch) < 3 && ((verticalRotation < 0 && moveY + floatY > 0) || (verticalRotation > 0 && moveY + floatY < 0)) && move > 0.1) {
        data.invalidPitch++;
    } else {
        data.invalidPitch = 0;
    }

    if (data.invalidPitch >= 20) {
        flag(player, "Kill Aura", "H", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["PitchDifferent:" + toFixed(yPitch - data.lastPitch, 5, true)]);
        data.invalidPitch = 0;
        return false;
    }

    return true;
}

function checkSuspiciousRotation(config: configi, player: Player,  LastRotateData, horizontalRotation: number, verticalRotation: number): boolean {
    const rotatedMove = Math.abs(data.horizonR - horizontalRotation);

    if (
        !isSpawning(player) &&
        !isSpikeLagging(player) &&
        Date.now() - player.lastTouchEntity < 300 &&
        (verticalRotation % 1 === 0 || horizontalRotation % 1 === 0) &&
        Math.abs(verticalRotation) !== 90 &&
        ((rotatedMove > 0 && verticalRotation === 0) || verticalRotation !== 0)
    ) {
        const yPitch = Math.abs(data.verticalR - verticalRotation);
        flag(player, "Kill Aura", "I", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["PitchDifferent:" + toFixed(yPitch - data.lastPitch, 5, true)]);
        return false;
    }

    return true;
}
function calculateHorizontalAngle(player: Player, target: Player, horizontalRotation: number): number {
    const pos1 = player.getHeadLocation();
    const pos2 = target.getHeadLocation();

    let horizontalAngle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI - horizontalRotation - 90;
    horizontalAngle = horizontalAngle <= -180 ? (horizontalAngle += 360) : horizontalAngle;
    return Math.abs(horizontalAngle);
}

function calculateHorizontalMovement(entity: Player): number {
    const { x: moveX, z: moveZ } = entity.getVelocity();
    return Math.hypot(moveX, moveZ);
}

function calculateVector(l1: Vector3, l2: Vector3) {
    const { x: x1, y: y1, z: z1 } = l1;
    const { x: x2, y: y2, z: z2 } = l2;

    return {
        x: x2 - x1,
        y: y2 - y1,
        z: z2 - z1,
    };
}

function calculateMagnitude({ x, z }: Vector3) {
    return Math.hypot(x, z);
}

function calculateAngle(attacker: Vector3, target: Vector3, attackerV: Vector3, targetV: Vector3, rotation: number = -90) {
    const pos1 = {
        x: attacker.x - attackerV.x * 0.5,
        y: 0,
        z: attacker.z - attackerV.z * 0.5,
    } as Vector3;
    const pos2 = {
        x: target.x - targetV.x * 0.5,
        y: 0,
        z: target.z - targetV.z * 0.5,
    } as Vector3;

    let angle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI - rotation - 90;
    angle = angle <= -180 ? angle + 360 : angle;
    return Math.abs(angle);
}

// Register the module
registerModule(
    "antiKillAura",
    false,
    [killauradata],
    {
        intick: async (config, player) => intickEvent(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, { damageSource: { damagingEntity, damagingProjectile, cause }, hurtEntity }: EntityHurtAfterEvent) => {
            if (damagingEntity instanceof Player && !isAdmin(damagingEntity) && cause == EntityDamageCause.entityAttack && !damagingProjectile) {
                doubleEvent(config, damagingEntity, hurtEntity, true);
            }
        },
    },
    {
        worldSignal: world.afterEvents.entityHitEntity,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, event: EntityHitEntityAfterEvent) => {
            if (event.hitEntity instanceof Player && !isAdmin(event.hitEntity)) {
                doubleEvent(config, event.damagingEntity as Player, event.hitEntity, false);
            }
        },
    }
);
