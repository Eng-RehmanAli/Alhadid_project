import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seed() {
  const { connectMongo } = await import("../src/lib/db");
  const { Article } = await import("../src/models/Article");
  const { Book } = await import("../src/models/Book");
  const { Course } = await import("../src/models/Course");
  const { Faculty } = await import("../src/models/Faculty");
  const { Testimonial } = await import("../src/models/Testimonial");
  const { articles } = await import("../src/data/articles");
  const { books } = await import("../src/data/books");
  const { courseGroups } = await import("../src/data/courses");
  const { faculties } = await import("../src/data/faculties");
  const { testimonials } = await import("../src/data/engagement");

  await connectMongo();

  let facultyCount = 0;
  for (const faculty of faculties) {
    await Faculty.findOneAndUpdate(
      { slug: faculty.slug },
      { $set: faculty },
      { upsert: true, returnDocument: "after" },
    );
    facultyCount += 1;
  }

  let courseCount = 0;
  for (const group of courseGroups) {
    for (const course of group.courses) {
      await Course.findOneAndUpdate(
        { slug: course.slug },
        {
          $set: {
            ...course,
            facultySlug: group.facultySlug,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
      courseCount += 1;
    }
  }

  let articleCount = 0;
  for (const article of articles) {
    await Article.findOneAndUpdate(
      { slug: article.slug },
      { $set: article },
      { upsert: true, returnDocument: "after" },
    );
    articleCount += 1;
  }

  let bookCount = 0;
  for (const book of books) {
    await Book.findOneAndUpdate(
      { slug: book.slug },
      { $set: book },
      { upsert: true, returnDocument: "after" },
    );
    bookCount += 1;
  }

  let testimonialCount = 0;
  for (const testimonial of testimonials) {
    await Testimonial.findOneAndUpdate(
      {
        name: testimonial.name,
        quote: testimonial.quote,
      },
      { $set: testimonial },
      { upsert: true, returnDocument: "after" },
    );
    testimonialCount += 1;
  }

  console.log("Seed complete:");
  console.log(`  faculties:     ${facultyCount}`);
  console.log(`  courses:       ${courseCount}`);
  console.log(`  articles:      ${articleCount}`);
  console.log(`  books:         ${bookCount}`);
  console.log(`  testimonials:  ${testimonialCount}`);
  console.log("  users:         (skipped — auth data left intact)");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
