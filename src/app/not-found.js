import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
      <h1 className="font-display text-4xl font-bold tracking-tighter sm:text-6xl">
        Nothing here
      </h1>
      <p className="mt-4 max-w-md text-sb-ink-soft">
        This page doesn&apos;t exist — or it moved somewhere else.
      </p>
      <Link
        href="/"
        data-interactive
        className="mt-8 inline-flex min-h-11 w-fit items-center text-sm text-sb-ink underline underline-offset-4 hover:text-sb-accent"
      >
        ← Back to the work
      </Link>
    </section>
  );
}
