/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { PrismaClient } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const prisma = new PrismaClient();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Maximum number of requests in the window
}

export class RateLimiter {
  private static async getAttempts(key: string, windowMs: number): Promise<number> {
    const windowStart = new Date(Date.now() - windowMs);
    
    const attempts = await prisma.rateLimitAttempt.count({
      where: {
        key,
        timestamp: {
          gte: windowStart
        }
      }
    });

    return attempts;
  }

  private static async recordAttempt(key: string): Promise<void> {
    await prisma.rateLimitAttempt.create({
      data: {
        key,
        timestamp: new Date()
      }
    });
  }

  static async checkRateLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<{ isAllowed: boolean; remainingAttempts: number }> {
    const attempts = await this.getAttempts(key, config.windowMs);
    const isAllowed = attempts < config.max;
    const remainingAttempts = Math.max(0, config.max - attempts);

    if (isAllowed) {
      await this.recordAttempt(key);
    }

    return { isAllowed, remainingAttempts };
  }
}

// Helper function to format the remaining time window
export function formatTimeWindow(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}


export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()} [${this.context}] ${message} ${metaString}`;
  }

  debug(message: string, meta?: any) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: any) {
    console.info(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage('error', message, meta));
  }
}