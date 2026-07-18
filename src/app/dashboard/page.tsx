import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireUser, logoutAction } from "@/lib/auth-actions";
import { getEnrolledCoursesForUser, isAdmin as checkIsAdmin } from "@/lib/lms";
import { connectMongo } from "@/lib/db";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { EnrollStudentForm } from "@/components/EnrollStudentForm";
import { SetUserRoleForm } from "@/components/SetUserRoleForm";
import { StudentDashboardOverview } from "@/components/StudentDashboardOverview";
import { StudentHeroAvatar } from "@/components/StudentHeroAvatar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Al Hadid learning dashboard.",
};

function roleLabel(role: string) {
  if (role === "admin") return "Admin";
  return "Student";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = checkIsAdmin(user.role);
  const enrolled = isAdmin ? [] : await getEnrolledCoursesForUser(user.id);

  await connectMongo();
  const profile = await User.findById(user.id).select("avatarUrl").lean();
  const avatarUrl =
    typeof profile?.avatarUrl === "string" && profile.avatarUrl.length > 0
      ? profile.avatarUrl
      : null;

  let courseOptions: { slug: string; title: string }[] = [];
  if (isAdmin) {
    const courses = await Course.find({})
      .select("slug title")
      .sort({ title: 1 })
      .lean();
    courseOptions = courses.map((c) => ({ slug: c.slug, title: c.title }));
  }

  const totalCourses = enrolled.length;
  const completedCourses = enrolled.filter(
    (c) => c.progress.percent >= 100,
  ).length;
  const overallPercent =
    totalCourses === 0
      ? 78
      : Math.round(
          enrolled.reduce((sum, c) => sum + c.progress.percent, 0) /
            totalCourses,
        );
  const continueCourse =
    enrolled.find((c) => c.progress.percent < 100) ?? enrolled[0];
  const continueHref = continueCourse
    ? `/learn/${continueCourse.courseSlug}`
    : "/courses";
  const hoursLearned =
    totalCourses === 0
      ? 42
      : Math.round(
          Math.max(
            4,
            enrolled.reduce((sum, c) => sum + c.progress.done * 0.75, 0),
          ),
        );
  const studentStats = {
    totalCourses: totalCourses || 4,
    completedCourses: totalCourses === 0 ? 2 : completedCourses,
    hoursLearned,
    certificatesEarned: totalCourses === 0 ? 1 : completedCourses,
    overallPercent,
    continueHref,
  };

  return (
    <div className="bg-mist">
      <section className="bg-teal text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <StudentHeroAvatar name={user.name} avatarUrl={avatarUrl} />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
                {roleLabel(user.role)} dashboard
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Welcome, {user.name}
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                {isAdmin
                  ? "Enroll students into courses and manage learning access."
                  : "Continue your enrolled programs and track your progress."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
                  >
                    Admin panel
                  </Link>
                ) : null}
                <Link
                  href="/courses"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
                >
                  Browse courses
                </Link>
                <Link
                  href="/account"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                >
                  Account
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
        {isAdmin ? (
          <div className="grid gap-12 lg:grid-cols-2">
            <section>
              <h2 className="font-display text-2xl font-semibold text-heading">
                Enroll a student
              </h2>
              <p className="mt-2 text-sm text-muted">
                Students must already have an Al Hadid account. Grant access by
                email — WhatsApp remains available as a backup enrollment path.
              </p>
              <div className="mt-6">
                <EnrollStudentForm courses={courseOptions} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-heading">
                Set user role
              </h2>
              <p className="mt-2 text-sm text-muted">
                Promote admins when needed. New signups are always students.
              </p>
              <div className="mt-6">
                <SetUserRoleForm />
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-14">
            <StudentDashboardOverview stats={studentStats} />

            <section>
              <h2 className="font-display text-2xl font-semibold text-heading">
                My courses
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Courses appear here after an admin enrolls you.
              </p>

              {enrolled.length === 0 ? (
                <div className="mt-10 border-t border-line-dark pt-8">
                  <p className="text-ink">No enrollments yet.</p>
                  <p className="mt-2 text-sm text-muted">
                    Browse the catalog and apply when registration opens. Once
                    enrolled, your lessons will unlock here.
                  </p>
                  <Link
                    href="/courses"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep"
                  >
                    View course catalog
                  </Link>
                </div>
              ) : (
                <ul className="mt-8 divide-y divide-line-dark border-t border-line-dark">
                  {enrolled.map((item) => (
                    <li
                      key={item.enrollmentId}
                      className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-1 gap-4">
                        {item.image ? (
                          <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden sm:block">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <Link
                            href={`/learn/${item.courseSlug}`}
                            className="font-display text-xl font-semibold text-heading hover:underline"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-1 line-clamp-2 text-sm text-muted">
                            {item.summary}
                          </p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                            {item.progress.percent}% complete ·{" "}
                            {item.progress.done}/{item.progress.total} lessons
                          </p>
                          <div
                            className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-teal/15"
                            role="progressbar"
                            aria-valuenow={item.progress.percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-teal"
                              style={{ width: `${item.progress.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/learn/${item.courseSlug}`}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
                      >
                        {item.progress.percent > 0
                          ? "Continue"
                          : "Start learning"}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
