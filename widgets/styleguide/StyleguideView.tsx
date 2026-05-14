"use client"

import { useState } from "react"
import {
  Bell,
  Cloud,
  Eye,
  Flame,
  Globe,
  Heart,
  Key,
  Moon,
  Play,
  Sparkles,
  Star,
  Trash2,
  ChevronUp,
  Menu,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import { cn } from "@/lib/utils"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="heading-3 mb-4 border-b border-border-neutral pb-2 font-semibold text-primary">{children}</h2>
  )
}

function SubTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("mb-3 text-base font-medium text-primary", className)}>{children}</h3>
}

function Swatch({ boxClass, label }: { boxClass: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("h-12 w-20 rounded-md border border-border-neutral shadow-sm", boxClass)} />
      <p className="max-w-44 text-center text-xs leading-snug text-primary/80">{label}</p>
    </div>
  )
}

const CAT_COLORS = [
  "bg-cat-energy",
  "bg-cat-love",
  "bg-cat-nature",
  "bg-cat-spiritual",
  "bg-cat-priority",
  "bg-cat-knowledge",
  "bg-cat-work",
  "bg-cat-neutral",
] as const

const COSMIC_BUTTON_VARIANTS = [
  "cosmicPrimary",
  "cosmicSecondary",
  "cosmicSuccess",
  "cosmicWarning",
  "cosmicError",
  "cosmicTertiary",
  "cosmicLinkLight",
  "cosmicLinkDark",
] as const

const SHADCN_BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const

export default function StyleguideView() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  return (
    <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 space-y-12 bg-surface px-4 py-10 text-primary md:px-6">
      <div>
        <h1 className="heading-2 mb-2 font-bold">Styleguide</h1>
        <p className="text-sm text-primary/75">
          CosmicTrack Pro — Tailwind <code className="rounded bg-input px-1 py-0.5 text-xs">@theme</code>,{" "}
          <code className="rounded bg-input px-1 py-0.5 text-xs">globals.css</code> components layer, shadcn{" "}
          <code className="rounded bg-input px-1 py-0.5 text-xs">Button</code>, and shared inputs.
        </p>
      </div>

      {/* —— Colors (Vue cosTraStyleguide parity) —— */}
      <section className="stack-section">
        <SectionTitle>Backgrounds</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <Swatch boxClass="bg-app" label="bg-app — night-sky #1f1a2e" />
          <Swatch boxClass="bg-app-darker" label="bg-app-darker #151319" />
          <Swatch boxClass="bg-surface" label="bg-surface — moonlight-cream" />
          <Swatch boxClass="bg-input" label="bg-input — lunar-ivory" />
          <Swatch boxClass="bg-footer-heading" label="bg-footer-heading — dark-gold" />
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Text & accents</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <Swatch boxClass="bg-heading" label="bg-heading — cosmic-gold" />
          <Swatch boxClass="bg-secondary" label="bg-secondary — mystic-violet (theme)" />
          <Swatch boxClass="bg-light" label="bg-light — star-ash" />
          <Swatch boxClass="bg-on-dark" label="bg-on-dark — button-text" />
          <Swatch boxClass="bg-favorite" label="bg-favorite — cosmic-amethyst" />
        </div>
        <p className="mt-3 text-sm text-primary/70">
          Typography defaults use <code className="text-xs">text-primary</code> on headings/body;{" "}
          <code className="text-xs">heading-secondary</code> → <code className="text-xs">text-secondary</code>.
        </p>
      </section>

      <section className="stack-section">
        <SubTitle>Primary button tokens</SubTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <Swatch boxClass="bg-btn-primary" label="btn-primary base" />
          <Swatch boxClass="bg-btn-primary-hover" label="hover" />
          <Swatch boxClass="bg-btn-primary-pressed" label="pressed" />
          <Swatch boxClass="bg-btn-primary-disabled" label="disabled" />
          <Swatch boxClass="bg-btn-primary-text" label="text on primary" />
        </div>
        <SubTitle className="mt-6">Secondary button tokens</SubTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <Swatch boxClass="bg-btn-secondary" label="btn-secondary" />
          <Swatch boxClass="bg-btn-secondary-hover" label="hover" />
          <Swatch boxClass="bg-btn-secondary-pressed" label="pressed" />
          <Swatch boxClass="bg-btn-secondary-disabled" label="disabled" />
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Status</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Swatch boxClass="bg-success" label="bg-success — sage-green" />
          <Swatch boxClass="bg-warning" label="bg-warning — solar-amber" />
          <Swatch boxClass="bg-error" label="bg-error — mars-red" />
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Borders & ring</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Swatch boxClass="border-2 border-border-neutral bg-surface" label="border-border-neutral" />
          <Swatch boxClass="border-2 border-border-dark bg-app" label="border-border-dark (on app)" />
          <Swatch boxClass="bg-surface ring-2 ring-ring-neutral" label="ring-ring-neutral" />
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Category colors</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4">
          {CAT_COLORS.map((c) => (
            <Swatch key={c} boxClass={c} label={c} />
          ))}
        </div>
      </section>

      <hr />

      <section className="stack-section">
        <SectionTitle>Typography (globals.css)</SectionTitle>
        <div className="stack-tight space-y-4 rounded-lg border border-border-neutral bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-primary/60">Forum — display</p>
          <h2 className="heading-display-2 text-heading">heading-display-2 (primary tone)</h2>
          <h2 className="heading-display-2 heading-secondary">heading-display-2 + heading-secondary</h2>
          <p className="text-xs font-medium uppercase tracking-wide text-primary/60">Roboto scale</p>
          <h2 className="heading-1">heading-1</h2>
          <h2 className="heading-1 heading-secondary">heading-1 + heading-secondary</h2>
          <h3 className="heading-2">heading-2</h3>
          <h3 className="heading-3">heading-3</h3>
          <h4 className="heading-4">heading-4</h4>
          <p>Default paragraph (p)</p>
          <p className="heading-secondary">Paragraph + heading-secondary</p>
          <p className="sm">p.sm — small</p>
          <p className="lead">p.lead — lead</p>
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Stack utilities</SectionTitle>
        <div className="rounded-lg border border-dashed border-border-neutral p-4 text-sm">
          <code className="text-xs">stack-block</code>, <code className="text-xs">stack-section</code>,{" "}
          <code className="text-xs">stack-card</code>, <code className="text-xs">stack-tight</code>,{" "}
          <code className="text-xs">stack-row</code>, <code className="text-xs">stack-grid</code> — vertical/horizontal
          spacing helpers in <code className="text-xs">@layer components</code>.
        </div>
      </section>

      {/* —— Cosmic buttons: same globals `.btn` rules, always via <Button> —— */}
      <section className="stack-section">
        <SectionTitle>Cosmic buttons (globals .btn via Button)</SectionTitle>
        <p className="mb-3 text-sm text-primary/75">
          Cosmic <code className="text-xs">variant</code> values map to <code className="text-xs">btn btn-*</code> in{" "}
          <code className="text-xs">components/ui/button.tsx</code>; styles live in{" "}
          <code className="text-xs">globals.css</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="cosmicPrimary" size="cosmicSm">
            btn-primary btn-sm
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicMd">
            btn-primary
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicLg">
            btn-primary btn-lg
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicMd" disabled>
            disabled
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="cosmicSecondary" size="cosmicMd">
            btn-secondary
          </Button>
          <Button type="button" variant="cosmicTertiary" size="cosmicMd">
            btn-tertiary
          </Button>
          <Button type="button" variant="cosmicSuccess" size="cosmicMd">
            btn-success
          </Button>
          <Button type="button" variant="cosmicWarning" size="cosmicMd">
            btn-warning
          </Button>
          <Button type="button" variant="cosmicError" size="cosmicMd">
            btn-error
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 rounded-lg bg-app p-4">
          <Button type="button" variant="cosmicTertiaryOnDark" size="cosmicMd">
            btn-tertiary-on-dark
          </Button>
          <Button type="button" variant="cosmicLinkLight" size="cosmicMd">
            btn-link-light
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="cosmicLinkDark" size="cosmicMd">
            btn-link-dark
          </Button>
        </div>
        <div className="mt-3">
          <Button type="button" variant="cosmicPrimary" size="cosmicFull">
            btn-block (full width)
          </Button>
        </div>
      </section>

      {/* —— shadcn Button cosmic variants —— */}
      <section className="stack-section">
        <SectionTitle>Button component — cosmic variants</SectionTitle>
        <p className="mb-3 font-mono text-xs text-primary/70">
          variant prop → maps to <code>.btn</code> classes in components/ui/button.tsx
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {COSMIC_BUTTON_VARIANTS.map((v) => (
            <Button key={v} type="button" variant={v} size="cosmicSm">
              {v}
            </Button>
          ))}
        </div>
        <SubTitle className="mt-6">Sizes (cosmic + icon)</SubTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="cosmicPrimary" size="cosmicSm">
            cosmicSm
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicMd">
            cosmicMd
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicLg">
            cosmicLg
          </Button>
          <Button type="button" variant="cosmicPrimary" size="cosmicFull" className="max-w-xs">
            cosmicFull
          </Button>
          <Button type="button" variant="cosmicPrimary" size="icon" aria-label="Play">
            <Play className="size-4" />
          </Button>
          <Button type="button" variant="cosmicSecondary" size="icon-sm" aria-label="Heart">
            <Heart className="size-4" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-footer-heading p-3">
          <Button type="button" variant="cosmicTertiaryOnDark" size="cosmicSm">
            cosmicTertiaryOnDark (on nav/footer tone)
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" variant="cosmicPrimary" size="cosmicLg">
            <Play className="size-4" /> With icon
          </Button>
          <Button type="button" variant="cosmicError" size="cosmicSm" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="stack-section">
        <SectionTitle>Button — shadcn / neutral variants</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {SHADCN_BUTTON_VARIANTS.map((v) => (
            <Button key={v} type="button" variant={v} size="sm">
              {v}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-primary/60">
          See <code className="rounded bg-input px-1">components/ui/button.tsx</code> for full{" "}
          <code className="rounded bg-input px-1">variant</code> and <code className="rounded bg-input px-1">size</code>{" "}
          unions (includes <code className="rounded bg-input px-1">cosmicTertiaryOnDark</code>, shadcn{" "}
          <code className="rounded bg-input px-1">default</code>, etc.).
        </p>
      </section>

      {/* —— Badge + chips —— */}
      <section className="stack-section">
        <SectionTitle>.badge + category bg-*</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CAT_COLORS.map((c) => (
            <span key={c} className={cn("badge", c)}>
              {c.replace("bg-", "")}
            </span>
          ))}
        </div>
      </section>

      {/* —— Cards —— */}
      <section className="stack-section">
        <SectionTitle>Cards (shadcn + utilities)</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-light">
            <CardHeader>
              <CardTitle>card-light</CardTitle>
              <CardDescription>Utility targets title/description via data-slot.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary/80">CardContent area.</p>
            </CardContent>
            <CardFooter className="text-xs text-primary/60">CardFooter</CardFooter>
          </Card>
          <Card className="card-dark">
            <CardHeader>
              <CardTitle>Journey-style dark card</CardTitle>
              <CardDescription>card-dark on light styleguide canvas.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="badge bg-cat-spiritual">chip</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* —— Dialog —— */}
      <section className="stack-section">
        <SectionTitle>Dialog (shadcn)</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="cosmicPrimary">
                Simple dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border-neutral bg-surface text-primary">
              <DialogHeader>
                <DialogTitle>Delete journey?</DialogTitle>
                <DialogDescription>This is a sample alert-style copy.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button type="button" variant="cosmicTertiary" size="cosmicMd" onClick={() => setDemoOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="cosmicError" size="cosmicMd" onClick={() => setDemoOpen(false)}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="cosmicSecondary">
                Dialog with form
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border-neutral bg-surface text-primary sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add step</DialogTitle>
                <DialogDescription>CosmicInput / CosmicTextarea inside dialog.</DialogDescription>
              </DialogHeader>
              <div className="stack-tight space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="sg-step">Title</Label>
                  <CosmicInput id="sg-step" placeholder="Step title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sg-note">Note</Label>
                  <CosmicTextarea id="sg-note" placeholder="Optional note" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="cosmicTertiary" size="cosmicMd" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="cosmicPrimary" size="cosmicMd" onClick={() => setFormOpen(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* —— Form —— */}
      <section className="stack-section">
        <SectionTitle>Form — CosmicInput / CosmicTextarea + Label</SectionTitle>
        <div className="max-w-md space-y-4 rounded-lg border border-border-neutral bg-input p-6">
          <div className="space-y-2">
            <Label htmlFor="sg-name">Name</Label>
            <CosmicInput id="sg-name" placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sg-email">Email</Label>
            <CosmicInput id="sg-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sg-msg">Message</Label>
            <CosmicTextarea id="sg-msg" placeholder="Write something…" rows={4} />
          </div>
        </div>
      </section>

      {/* —— Icons (lucide-react) —— */}
      <section className="stack-section">
        <SectionTitle>Icons — lucide-react</SectionTitle>
        <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[
            { Icon: Play, name: "Play" },
            { Icon: Bell, name: "Bell" },
            { Icon: Menu, name: "Menu" },
            { Icon: X, name: "X" },
            { Icon: Sparkles, name: "Sparkles" },
            { Icon: Moon, name: "Moon" },
            { Icon: Star, name: "Star" },
            { Icon: Heart, name: "Heart" },
            { Icon: Eye, name: "Eye" },
            { Icon: Key, name: "Key" },
            { Icon: Globe, name: "Globe" },
            { Icon: Flame, name: "Flame" },
            { Icon: Cloud, name: "Cloud" },
            { Icon: ChevronUp, name: "ChevronUp" },
            { Icon: Trash2, name: "Trash2" },
          ].map(({ Icon, name }) => (
            <li key={name} className="flex items-center gap-2 text-primary/90">
              <Icon className="size-5 shrink-0 text-secondary" />
              <span>
                <code className="text-xs">{name}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-primary/50">
        Divider: default <code className="rounded bg-input px-1">hr</code> uses <code className="rounded bg-input px-1">bg-border-neutral</code> per globals.
      </p>
      <hr />
    </main>
  )
}
