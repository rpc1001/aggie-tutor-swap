import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { supabase } from '../supabaseClient';
// Icons
import { LuMail, LuPhone } from 'react-icons/lu';
import { FaDiscord, FaInstagram, FaSnapchat } from 'react-icons/fa6';



interface ContactInfo {
  sms?: string;
  email?: string;
  discord?: string;
  snapchat?: string;
  instagram?: string;
}

interface MatchProfile {
  id: string;
  contact_info?: ContactInfo;
  need_help_courses?: string[];
  can_tutor_courses?: string[];
  youCanHelp?: string[];   // added by backend, not actually part of database vv
  theyCanHelp?: string[]; 
}

export default function ViewMatches() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // map each contact method to its icon
  const contactIconsMap: { [key: string]: JSX.Element } = {
    email: <LuMail className="text-gray-300 text-lg" />,
    discord: <FaDiscord className="text-gray-300 text-lg" />,
    instagram: <FaInstagram className="text-gray-300 text-lg" />,
    snapchat: <FaSnapchat className="text-gray-300 text-lg" />,
    sms: <LuPhone className="text-gray-300 text-lg" />,
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // get the Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
  
        if (!session) {
          setError('No session found. Please log in.');
          setLoading(false);
          return;
        }

        const userId = session.user?.id;
        if (!userId) {
          setError('User not found in session.');
          setLoading(false);
          return;
        }

        // request to backend to get profiles of all the matches
        const _apiUrl = import.meta.env.VITE_BACKEND_URL;
        const { data } = await axios.post(
          `${_apiUrl}/api/update-matches`,
          { userId }
        );

        // data.matches is now an array of profiles
        setMatches(data.matches || []);
      } catch {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen">

      <h1 className="text-4xl font-bold text-primary mb-6">Your Matches</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/edit-profile')}
          className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75"
        >
          Edit Profile
        </button>
      </div>
      {loading && <p className="text-gray-300">Loading matches...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {matches.length === 0 && !loading && !error && (
        <p className="text-gray-400">
          No matches found. Update your courses to find matches!
        </p>
      )}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto justify-center">
          {matches.map((match, index) => (
          <div
            key={match.id}
            className="bg-zinc-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold text-primary mb-2">
              Student {index + 1}
            </h2>

            {/* Contact info */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-200 mb-1">Contact Info</h3>
              {match.contact_info && Object.values(match.contact_info).some(val => val) ? (
                <ul className="space-y-2">
                  {Object.entries(match.contact_info).map(([key, value]) => {
                    if (!value) return null;
                    // find the corresponding icon
                    const icon = contactIconsMap[key];
                    return (
                      <li key={key} className="flex items-center space-x-2 text-gray-300">
                        {icon}
                        <span className="font-medium">{value}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400">No contact info provided.</p>
              )}
            </div>

            {/* Exchange */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-200 mb-1">Exchange</h3>
              <div className="text-gray-300">
                <div className="mb-2">
                  <span className="font-medium">You can help them with:</span>{' '}
                  {match.youCanHelp && match.youCanHelp.length > 0 ? (
                    <span className="font-bold text-text">
                      {match.youCanHelp.join(', ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
                <div>
                  <span className="font-medium">They can help you with:</span>{' '}
                  {match.theyCanHelp && match.theyCanHelp.length > 0 ? (
                    <span className="text-text font-bold">
                      {match.theyCanHelp.join(', ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
