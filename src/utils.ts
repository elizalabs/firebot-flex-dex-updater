import { readFile } from "node:fs/promises"

export const loadJsonFromFile = async (filename: string) => {
    const file = await readFile(filename)
    if (!file) {
        throw `file "${filename}" could not be read, or is empty`
    }
    return JSON.parse(file.toString())
}

const loadListFromFile = async (file: string) => {
    const data = await loadJsonFromFile(file)
    const content: { [key: string]: string } = {}
    for (let i = 0; i < data.length; i += 2) {
        if (data[i] === "update_timestamp") {
            continue
        }
        content[data[i]] = data[i + 1]
    }
    return content
}

export async function diffLists(OLD_FILE: string, NEW_FILE: string) {
    const oldData = await loadListFromFile(OLD_FILE)
    const newData = await loadListFromFile(NEW_FILE)

    const diff: { old_only: string[]; new_only: string[] } = {
        old_only: [],
        new_only: [],
    }

    console.log("--- REMOVED: ---")
    for (const id in oldData) {
        if (oldData[id] && !newData[id]) {
            diff.old_only.push(oldData[id])
            console.log(`${id}: ${oldData[id]}`)
        }
    }

    console.log("--- ADDED: ---")
    for (const id in newData) {
        if (newData[id] && !oldData[id]) {
            diff.old_only.push(newData[id])
            console.log(`${id}: ${newData[id]}`)
        }
    }
}
