import { CourseFaqItem } from "@/types/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CourseFaqsProps {
  faqs?: CourseFaqItem[];
}

export function CourseFaqs({ faqs = [] }: CourseFaqsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
          Course FAQs
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Clear answers to the practical doubts learners usually have about this
          program.
        </p>
      </div>

      {faqs.length ? (
        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          defaultValue="faq-0"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={`${faq.question}-${index}`}
              value={`faq-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 px-5 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/60 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055]"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-950 hover:no-underline dark:text-white [&>svg]:text-blue-700 dark:[&>svg]:text-rose-200">
                <span className="pr-4 leading-7">{faq.question}</span>
              </AccordionTrigger>

              <AccordionContent className="pb-5">
                <div className="border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-[#0b1628]">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            No FAQs added yet
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            FAQs will appear here once the admin adds them for this course.
          </p>
        </div>
      )}
    </section>
  );
}
