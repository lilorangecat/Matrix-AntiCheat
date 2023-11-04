//@ts-check
import {
  world,
  Player,
  system
} from "@minecraft/server"
import {
  setScore,
} from "../config.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  let player = event.player
  try {
    const tags = player.getTags();
    const oldReason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
    const oldBy = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
    
    const unban = world.scoreboard.getObjective(player.name.toLowerCase()).displayName
    if (unban == player.name.toLowerCase()) {
      player.removeTag("ban")
      player.removeTag(`Reason:${oldReason}`)
      player.removeTag(`By:${oldBy}`)
      world.scoreboard.removeObjective(player.name.toLowerCase())
      world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unbanned!`)
    }
  } catch { }
  player.addTag(`skip_check`)
  world.scoreboard.getObjective('skip_check').setScore(player, 100);
  world.scoreboard.getObjective('cps2').setScore(player, 0);
  world.scoreboard.getObjective('tryAutoClicker').setScore(player, 0);
})

world.beforeEvents.itemUse.subscribe((event) => {
  const player = event.source
  if (player.hasTag("freeze")) {
    ev.cancel = true
    system.run(() => player.sendMessage("§e[§cMatrix§e] §cYou can't use item. You're freezed"))
  }
})

system.runInterval(() => {
  world.getPlayers({ tags: ["freeze"] }).forEach(player => {
    //cancel the move permission per 2 second
    player.runCommand(`inputpermission set @s movement disabled`)
  }
}, 40)

/** @param {Player} player */
function moderation (player) {
  if(player.isGliding == true){
    setScore(world,player,"skip_check",15)
  }
  try{
  //@ts-expect-error
  let getItemInSlot = player.getComponent("inventory").container.getItem(player.selectedSlot)
let getEnchantment = getItemInSlot.getComponent("minecraft:enchantments").enchantments
  if(getItemInSlot.typeId.includes("trident") && player.hasTag("is_using_item")){
   
    let  checkRipTide = getEnchantment.hasEnchantment("riptide")
      if(checkRipTide>0){
        setScore(world,player,"skip_check",40)
      }
  }}catch{
  }
  const banTimer = world.scoreboard.getObjective("bantimer").getScore(player.scoreboardIdentity)
  //const cps = world.scoreboard.getObjective("trueCps").getScore(player.scoreboardIdentity)
  const tags = player.getTags()
  const reason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
  const by = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
  
  if (banTimer == 0 && player.hasTag("ban")) {
    world.scoreboard.getObjective('bantimer').setScore(player, 40);
    player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are banned!\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${by}`)
  }
}

export class moderateAction {
  player;
  playerName;
  admin;

  constructor (player, admin) {
    this.admin = admin ?? undefined
    if (typeof player !== "object") {
      this.player = world.getPlayers({ name: player })[0]
      this.playerName = player
      //RaMi only use name sometime..
    } else {
      this.player = player
      this.playerName = player.name
    }
  }

  /** @param {string} reason */
  ban (reason) {
    const player = this.player
    const admin = this.admin
    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been banned from server\n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag("ban")
    player.addTag(`Reason:${reason ?? 'no reason specific'}§r`)
    player.addTag(`By:${admin.name ?? 'System'}§r`)
    world.scoreboard.getObjective('bantimer').setScore(player, 40)
    player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are banned!\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${admin.name}`)
  }

  /** @param {string} reason */
  kick (reason) {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been kicked from server\n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are kicked!\n§r§8 >> §gReason§8:§c${reason ?? 'no reason specific'}\n§8 >> §gBy§8:§c${admin.name ?? 'System'}`)
  }

  /** 
   * @param {string} reason
   * @param {import("@minecraft/server").Vector3} pos
  */
  freeze (reason, pos) {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been frozen \n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag('freeze')
    player.runCommand(`inputpermission set @s movement disabled`)
  }

  /** @param {string} reason */
  mute (reason) {
    const player = this.player
    const admin = this.admin
    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been muted \n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag('mute')
  }

  unban () {
    const player = this.playerName
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player} §ais currently unbanned\n§gBy§8:§b${admin.name}`)
    try {
      world.scoreboard.addObjective(player.toLowerCase(), player.toLowerCase())
    } catch { }
  }

  unmute () {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ais currently unmuted!\n§gBy§8:§b${admin.name ?? 'System'}`)
    player.removeTag('mute')
    player.runCommand(`inputpermission set @s movement enabled`)
  }
  
  unfreeze () {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unfreeze\n§gBy§8:§b${admin.name}`)
    player.removeTag('freeze')
  }

  seeInv () {
    const player = this.player
    const admin = this.admin
    const inventory = player.getComponent('inventory').container

    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i) ?? { typeId: "air", amount: 1 }
      admin.sendMessage(`§e[§cMatrix§e] §gslot number §8(§g${i}§8) §gincluding §c${item.typeId} §gamount §c${item.amount}`)
    }
  }

  /** @param {string} seach */
  seachInv (seach) {
    const player = this.player
    const admin = this.admin
    const inventory = player.getComponent('inventory').container

    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i) ?? { typeId: "minecraft:air", amount: 1 }
      if (item.typeId === seach) {
        player.sendMessage(`§g[§cMatrix§g] §aSuccessfully found §8(§g${seach}§8) §gamount §8(§g${item.amount}§8) §gin slot §8(§g${i}§8)`)
      }
    }
  }
  copyInv () {
    const player = this.player
    const admin = this.admin
    const inventory1 = player.getComponent('inventory').container
    const inventory2 = admin.getComponent('inventory').container

    for (let i = 0; i < inventory1.size; i++) {
      const item = inventory1.getItem(i) ?? { typeId: "air", amount: 1 }
      if (item.typeId === "air") {
        inventory2.setItem(i)
      } else {
        inventory2.setItem(i, item.clone())
      }
    }
  }
}

export { moderation }
