import { REST, Routes } from "discord.js";
import { Command } from "./type/discord-command";

/**
 * Register commands to discord
 */
const setCommands = async (rest: REST, clientId: string, commands: Command[]) => {
    const data = commands.map((c) => c.data);
    await rest.put(
        Routes.applicationCommands(clientId),
        {
            body: data
        }
    );
};

const addCommands = async (rest: REST, clientId: string, commands: Command[]) => {
    const data = commands.map((c) => c.data);
    await rest.post(
        Routes.applicationCommands(clientId),
        {
            body: data
        }
    );
};

export {
    setCommands, addCommands
};
