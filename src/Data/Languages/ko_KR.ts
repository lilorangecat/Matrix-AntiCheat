/** @author UserX0001 */

export default {
    "-help.helpCDlist": "명령어 목록 :",
    "-help.help": "help - 명령어에 대한 자세한 정보를 알려줍니다.",
    "-help.toggles": "toggles - 모든 모듈을 키고/끕니다. ",
    "-help.toggle": "toggle <module> <enable/disable> - 하나의 모듈을 키거나 끕니다.",
    "-help.op": "op <player> - 플레이어에게 어드민 권한을 제공합니다. OP 권한이 제공된 플레이어는 메트릭스 설정을 바꿀 수 있습니다.",
    "-help.deop": "deop <player> - 플레이어의 어드민 권한을 삭제합니다.",
    "-help.passwords": "passwords <oldPassword> <newPassword> - 비밀번호를 번경합니다. 비밀번호 번경 후 까먹을 시 재번경 불가능합니다. 신중히 설정해주세요.",
    "-help.flagmode": "flagmode <all/tag/bypass/admin> - 채팅 표시기 모드를 번경합니다.",
    "-help.rank": "rank <set/add/remove> <player> <rank> - 플레이어의 칭호[Rank]를 번경합니다.",
    "-help.rankclear": "rankclear <player> - 해당 플레이어의 모든 칭호를 제거합니다.",
    "-help.defaultrank": "defaultrank <rank> - 칭호가 없는 플레이어의 기본 칭호를 정합니다.",
    "-help.showallrank": "showallrank <true/false> - 채팅에 모든 권한을 표시합니다.",
    "-help.ban": "ban <player> <reason> <timeRegax/forever> - 플레이어를 벤시킵니다.",
    "-help.unban": "unban <player> - 플레이어를 언벤합니다.[벤 해제]",
    "-help.unbanremove": "unbanremove <player> - 플레이어의 언벤 대기를 삭제합니다.",
    "-help.unbanlist": "unbanlist - 언벤 대기창에 있는 플레이어 목록을 불러옵니다.",
    "-help.freeze": "freeze <player> - 플레이어를 멈춥니다.",
    "-help.unfreeze": "unfreeze <player> - 플레이어 멈춤을 해제합니다.",
    "-help.vanish": "vanish - 자신을 숨깁니다. [투명화 상위 호환, 맵 제작에 유용합니다.]",
    "-help.unvanish": "unvanish - 숨김을 제거합니다.",
    "-help.invcopy": "invcopy <player> - 플레이어의 인벤토리를 자신에게 그대로 복사합니다.",
    "-help.invsee": "invsee <player> - 플레이어의 인벤토리를 확인합니다.",
    "-help.echestwipe": "echestwipe <player> - 플레이어의 엔더상자를 클리어시킵니다.",
    "-help.lockdowncode": "lockdowncode <get/set/random> <코드 지정>/[랜덤: 길이] - Whitelist 기능으로, 코드를 이용해 들어올 수 있게 합니다.",
    "-help.lockdown": "lockdown <code> - 코드로 서버를 잠급니다.",
    "-help.unlock": "unlock <code> - 서버를 잠금 해제합니다.",
    "-help.adminchat": "adminchat - 어드민만 보이는 채팅을 사용/해제합니다.",
    "-help.lang": "lang <language> - 언어를 번경합니다. [한국어 패치 제작자 : UserX0001]",
    "-help.langlist": "langlist - 모든 언어를 확인합니다.",
    "-about.line1": "메트릭스[Matrix]는 @Minecraft API에 기반한 마인크래프트 BE 안티-치트입니다.",
    "-about.version": "버전",
    "-about.author": "저자",
    "-toggles.toggle": "토클",
    "-toggles.module": "모듈",
    "-toggles.toggleList": "토글 목록:",
    "-toggles.unknownModule": "없는 모듈입니다. - %atoggles",
    "-toggles.toggleChange": "%a 모듈이 %bd 로 설정되었습니다.",
    "-toggles.unknownAction": "잘못된 작업입니다. enable/disable을 입력해주세요.",
    "-toggles.already": "이 모듈은 이미 %ad입니다!",
    "-op.hasbeen": "%a가 %b를 통하여 OP처리 되었습니다. 부적절한 상황으로 의심될 시 즉시 DE-OP처리하세요.",
    "-op.please": "비밀번호를 입력해주세요.",
    "-op.now": "당신은 이제 어드민입니다.",
    "-op.wrong": "잘못된 비밀번호",
    "-op.wait": "비밀번호를 입력하기 위해 %a초 기다려주세요.",
    "-deop.lockdown": "현재 서버는 LockDown 모드입니다.[Whitelist]",
    "-deop.notadmin": "%a는 어드민이 아닙니다.",
    "-deop.hasbeen": "%a님이 %b님을 통하여 DE-OP 처리되었습니다.",
    "-passwords.oldnew": "이전 비밀번호와 현재 비밀번호를 입력해주세요.",
    "-passwords.wrong": "잘못된 비밀번호",
    "-passwords.changed": "비밀번호가 번경되었습니다.",
    "-flagmode.unknown": "잘못된 작업, all/bypass/admin/tag/none중 하나를 입력해주세요.",
    "-flagmode.changed": "Flag 모드가 %a로 번경되었습니다.",
    "-rank.unknownAction": "잘못된 작업, set/add/remove중 하나를 입력해주세요.",
    "-rank.enter": "칭호를 입력해주세요.",
    "-rank.hasset": "%a의 칭호가 %b로 설정되었습니다.",
    "-rank.hasadd": "%a에게 칭호 %b가 추가되었습니다.",
    "-rank.already": "%a는 이미 %b 칭호를 가지고 있습니다.",
    "-rank.hasremove": "%a의 칭호가 제거되었습니다.",
    "-rank.norank": "%a는 %b 칭호를 가지고 있지 않습니다.",
    "-rank.empty": "%a는 아무 칭호도 가지고 있지 않습니다.",
    "-rankclear.has": "%a의 칭호가 제거되었습니다.",
    "-rankclear.empty": "%a는 아무 칭호도 가지고 있지 않습니다.",
    "-defaultrank.enter": "칭호를 입력해주세요.",
    "-defaultrank.has": "기본 칭호가 %a로 번경되었습니다.",
    "-showallrank.unknown": "잘못된 작업, true/false중 하나를 입력해주세요.",
    "-showallrank.has": "모든 칭호가 %a로 설정되었습니다.",
    "-ban.self": "자신을 벤할 수 없습니다.",
    "-ban.admin": "어드민을 벤할 수 없습니다.",
    "-ban.reason": "사유를 입력해주세요.",
    "-ban.time": "시간을 입력해주세요, 예시: 1d20h30m40s",
    "-ban.has": "%a님이 %b님의 처리로 벤 처리되었습니다.",
    "-unban.self": "자기 자신을 벤할 수 없습니다.",
    "-unban.notban": "%a님은 벤 되지 않았습니다.",
    "-unban.add": "%a님이 언벤 목록에 접속했습니다.",
    "-unbanremove.not": "%a님은 언벤 목록에 없습니다.",
    "-unbanremove.yes": "%a님이 언벤 목록에서 제거되었습니다.",
    "-unbanlist.none": "언벤 목록에 아무도 없습니다.",
    "-unbanlist.list": "언벤 목록",
    "-freeze.self": "자신을 프리즈할 수 없습니다.",
    "-freeze.admin": "어드민을 프리즈할 수 없습니다.",
    "-freeze.has": "%a님이 %b님의 처리로 프리즈 처리되었습니다.",
    "-freeze.already": "%a님은 이미 프리즈 처리되어있습니다.",
    "-unfreeze.self": "자신을 프리즈할 수 없습니다.",
    "-unfreeze.not": "%a는 프리즈 되어있지 않습니다.",
    "-unfreeze.has": "%a님이 %b님을 통하여 언프리즈 되었습니다.",
    "-unfreeze.admin": "어드민을 언프리즈할 수 없습니다.",
    "-mute.self": "자신을 뮤트할 수 없습니다.",
    "-mute.admin": "어드민을 뮤트할 수 없습니다.",
    "-mute.has": "%a님이 %b님의 처리로 뮤트되었습니다.",
    "-mute.already": "%a님은 이미 뮤트입니다.",
    "-unmute.self": "자기 자신을 언뮤트할 수 없습니다.",
    "-unmute.not": "%a님은 뮤트되지 않았습니다.",
    "-unmute.has": "%a님이 %b님의 처리로 언뮤트되었습니다.",
    "-unmute.admin": "어드민을 언뮤트할 수 없습니다.",
    "-vanish.has": "숨김 처리되었습니다.",
    "-vanish.out": "더 이상 숨김 처리되지 않습니다.",
    "-invcopy.self": "자기 자신의 인벤토리를 복제할 수 없습니다.",
    "-invcopy.not": "%a의 인벤토리가 복사되었습니다.",
    "-invsee.self": "자신의 인벤토리를 볼 수 없습니다.",
    "-invsee.of": "%a의 인벤토리",
    "-echestwipe.self": "자신의 엔더상자를 클리어할 수 없습니다.",
    "-echestwipe.admin": "어드민의 인벤토리를 클리어할 수 없습니다.",
    "-echestwipe.has": "%a님의 엔더상자가 %b님의 처리로 클리어 되었습니다.",
    "-lockdowncode.unknown": "원하는 항목을 입력하세요.",
    "-lockdowncode.get": "잠금 코드: %a",
    "-lockdowncode.enter": "코드를 입력하세요.",
    "-lockdowncode.set": "성공적으로 코드가 %a로 번경되었습니다.",
    "-lockdowncode.number": "코드 길이는 숫자여야 합니다.",
    "-lockdowncode.length": "1에서 128사이의 코드를 입력해주세요.",
    "-lockdowncode.random": "성공적으로 코드가 번경되었습니다. - %a",
    "-lockdowncode.unknownAction": "잘못된 행동, get/set/random중 하나를 입력해주세요.",
    "-lockdown.enter": "코드를 입력해주세요.",
    "-lockdown.wrong": "잘못된 코드",
    "-lockdown.already": "서버는 %a님에 의해 현재 락다운 모드입니다.",
    "-lockdown.has": "서버는 현재 락다운 모드입니다.",
    "-unlock.not": "락다운이 켜져있지 않습니다.",
    "-unlock.has": "락다운이 %a님에 의해 해제되었습니다.",
    "-adminchat.has": "당신은 현재 어드민 채널입니다. §e어드민만 채팅을 볼 수 있습니다.",
    "-adminchat.out": "당신은 현재 전체 채널입니다.",
    "-lang.enter": "언어를 입력해주세요.",
    "-lang.unknown": "잘못된 언어, %alanglist를 입력하세요.",
    "-lang.has": "언어가 %a님에 의해 번경되었습니다.",
    "-langlist.list": "언어 목록:",
    ".CommandSystem.no_permission": "이 명령어를 사용할 권한이 없습니다.",
    ".CommandSystem.unknown_command": '잘못된 명령어. "help"를 입력해보세요.',
    ".CommandSystem.command_disabled": "이 명령어는 현재 꺼져있습니다.",
    ".CommandSystem.command_disabled_reason": "이 명령어는 어드민만 사용할 수 있습니다.",
    ".CommandSystem.no_permisson": "이 명령어를 사용할 충분한 권한이 없습니다.",
    ".CommandSystem.no_player": "플레이어를 정확히 입력하세요.",
    ".CommandSystem.unknown_player": "알려지지 않은 플레이어",
    ".CommandSystem.unknown": "잘못된 명령어, %ahelp를 입력하세요.",
    ".CommandSystem.about": "더 많은 정보를 위해 -about을 사용하세요.",
    ".Util.kicked": "당신은 추방되었습니다!",
    ".Util.reason": "사유",
    ".Util.noreason": "제공된 사유 없음",
    ".Util.unknown": "알려지지 않음",
    ".Util.has_failed": "감지 되었습니다.",
    ".Util.formkick": "%a님이 게임에서 자동 추방되었습니다.",
    ".Util.formban": "%a님이 게임에서 자동 벤되었습니다.",
    ".banHandler.banned": "당신은 벤 처리되었습니다.",
    ".banHandler.format": "§c당신은 §l§c벤 §r§c처리되었습니다.\n§r§7남은 시간:§c %a\n§7사유 §c%b§r\n§e%c에 의한 처리",
    ".AdminChat.adminchat": "관리자 채팅",
    ".ChatHandler.muted": "당신은 뮤트되었습니다! 채팅을 칠 수 없습니다.",
    ".dimensionLock.stop": "다른 차원으로 이동할 권한이 없습니다.",
    ".Spam.slowdown": "채팅을 조금 천천히 입력해주세요.",
    ".Spam.repeated": "같은 채팅을 반복해서 입력할 수 없습니다.",
    ".Spam.kicked": "§c%a§g님이 채팅 반복 스팸으로 추방되었습니다.",
    ".Spam.filter": "당신의 메시지는 서버에서 금지된 단어를 포함하고 있습니다.",
    ".Spam.long": "당신의 메시지는 너무 깁니다.",
    ".Spam.blacklist": "금지된 메시지, 경고",
    ".Spam.kickedBlacklist": "§c%a§g님이 서버에서 금지된 단어를 여러 번 입력해 자동으로 추방되었습니다.",
    ">distance": "거리[distance]",
    ">yReach": "y좌표 리치[yreach]",
    ">HitLength": "힛범위[hitlength]+",
    ">Angle": "각도[angle]",
    ">Click Per Second": "초당 클릭 속도[Click Per Second]",
    ">RotSpeed": "RotSpeed",
    ">RotSpeedX": "RotSpeedX",
    ">RotSpeedY": "RotSpeedY",
    ">Type": "타입",
    ">Pos": "Pos",
    ">PosDeff": "PosDeff",
    ">AttackTime": "공격 시간",
    ">UsingItem": "아이템 소지",
    ">Moving": "이동",
    ">Container": "컨테이너",
    ">velocityY": "Y 속도",
    ">velocityXZ": "XZ 속도",
    ">playerSpeed": "플레이어 속도",
    ">Mph": "Mph",
    ">Reach": "리치",
    ">Mode": "모드",
    ">Break": "파괴",
    ">Place": "설치",
    ">GameMode": "게임모드",
    ">illegalLength": "잘못된 길이",
    ">illegalRegax": "잘못된 Regax",
    ">Length": "길이",
    ">Block": "블록",
    ">RotationX": "X회전",
    ">RotationY": "Y회전",
    ">relative": "relative",
    ">Delay": "딜레이",
    ">typeId": "Id 입력",
    ">nameLength": "이름 길이",
    ">CentreDis": "CentreDis",
    ">ItemType": "아이템 타입",
    ">ItemNameLength": "아이템 이름 길이",
    ">ItemLore": "아이템 설명",
    ">EnchantLevel": "인첸트 레벨",
    ">EnchantConflict": "부적절한 인첸트",
    ">ItemEnchantAble": "가능한 아이템 인첸트",
    ">ItemEnchantRepeat": "아이템 인첸트 반복",
    ">ItemAmount": "아이템 갯수",
    ">ItemTag": "아이템 태그",
    ">Amount": "수량",
    ">Ratio": "비율",
    ">Limit": "제한",
    ">BlockPerSecond": "초당 블록 속도[BPS]",
    // Version 3.0.0 or upper version
    ".Util.unfair": "%a의 부적절한 활동",
    ".Util.by": "(행동 즉시 방어)",
    ".Util.operator": "By",
    ".Bot.by": "(봇 방어 액션)",
    ".Spam.by": "(안티-스팸 자동 액션)",
    ".Spam.spamming": "스팸 채팅",
    ".Spam.blacklisted": "금지된 메시지",
    ".Bot.waitUI": "보안상의 이유로, 인증 절차를 밟기 전 채팅을 입력할 수 없습니다. 인증 UI가 나올 때 까지 기다려주세요.",
    ".Bot.expired": "만료된 인증",
    ".Bot.ui": "§a[이 서버는 Matrix Anticheat(메트릭스 안티-치트)에 의해 보호되어 있습니다.]\n§g당신은 봇이 아닐 경우 인증해야합니다.§7(%a/%b)§g\n§e%c§g초 남음\n코드 §e§l%d§r§g를 아래 입력해주세요.",
    ".Bot.title": "안티=봇인증",
    ".Bot.failed": "인증 실패",
    ".Bot.ok": "성공적으로 인증 되었습니다!",
    ".Border.reached": "월드보더에 도달해 해당 위치로 더 나아갈 수 없습니다.",
    ".Border.outside": "월드보더를 넘어선 위치로 벗어날 수 없습니다.",
    ".Border.interact": "월드 보더를 넘어선 곳에서 엔티티 및 블록과 상호작용할 수 없습니다.",
    "-borderSize.enter": "보더 크기를 입력해주세요.",
    "-borderSize.notANum": "숫자가 아닙니다!",
    "-borderSize.between": "보더 크기는 100에서 1,000,000 사이여야합니다!",
    "-borderSize.ok": "보더 크기가 %a로 번경되었습니다.",
    "-help.borderSize": "borderSize <size/default> - 월드 보더 크기를 번경합니다.",
    ".UI.exit": "나가기",
    ".UI.i": "어드민 GUI",
    ".UI.i.a": "플레이어 관리",
    ".UI.i.b": "설정",
};
