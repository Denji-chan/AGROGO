import { z } from "zod";
export const leadSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s()\-]/g, ""))
    .pipe(z.string().regex(/^\+[1-9]\d{8,14}$/)),
  region: z.enum([
    "nukus",
    "khorezm",
    "bukhara",
    "samarkand",
    "tashkent",
    "other",
  ]),
  service: z.enum(["storage", "equipment", "packing", "transport", "export"]),
  role: z.enum(["farmer", "partner"]),
  locale: z.enum(["uz", "ru", "en"]),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
