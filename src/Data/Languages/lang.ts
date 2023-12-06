import { world } from "@minecraft/server";
import en_US from "./en_US";
import config from "../Config";
import zh_TW from "./zh_TW";
import ar_DZ from "./ar_DZ";
import vi_VN from "./vi_VN";
import { LangType } from "./LangType";

let languageNow = config.language

export const langs: { [key: string]: { [key: string]: LangType | string } } = {
    "en_US": en_US,
    "zh_TW": zh_TW,
    "ar_DZ": ar_DZ,
    "vi_VN": vi_VN
}

world.afterEvents.worldInitialize.subscribe(() => {
    const language = world.getDynamicProperty("matrix:language") as string
    if (language === undefined) return
    
    languageNow = language
})

export function changeLanguage (lang: string) {
    if (Object.keys(langs).includes(lang)) {
        languageNow = lang
        world.setDynamicProperty("matrix:language", lang)
        return true
    }
    return false
}
export const getAllLang = () => Object.keys(langs)

export default function (key: LangType): string {
    return langs[languageNow][key] ?? "[???]"
}
