import { loadJsonFromFile } from "./index.ts"

const OLD_FILE = "./data/old.json"
const NEW_FILE = "./data/output.json"

const loadFromFile = async (file: string) => {
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

async function main() {
    const oldData = await loadFromFile(OLD_FILE)
    const newData = await loadFromFile(NEW_FILE)

    const diff: { old_only: string[]; new_only: string[] } = {
        old_only: [],
        new_only: [],
    }

    console.log("--- OLD ONLY: ---")
    for (const id in oldData) {
        if (oldData[id] && !newData[id]) {
            diff.old_only.push(oldData[id])
            console.error(`${id}: ${oldData[id]}`)
        }
    }

    console.log("--- NEW ONLY: ---")
    for (const id in newData) {
        if (newData[id] && !oldData[id]) {
            diff.old_only.push(newData[id])
            console.error(`${id}: ${newData[id]}`)
        }
    }
}

main().catch((e) => {
    console.error(e)
    process.exitCode = 1
})
