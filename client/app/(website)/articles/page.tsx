import { ArticleCard } from "@/components/articles/article-card";
import Container from "@/components/container";
import { ArticleHeader } from "@/components/layout/article-header";
import { getErrorMessage } from "@/lib/error-handler";
import { buildMetadata } from "@/lib/seo";
import { articleServerService } from "@/services/articles/article.server";
import { Article } from "@/types/article";
import Link from "next/link";

type ArticleCategorySummary = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export const metadata = buildMetadata({
  title: "Articles",
  description:
    "Read practical wellness, health, learning, and nutrition articles from Unitus Health Academy.",
  path: "/articles",
});

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let articles: Article[] = [];

  try {
    const response = await articleServerService.getAll();
    articles = response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }

  const categoryMap = new Map<number, ArticleCategorySummary>();

  for (const currentArticle of articles) {
    for (const cat of currentArticle.categories || []) {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: (categoryMap.get(cat.id)?.count || 0) + 1,
      });
    }
  }

  const categories = Array.from(categoryMap.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );

  const filteredArticles = category
    ? articles.filter((article) =>
        article.categories?.some((item) => item.slug === category),
      )
    : articles;

  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:bg-[#101b2d] dark:bg-none">
      <ArticleHeader />

      <section className="relative py-12 pb-20">
        <Container>
          {/* FILTERS */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/articles"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !activeCategory
                    ? "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] dark:bg-rose-200 dark:text-black"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
                }`}
              >
                All Articles
              </Link>

              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/articles?category=${item.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory?.id === item.id
                      ? "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] dark:bg-rose-200 dark:text-black"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
                  }`}
                >
                  {item.name} ({item.count})
                </Link>
              ))}
            </div>

            {activeCategory && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Showing articles in{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {activeCategory.name}
                </span>
                .
              </p>
            )}
          </div>

          {/* LIST */}
          {filteredArticles.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#07111f]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No articles found
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try selecting another category.
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
