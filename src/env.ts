import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  POSTGRES_HOST: z.string().trim().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string().trim().min(1),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string().trim().min(1),
})

export type AppEnv = z.infer<typeof envSchema>

export const loadEnv = (source: NodeJS.ProcessEnv = process.env): AppEnv => {
  return envSchema.parse({
    PORT: source.PORT,
    POSTGRES_HOST: source.POSTGRES_HOST,
    POSTGRES_PORT: source.POSTGRES_PORT,
    POSTGRES_USER: source.POSTGRES_USER,
    POSTGRES_PASSWORD: source.POSTGRES_PASSWORD ?? '',
    POSTGRES_DB: source.POSTGRES_DB,
  })
}
