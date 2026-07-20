import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-actions";
import {
  getActivityFeed,
  getAdminCourses,
  getAdminLessons,
  getAdminStats,
  getAllStudents,
  getContactMessages,
  getCourseEnrollmentCounts,
  getFacultyOptions,
  getIncompleteStudents,
  getRecentEnrollments,
  getWaitlistEntries,
} from "@/lib/admin";
import { AdminExportButtons } from "@/components/AdminExportButtons";
import { AdminHeroScene } from "@/components/AdminHeroScene";
import {
  ContactMessagesPanel,
  WaitlistPanel,
} from "@/components/AdminInboxPanels";
import { AdminPanelNav } from "@/components/AdminPanelNav";
import { AdminPerformanceCharts } from "@/components/AdminPerformanceCharts";
import { AdminStudentsPanel } from "@/components/AdminStudentsPanel";
import { CourseAdminForm } from "@/components/CourseAdminForm";
import { EnrollmentManageTable } from "@/components/EnrollmentManageTable";
import { LessonAdminForm } from "@/components/LessonAdminForm";
import { SetUserRoleForm } from "@/components/SetUserRoleForm";
import { CountUp } from "@/components/motion/CountUp";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { StatPop } from "@/components/motion/StatPop";

export const metadata: Metadata = {
  title: "Admin panel",
  description: "Manage students, roles, courses, and enrollments.",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const nav = [
  { href: "#overview", label: "Overview" },
  { href: "#students", label: "Students" },
  { href: "#enrollments", label: "Enrollments" },
  { href: "#courses", label: "Add course" },
  { href: "#lessons", label: "Lessons" },
  { href: "#inbox", label: "Inbox" },
  { href: "#activity", label: "Activity" },
];

export default async function AdminPage() {
  const admin = await requireAdmin();

  const [
    stats,
    enrollments,
    students,
    courseCounts,
    incomplete,
    activity,
    contacts,
    waitlist,
    faculties,
    courses,
    lessons,
  ] = await Promise.all([
    getAdminStats(),
    getRecentEnrollments(80),
    getAllStudents(),
    getCourseEnrollmentCounts(),
    getIncompleteStudents(),
    getActivityFeed(25),
    getContactMessages(),
    getWaitlistEntries(),
    getFacultyOptions(),
    getAdminCourses(),
    getAdminLessons(),
  ]);

  const courseOptions = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
  }));

  const studentRows = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    disabled: s.disabled,
    createdAt: s.createdAt ? s.createdAt.toISOString() : null,
  }));

  const exportStudents = students.map((s) => ({
    name: s.name,
    email: s.email,
    disabled: s.disabled,
    createdAt: s.createdAt ? s.createdAt.toISOString() : "",
  }));

  const exportEnrollments = enrollments.map((e) => ({
    studentName: e.studentName,
    studentEmail: e.studentEmail,
    courseTitle: e.courseTitle,
    status: e.status,
    enrolledAt: e.enrolledAt.toISOString(),
  }));

  const statCards = [
    { label: "Students", value: stats.students },
    { label: "Admins", value: stats.admins },
    { label: "Courses", value: stats.courses },
    { label: "Lessons", value: stats.lessons },
    { label: "Active enrollments", value: stats.activeEnrollments },
    { label: "Waitlist", value: stats.waitlist },
    { label: "Messages", value: stats.contactMessages },
  ];

  const avgProgress =
    incomplete.length === 0
      ? 0
      : Math.round(
          incomplete.reduce((sum, row) => sum + row.percent, 0) /
            incomplete.length,
        );

  return (
    <div className="bg-mist">
      <section className="relative overflow-hidden bg-teal text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 12% 20%, rgba(200,255,74,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 88% 10%, rgba(255,255,255,0.12), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-5 md:px-8 md:pt-16">
          <div className="flex flex-col gap-10 pb-10 md:flex-row md:items-end md:justify-between md:gap-12 md:pb-12">
            <div className="min-w-0 max-w-xl">
              <IntroRise immediate delayMs={60}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
                  Admin panel
                </p>
              </IntroRise>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                <MaskLine immediate delayMs={140}>
                  Manage Al Hadid
                </MaskLine>
              </h1>
              <IntroRise immediate delayMs={280}>
                <p className="mt-3 text-white/70">
                  Jump to any section below to manage students, courses, and
                  inbox.
                </p>
              </IntroRise>
              <IntroRise immediate delayMs={400}>
                <div className="mt-6">
                  <Link
                    href="/dashboard"
                    className="login-btn inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </IntroRise>
            </div>
            <AdminHeroScene name={admin.name} />
          </div>
          <AdminPanelNav items={nav} adminName={admin.name} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-5 md:px-8 md:py-16">
        <section id="overview" className="scroll-mt-36">
          <Reveal variant="line">
            <h2 className="font-display text-2xl font-semibold text-heading">
              Overview
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {statCards.map((card, i) => (
              <StatPop key={card.label} delayMs={i * 90}>
                <div className="hover-lift rounded-2xl border border-line-dark bg-white p-5">
                  <p className="text-3xl font-semibold text-heading">
                    <CountUp value={String(card.value)} />
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {card.label}
                  </p>
                </div>
              </StatPop>
            ))}
          </div>

          <Reveal>
            <AdminPerformanceCharts
              students={stats.students}
              activeEnrollments={stats.activeEnrollments}
              avgProgress={avgProgress}
              courseCounts={courseCounts.map((row) => ({
                title: row.title,
                active: row.active,
                completed: row.completed,
                revoked: row.revoked,
                total: row.total,
              }))}
            />
          </Reveal>

          <Reveal className="mt-8">
            <h3 className="font-display text-xl font-semibold text-heading">
              Course enrollment counts
            </h3>
            {courseCounts.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No courses yet.</p>
            ) : (
              <div className="hover-lift mt-4 overflow-x-auto rounded-2xl border border-line-dark bg-white">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    <tr>
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Active</th>
                      <th className="px-5 py-3">Completed</th>
                      <th className="px-5 py-3">Revoked</th>
                      <th className="px-5 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-dark">
                    {courseCounts.map((row, i) => (
                      <tr
                        key={row.courseSlug}
                        className="animate-fade-in transition-colors duration-200 hover:bg-mist"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td className="px-5 py-3 font-medium text-ink">
                          {row.title}
                        </td>
                        <td className="px-5 py-3 text-ink">{row.active}</td>
                        <td className="px-5 py-3 text-ink">{row.completed}</td>
                        <td className="px-5 py-3 text-ink">{row.revoked}</td>
                        <td className="px-5 py-3 text-muted">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Reveal>

          <Reveal className="mt-8">
            <h3 className="font-display text-xl font-semibold text-heading">
              Export
            </h3>
            <p className="mt-2 text-sm text-muted">
              Download student and enrollment lists as CSV.
            </p>
            <div className="mt-4">
              <AdminExportButtons
                students={exportStudents}
                enrollments={exportEnrollments}
              />
            </div>
          </Reveal>
        </section>

        <section id="students" className="scroll-mt-36">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-heading">
              All students
            </h2>
            <p className="mt-2 text-sm text-muted">
              Search, enroll from the list, view progress, WhatsApp, disable,
              force logout, or delete.
            </p>
          </Reveal>
          <div className="mt-6">
            <AdminStudentsPanel
              students={studentRows}
              courses={courseOptions}
            />
          </div>
        </section>

        <section id="incomplete" className="scroll-mt-36">
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Incomplete progress
          </h2>
          <p className="mt-2 text-sm text-muted">
            Students enrolled but not finished yet.
          </p>
          </Reveal>
          {incomplete.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No incomplete enrollments.
            </p>
          ) : (
            <div className="hover-lift mt-6 overflow-x-auto rounded-2xl border border-line-dark bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-dark">
                  {incomplete.map((row) => (
                    <tr
                      key={`${row.userId}-${row.courseSlug}`}
                      className="transition-colors duration-200 hover:bg-mist"
                    >
                      <td className="px-5 py-3">
                        <span className="block font-medium text-ink">
                          {row.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {row.email}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink">{row.courseTitle}</td>
                      <td className="px-5 py-3 text-muted">
                        {row.percent}% ({row.done}/{row.total})
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/students/${row.userId}`}
                          className="text-sm font-semibold text-teal-deep hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Set user role
          </h2>
          <p className="mt-2 text-sm text-muted">
            Promote admins when needed. New signups are always students.
          </p>
          </Reveal>
          <div className="mt-6 max-w-lg">
            <SetUserRoleForm />
          </div>
        </section>

        <section id="enrollments" className="scroll-mt-36">
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Manage enrollments
          </h2>
          <p className="mt-2 text-sm text-muted">
            Revoke or re-activate student course access.
          </p>
          </Reveal>
          <div className="mt-6">
            <EnrollmentManageTable
              enrollments={enrollments.map((e) => ({
                enrollmentId: e.enrollmentId,
                studentName: e.studentName,
                studentEmail: e.studentEmail,
                courseTitle: e.courseTitle,
                status: e.status,
                enrolledAt: e.enrolledAt.toISOString(),
              }))}
            />
          </div>
        </section>

        <section id="courses" className="scroll-mt-36">
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Add course
          </h2>
          <p className="mt-2 text-sm text-muted">
            Create a new course for the catalog.
          </p>
          </Reveal>
          <div className="mt-6">
            <CourseAdminForm faculties={faculties} />
          </div>
        </section>

        <section id="lessons" className="scroll-mt-36">
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Manage lessons
          </h2>
          <p className="mt-2 text-sm text-muted">
            Add a video, then scroll down to Published lessons and click Generate
            summary.
          </p>
          </Reveal>
          <div className="mt-6">
            <LessonAdminForm
              courses={courseOptions}
              lessons={lessons.map((l) => ({
                id: String(l._id),
                courseSlug: l.courseSlug,
                slug: l.slug,
                title: l.title,
                moduleTitle: l.moduleTitle,
                moduleIndex: l.moduleIndex,
                order: l.order,
                type: l.type,
                content: l.content,
                durationMinutes: l.durationMinutes,
                summaryStatus: l.summaryStatus,
                summaryGeneratedAt: l.summaryGeneratedAt
                  ? new Date(l.summaryGeneratedAt).toISOString()
                  : null,
              }))}
            />
          </div>
        </section>

        <div
          id="inbox"
          className="grid scroll-mt-36 gap-12 lg:grid-cols-2"
        >
          <section>
            <Reveal>
            <h2 className="font-display text-2xl font-semibold text-heading">
              Contact messages
            </h2>
            </Reveal>
            <div className="mt-6">
              <ContactMessagesPanel
                messages={contacts.map((m) => ({
                  id: String(m._id),
                  name: m.name,
                  email: m.email,
                  subject: m.subject,
                  message: m.message,
                  createdAt: m.createdAt
                    ? new Date(m.createdAt).toISOString()
                    : null,
                }))}
              />
            </div>
          </section>
          <section>
            <Reveal delayMs={120}>
            <h2 className="font-display text-2xl font-semibold text-heading">
              Waitlist
            </h2>
            </Reveal>
            <div className="mt-6">
              <WaitlistPanel
                entries={waitlist.map((w) => ({
                  id: String(w._id),
                  name: w.name,
                  age: typeof w.age === "number" ? w.age : null,
                  city: w.city ?? null,
                  profession: w.profession ?? null,
                  whatsapp: w.whatsapp ?? null,
                  email: w.email ?? null,
                  university: w.university ?? null,
                  source: w.source ?? null,
                  createdAt: w.createdAt
                    ? new Date(w.createdAt).toISOString()
                    : null,
                }))}
              />
            </div>
          </section>
        </div>

        <section id="activity" className="scroll-mt-36">
          <Reveal>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Activity feed
          </h2>
          <p className="mt-2 text-sm text-muted">
            Recent signups, enrollments, and completed lessons.
          </p>
          </Reveal>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No recent activity.</p>
          ) : (
            <ul className="mt-6 divide-y divide-line-dark rounded-2xl border border-line-dark bg-white">
              {activity.map((item, i) => (
                <li
                  key={item.id}
                  className="animate-fade-up flex flex-col gap-1 px-5 py-4 transition-colors duration-200 hover:bg-mist sm:flex-row sm:items-center sm:justify-between"
                  style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-ink">{item.detail}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted">
                    {dateFormat.format(new Date(item.at))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
