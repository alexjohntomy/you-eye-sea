import { PrismaClient } from "../src/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";

function createProductionPrismaClient() {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
  }).$extends(withAccelerate());
}

export function prismaCacheStrategy(ttl: number, swr: number) {
  if (process.env.NODE_ENV === "development")
    return {} as { cacheStrategy?: { ttl: number; swr: number } };
  return { cacheStrategy: { ttl, swr } };
}

const prisma =
  process.env.NODE_ENV === "development"
    ? (new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
      }) as unknown as ReturnType<typeof createProductionPrismaClient>)
    : createProductionPrismaClient();

export default prisma;
