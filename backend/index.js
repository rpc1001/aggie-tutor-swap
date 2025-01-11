const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://aggie-tutor-swap.up.railway.app';,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json()); 

// connect to Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, needHelpCourses, canTutorCourses, contactInfo } = req.body;
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      throw signUpError;
    }
    const userId = signUpData.user?.id;

    if (!userId) {
      throw new Error('User ID not returned by Supabase');
    }

    // insert data into the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          need_help_courses: needHelpCourses,
          can_tutor_courses: canTutorCourses,
          contact_info: contactInfo,
        },
      ]);
      if (profileError) {
        throw profileError;
      }
  
    return res.status(200).json({ message: 'User created successfully'});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/update-matches', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // helper function to find the intersection of two arrays:
  const intersect = (arr1 = [], arr2 = []) => {
    return arr1.filter((item) => arr2.includes(item));
  };

  try {
    // get the current user's profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, need_help_courses, can_tutor_courses, matches')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { need_help_courses, can_tutor_courses, matches = [] } = userProfile;

    // fetch all other profiles to find potential matches
    const { data: potentialMatches, error: matchError } = await supabase
      .from('profiles')
      .select('id, need_help_courses, can_tutor_courses')
      .not('id', 'eq', userId);

    if (matchError) {
      return res.status(500).json({ error: 'Failed to fetch profiles' });
    }

    // determine which profiles are actually matches
    const newMatches = potentialMatches.filter((profile) => {
      const youCanHelp = intersect(can_tutor_courses, profile.need_help_courses);
      const theyCanHelp = intersect(profile.can_tutor_courses, need_help_courses);
      // match if both intersections are  non-empty (help needs to go both ways)
      return youCanHelp.length > 0 && theyCanHelp.length > 0;
    });

    // update the user's matches array in DB
    const newMatchIds = newMatches.map((m) => m.id);
    const updatedMatches = [...new Set([...matches, ...newMatchIds])]; // combine unique
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ matches: updatedMatches })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update user matches' });
    }

    // 5) For each newly matched user, make sure they have this user in their 'matches' array
    for (const matchId of newMatchIds) {
      const { data: matchProfile, error: matchProfileError } = await supabase
        .from('profiles')
        .select('matches')
        .eq('id', matchId)
        .single();

      if (!matchProfileError && matchProfile) {
        const matchUpdatedMatches = [...new Set([...matchProfile.matches, userId])];
        await supabase
          .from('profiles')
          .update({ matches: matchUpdatedMatches })
          .eq('id', matchId);
      }
    }

    // fetch the full matched profiles
    const { data: matchedProfiles, error: matchedProfilesError } = await supabase
      .from('profiles')
      .select('id, contact_info, need_help_courses, can_tutor_courses')
      .in('id', updatedMatches);

    if (matchedProfilesError) {
      return res
        .status(500)
        .json({ error: 'Failed to fetch matched profiles' });
    }

    // attach intersection details (youCanHelp, theyCanHelp) for frontend clarity
    const enrichedMatches = matchedProfiles
    .map((m) => {
      const youCanHelp = intersect(can_tutor_courses, m.need_help_courses);
      const theyCanHelp = intersect(m.can_tutor_courses, need_help_courses);
      // only include profiles where both arrays are non-empty
      if (youCanHelp.length > 0 && theyCanHelp.length > 0) {
        return {
          ...m,
          youCanHelp,
          theyCanHelp,
        };
      }
      return null;
    })
    .filter((m) => m !== null); // filter out null values
  

    return res.status(200).json({
      message: 'Matches updated successfully',
      matches: enrichedMatches,
    });
  } catch (err) {
    console.error('Error updating matches:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});