import Image from "next/image";
import Link from "next/link";

type FacultyCardProps = {
  href: string;
  title: string;
  description: string;
  image: string;
  index?: number;
  number?: string;
};

export function FacultyCard({
  href,
  title,
  description,
  image,
  index = 0,
  number,
}: FacultyCardProps) {
  const label = number ?? String(index + 1).padStart(2, "0");

  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[6px]">
        <Image
          src={image}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 767px) 90vw, 420px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold tracking-wide text-teal-deep">
          {label}
        </p>

        <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-[22px] font-bold leading-snug tracking-tight md:text-[26px]">
          {title}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#6B6B6B]">
          {description}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-deep transition-colors duration-300 group-hover:text-teal group-hover:underline group-hover:underline-offset-4">
          Explore Division
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
