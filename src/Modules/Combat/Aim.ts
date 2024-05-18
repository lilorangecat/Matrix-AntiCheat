import { Player, PlayerLeaveAfterEvent, system, world } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description Detect the suspicious aiming
 */
const aimData: Map<string, AimData> = new Map();

function AntiAim(player: Player) {
    const data = aimData.get(player.id);
    const { x: rotationX, y: rotationY } = player.getRotation();
    if (!data) {
        aimData.set(player.id, { lastRotationX: rotationX, lastRotationY: rotationY, previousRotationX: undefined, previousRotationY: undefined, strightRotContinue: 0, similarRotContinue: 0, vibrateRotContinue: 0, lastRotDifferent: 0 });
        return;
    } else if (!data?.previousRotationX || player.getComponent("riding")?.entityRidingOn || player.isSleeping || player.isSwimming || player.isGliding) {
        aimData.set(player.id, {
            lastRotationX: rotationX,
            lastRotationY: rotationY,
            previousRotationX: data.lastRotationX,
            previousRotationY: data.lastRotationY,
            strightRotContinue: data.strightRotContinue,
            similarRotContinue: data.similarRotContinue,
            vibrateRotContinue: data.vibrateRotContinue,
            lastRotDifferent: 0,
        });
        return;
    }
    const rotSpeedX = Math.abs(rotationX - data.lastRotationX);
    const rotSpeedY = Math.abs(rotationY - data.lastRotationY);
    const lastRotSpeedX = Math.abs(rotationX - data.previousRotationX);
    const lastRotSpeedY = Math.abs(rotationY - data.previousRotationY);
    const config = c();
    // Integer rotation
    if ((rotationX % 5 == 0 && rotationX != 0 && Math.abs(rotationX) != 90) || (rotationY % 5 == 0 && rotationY != 0)) {
        if (!player.hasTag("matrix:riding")) {
            flag(player, "Aim", "A", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotationX") + ":" + rotationX, lang(">RotationY") + ":" + rotationY]);
        }
    }
    // Interger rot speed
    if ((rotSpeedX % 1 == 0 && rotSpeedX != 0) || (rotSpeedY % 1 == 0 && rotSpeedY != 0)) {
        flag(player, "Aim", "B", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
    }
    // Stright rotation movement
    if (rotSpeedY > 5 && rotSpeedX < 0.05 && !player.isSwimming) {
        data.strightRotContinue++;
        if (data.strightRotContinue > 20) {
            flag(player, "Aim", "C", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
            data.strightRotContinue = 0;
        }
    } else data.strightRotContinue = 0;
    // Similar rotation movement
    if (rotSpeedX > 0 && rotSpeedY > 0 && rotSpeedY > 35 && Math.abs(lastRotSpeedX - rotSpeedX) < 0.01 && Math.abs(rotationX) < 79) {
        data.similarRotContinue++;
        if (data.similarRotContinue > 5) {
            flag(player, "Aim", "D", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
            data.similarRotContinue = 0;
        }
    } else data.similarRotContinue = 0;
    // Vibrate rotation movement
    if ((lastRotSpeedY - rotSpeedY > 0 && data.lastRotDifferent < 0) || (lastRotSpeedY - rotSpeedY < 0 && data.lastRotDifferent > 0)) {
        data.vibrateRotContinue++;
        if (data.vibrateRotContinue >= 4) {
            flag(player, "Aim", "E", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
            data.vibrateRotContinue = 0;
        }
    } else data.vibrateRotContinue = 0;
    data.lastRotDifferent = rotationX - data.lastRotationX;
    // Killaura reset point check
    if ((rotationX == 0 || rotationX % 90 == 0) && Math.abs(rotationY) % 90 == 0) {
        flag(player, "Aim", "F", config.antiAim.maxVL, config.antiAim.punishment, undefined);
    }
    const unnaturalRots =
        (rotationX.toString() == rotationX.toFixed(4) && (rotationX != 0 || (rotSpeedY > 0 && data.lastRotationX == 0 && rotationX == 0))) ||
        (rotationY.toString() == rotationY.toFixed(4) && rotationY != 0) ||
        rotSpeedX.toString() == rotSpeedX.toFixed(4) ||
        rotSpeedY.toString() == rotSpeedY.toFixed(4);
    if (unnaturalRots) {
        flag(player, "Aim", "G", config.antiAim.maxVL, config.antiAim.punishment, undefined);
    }
    const instantRot =
        (lastRotSpeedX >= 30 && rotSpeedX <= 2 && (rotationX != 0 || (rotSpeedY > 0 && data.lastRotationX == 0 && rotationX == 0))) ||
        (lastRotSpeedY >= 30 && rotSpeedY <= 2 && (rotationY != 0 || (rotSpeedX > 0 && data.lastRotationY == 0 && rotationY == 0)));
    if (instantRot) {
        flag(player, "Aim", "H", config.antiAim.maxVL, config.antiAim.punishment, undefined);
    }
    aimData.set(player.id, {
        lastRotationX: rotationX,
        lastRotationY: rotationY,
        previousRotationX: data.lastRotationX,
        previousRotationY: data.lastRotationY,
        strightRotContinue: data.strightRotContinue,
        similarRotContinue: data.similarRotContinue,
        vibrateRotContinue: data.vibrateRotContinue,
        lastRotDifferent: Math.abs(rotationX - data.lastRotationX),
    });
}
function playerLeaveAfterEvent({ playerId }: PlayerLeaveAfterEvent) {
    aimData.delete(playerId);
}
function antiAim() {
    const allPlayers = world.getAllPlayers();
    for (const player of allPlayers) {
        if (isAdmin(player)) continue;
        AntiAim(player);
    }
}
let id: number;
export default {
    enable() {
        id = system.runInterval(antiAim, 1);
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent);
    },
    disable() {
        aimData.clear();
        system.clearRun(id);
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent);
    },
};
interface AimData {
    lastRotationX: number;
    lastRotationY: number;
    previousRotationX: number;
    previousRotationY: number;
    strightRotContinue: number;
    similarRotContinue: number;
    vibrateRotContinue: number;
    lastRotDifferent: number;
}
