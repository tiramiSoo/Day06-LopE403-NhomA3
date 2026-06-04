import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/restaurant" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">Saffron</span>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">&amp; Smoke</span>
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/restaurant" className="transition-colors hover:text-foreground">Restaurants</Link>
        </nav>
        <Link
          to="/restaurant"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Reserve a table
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">Saffron &amp; Smoke</p>
          <p className="mt-2 text-sm text-muted-foreground">A curated guide to the most loved restaurants across India.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Hyderabad</li><li>Delhi</li><li>Mumbai</li><li>Bangalore</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Cuisine</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Biryani</li><li>Mughlai</li><li>South Indian</li><li>Bengali</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Letters</p>
          <p className="mt-3 text-sm text-muted-foreground">A weekly dispatch on what to eat, where, and why.</p>
          <form className="mt-3 flex gap-2">
            <input className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm" placeholder="you@table.com" />
            <button className="rounded-full bg-foreground px-4 py-2 text-sm text-background">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Saffron &amp; Smoke. Data from FakeRestaurantAPI.
      </div>
    </footer>
  );
}
