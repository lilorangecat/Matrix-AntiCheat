import { Dimension, GameMode, Player, Vector3 } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { configi, registerModule } from "../Modules";
import { bypassMovementCheck, flag, isSpawning } from "../../Assets/Util";
import { isSpikeLagging } from "../../Assets/Public";
import { MatrixUsedTags } from "../../Data/EnumData";

import { PlayerFlyData } from "./PlayerFlyData";

/**
 * @author RaMiGamerDev
 * @description Code rewrite by jasonlaubb
 * A efficient vertical movement check based on bds prediction
 */

const flyData = new Map<string, PlayerFlyData>();

/**
 * Checks if the given block is a stair block.
 * @param location The location of the block.
 * @param dimension The dimension of the block.
 * @returns True if the block is a stair block, false otherwise.
 */
const isStairBlock = ({ location: { x: px, y: py, z: pz }, dimension }: { location: Vector3; dimension: Dimension }): boolean => {
    try {
        const blockBelow = dimension.getBlock({ x: Math.floor(px), y: Math.floor(py) - 1, z: Math.floor(pz) })?.typeId;
        const currentBlock = dimension.getBlock({ x: Math.floor(px), y: Math.floor(py), z: Math.floor(pz) })?.typeId;
        return [currentBlock, blockBelow].includes("stair");
    } catch (error) {
        console.warn(`Error checking for stair block: ${error}`);
        return false;
    }
};

/**
 * Performs anti-fly checks on the given player.
 * @param player The player to check.
 * @param now The current timestamp.
 * @param config The anti-fly configuration.
 */
function antiFly(player: Player, now: number, config: configi): void {
    let data = flyData.get(player.id) ?? new PlayerFlyData(player.location);
    flyData.set(player.id, data);

    const { y: velocity, x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);

    // Reset velocity log if the player is moving upwards slowly
    if (velocity <= config.antiFly.highVelocity && velocity >= 0) {
        data.resetVelocity(player.location);
    }

    const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
    const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
    const onStair = isStairBlock(player);

    // Skip checks if the player is allowed to bypass them
    const shouldSkipChecks =
        bypassMovementCheck(player) ||
        (jumpBoost && jumpBoost.amplifier > 2) ||
        (levitation && levitation.amplifier > 2) ||
        (player.lastExplosionTime && now - player.lastExplosionTime < 5500) ||
        (player.threwTridentAt && now - player.threwTridentAt < 5000) ||
        player.hasTag(MatrixUsedTags.knockBack) ||
        player.isFlying ||
        player.isGliding;

    if (shouldSkipChecks) {
        return;
    }

    const isFlyingMovement = (data.velocityLog > 1 && velocity <= 0) || (velocity < config.antiFly.highVelocity && player.fallDistance < -1.5);
    const isClientFly = data.velocityLog > 0 && player?.lastVelLog == data.velocityLog;

    // Check for client-side fly hacks
    if (!player.isOnGround && isClientFly && isFlyingMovement && velocity != 1 && !onStair) {
        player.teleport(data.previousLocations);

        if (data.lastFlag && now - data.lastFlag <= 5000 && now - data.lastFlag >= 500) {
            flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
        }

        data.resetVelocity(player.location, now);
    }

    data.lastVelLog = data.velocityLog;

    // Check for various fly patterns
    if (data.velocityLog == 1 && !onStair && velocity <= 0.2) {
        data.flyFlags++;
        const notSL = !isSpikeLagging(player);

        if ((data.lastVelocity >= -0.95 && data.lastVelocity <= -0.1) || (data.lastVelocity <= 0.42 && data.lastVelocity >= -0.03)) {
            if (notSL && (xz > 0 || player.lastXZLogged > 0) && (data.lastHighVelocity >= 7 || (data.flyFlags >= 2 && now - data.lastFlag2 >= 450 && now - data.lastFlag2 <= 1000))) {
                flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
                player.teleport(data.previousLocations);
                data.flyFlags++;
            } else if (data.flyFlags >= 2) {
                data.flyFlags = 0;
            }

            if (notSL && player.location.y - data.previousLocations.y >= config.antiFly.maxGroundPrviousVelocity && data.lastHighVelocity >= 0.7 && !isSpawning(player)) {
                if (now - data.lastFlag2 <= 2000) {
                    flag(player, "Fly", "E", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
                }
                player.teleport(data.previousLocations);
            }
        }

        if (data.lastHighVelocity >= config.antiFly.maxGroundPrviousVelocity && (player.isOnGround || player.isClimbing)) {
            if (now - data.lastFlag2 <= 5000) {
                flag(player, "Fly", "C", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
            }
            player.teleport(data.previousLocations);
        }

        if (data.lastHighVelocity > config.antiFly.maxHighVelocity) {
            flag(player, "Fly", "D", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
            player.teleport(data.previousLocations);
        }

        data.lastFlag2 = now;
    }

    // Update velocity log and last high velocity
    if (velocity > config.antiFly.highVelocity) {
        data.velocityLog += 1;
        data.lastHighVelocity = velocity;
    } else if (velocity <= config.antiFly.highVelocity || (velocity == 0 && player.isOnGround)) {
        data.lastVelocity = velocity;
        data.velocityLog = 0;
    }
}

registerModule("antiFly", false, [flyData], {
    tickInterval: 1,
    tickOption: { excludeGameModes: [GameMode.creative, GameMode.spectator] },
    intick: async (config, player) => {
        antiFly(player, Date.now(), config);
    },
});
