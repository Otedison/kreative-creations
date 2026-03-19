import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug } from "@/data/projects";
import CaseStudy from "@/views/CaseStudy";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return buildMetadata({
      title: "Case Study",
      description: "Kreative Creations case study.",
      url: `/case-study/${params.slug}`,
      robots: "noindex, nofollow",
    });
  }

  return buildMetadata({
    title: `${project.title} - Case Study | Kreative Creations`,
    description:
      project.description ||
      `Learn how we helped ${project.title} achieve their digital goals. View our case study showcasing our ${project.category} expertise.`,
    url: `/case-study/${project.slug}`,
    image: project.image || undefined,
    type: "article",
  });
}

export default function Page() {
  return <CaseStudy />;
}
