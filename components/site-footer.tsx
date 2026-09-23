export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 py-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          <span className="font-serif text-sm text-foreground">
            College<span className="text-primary">Cards</span>
          </span>{' '}
          — find college football prospects early, flip smarter.
        </p>
        <p className="text-pretty">
          Sales via eBay. Stats provided by CollegeFootballData.com. Prices are estimates, not investment advice.
        </p>
      </div>
    </footer>
  )
}
