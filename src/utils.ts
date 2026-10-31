import { readFile } from "node:fs/promises"

export const loadJsonFromFile = async (filename: string) => {
    const file = await readFile(filename)
    if (!file) {
        throw `file "${filename}" could not be read, or is empty`
    }
    return JSON.parse(file.toString())
}
