"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/db";
import { fields } from "~/db/schema";
import { actionClient } from "~/lib/safe-action";

const schema = z.object({
  coordinates: z.array(z.array(z.number())),
  name: z.string(),
  crop: z.string(),
});

export const createField = actionClient
  .schema(schema)
  .action(async ({ parsedInput: input }) => {
    const data = {
      id: Date.now().toString(),
      cropType: input.crop,
      ...input,
    };
    const result = await db.insert(fields).values(data);
    revalidatePath("/");

    return result;
  });
