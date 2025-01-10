import { useNavigate } from 'react-router-dom';

const Verified = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-background  min-h-screen flex flex-col items-center ">
      <h1 className="text-2xl text-text font-bold mb-4">Your Email Has Been Verified!</h1>
      <p>Please log in to access your account.</p>
      <button
        onClick={() => navigate('/login')}
        className="bg-secondary text-white py-2 px-4 mt-4 rounded"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Verified;
