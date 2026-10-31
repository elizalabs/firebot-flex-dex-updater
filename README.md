# update firebot dexid list

## how to use in firebot

see [Releases](https://github.com/elizalabs/firebot-flex-dex-updater/releases) to download the latest `dexid.txt`.

[NibsNook](https://www.twitch.tv/nibsnook) has written some [amazing instructions](https://docs.google.com/document/d/1tE0USZYQvxiRtLvWo-ybimKuNKkK4yxgN19IEC6sq1o/edit) for using the Firebot Shiny Flex setup.

## about

this is a compliment to the amazing Firebot Shiny Flex setup by [Akek0l](https://www.twitch.tv/akek0l) for [Pokemon Community Game](https://dashboard.twitch.tv/extensions/pm0qkv9g4h87t5y6lg329oam8j7ze9-1.5.2) on Twitch. Ake's setup has an event that listens for PCG's responses to `!pokeflex`/`!pokebuddy` commands and displays the shiny sprite on Firebot's overlay, so people can really show off those beautiful shinies.

Ake's Shiny Flex setup requires mapping the pokemon's display name from PCG to their pokedex ID. this mapping is a simple JSON array, where odd elements are IDs and even elements are pokemon display names, in lowercase. prior to this project, the mapping needed to be updated manually every time a pokemon was added to PCG, and in some cases required seeing or guessing the display name.

this project seeks to automate the process as much as possible. PCG doesn't have a publicly accessible list of pokemon with their display names and IDs, so there is one manual step of saving the pokedex list from the PCG extension (see below). using the pokedex list ensures that every pokemon that is currently in the pokedex is included in the mapping. the pokedex list does not include the display name, so this project gets the display name from PCG's translation file.

## get current pokedex list

1. popout the pcg extension
2. open devtools
3. in the pcg extension, navigate to the pokedex page
4. in devtools, find the response for request `/api/game/ext/trainer/pokedex/v2/`
   - this request requires authentication with your token from twitch, which is why we can't grab it automatically
5. save this as `data/pokedex.json`

## running

### prerequisites

- `node` & `npm`
- run `npm install` if you plan to do any development work in Visual Studio Code or similar
  - this project does not require any dependencies to run, but this is required for type checking in your editor

### creating the mapping

ensure that `data/pokedex.json` is up to date (see above) then run

`npm run exec`

this updates `data/output.json`, which contains the dexid mappings. you can copy this into firebot.

### comparing the mapping to an old one

if you have an old dexids mapping in your firebot or sent to you on discord, you can check which pokemon changed between that list and the new mapping. run `npm run exec` as above to create the new mapping, and save the old mapping to `data/old.json`. then run

`npm run check`

this will output a list of pokemon that are only present in the old mapping or the new mapping.
