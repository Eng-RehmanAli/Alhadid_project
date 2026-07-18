import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seed() {
  const { connectMongo } = await import("../src/lib/db");
  const { Article } = await import("../src/models/Article");
  const { Book } = await import("../src/models/Book");
  const { Course } = await import("../src/models/Course");
  const { Faculty } = await import("../src/models/Faculty");
  const { Lesson } = await import("../src/models/Lesson");
  const { Testimonial } = await import("../src/models/Testimonial");
  const { User } = await import("../src/models/User");
  const { articles } = await import("../src/data/articles");
  const { books } = await import("../src/data/books");
  const { courseGroups } = await import("../src/data/courses");
  const { sampleCurricula } = await import("../src/data/curriculum");
  const { faculties } = await import("../src/data/faculties");
  const { testimonials } = await import("../src/data/engagement");
  const { hashPassword } = await import("../src/lib/password");

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

  let lessonCount = 0;
  for (const curriculum of sampleCurricula) {
    let order = 0;
    for (let moduleIndex = 0; moduleIndex < curriculum.modules.length; moduleIndex += 1) {
      const mod = curriculum.modules[moduleIndex]!;
      for (const lesson of mod.lessons) {
        await Lesson.findOneAndUpdate(
          { courseSlug: curriculum.courseSlug, slug: lesson.slug },
          {
            $set: {
              courseSlug: curriculum.courseSlug,
              moduleTitle: mod.title,
              moduleIndex,
              slug: lesson.slug,
              title: lesson.title,
              type: lesson.type,
              content: lesson.content,
              order,
              durationMinutes: lesson.durationMinutes,
            },
          },
          { upsert: true, returnDocument: "after" },
        );
        order += 1;
        lessonCount += 1;
      }
    }
  }

  // Optional bootstrap admin (set SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD in .env)
  let adminNote = "skipped (set SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD to create)";
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME?.trim() || "Al Hadid Admin";

  if (adminEmail && adminPassword && adminPassword.length >= 8) {
    const passwordHash = await hashPassword(adminPassword);
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: adminName,
          email: adminEmail,
          passwordHash,
          role: "admin",
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    adminNote = `upserted ${adminEmail}`;
  }

  // Ensure legacy users without role (or old instructor role) become student
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: "student" } },
  );
  await User.updateMany(
    { role: "instructor" } as never,
    { $set: { role: "student" } },
  );

  console.log("Seed complete:");
  console.log(`  faculties:     ${facultyCount}`);
  console.log(`  courses:       ${courseCount}`);
  console.log(`  articles:      ${articleCount}`);
  console.log(`  books:         ${bookCount}`);
  console.log(`  testimonials:  ${testimonialCount}`);
  console.log(`  lessons:       ${lessonCount}`);
  console.log(`  admin user:    ${adminNote}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
