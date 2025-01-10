const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// connect to Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// TODO: add any input validation routes (domain check, handles)


app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, needHelpCourses, canTutorCourses, contactInfo } = req.body;
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      throw signUpError;
    }3
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate the user with Supabase
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return res.status(403).json({ error: 'Email not confirmed' });
      }
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return session information to the frontend
    return res.status(200).json({
      message: 'Login successful',
      user: session.user,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});