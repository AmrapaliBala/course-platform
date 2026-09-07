import Course from "../models/Course.js";
import Chapter from "../models/Chapter.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      _id: id,
      published: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const chapters = await Chapter.find({
      course: course._id,
    }).sort({
      order: 1,
    });

    const chapterIds = chapters.map(
      (chapter) => chapter._id
    );

    const lessons = await Lesson.find({
      chapter: { $in: chapterIds },
    }).sort({
      order: 1,
    });

    const chaptersWithLessons = chapters.map(
      (chapter) => ({
        ...chapter.toObject(),

        lessons: lessons.filter(
          (lesson) =>
            lesson.chapter.toString() ===
            chapter._id.toString()
        ),
      })
    );

    let enrolled = false;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id,
      });

      enrolled = Boolean(enrollment);
    }

    res.json({
      success: true,

      course: {
        ...course.toObject(),
        chapters: chaptersWithLessons,
      },

      enrolled,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};