import dotenv from "dotenv";

import connectDB from "./config/db.js";

import Course from "./models/Course.js";
import Chapter from "./models/Chapter.js";
import Lesson from "./models/Lesson.js";

dotenv.config();

await connectDB();

await Course.deleteMany({});
await Chapter.deleteMany({});
await Lesson.deleteMany({});

const course = await Course.create({
  title: "Complete JavaScript Fundamentals",
  description:
    "Learn JavaScript from fundamentals to practical projects.",
  price: 999,
});

const chapter1 = await Chapter.create({
  course: course._id,
  title: "JavaScript Basics",
  order: 1,
});

const chapter2 = await Chapter.create({
  course: course._id,
  title: "Functions and Objects",
  order: 2,
});

await Lesson.create([
  {
    chapter: chapter1._id,
    title: "Variables and Data Types",
    content:
      "Learn variables and JavaScript data types.",
    order: 1,
  },
  {
    chapter: chapter1._id,
    title: "Operators",
    content:
      "Learn arithmetic and logical operators.",
    order: 2,
  },
  {
    chapter: chapter2._id,
    title: "Functions",
    content:
      "Learn how JavaScript functions work.",
    order: 1,
  },
  {
    chapter: chapter2._id,
    title: "Objects",
    content:
      "Learn JavaScript objects.",
    order: 2,
  },
]);

console.log("Database seeded successfully");

process.exit(0);