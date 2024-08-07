import { Vector3 } from "@minecraft/server";

class PlayerFlyData {
    previousLocations: Vector3;
    velocityLog: number = 0;
    lastHighVelocity: number = 0;
    flyFlags: number = 0;
    lastFlag: number = 0;
    lastFlag2: number = 0;
    lastVelLog: number = 0;
    lastVelocity: number = 0;

    constructor(location: Vector3) {
        this.previousLocations = location;
    }

    resetVelocity(location: Vector3, now?: number): void {
        this.previousLocations = location;
        this.velocityLog = 0;
        this.lastVelocity = 0;

        if (now) {
            this.lastFlag = now;
        }
    }
}

export { PlayerFlyData };
