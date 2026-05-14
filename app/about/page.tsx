export default function AboutPage() {
  return (
    <main className="mx-auto min-h-0 w-full max-w-2xl flex-1 bg-surface px-4 py-12 text-primary md:px-6">
      <div className="stack-section">
        <h1 className="heading-3 font-semibold">About CosmicTrack</h1>
        <p className="text-base leading-7 text-primary/85">
          CosmicTrack is a personal project to help you track your tarot journeys, categorize insights,
          and reflect through symbolic patterns.
        </p>
        <p className="text-base leading-7 text-primary/85">
          Built with ❤️ using Next.js, Supabase and Tailwind CSS.
        </p>
        <ul className="list-none space-y-2 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">Email:</strong> esmaari.dev@gmail.com
          </li>
          <li>
            <strong className="text-primary">Instagram:</strong> @kozmiktarotesma
          </li>
          <li>
            <strong className="text-primary">GitHub:</strong>{" "}
            <a
              href="https://github.com/esmaari"
              className="text-secondary underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github.com/esmaari
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
