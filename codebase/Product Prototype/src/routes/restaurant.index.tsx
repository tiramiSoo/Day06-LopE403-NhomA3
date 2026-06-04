import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { restaurantsQuery } from "@/lib/api/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/restaurant/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All restaurants — Saffron & Smoke" },
      { name: "description", content: "Browse every restaurant in our guide, filtered by cuisine, city, or name." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(restaurantsQuery());
    } catch {
      // If the external API is slow/unreachable during SSR, don't crash —
      // React Query on the client will retry the fetch automatically.
    }
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading restaurants…</p>
      </div>
    </div>
  ),
  component: RestaurantsList,
});

function RestaurantsList() {
  const { data: all } = useSuspenseQuery(restaurantsQuery());
  const { category, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/restaurant" });
  const [query, setQuery] = useState(q ?? "");

  const cuisines = useMemo(() => Array.from(new Set(all.map(r => r.type))).sort(), [all]);

  const results = useMemo(() => {
    return all.filter(r => {
      if (category && r.type !== category) return false;
      if (query) {
        const s = query.toLowerCase();
        if (!r.restaurantName.toLowerCase().includes(s) && !r.address.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [all, category, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">The guide</p>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            {category ? <>All <em className="italic text-primary">{category}</em></> : "Every restaurant we love."}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {results.length} restaurant{results.length === 1 ? "" : "s"} {category ? `serving ${category.toLowerCase()}` : "across the country"}.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-card p-2">
              <Search className="ml-3 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search name or city…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate({ search: { q: query || undefined } })}
                className={`rounded-full border px-3 py-1 text-xs ${!category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
              >
                All
              </button>
              {cuisines.slice(0, 10).map(c => (
                <button
                  key={c}
                  onClick={() => navigate({ search: { category: c, q: query || undefined } })}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {results.length === 0 ? (
          <p className="text-center text-muted-foreground">No restaurants match those filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(r => <RestaurantCard key={r.restaurantID} r={r} />)}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
