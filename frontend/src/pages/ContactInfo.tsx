import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuMail, LuPhone } from 'react-icons/lu';
import { FaDiscord, FaInstagram, FaSnapchat } from 'react-icons/fa6';

const ContactInfo: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    discord: '',
    instagram: '',
    snapchat: '',
    sms: '',
  });

  const location = useLocation();
  const navigate = useNavigate();

  // get the variables from previous
  const { email, password, needHelpCourses, canTutorCourses } =
    (location.state as {
      email: string;
      password: string;
      needHelpCourses: string[];
      canTutorCourses: string[];
    }) || {};

  // incase someone just went straight to the courses URL
  React.useEffect(() => {
    if (!email || !password || !needHelpCourses || !canTutorCourses) {
      // if states are  missing redirect back to sign up page
      navigate('/signup');
    }
  }, [email, password, needHelpCourses, canTutorCourses, navigate]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setContactInfo({ ...contactInfo, [field]: e.target.value });
    };

  const handleNext = () => {
    const hasContactInfo = Object.values(contactInfo).some(
      (info) => info.trim() !== ''
    );

    if (!hasContactInfo) {
      alert('Please provide at least one contact method!');
      return;
    }

    navigate('/summary', {
      state: {
        email,
        password,
        needHelpCourses,
        canTutorCourses,
        contactInfo,
      },
    });
  };

  return (
    <div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Provide Your Contact Info For Others
      </h1>
      <p className="text-gray-400 text-m mb-6 text-center">
        <span className="font-semibold">
          Enter at least <span className="text-secondary">one</span> contact
          method. Additional methods are optional.{' '}
        </span>
      </p>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <form className="space-y-4">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <LuMail className="text-gray-300 text-xl" />
            <input
              type="email"
              placeholder="Email"
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
              value={contactInfo.email}
              onChange={handleChange('email')}
            />
          </div>

          {/* Discord */}
          <div className="flex items-center space-x-3">
            <FaDiscord className="text-gray-300 text-xl" />
            <input
              type="text"
              placeholder="Discord"
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
              value={contactInfo.discord}
              onChange={handleChange('discord')}
            />
          </div>

          {/* Instagram */}
          <div className="flex items-center space-x-3">
            <FaInstagram className="text-gray-300 text-xl" />
            <input
              type="text"
              placeholder="Instagram"
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
              value={contactInfo.instagram}
              onChange={handleChange('instagram')}
            />
          </div>

          {/* Snapchat */}
          <div className="flex items-center space-x-3">
            <FaSnapchat className="text-gray-300 text-xl" />
            <input
              type="text"
              placeholder="Snapchat"
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
              value={contactInfo.snapchat}
              onChange={handleChange('snapchat')}
            />
          </div>

          {/* SMS */}
          <div className="flex items-center space-x-3">
            <LuPhone className="text-gray-300 text-xl" />
            <input
              type="text"
              placeholder="Phone Number"
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
              value={contactInfo.sms}
              onChange={handleChange('sms')}
            />
          </div>
        </form>

        <button
          onClick={handleNext}
          className="bg-secondary hover:brightness-75 text-white py-2 px-4 rounded mt-6 w-full"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;
