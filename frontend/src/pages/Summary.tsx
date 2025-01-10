import React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

type LocationState = {
  email: string;
  password: string;
  needHelpCourses: string[];
  canTutorCourses: string[];
  contactInfo: {
    email: string;
    discord: string;
    instagram: string;
    snapchat: string;
    sms: string;
  };
};

const Summary: React.FC = () => {
const navigate = useNavigate();
const location = useLocation();
  const state = location.state as LocationState;

  const { email, needHelpCourses, canTutorCourses, contactInfo } = state || {};

  // incase someone just went straight to the courses URL
  React.useEffect(() => {
    if (!email || !needHelpCourses || !canTutorCourses || !contactInfo) {
      navigate('/signup');
    }
  }, [email, needHelpCourses, canTutorCourses, contactInfo, navigate]);

  // reroute them if they want to edit, will have to do everything over again though
  const handleEditCourses = () => navigate('/courses', { state });
  const handleEditContact = () => navigate('/contact-info', { state });

  const handleConfirm = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/signup',
        state
      );
      console.log(
        'information has been submitted successfully. User ID: ' + data.userId
      );
      alert(
        'Sign up successful. Please check your email to confirm your account.'
      );
    } catch (error: any) {
      console.error(error);
      alert(
        'Failed to create user: ' + error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className="p-8 bg-background flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Overview
      </h1>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-6">
        {/* Email */}
        <div>
          <h2 className="text-xl font-semibold text-text mb-2">Email</h2>
          <p className="text-gray-400">{email}</p>
        </div>

        {/* Need Help Courses */}
        <div>
          <h2 className="text-xl font-semibold text-text mb-2">
            Need Help With
          </h2>
          {needHelpCourses.length > 0 ? (
            <ul className="text-gray-400 space-y-1">
              {needHelpCourses.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses selected</p>
          )}
          <button
            onClick={handleEditCourses}
            className="text-blue-500 hover:underline mt-2"
          >
            Edit Courses
          </button>
        </div>

        {/* Can Tutor Courses */}
        <div>
          <h2 className="text-xl font-semibold text-text mb-2">Can Tutor</h2>
          {canTutorCourses.length > 0 ? (
            <ul className="text-gray-400 space-y-1">
              {canTutorCourses.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses selected</p>
          )}
          <button
            onClick={handleEditCourses}
            className="text-blue-500 hover:underline mt-2"
          >
            Edit Courses
          </button>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-semibold text-text mb-2">
            Contact Information
          </h2>
          <ul className="text-gray-400 space-y-1">
            {Object.entries(contactInfo).map(([key, value]) =>
              value ? (
                <li key={key}>
                  <strong className="capitalize">{key}:</strong> {value}
                </li>
              ) : null
            )}
          </ul>
          <button
            onClick={handleEditContact}
            className="text-blue-500 hover:underline mt-2"
          >
            Edit Contact Info
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75 w-full"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Summary;
