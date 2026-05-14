export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 bg-surface px-4 py-12 text-primary md:px-6">
      <div className="stack-section">
        <header className="stack-tight">
          <h1 className="heading-3 font-semibold">Privacy Notice</h1>
          <p className="text-base leading-7 text-primary/85">How we handle your email and account data on CosmicTrack.</p>
        </header>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>Email address (required for login/register and account recovery).</li>
            <li>Basic profile data you provide (e.g., name, avatar).</li>
            <li>Usage data you create in the app (journeys, steps, categories, favorites).</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">Why we collect it</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>Authenticate you and secure your account.</li>
            <li>Sync your journeys and categories across devices.</li>
            <li>Send essential account emails (confirmation, reset, security).</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">
            What we do <span className="font-normal">(and don&apos;t do)</span>
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>No selling or sharing emails with third parties for marketing.</li>
            <li>No marketing emails without your explicit opt-in.</li>
            <li>We use Supabase as our backend; data is stored and secured there.</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">Your choices</h2>
          <ul className="list-disc space-y-1 pl-5 text-base leading-7 text-primary/85">
            <li>Request account deletion to remove your data from our systems.</li>
            <li>Update your profile info anytime in the app.</li>
          </ul>
        </section>

        <section className="stack-tight">
          <h2 className="text-xl font-semibold text-primary">Questions</h2>
          <p className="text-base leading-7 text-primary/85">
            If you have any privacy questions or requests, contact us at{" "}
            <a
              href="mailto:esmaari.dev@gmail.com"
              className="font-medium text-secondary underline-offset-2 hover:underline"
            >
              esmaari.dev@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
