import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setIsLoggedIn(!!sessionData?.session);
    };
    checkSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Aggie Tutor Swap!</h1>
      <p className="text-gray-300 mb-8 text-center max-w-md">
        A place to swap tutoring services with your classmates.
      </p>
      
      {/* if user logged in, show "View Matches" only. Otherwise, show Sign Up / Log In */}
      {isLoggedIn ? (
        <Link
          to="/view-matches"
          className="bg-primary text-white py-2 px-6 rounded font-semibold hover:brightness-75"
        >
          View Matches
        </Link>
      ) : (
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="bg-secondary text-white py-2 px-6 rounded font-semibold hover:brightness-75"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-primary text-white py-2 px-6 rounded font-semibold hover:brightness-75"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
