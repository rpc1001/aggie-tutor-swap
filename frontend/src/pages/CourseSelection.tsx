import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const courses = [
  "MAT 21A", "MAT 21B", "MAT 22A", "ECS 032A", "ECS 032B", 
  "ECS 036A", "ECS 150", "CHE 002A", "PHY 009A", "STA 013",
];

const CourseSelection: React.FC = () => {
  const [needHelpSearch, setNeedHelpSearch] = useState('');
  const [canTutorSearch, setCanTutorSearch] = useState('');
  const [needHelpCourses, setNeedHelpCourses] = useState<string[]>([]);
  const [canTutorCourses, setCanTutorCourses] = useState<string[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

// get the variables from previous 
  const { email, password } = (location.state as { email: string; password: string }) || {};

// incase someone just went straight to the courses URL
  React.useEffect(() => {
    if (!email || !password) {
      // if states are  missing redirect back to sign up page
      navigate('/signup');
    }
  }, [email, password, navigate]);


  // filter courses on search 
  const filteredNeedHelpCourses = courses.filter((course) =>
    course.toLowerCase().includes(needHelpSearch.toLowerCase())
  );
  const filteredCanTutorCourses = courses.filter((course) =>
    course.toLowerCase().includes(canTutorSearch.toLowerCase())
  );

  const toggleCourse = (course: string, type: 'help' | 'tutor') => {
    if (type === 'help') {
      if (needHelpCourses.includes(course)) {
        setNeedHelpCourses(prev => prev.filter(c => c !== course)); // remove  course
      } else {
        setNeedHelpCourses(prev => [...prev, course]); // add course
      }
    } else {
      if (canTutorCourses.includes(course)) {
        setCanTutorCourses(prev => prev.filter(c => c !== course)); // remove course
      } else {
        setCanTutorCourses(prev => [...prev, course]); // add course
      }
    }
  };

  const handleNext = () => {
    // pass along the selected courses to next page
    navigate('/contact-info', {
      state: {
        email,
        password,
        needHelpCourses,
        canTutorCourses
      }
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
            <h2 className="text-xl font-semibold mb-4 text-text">Need Help</h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
              value={needHelpSearch}
              onChange={(e) => setNeedHelpSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredNeedHelpCourses.length > 0 ? (
                filteredNeedHelpCourses.map((course) => (
                  <label key={course} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={needHelpCourses.includes(course)}
                      onChange={() => toggleCourse(course, 'help')}
                      className="mr-2"
                    />
                    {course}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No courses found</p>
              )}
            </div>
          </div>
  
          {/* Can Tutor Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-4 text-text">Can Tutor</h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
              value={canTutorSearch}
              onChange={(e) => setCanTutorSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredCanTutorCourses.length > 0 ? (
                filteredCanTutorCourses.map((course) => (
                  <label key={course} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={canTutorCourses.includes(course)}
                      onChange={() => toggleCourse(course, 'tutor')}
                      className="mr-2"
                    />
                    {course}
                  </label>
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
            className="bg-secondary hover:brightness-75 text-white py-2 px-4 rounded mt-4"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default CourseSelection;