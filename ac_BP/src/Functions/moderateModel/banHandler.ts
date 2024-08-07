import { world, Player, system } from "@minecraft/server";
import { msToTime, isHost, isAdmin, c } from "../../Assets/Util";
import { Action } from "../../Assets/Action";
import { BanqueueData } from "../chatModel/Commands/moderations/banqueue";

interface BanInfo {
    reason: string;
    by: string;
    time: number | "forever";
}

function getUnbanList(): string[] {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    return unbanListingString ? JSON.parse(unbanListingString) : [];
}

function setUnbanList(unbanList: string[]): void {
    world.setDynamicProperty("unbanListing", JSON.stringify(unbanList));
}

function checksBan(player: Player): void {
    const info = player.getDynamicProperty("isBanned");
    const baninfo: BanInfo | undefined = info ? JSON.parse(info) : undefined;

    const unbanListing = getUnbanList();

    if (unbanListing.includes(player.name)) {
        setUnbanList(unbanListing.filter((name) => name !== player.name));
        player.setDynamicProperty("isBanned", undefined);
        return;
    }

    if (!baninfo) {
        const banqueue: BanqueueData[] = JSON.parse((world.getDynamicProperty("banqueue") as string) ?? "[]");
        const queuedata = banqueue.find(({ name }) => name === player.name);
        if (queuedata) {
            Action.ban(player, queuedata.reason, queuedata.admin, queuedata.time);
            world.setDynamicProperty("banqueue", JSON.stringify(banqueue.filter(({ name }) => name !== player.name)));
        }
        return;
    }

    let reason: string;
    let by: string;
    let time: number | "forever";

    try {
        reason = baninfo.reason;
        by = baninfo.by;
        time = baninfo.time;
    } catch {
        console.log("baninfo is not a BanInfo object, unbanned");
        player.setDynamicProperty("isBanned", undefined);
        return;
    }

    if (time !== "forever" && Date.now() > time) {
        player.setDynamicProperty("isBanned", undefined);
        return;
    }

    const timeLeft = time === "forever" ? "forever" : msToTime(time - Date.now());
    const timeTherShold = timeLeft === "forever"
        ? "forever"
        : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`;

    const extraMessages = c().banModify.extraMessages as string[];
    const extraString = extraMessages.length > 0
        ? extraMessages
            .map((string) => {
                const [key, value] = string.split(":");
                return `§7${key}: §c${value}`;
            })
            .join("\n")
        : "";

    try {
        player.runCommand(`kick "${player.name}" §r\n§c§lYour have been banned!\n§r§7Time Left:§c ${timeTherShold}\n§7Reason: §c${reason}§r\n§7By: §c${by}${extraString}`);
    } catch {
        Action.tempkick(player);
    }
}

function ban(player: Player, reason: string, by: string, time: number | "forever"): void {
    if (isHost(player) || isAdmin(player)) {
        return;
    }
    if (time !== "forever" && time < Date.now()) {
        return;
    }
    system.run(() => {
        player.setDynamicProperty(
            "isBanned",
            JSON.stringify({ reason, by, time } as BanInfo)
        );
        checksBan(player);
    });
}

function unban(playerName: string): void {
    const unbanList = getUnbanList();
    setUnbanList([...unbanList, playerName]);
}

function unbanRemove(playerName: string): boolean {
    const unbanList = getUnbanList();
    if (!unbanList.includes(playerName)) {
        return false;
    }
    setUnbanList(unbanList.filter((name) => name !== playerName));
    return true;
}

function unbanList(): string[] {
    return getUnbanList();
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        checksBan(player);
    }
});

export { ban, unban, unbanRemove, unbanList };
