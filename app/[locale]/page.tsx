import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-app text-on-dark">
      {/* Vue HomeView: CT_bg.png full-bleed background */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/CT_bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Moon & stars (Vue positions: sm:left-16 md:left-40 lg:left-48) */}
      <Image
        src="/images/Moon_and_stars.svg"
        alt=""
        width={140}
        height={184}
        priority
        className="pointer-events-none w-18 absolute left-2 top-0 sm:left-8  sm:w-20 md:left-20  md:w-28 lg:left-24 lg:w-36"  
      />

      {/* Witch fool illustration (Vue: top/right responsive) */}
      <div className="pointer-events-none absolute right-2 top-1 w-24 sm:right-6 sm:top-8 sm:w-30 md:top-10 md:w-38 md:right-12 lg:right-20 lg:top-12 lg:w-46">
        <Image
          src="/images/witchfool.png"
          alt=""
          width={192}
          height={192}
          className="h-auto w-full object-contain object-top"
          priority
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 sm:min-h-[calc(100vh-10rem)]">
        <div className="w-full">
          <div className="flex flex-col gap-4 text-center">
            <div className="text-xs font-semibold tracking-[0.2em] text-heading">COSMICTRACK</div>

            <h1 className="heading-display-2 text-heading">
              Track your <br /> journey.
              <br />
              One step at a time.
            </h1>

            <p className="font-body text-base leading-7 text-on-dark/80">
              A calm space for journaling your journeys, organizing steps, and keeping focus with
              categories and favorites.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild variant="cosmicPrimary" size="cosmicLg">
              <Link href="/auth">Sign in / Sign up</Link>
            </Button>

            <Button asChild variant="cosmicSecondary" size="cosmicLg">
              <Link href="/tarot">Explore tarot</Link>
            </Button>
          </div>

          {/* Vue: tarot icons w-16 */}
          <div className="mt-12 flex items-center justify-center gap-5">
            {[
              { src: "/icons/cup.svg", alt: "Cup" },
              { src: "/icons/sword.svg", alt: "Sword" },
              { src: "/icons/wand.svg", alt: "Wand" },
              { src: "/icons/pentacle.svg", alt: "Pentacle" },
            ].map((item) => (
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={64}
                height={64}
                className="opacity-90"
              />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-on-dark/60">Built for focus. Designed for calm.</p>
      </div>
    </main>
  )
}
