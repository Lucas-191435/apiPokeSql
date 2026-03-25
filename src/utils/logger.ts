import { addColors, createLogger, format, transports } from 'winston';

addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    verbose: 'magenta',
    debug: 'cyan',
    silly: 'gray',
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        }),
        format.colorize({ all: true }) 
    ),
    transports: [new transports.Console()],
});

export default logger;