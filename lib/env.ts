import { z } from 'zod';

/** Server-side env schema. Validate in server code (e.g. auth, API client). */
const serverEnvSchema = z.object({
  NEXTAUTH_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().optional(),
  MATA_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Parse and validate server env. Call from server-only code. */
export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MATA_API_URL: process.env.MATA_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });
}

/** Safe parse for optional validation (e.g. build time). */
export function parseServerEnv() {
  return serverEnvSchema.safeParse({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MATA_API_URL: process.env.MATA_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });
}
