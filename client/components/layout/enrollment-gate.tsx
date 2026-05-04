"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface EnrollmentGateProps {
  hasAccess: boolean;
  children: React.ReactNode;
  courseSlug: string;
}

export const EnrollmentGate = ({
  hasAccess,
  children,
  courseSlug,
}: EnrollmentGateProps) => {
  const router = useRouter();
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">🔒 This course is locked</h2>
        <p className="text-gray-500 mb-4">
          You need to purchase this course to access the content.
        </p>

        <Button onClick={() => router.push(`/course/${courseSlug}`)}>
          Buy Course
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
