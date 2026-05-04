"use client";

import { PricingForm } from "./pricing-form";
import { TagsForm } from "./tags-form";
import { CategoryForm } from "./category-form";
import QuickInfo from "./quick-info";
import { Course } from "@/types/course";
import { FeaturedImageForm } from "./featured-image-form";
import { FeaturedVideoForm } from "./featured-video-form";
import { AssignFacultyForm } from "./assign-faculty-form";

interface RightSidebarProps {
  course: Course;
}

export const RightSidebar = ({ course }: RightSidebarProps) => {
  return (
    <div className="grid gap-4 xl:sticky xl:top-24 xl:grid-cols-1">
      {/* 🔥 Featured Image */}
      <FeaturedImageForm course={course} />
      {/* 🔥 Featured Video */}
      <FeaturedVideoForm course={course} />
      {/* 🔥 Assign Faculty */}
      <AssignFacultyForm course={course} />
      {/* 🔥 Category */}
      <CategoryForm course={course} />

      {/* 🔥 Tags */}
      <TagsForm course={course} />

      {/* 🔥 Pricing */}
      <PricingForm course={course} />
      {/* 🔥 Quick Info */}
      <QuickInfo course={course} />
    </div>
  );
};
