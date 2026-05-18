export default function ImpressumPage() {
  return (
    <main className="mx-auto min-h-0 w-full max-w-2xl flex-1 bg-surface px-4 py-12 text-primary md:px-6">
      <div className="stack-section">
        <h1 className="heading-3 font-semibold">Impressum</h1>
        <h2 className="heading-4 font-semibold text-primary">Legal Disclosure (English)</h2>

        <p className="text-base leading-7 text-primary/85">Information in accordance with Section 5 TMG (Germany):</p>
        <ul className="list-none space-y-1 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">Name:</strong> Esma Ari
          </li>
          <li>
            <strong className="text-primary">Address:</strong> Munich, Germany (full address available upon request)
          </li>
          <li>
            <strong className="text-primary">Email:</strong> esmaari.dev@gmail.com
          </li>
        </ul>

        <p className="text-base leading-7 text-primary/85">Angaben gemäß § 5 TMG:</p>
        <ul className="list-none space-y-1 text-base leading-7 text-primary/85">
          <li>
            <strong className="text-primary">Name:</strong> Esma Ari
          </li>
          <li>
            <strong className="text-primary">Anschrift:</strong> München, Deutschland (vollständige Adresse auf Anfrage
            erhältlich)
          </li>
          <li>
            <strong className="text-primary">Email:</strong> esmaari.dev@gmail.com
          </li>
        </ul>
      </div>
    </main>
  )
}
