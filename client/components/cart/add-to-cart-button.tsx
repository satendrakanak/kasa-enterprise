"use client";

import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader, ShoppingCart } from "lucide-react";
import { getCourseMeta } from "@/helpers/course-meta";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  course: Course;
  className?: string;
}

const getInstructorLabel = (course: Course) => {
  const facultyNames =
    course.faculties
      ?.map((faculty) =>
        [faculty.firstName, faculty.lastName].filter(Boolean).join(" ").trim(),
      )
      .filter(Boolean) || [];

  if (facultyNames.length) return facultyNames.join(", ");

  return [course.createdBy?.firstName, course.createdBy?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const AddToCartButton = ({
  course,
  className,
}: AddToCartButtonProps) => {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const alreadyAdded = useCartStore((s) =>
    s.cartItems.some((item) => item.id === course.id),
  );

  const [loading, setLoading] = useState(false);

  const [meta, setMeta] = useState({
    totalLectures: 0,
    totalDuration: "0m",
  });

  useEffect(() => {
    const loadMeta = async () => {
      const data = await getCourseMeta(course);
      setMeta(data);
    };

    loadMeta();
  }, [course]);

  const handleAddToCart = async () => {
    if (alreadyAdded) {
      router.push("/cart");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart({
      id: course.id,
      title: course.title,
      price: Number(course.priceInr),
      image: course.image?.path,
      instructor: getInstructorLabel(course),
      totalDuration: meta.totalDuration,
      totalLectures: meta.totalLectures,
      slug: course.slug,
    });

    setLoading(false);

    toast.success("Added to cart", {
      description: course.title,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      variant="default"
      className={cn(
        "group relative h-12 w-full overflow-hidden rounded-full text-base font-semibold shadow-[0_16px_40px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-0.5",
        alreadyAdded
          ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300",
        loading && "cursor-not-allowed opacity-80 hover:translate-y-0",
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            Adding...
          </>
        ) : alreadyAdded ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            Go to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </>
        )}
      </span>
    </Button>
  );
};
