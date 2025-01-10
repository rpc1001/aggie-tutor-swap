import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Aggie Tutor Swap!</h1>
      <p className="text-gray-300 mb-8 text-center">
        A place to swap tutoring services with your classmates.
      </p>
      <Link
        to="/signup"
        className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Home;
