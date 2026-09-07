import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Chapter from "../models/Chapter.js";
import Lesson from "../models/Lesson.js";

export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course || !course.published) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};


export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    })
      .populate("course")
      .lean();

    const courses = [];

    for (const enrollment of enrollments) {
      // Get chapters in the correct course order
      const chapters = await Chapter.find({
        course: enrollment.course._id,
      })
        .sort({ order: 1 })
        .lean();

      // Get lessons chapter-by-chapter so the order is deterministic
      const lessons = [];

      for (const chapter of chapters) {
        const chapterLessons = await Lesson.find({
          chapter: chapter._id,
        })
          .sort({ order: 1 })
          .lean();

        lessons.push(...chapterLessons);
      }

      const completedLessons =
        enrollment.completedLessons || [];

      // Find the first lesson the student has NOT completed
      const nextLesson = lessons.find(
        (lesson) =>
          !completedLessons.some(
            (completedId) =>
              completedId.toString() === lesson._id.toString()
          )
      );

      courses.push({
        enrollmentId: enrollment._id,
        course: enrollment.course,
        completedLessons,
        completedCount: completedLessons.length,
        totalLessons: lessons.length,
        firstLessonId: nextLesson
          ? nextLesson._id
          : null,
      });
    }

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};