import { z } from 'zod';
import { insertMoodLogSchema, moodLogs } from './schema';

export const api = {
  mood: {
    analyze: {
      method: 'POST' as const,
      path: '/api/mood' as const,
      input: z.object({
        method: z.enum(['face', 'self']),
        data: z.string().optional(), // Text for 'self', Base64/URL for 'face'
      }),
      responses: {
        200: z.object({
          mood: z.string(),
          confidence: z.number(),
          recommendations: z.object({
            outfit: z.array(z.string()),
            playlist: z.string(),
            workout: z.string(),
            food: z.string(),
            affirmation: z.string(),
            productivity: z.string(),
          }),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/mood/history' as const,
      responses: {
        200: z.array(z.custom<typeof moodLogs.$inferSelect>()),
      },
    },
  },
};
