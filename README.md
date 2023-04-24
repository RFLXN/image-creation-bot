# Discord Image Creation Bot

## Requirements

* Node.js above 16.9.0
* Python 3.10.6 (for stable diffusion webui) and add to PATH

## Scripts

* start:bot (`npm run start:bot`): Start discord bot.
* start:webui (`npm run start:webui`): Start webui API server.

## Setting preset

add `resource/preset/*.preset.json` file for using preset-based image generation.    
(for command: `/generate basic`)

preset interface here

```typescript
// in src/type/image.ts
interface Preset {
    id: number;
    description: string;
    model: {
        name: string;
        hash: string;
    };
    vae?: string;
    lora?: {
        name: string;
        weight?: number;
    }[];
    sampler?: string;
    defaultPrompt?: string;
    steps: number;
    height: number;
    width: number;
    batchSize?: number;
}
```

## Setting bot token

copy `resource/discord.example.json` and paste `resource/discord.json`.   
after that edit your discord bot token.

## stable-diffusion-webui API

[stable-diffusion-webui API guide](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)

