import { createLogger, transports, format } from 'winston';
import * as fs from 'fs';
import path from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { logDir, nodeEnv } from '../environmentVariables';

let dir = logDir;
if (!dir) dir = path.resolve('logs');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logLevel = nodeEnv === 'development' ? 'debug' : 'info';

const winstonFormatFile = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const winstonFormatConsole = format.combine(
  format.colorize({
    all: true,
  }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.align(),
  format.printf(
    (info) =>
      `[timestamp : ${info.timestamp}] [level: ${info.level}] : ${info.message}`,
  ),
);

const options = {
  file: {
    level: 'info',
    filename: dir + '/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '21d',
  },
};

const transportfile: DailyRotateFile = new DailyRotateFile(options.file);
transportfile.on('rotate', function (oldFilename, newFilename) {});

//creates a logger instace and exports it. It logs to a daily rotate file
export default createLogger({
  format: winstonFormatFile,
  level: 'warn',
  transports: [
    transportfile,
    new transports.Console({
      level: logLevel,
      format: winstonFormatConsole,
    }),
  ],
});
