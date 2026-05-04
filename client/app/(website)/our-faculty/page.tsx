import Container from "@/components/container";
import { FacultyGrid } from "@/components/faculty/faculty-grid";
import { userServerService } from "@/services/users/user.server";
import { User } from "@/types/user";
import { PageHero } from "@/components/sliders/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Faculty",
  description:
    "Meet experienced Unitus Health Academy faculty across nutrition, wellness, Ayurveda, and lifestyle sciences.",
  path: "/our-faculty",
});

export default async function FacultiesPage() {
  let faculties: User[] = [];

  try {
    const response = await userServerService.getFaculties();
    faculties = response.data;
  } catch {
    console.error("Failed to load faculties");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:bg-[#101b2d] dark:bg-none">
      <PageHero
        pageTitle="Faculty Network"
        pageHeadline="Meet the minds behind the learning experience."
        pageDescription="Learn from experienced faculty across nutrition, wellness, and lifestyle sciences who bring both depth and real practice into every session."
      />

      <section className="py-12 pb-20">
        <Container>
          {faculties.length ? (
            <FacultyGrid faculties={faculties} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                No faculty profiles found
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Faculty profiles will appear here once they are added.
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
