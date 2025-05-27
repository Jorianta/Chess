
import client from './src/client.js';
import { LoadCommands } from './src/commands.js';
import { ConnectDatabase } from './src/data.js';
import { LoadReactions } from './src/reactions.js';
import { LoadResponses } from './src/responses.js';

ConnectDatabase(client)
LoadCommands(client)
LoadReactions(client)
LoadResponses(client)