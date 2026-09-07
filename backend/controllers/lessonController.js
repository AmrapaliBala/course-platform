import Lesson from "../models/Lesson.js";
import Chapter from "../models/Chapter.js";
import Enrollment from "../models/Enrollment.js";

export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).lean();

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const chapter = await Chapter.findById(
      lesson.chapter
    ).lean();

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: chapter.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const completed = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    res.json({
      success: true,
      lesson,
      completed,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
    });
  }
};

export const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Find the chapter containing this lesson
    const chapter = await Chapter.findById(
      lesson.chapter
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    // Make sure the logged-in user is enrolled
    // in the course containing this lesson.
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: chapter.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Add the lesson ID only if it isn't already there.
    if (
      !enrollment.completedLessons.some(
        (id) => id.toString() === lessonId
      )
    ) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
    }

    res.json({
      success: true,
      message: "Lesson marked as complete",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to mark lesson as complete",
    });
  }
};