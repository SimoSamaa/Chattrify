import winston from 'winston';

const isDev = process.env.DEV_MODE === 'development';

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      silent: !isDev,
    }),
  ],
});

export default logger;
