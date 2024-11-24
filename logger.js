// logger.js
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Устанавливаем уровень логирования
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Добавляем временную метку
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // Выводим логи в консоль
    new transports.File({ filename: 'app.log' }), // Также сохраняем в файл
  ],
});

export default logger;
