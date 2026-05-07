"use client";

import { Article } from "@/types/article";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <article
      className="
        academy-card prose prose-lg max-w-none p-4
        prose-headings:text-card-foreground
        prose-p:leading-8 prose-p:text-muted-foreground
        prose-strong:text-card-foreground
        prose-a:text-primary
        prose-blockquote:border-primary prose-blockquote:text-muted-foreground
        prose-li:text-muted-foreground prose-li:marker:text-primary
        prose-img:rounded-2xl
        md:p-5
      "
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );
}
