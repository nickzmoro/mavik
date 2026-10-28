import { z } from "zod";

const saturdayCustomersSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{1,5}$/.test(value),
    "Use só números, sem pontos ou vírgulas.",
  );

export const storeTrafficFormSchema = z.object({
  saturdays: z.array(saturdayCustomersSchema),
});

export type StoreTrafficFormValues = z.infer<typeof storeTrafficFormSchema>;
