import { LRUCache } from 'lru-cache'

type Options = {
  max: number
  ttl: number
}

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const defaultOptions: Options = {
  max: 100,
  ttl: 60 * 1000,
}

export class RateLimiter {
  private cache: LRUCache<string, number>

  constructor(options: Options = defaultOptions) {
    this.cache = new LRUCache<string, number>({
      max: options.max,
      ttl: options.ttl,
    })
  }

  consume(key: string, max: number = 100): RateLimitResult {
    const ttl = this.cache.ttl
    const now = Date.now()
    const windowStart = now - ttl

    const entries = Array.from(this.cache.keys()).filter((k: string) => {
      const entries = k.split(':')
      return parseInt(entries[1] || '0', 10) >= windowStart
    })

    const newCount = entries.length + 1
    const keyWithTimestamp = `${key}:${now}`
    this.cache.set(keyWithTimestamp, newCount)

    return {
      success: newCount <= max,
      limit: max,
      remaining: Math.max(0, max - newCount),
      reset: Math.ceil((ttl - (now % ttl)) / 1000),
    }
  }

  private getCount(key: string): number {
    let count = 0
    for (const k of this.cache.keys()) {
      if (k.startsWith(`${key}:`)) {
        count += this.cache.get(k) || 0
      }
    }
    return count
  }
}

export const authRateLimiter = new RateLimiter({ max: 10, ttl: 15 * 60 * 1000 })
export const registerRateLimiter = new RateLimiter({ max: 3, ttl: 60 * 60 * 1000 })

export function getClientIP(req: Request): string {
  const headers = req.headers
  const forwarded = headers.get('x-forwarded-for')
  const cfConnecting = headers.get('cf-connecting-ip')
  const xRealIp = headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (cfConnecting) {
    return cfConnecting.trim()
  }
  if (xRealIp) {
    return xRealIp.trim()
  }
  return 'unknown'
}
