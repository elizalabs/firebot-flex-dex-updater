import { copyFile, rm, writeFile } from "node:fs/promises"
import { diffLists, loadJsonFromFile } from "./utils.ts"

export const OLD_FILE = "./data/_tmp_old.json"
export const NEW_FILE = "./data/output.json"

const LOCAL_TRANSLATIONS = false

const LOCAL_TRANSLATION_FILE = "./data/translations.json"
const REMOTE_TRANSLATION_FILE = "https://poketwitch.bframework.de/api/game/ext/fetch-translations/"
const LOCAL_POKEDEX_FILE = "./data/pokedex.json"

interface Translation {
    translations: {
        [key: string]: string
    }
    language: string
}
interface Pokedex {
    dex: {
        name: string
        pokedexId: number
    }[]
}

const loadTranslations = async (): Promise<Translation> => {
    if (LOCAL_TRANSLATIONS) {
        return loadJsonFromFile(LOCAL_TRANSLATION_FILE)
    } else {
        return (await fetch(REMOTE_TRANSLATION_FILE)).json() as Promise<Translation>
    }
}

async function main() {
    const translations: Translation = await loadTranslations()
    const pokedex: Pokedex = await loadJsonFromFile(LOCAL_POKEDEX_FILE)

    pokedex.dex.sort(({ pokedexId: a }, { pokedexId: b }) => {
        if (a === b) return 0
        else if (Number(a) < Number(b)) return -1
        else return 1
    })

    const output = ["update_timestamp", new Date().toISOString()]
    for (const dex of pokedex.dex) {
        const translation = translations.translations[dex.name]
        if (!translation) {
            throw `${dex.pokedexId} has no translation? ${dex.name}`
        }

        output.push(`${dex.pokedexId}`)
        output.push(translation.toLowerCase())
    }

    await copyFile(NEW_FILE, OLD_FILE)

    await writeFile(NEW_FILE, JSON.stringify(output, null, 2))

    await diffLists(OLD_FILE, NEW_FILE)

    await rm(OLD_FILE)
}

main().catch((e) => {
    console.error(e)
    process.exitCode = 1
})
