import { c } from "../Assets/Util";
import { world } from "@minecraft/server";

// import the toggle handler of each module
import autoClicker from "./Combat/Auto Clicker";
import killAura from "./Combat/Kill Aura";
import reach from "./Combat/Reach";
import aim from "./Combat/Aim";
import spammer from "./Misc/Spammer";
import crasher from "./Misc/Crasher";
import fly from "./Movement/Fly";
import nofall from "./Movement/NoFall";
import noClip from "./Movement/NoClip";
import speed from "./Movement/Speed";
import timer from "./Movement/Timer";
import noSlow from "./Movement/NoSlow";
import elytraFly from "./Movement/ElytraFly";
import nuker from "./World/Nuker";
import scaffold from "./World/Scaffold";
import tower from "./World/Tower";
import cbe from "./World/CommandBlockExplolit";
import breaker from "./World/Breaker";
import blockReach from "./Player/BlockReach";
import illegalItem from "./Player/Illegal Item";
import nameSpoof from "./Player/NameSpoof";
import auto from "./Player/Auto";
import fastUse from "./Player/FastUse";
import gameMode from "./Player/GameMode";
import spam from "./Misc/Spam";
import autotool from "./World/AutoTool";
import bot from "./Misc/Bot";
import fastBreak from "./World/FastBreak";
import xray from "./Misc/Xray";
import worldBorder from "./Movement/World Border";
import disabler from "./Misc/Disabler";
import clientAuth from "./Player/ClientAuth";

interface toggleHandler {
    enable: () => void;
    disable: () => void;
}

export const antiCheatModules: { [key: string]: toggleHandler } = {
    worldBorder: worldBorder,
    antiReach: reach,
    antiKillAura: killAura,
    antiAutoClicker: autoClicker,
    antiSpam: spam,
    antiSpammer: spammer,
    antiFly: fly,
    antiNoFall: nofall,
    antiElytraFly: elytraFly,
    antiBreaker: breaker,
    antiNoClip: noClip,
    antiSpeed: speed,
    antiTimer: timer,
    antiNuker: nuker,
    antiGameMode: gameMode,
    antiTower: tower,
    antiFastUse: fastUse,
    antiNoSlow: noSlow,
    antiBlockReach: blockReach,
    antiAim: aim,
    antiScaffold: scaffold,
    antiAutoTool: autotool,
    antiAuto: auto,
    antiFastBreak: fastBreak,
    antiNameSpoof: nameSpoof,
    antiCBE: cbe,
    antiXray: xray,
    antiCrasher: crasher,
    antiIllegalItem: illegalItem,
    antiBot: bot,
    antiDisabler: disabler,
    clientAuth: clientAuth,
};

export const defaultLy = (key: string) => {
    const config: { [key: string]: any } = c();
    if (key == "antiCBE") return config.antiCommandBlockExplolit.enabled;
    return config[key].enabled;
};

export const keys = Object.keys(antiCheatModules);

export function getModuleState(module: string) {
    if (!keys.includes(module)) return undefined;
    return (world.getDynamicProperty(module) as boolean) ?? defaultLy(module);
}

export function moduleStart() {
    const config = c();
    const exN = (world.getDynamicProperty("exN") as number) ?? 0;
    for (const module of keys) {
        if (getModuleState(module) !== true) continue;
        // the bug is config[module] module must be a number not string 
        try {
            if ((config as { [key: string]: any })[module].experimental && exN != config.exN) {
                world.setDynamicProperty(module, undefined);
                continue;
            }
        } catch (error) {
            console.warn(JSON.stringify(error));
        } 
        antiCheatModules[module].enable();
    }
    if (exN != config.exN) world.setDynamicProperty("exN", config.exN);
    return true;
}
