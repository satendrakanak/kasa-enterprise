import Container from "@/components/container";
import { ProfileCover } from "@/components/profile/profile-cover";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileMenu } from "@/components/profile/profile-menu";
import { getSession } from "@/lib/auth";
import { getErrorMessage } from "@/lib/error-handler";
import { userServerService } from "@/services/users/user.server";
import { User } from "@/types/user";
import { notFound } from "next/navigation";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username?: string }>;
}) {
  const { username } = await params;
  const session = await getSession();

  let user: User | null = null;
  let stats = {
    courses: 0,
    completed: 0,
    progress: 0,
    examsTaken: 0,
    examsPassed: 0,
    certificatesEarned: 0,
  };

  if (username) {
    const response = await userServerService.getPublicProfile(
      username.startsWith("@") ? username.slice(1) : username,
    );

    const bundle = response.data;
    if (!bundle) notFound();

    user = bundle.user;
    stats = bundle.stats;
  } else {
    user = session;
  }

  if (!user) return null;

  const isOwner = session?.id === user.id;

  if (!username) {
    try {
      const res = await userServerService.getDashboardStats(user.id);
      stats = res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 dark:bg-[#101b2d] dark:bg-none">
      <Container>
        <div className="pb-12 pt-6">
          <ProfileCover coverImage={user.coverImage?.path} isOwner={isOwner} />

          <div className="relative z-10 px-2 md:px-6">
            <ProfileHeader user={user} isOwner={isOwner} stats={stats} />

            {!username ? <ProfileMenu isOwner={isOwner} /> : null}

            <div className="py-8">{children}</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
