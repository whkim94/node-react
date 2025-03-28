import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logLevels: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];
  private context = 'App';
  private logDir = 'logs';

  constructor(context?: string) {
    if (context) {
      this.context = context;
    }

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: unknown, context?: string): void {
    this.writeLog('log', message, context || this.context);
    console.log(`[${context || this.context}] ${String(message)}`);
  }

  error(message: unknown, trace?: string, context?: string): void {
    const formattedMessage = trace
      ? `${String(message)} - ${trace}`
      : String(message);
    this.writeLog('error', formattedMessage, context || this.context);
    console.error(`[${context || this.context}] ${formattedMessage}`);
  }

  warn(message: unknown, context?: string): void {
    this.writeLog('warn', message, context || this.context);
    console.warn(`[${context || this.context}] ${String(message)}`);
  }

  debug(message: unknown, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.writeLog('debug', message, context || this.context);
      console.debug(`[${context || this.context}] ${String(message)}`);
    }
  }

  verbose(message: unknown, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.writeLog('verbose', message, context || this.context);
      console.log(`[${context || this.context}] VERBOSE: ${String(message)}`);
    }
  }

  private writeLog(level: LogLevel, message: unknown, context: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === 'object' && message !== null
        ? JSON.stringify(message)
        : String(message);

    const logEntry = `${timestamp} [${level.toUpperCase()}] [${context}] ${formattedMessage}\n`;

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${today}-${level}.log`);

    try {
      fs.appendFileSync(logFile, logEntry);

      // Also write to a combined log
      const combinedLogFile = path.join(this.logDir, `${today}-combined.log`);
      fs.appendFileSync(combinedLogFile, logEntry);
    } catch (error) {
      console.error(
        `Failed to write to log file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
