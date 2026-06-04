import { Link } from "@tanstack/react-router";
import { MapPin, Star, Clock, Car } from "lucide-react";
import {
  type Restaurant,
  cityOf,
  stateOf,
  ratingFor,
  priceFor,
  minutesFor,
} from "@/lib/api/restaurants";
import biryani from "@/assets/dish-biryani.jpg";
import dosa from "@/assets/dish-dosa.jpg";
import curry from "@/assets/dish-curry.jpg";
import thali from "@/assets/dish-thali.jpg";

const POOL = [biryani, curry, dosa, thali];

export function imageFor(r: Restaurant) {
  const t = r.type.toLowerCase();
  if (t.includes("biryani") || t.includes("hyderabadi")) return biryani;
  if (t.includes("south") || t.includes("dosa") || t.includes("kerala")) return dosa;
  if (t.includes("thali") || t.includes("gujarati") || t.includes("rajasthani")) return thali;
  if (t.includes("mughlai") || t.includes("north") || t.includes("punjabi")) return curry;
  return POOL[r.restaurantID % POOL.length];
}

export function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(r.restaurantID) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageFor(r)}
          alt={r.restaurantName}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground backdrop-blur">
          {r.type}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-primary-foreground">
          <h3 className="font-display text-2xl font-semibold leading-tight text-white drop-shadow">
            {r.restaurantName}
          </h3>
          <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            <Star className="h-3 w-3 fill-current" /> {ratingFor(r.restaurantID)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-5 py-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {cityOf(r.address)}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {minutesFor(r.restaurantID)} min</span>
        <span className="flex items-center gap-1.5">
          {r.parkingLot ? <Car className="h-3.5 w-3.5" /> : null}
          <span className="font-medium text-foreground">{priceFor(r.restaurantID)}</span>
        </span>
      </div>
    </Link>
  );
}

export { cityOf, stateOf };
