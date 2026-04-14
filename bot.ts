
import client from './src/client.js';
import { LoadCommands } from './src/commands.js';
import { initDB } from './src/db.js';
import { LoadReactions } from './src/reactions.js';
import { LoadResponses } from './src/responses.js';

initDB()
LoadCommands(client)
LoadReactions(client)
LoadResponses(client)