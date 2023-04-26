# Discord Image Creation Bot

## Requirements

* Node.js above 16.9.0
* Python 3.10.6 (for stable diffusion webui) and add to PATH

## Scripts

* `init.sh` (or `init.bat`) - run `npm install` for download discord bot dependencies    
  run this only one at first time
* `launch-bot.sh` (or `launch-bot.bat`) - run `npm run start:bot` for launch discord bot
* `launch-webui.sh` (or `launch-webui.bat`) - run `npm run start:webui` for launch webui API server

## Setting models

* Put your webui extensions in `resource/sd-files/extensions`.
* Put your Stable-diffusion models in `resource/sd-files/models/Stable-diffusion`.
* Put your Lora models in `resource/sd-files/models/Lora`.
* Put your VAE models in `resource/sd-files/models/VAE`.

This files will be linked into webui (or automatic) files.

## Setting preset

add `resource/preset/*.preset.json` file for using preset-based image generation.    
(for command: `/generate`)

preset interface here

```typescript
// in src/type/image.ts
interface Preset {
    id: number;
    description: string;
    model: {
        name: string;
        hash?: string;
    };
    vae?: string;
    lora?: {
        name: string;
        weight?: number;
    }[];
    sampler?: string;
    defaultPrompt?: string;
    defaultNegativePromt?: string;
    steps: number;
    height: number;
    width: number;
    batchSize?: number;
    scriptArgs?: string[];
}
```

## Setting bot token

copy `resource/discord.example.json` and paste `resource/discord.json`.   
After that edit your discord bot token.

## Setting API Server

copy `resource/webui.example.json` and paste `resource/webui.json`.    
If you want to use AUTOMATIC, edit it to true

## stable-diffusion-webui API

[stable-diffusion-webui API guide](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)

