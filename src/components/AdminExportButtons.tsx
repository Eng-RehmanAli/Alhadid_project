"use client";

type CsvColumn = { key: string; label: string };

function toCsv(rows: Record<string, string | number | boolean | null | undefined>[], columns: CsvColumn[]) {
  const escape = (value: unknown) => {
    const raw = value == null ? "" : String(value);
    if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
    return raw;
  };
  const header = columns.map((c) => escape(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escape(row[c.key])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminExportButtons({
  students,
  enrollments,
}: {
  students: Record<string, string | number | boolean | null | undefined>[];
  enrollments: Record<string, string | number | boolean | null | undefined>[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() =>
          downloadCsv(
            "alhadid-students.csv",
            toCsv(students, [
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "disabled", label: "Disabled" },
              { key: "createdAt", label: "Signed up" },
            ]),
          )
        }
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-teal-deep px-5 py-2.5 text-sm font-semibold text-teal-deep hover:bg-mist"
      >
        Export students CSV
      </button>
      <button
        type="button"
        onClick={() =>
          downloadCsv(
            "alhadid-enrollments.csv",
            toCsv(enrollments, [
              { key: "studentName", label: "Student" },
              { key: "studentEmail", label: "Email" },
              { key: "courseTitle", label: "Course" },
              { key: "status", label: "Status" },
              { key: "enrolledAt", label: "Enrolled" },
            ]),
          )
        }
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-teal-deep px-5 py-2.5 text-sm font-semibold text-teal-deep hover:bg-mist"
      >
        Export enrollments CSV
      </button>
    </div>
  );
}
