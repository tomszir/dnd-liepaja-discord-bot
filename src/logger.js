const path = require('path');
const { consoleFormat } = require('winston-console-format');
const { createLogger, format, transports } = require('winston');

require('winston-daily-rotate-file');

const logger = createLogger({
  level: 'silly',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'dnd-discord-bot' },
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      filename: path.join(__dirname, '../logs/%DATE%-error.log'),
      datePattern: 'DD-MM-YY',
      zippedArchive: true,
      maxSize: '20m'
    }),
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/%DATE%-combined.log'),
      datePattern: 'DD-MM-YY',
      zippedArchive: true,
      maxSize: '20m'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ['timestamp', 'service'],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity
          }
        })
      )
    })
  );
}

module.exports = logger;
