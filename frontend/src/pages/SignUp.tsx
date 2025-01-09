import {useState } from 'react';


const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form className="flex flex-col">
          <input
            type="email"
            placeholder="UC Davis Email"
            className="border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-800 text-white py-2 px-4 rounded hover:brightness-75"
          >
            Next
          </button>
        </form>
      </div>
    );
  };
  
  export default SignUp;