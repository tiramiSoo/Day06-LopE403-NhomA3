import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { MenuItem, Restaurant } from "./restaurants";

const BASE = "https://fakerestaurantapi.runasp.net/api/Restaurant";

/**
 * Server function: fetch all restaurants.
 * Runs on the backend — the external API is never called from the browser.
 */
export const getRestaurants = createServerFn({ method: "GET" })
  .inputValidator(
    z
      .object({
        category: z.string().optional(),
        address: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
  )
  .handler(async ({ data: params }): Promise<Restaurant[]> => {
    const url = new URL(BASE);
    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.address) url.searchParams.set("address", params.address);
    if (params?.name) url.searchParams.set("name", params.name);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load restaurants");
    return res.json();
  });

/**
 * Server function: fetch menu items for a restaurant after its ID is known.
 * Runs on the backend, so the external API is never called from the browser.
 */
export const getRestaurantMenu = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data: { id } }): Promise<MenuItem[]> => {
    const res = await fetch(`${BASE}/${id}/menu`);
    if (!res.ok) throw new Error("Failed to load restaurant menu");
    return res.json();
  });
