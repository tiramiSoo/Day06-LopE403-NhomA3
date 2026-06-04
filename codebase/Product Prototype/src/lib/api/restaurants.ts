import { queryOptions } from "@tanstack/react-query";
import { getRestaurants, getRestaurantMenu } from "./restaurants.functions";

export interface Restaurant {
  restaurantID: number;
  restaurantName: string;
  address: string;
  type: string;
  parkingLot: boolean;
}

export interface MenuItem {
  itemID: number;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  imageUrl?: string;
  restaurantID?: number;
  restaurantName?: string;
}

export const restaurantsQuery = (params?: { category?: string }) =>
  queryOptions({
    queryKey: ["restaurants", params ?? {}],
    queryFn: () => getRestaurants({ data: params }),
    staleTime: 60_000,
  });

export const restaurantMenuQuery = (id: number) =>
  queryOptions({
    queryKey: ["restaurant-menu", id],
    queryFn: () => getRestaurantMenu({ data: { id } }),
    staleTime: 60_000,
  });

// Deterministic helpers for richer UI from minimal data
export function cityOf(address: string) {
  return address.split(",")[0]?.trim() ?? address;
}
export function stateOf(address: string) {
  const parts = address.split(",").map((s) => s.trim());
  return parts[parts.length - 1] ?? "";
}
export function ratingFor(id: number) {
  // 3.8 – 4.9
  return (3.8 + ((id * 37) % 12) / 10).toFixed(1);
}
export function priceFor(id: number) {
  return ["$$", "$$$", "$$", "$$$$", "$$"][id % 5];
}
export function minutesFor(id: number) {
  return 18 + (id * 7) % 35;
}
