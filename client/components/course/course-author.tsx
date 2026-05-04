"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface CourseAuthorProps {
  authorName: string;
  authorPhoto: StaticImageData;
}

const CourseAuthor = ({ authorName, authorPhoto }: CourseAuthorProps) => {
  return (
    <div className="flex items-center justify-center md:justify-start md:my-4">
      <Image
        src={authorPhoto}
        alt="Author's Profile Photo"
        className="w-8 h-8 rounded-full border-2 border-white mr-2"
      />
      <p className="text-md">
        <span>By </span>
        <Link href="/">{authorName}</Link>
      </p>
    </div>
  );
};

export default CourseAuthor;
