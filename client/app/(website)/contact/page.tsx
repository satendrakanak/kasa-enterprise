import Container from "@/components/container";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sliders/page-hero";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Unitus Health Academy for course guidance, support, and academy enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 dark:bg-[#101b2d] dark:bg-none">
      <PageHero
        pageTitle="Contact Us"
        pageHeadline="Talk to the academy team with context, not confusion."
        pageDescription="Ask about admissions, course fit, faculty, support, or next steps and we will guide you clearly."
      />

      <section className="py-12 pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <ContactForm />
            <ContactInfo />
          </div>
        </Container>
      </section>
    </div>
  );
}
