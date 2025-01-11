import { useEffect, useState, } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

import { LuMail, LuPhone } from 'react-icons/lu';
import { FaDiscord, FaInstagram, FaSnapchat } from 'react-icons/fa6';

const ALL_COURSES = [
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

export default function EditProfile() {

  const [needHelpCourses, setNeedHelpCourses] = useState<string[]>([]);
  const [canTutorCourses, setCanTutorCourses] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    discord: '',
    instagram: '',
    snapchat: '',
    sms: '',
  });

  const [needHelpSearch, setNeedHelpSearch] = useState('');
  const [canTutorSearch, setCanTutorSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // fetch the user's existing profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session) {
          setMessage('No session found. Please log in.');
          setLoading(false);
          return;
        }

        const userId = session.user.id;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('need_help_courses, can_tutor_courses, contact_info')
          .eq('id', userId)
          .single();

        if (error || !profile) {
          setMessage('Failed to load profile. ' + error?.message);
        } else {
          // populate from their existing info
          setNeedHelpCourses(profile.need_help_courses || []);
          setCanTutorCourses(profile.can_tutor_courses || []);
          setContactInfo(profile.contact_info || {});
        }
      } catch {
        setMessage('Error fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // filter courses on search
  const filteredNeedHelpCourses = ALL_COURSES.filter(
    (course) =>
      course.toLowerCase().includes(needHelpSearch.toLowerCase()) &&
      !canTutorCourses.includes(course)
  );
  const filteredCanTutorCourses = ALL_COURSES.filter(
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
      setCanTutorCourses((prev) => prev.filter((c) => c !== course));
    } else {
      setCanTutorCourses((prev) =>
        prev.includes(course)
          ? prev.filter((c) => c !== course)
          : [...prev, course]
      );
      setNeedHelpCourses((prev) => prev.filter((c) => c !== course));
    }
  };

  // save everything to Supabase
  const handleSave = async () => {
    setMessage('Saving...');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) {
        setMessage('No session found. Please log in.');
        return;
      }

      const userId = session.user.id;
      const { error } = await supabase
        .from('profiles')
        .update({
          need_help_courses: needHelpCourses,
          can_tutor_courses: canTutorCourses,
          contact_info: contactInfo,
        })
        .eq('id', userId);

      if (error) {
        setMessage('Failed to update profile: ' + error.message);
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch  {
      setMessage('Error updating profile.');
    }
  };
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/view-matches');
  };

  if (loading) {
    return (
      <div className="p-8 bg-zinc-900 min-h-screen text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }
  return (
    <div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen text-white">
      <div className="w-full max-w-3xl mb-6 flex items-center justify-between relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-primary text-white py-2 px-4 rounded hover:brightness-75"
        >
          Back to Matches
        </button>
        {/* Header */}
      <h1 className="absolute inset-0 flex justify-center items-center text-3xl font-bold text-primary">
        Edit Profile
      </h1>
    </div>
      {message && <p className="text-sm mb-4">{message}</p>}

      <div className="flex flex-col gap-4 w-full max-w-3xl">
          {/* Course Sections */}
          <div className="flex flex-row gap-4">
          {/* Need Help Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl text-center font-semibold mb-4 text-text">
              Need Help
            </h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
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

          {/* Can Tutor Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-4 text-text text-center">
              Can Tutor
            </h2>
            <input
              type="text"
              placeholder="Search courses..."
              className="border border-gray-600 bg-zinc-700 p-2 rounded w-full mb-4 text-text"
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
          {/* Contact Info Section */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex flex-col space-y-3">
            <h2 className="text-xl font-semibold text-text text-center mb-2">
              Contact Info
             </h2> 
            {/* Email */}
            <div className="flex items-center space-x-3">
              <LuMail className="text-gray-300 text-lg" />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
              />
            </div>
            {/* SMS */}
            <div className="flex items-center space-x-3">
              <LuPhone className="text-gray-300 text-lg" />
              <input
                type="text"
                placeholder="Phone/SMS"
                className="border border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
                value={contactInfo.sms}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, sms: e.target.value })
                }
              />
            </div>
            {/* Discord */}
            <div className="flex items-center space-x-3">
              <FaDiscord className="text-gray-300 text-lg" />
              <input
                type="text"
                placeholder="Discord"
                className="border border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
                value={contactInfo.discord}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, discord: e.target.value })
                }
              />
            </div>
            {/* Instagram */}
            <div className="flex items-center space-x-3">
              <FaInstagram className="text-gray-300 text-lg" />
              <input
                type="text"
                placeholder="Instagram"
                className="border border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
                value={contactInfo.instagram}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, instagram: e.target.value })
                }
              />
            </div>
            {/* Snapchat */}
            <div className="flex items-center space-x-3">
              <FaSnapchat className="text-gray-300 text-lg" />
              <input
                type="text"
                placeholder="Snapchat"
                className="border border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
                value={contactInfo.snapchat}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, snapchat: e.target.value })
                }
              />
            </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
