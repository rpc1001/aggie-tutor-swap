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
    }

    return res.status(200).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
