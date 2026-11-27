import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, bySlug } from "@/lib/cases";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export function generateStaticParams() { return caseStudies.map((c) => ({ slug: c.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = bySlug((await params).slug);
  return c ? { title: `${c.company} case study | Flint Studio`, description: c.sub } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  if (!c) notFound();
  const i = caseStudies.findIndex((x) => x.slug === c.slug);
  return <CaseStudyPage c={c} next={caseStudies[(i + 1) % caseStudies.length]} />;
}
