import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const courses = [
  'MAT 21A',
  'MAT 21B',
  'MAT 22A',
  'ECS 032A',
  'ECS 032B',
  'ECS 036A',
  'ECS 150',
  'CHE 002A',
  'PHY 009A',
  'STA 013',
];

const CourseSelection: React.FC = () => {
  const [needHelpSearch, setNeedHelpSearch] = useState('');
  const [canTutorSearch, setCanTutorSearch] = useState('');
  const [needHelpCourses, setNeedHelpCourses] = useState<string[]>([]);
  const [canTutorCourses, setCanTutorCourses] = useState<string[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  // get the variables from previous
  const { email, password } =
    (location.state as { email: string; password: string }) || {};

  // incase someone just went straight to the courses URL
  React.useEffect(() => {
    if (!email || !password) {
      // if states are  missing redirect back to sign up page
      navigate('/signup');
    }
  }, [email, password, navigate]);

  // filter courses on search
  const filteredNeedHelpCourses = courses.filter(
    (course) =>
      course.toLowerCase().includes(needHelpSearch.toLowerCase()) &&
      !canTutorCourses.includes(course)
  );
  const filteredCanTutorCourses = courses.filter(
    (course) =>
      course.toLowerCase().includes(canTutorSearch.toLowerCase()) &&
      !needHelpCourses.includes(course)
  );

  const toggleCourse = (course: string, type: 'help' | 'tutor') => {
    if (type === 'help') {
      setNeedHelpCourses((prev) =>
        prev.includes(course)
          ? prev.filter((c) => c !== course)
          : [...prev, course]
      );
    } else {
      setCanTutorCourses((prev) =>
        prev.includes(course)
          ? prev.filter((c) => c !== course)
          : [...prev, course]
      );
    }
  };

  const handleNext = () => {
    navigate('/contact-info', {
      state: {
        email,
        password,
        needHelpCourses,
        canTutorCourses,
      },
    });
  };

  return (
    <div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Select Your Courses
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {/* Row for "Need Help" and "Can Tutor" Sections */}
        <div className="flex flex-row gap-4">
          {/* Need Help Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl text-center font-semibold mb-4 text-text">
              Need Help
            </h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
              value={needHelpSearch}
              onChange={(e) => setNeedHelpSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
              {filteredNeedHelpCourses.length > 0 ? (
                filteredNeedHelpCourses.map((course) => (
                  <button
                    key={course}
                    onClick={() => toggleCourse(course, 'help')}
                    className={`py-2 px-4 rounded text-sm font-semibold ${
                      needHelpCourses.includes(course)
                        ? 'bg-primary text-white'
                        : 'bg-zinc-700 text-gray-300 hover:brightness-75'
                    } `}
                  >
                    {course}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No courses found</p>
              )}
            </div>
          </div>

          {/* Can Tutor Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-4 text-text text-center">
              Can Tutor
            </h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
              value={canTutorSearch}
              onChange={(e) => setCanTutorSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
              {filteredCanTutorCourses.length > 0 ? (
                filteredCanTutorCourses.map((course) => (
                  <button
                    key={course}
                    onClick={() => toggleCourse(course, 'tutor')}
                    className={`py-2 px-4 rounded text-sm font-semibold ${
                      canTutorCourses.includes(course)
                        ? 'bg-primary text-white'
                        : 'bg-zinc-700 text-gray-300 hover:brightness-75'
                    }`}
                  >
                    {course}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No courses found</p>
              )}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75"
          >
            <p className="font-semibold">Next</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
