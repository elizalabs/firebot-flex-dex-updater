import { diffLists } from "./utils.ts"

export const OLD_FILE = "./data/old.json"
export const NEW_FILE = "./data/output.json"

diffLists(OLD_FILE, NEW_FILE).catch((e) => {
    console.error(e)
    process.exitCode = 1
})
