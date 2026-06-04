import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Star, Clock, Car, Phone } from "lucide-react";
import {
  restaurantMenuQuery,
  restaurantsQuery,
  ratingFor,
  priceFor,
  minutesFor,
  cityOf,
} from "@/lib/api/restaurants";
import { RestaurantCard, imageFor } from "@/components/RestaurantCard";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const Route = createFileRoute("/restaurant/$id")({
  loader: async ({ context, params }) => {
    const id = Number(params.id);
    if (Number.isNaN(id)) throw notFound();
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(restaurantsQuery()),
        context.queryClient.ensureQueryData(restaurantMenuQuery(id)),
      ]);
    } catch {
      // If the external API is slow/unreachable during SSR, don't crash —
      // React Query on the client will retry the fetch automatically.
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `Restaurant #${params.id} — Saffron & Smoke` },
      { name: "description", content: "Read the full review, hours, address, and book your table." },
    ],
  }),
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading restaurant…</p>
      </div>
    </div>
  ),
  component: RestaurantDetail,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>Restaurant not found. <Link to="/restaurant" className="text-primary underline">Back to guide</Link></p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <p className="text-destructive">{error.message}</p>
        <Link to="/restaurant" className="mt-4 inline-block text-primary underline">Back to guide</Link>
      </div>
    </div>
  ),
});

function RestaurantDetail() {
  const { id } = Route.useParams();
  const rid = Number(id);
  const { data: all } = useSuspenseQuery(restaurantsQuery());
  const { data: menu } = useSuspenseQuery(restaurantMenuQuery(rid));
  const r = all.find(x => x.restaurantID === rid);

  if (!r) throw notFound();

  const similar = all.filter(x => x.type === r.type && x.restaurantID !== r.restaurantID).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <article>
        {/* HERO */}
        <section className="relative">
          <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
            <img src={imageFor(r)} alt={r.restaurantName} width={1600} height={900} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
          <div className="mx-auto -mt-32 max-w-5xl px-6 pb-6">
            <Link to="/restaurant" className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-background">
              <ArrowLeft className="h-4 w-4" /> Back to guide
            </Link>
            <div className="mt-4 rounded-3xl border border-border bg-card p-8 shadow-2xl md:p-12">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="rounded-full bg-accent/20 px-3 py-1 font-semibold text-accent-foreground">{r.type}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {cityOf(r.address)}</span>
              </div>
              <h1 className="mt-4 font-display text-5xl font-bold leading-tight md:text-6xl">{r.restaurantName}</h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-4 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Star className="h-4 w-4 fill-accent text-accent" /> {ratingFor(r.restaurantID)} <span className="font-normal text-muted-foreground">/ 5</span>
                </span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {minutesFor(r.restaurantID)} min from you</span>
                <span className="flex items-center gap-2 font-medium">{priceFor(r.restaurantID)}</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Car className="h-4 w-4" /> {r.parkingLot ? "Parking available" : "No parking"}
                </span>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h2 className="font-display text-2xl font-semibold">The story</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Tucked into {r.address}, {r.restaurantName} has been pulling crowds for its
                    devotion to {r.type.toLowerCase()}. Expect generous portions, clattering plates,
                    and the kind of regulars who order without ever opening the menu.
                  </p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    The kitchen leans into slow, careful technique — long braises, freshly pounded
                    masalas, and ghee that never apologizes for itself. Come hungry.
                  </p>

                  <h3 className="mt-8 font-display text-xl font-semibold">Menu</h3>
                  {menu.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">No menu items are available for this restaurant yet.</p>
                  ) : (
                    <ul className="mt-3 grid gap-2 text-sm">
                      {menu.map(item => (
                        <li key={item.itemID} className="flex justify-between gap-4 border-b border-dashed border-border py-2">
                          <span>
                            <span className="font-medium text-foreground">{item.itemName}</span>
                            {item.itemDescription ? (
                              <span className="mt-1 block text-xs text-muted-foreground">{item.itemDescription}</span>
                            ) : null}
                          </span>
                          <span className="shrink-0 font-medium text-foreground">₹{item.itemPrice}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <aside className="space-y-4 rounded-2xl bg-secondary/50 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Address</p>
                    <p className="mt-1 font-medium">{r.address}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Hours</p>
                    <p className="mt-1 font-medium">12:00 – 23:00, daily</p>
                  </div>
                  <a href="#" className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
                    <Phone className="h-4 w-4" /> Reserve a table
                  </a>
                  <button className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm font-medium">
                    Save to list
                  </button>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">More {r.type}</p>
            <h2 className="mt-3 font-display text-4xl font-bold">Other tables in the same key.</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map(x => <RestaurantCard key={x.restaurantID} r={x} />)}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
