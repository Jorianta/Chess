import CONFIG from "./config.js"

export function log (...args: any[]) {
	try {
		let args = Array.from(arguments);

		//create options, import from first argument if provided
		let options: logOptions = {};
		if (typeof args[0] == 'object') {
			options = args.shift();
		}

		//get bot name
		options.botName = CONFIG.botName||'CHESS';

		//create log message string
		let message =
					'\x1b[1m'+ //bold
					'\x1b[37m'+	//white
					'['+CONFIG.botName.toUpperCase()+']'; //bot name

		//add module name
		if (options.module) message += ' ['+options.module.toUpperCase()+']';

		//add error message
		if (options.error) message += '\x1b[31m'+' ERROR: '+'\x1b[0m'+options.error.message;

		//reset formatting
		message+=	'\x1b[0m';

		//insert text at beginning of array
		args.unshift(message);

		//log it
		console.log.apply(args);

		//if debug is enabled and an error was passed, log the error stack
		if (CONFIG.debug && options.error) console.log(options.error);
	} catch (e) {
		console.log('error in logging.js',e);
	}
}

interface logOptions {
    botName?: string
    module?: string
    error?: Error
    message?: string
}

/*global Module, CONFIG, client, error, send, react, sendEmoji, pickRandom, messageHasBotPing, isMod */