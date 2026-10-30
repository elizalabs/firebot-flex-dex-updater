import { readFile, writeFile } from "node:fs/promises"

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

export const loadJsonFromFile = async (filename: string) => {
    const file = await readFile(filename)
    if (!file) {
        throw `file "${filename}" could not be read, or is empty`
    }
    return JSON.parse(file.toString())
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

    const output = ["update_timestamp", new Date().toISOString()]
    for (const dex of pokedex.dex) {
        const translation = translations.translations[dex.name]
        if (!translation) {
            throw `${dex.pokedexId} has no translation? ${dex.name}`
        }

        output.push(`${dex.pokedexId}`)
        output.push(translation.toLowerCase())
    }

    writeFile("./data/output.json", JSON.stringify(output, null, 2))
}

main().catch(console.error)
