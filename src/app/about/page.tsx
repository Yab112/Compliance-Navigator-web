import Link from "next/link";
import { aboutDeveloper, aboutProduct } from "@/content/about";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">
          {aboutProduct.name}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {aboutProduct.tagline}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {aboutProduct.description}
        </p>
      </section>

      <section className="flex flex-col gap-4 border-t pt-10">
        <h2 className="text-2xl font-semibold tracking-tight">About</h2>
        <p className="font-medium">
          {aboutDeveloper.name}
          <span className="text-muted-foreground font-normal">
            {" "}
            · {aboutDeveloper.title} · {aboutDeveloper.location}
          </span>
        </p>
        <p className="leading-relaxed">{aboutDeveloper.summary}</p>
        {aboutDeveloper.biography.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p>
          <a
            href={aboutDeveloper.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            yabibal.site
          </a>
        </p>
      </section>

      <div>
        <Link href="/">
          <Button>Return home</Button>
        </Link>
      </div>
    </div>
  );
}
