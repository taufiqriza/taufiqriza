import { Metadata } from "next";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";
import { getProjectsDataBySlug } from "@/services/projects";
import { PROJECTS } from "@/common/constants/projects";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

const getProjectDetail = async (slug: string): Promise<ProjectItem | null> => {
  let project: ProjectItem | null = null;
  try {
    project = await getProjectsDataBySlug(slug);
  } catch {
    project = PROJECTS.find((item) => item.slug === slug) || null;
  }
  if (!project) return null;
  const contents = loadMdxFiles();
  const content = contents.find((item) => item.slug === slug);
  const response = { ...project, content: project.content || content?.content };
  return JSON.parse(JSON.stringify(response));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const project = await getProjectDetail(params?.slug);
  if (!project) return {};
  const locale = params.locale || "en";

  return {
    title: `${project.title} ${METADATA.exTitle}`,
    description: project.description,
    openGraph: {
      images: project.image,
      url: `${METADATA.openGraph.url}/${project.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      authors: [METADATA.creator],
    },
    keywords: project.title,
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}/projects/${params.slug}`,
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const data = await getProjectDetail(params?.slug);
  if (!data) notFound();

  return (
    <Container data-aos="fade-up">
      <BackButton url="/projects" />
      <PageHeading title={data?.title} description={data?.description} />
      <ProjectDetail {...data} />
    </Container>
  );
};

export default ProjectDetailPage;
