import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { getStudentById, getStudentProgress } from "@/lib/admin";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudentById(id);
  return {
    title: student ? `${student.name} · Admin` : "Student · Admin",
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminStudentPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) notFound();

  const progress = await getStudentProgress(student.id);
  const wa = whatsappGeneralUrl(
    `Assalamualaikum ${student.name}, regarding your Al Hadid learning progress.`,
  );

  return (
    <div className="bg-mist">
      <section className="bg-teal text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.22em] text-lime">
            Student progress
          </p>
          <h1 className="animate-fade-up delay-1 mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {student.name}
          </h1>
          <p className="animate-fade-up delay-2 mt-3 text-white/70">
            {student.email}
          </p>
          <p className="animate-fade-up delay-2 mt-2 text-sm text-white/60">
            Signed up{" "}
            {student.createdAt
              ? dateFormat.format(new Date(student.createdAt))
              : "—"}
            {student.disabled ? " · Account disabled" : ""}
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin#students"
              className="login-btn inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
            >
              Back to admin
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="login-btn inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
            >
              WhatsApp student
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
        <h2 className="font-display text-2xl font-semibold text-heading">
          Courses & progress
        </h2>
        {progress.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            This student is not enrolled in any courses yet.
          </p>
        ) : (
          <ul className="mt-8 divide-y divide-line-dark border-t border-line-dark">
            {progress.map((item, i) => (
              <li
                key={item.courseSlug}
                className="animate-fade-up flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div>
                  <p className="font-display text-xl font-semibold text-heading">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm capitalize text-muted">
                    Status: {item.status} · Enrolled{" "}
                    {dateFormat.format(new Date(item.enrolledAt))}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                    {item.percent}% · {item.done}/{item.total} lessons
                  </p>
                  <div
                    className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-teal/15"
                    role="progressbar"
                    aria-valuenow={item.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="bar-grow h-full rounded-full bg-teal"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
                <Link
                  href={`/learn/${item.courseSlug}`}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
                >
                  Open course
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
