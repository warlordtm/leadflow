type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LogContext = Record<string, unknown>

class Logger {
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(context || {}),
    })
  }

  info(message: string, context?: LogContext): void {
    if (this.isProduction) {
      console.log(this.formatMessage('info', message, context))
    } else {
      console.log(`[\x1b[36mINFO\x1b[0m] ${message}`, context || '')
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.isProduction) {
      console.warn(this.formatMessage('warn', message, context))
    } else {
      console.warn(`[\x1b[33mWARN\x1b[0m] ${message}`, context || '')
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.isProduction) {
      console.error(this.formatMessage('error', message, context))
    } else {
      console.error(`[\x1b[31mERROR\x1b[0m] ${message}`, context || '')
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isProduction) return
    console.debug(`[\x1b[35mDEBUG\x1b[0m] ${message}`, context || '')
  }
}

export const logger = new Logger()
