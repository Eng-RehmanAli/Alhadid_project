"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { allCourses, courseGroups } from "@/data/courses";
import { trackSearch } from "@/lib/analytics";

export function CoursesCatalog() {
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCourses.filter((course) => {
      const facultyMatch =
        faculty === "all" || course.facultySlug === faculty;
      const textMatch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.summary.toLowerCase().includes(q) ||
        course.facultyTitle.toLowerCase().includes(q);
      return facultyMatch && textMatch;
    });
  }, [query, faculty]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line-dark pb-8 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 2) trackSearch(e.target.value);
            }}
            placeholder="Search courses…"
            className="w-full rounded-full border border-line-dark bg-white px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-teal focus:outline-none"
          />
        </label>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]" role="tablist" aria-label="Filter by faculty">
          <FilterChip
            active={faculty === "all"}
            onClick={() => setFaculty("all")}
            label="All"
          />
          {courseGroups.map((group) => (
            <FilterChip
              key={group.facultySlug}
              active={faculty === group.facultySlug}
              onClick={() => setFaculty(group.facultySlug)}
              label={group.title}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {filtered.length} course{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-muted">No courses match your search.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} onLight />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap ${
        active
          ? "bg-lime text-ink"
          : "border border-line-dark text-ink hover:border-teal"
      }`}
    >
      {label}
    </button>
  );
}
