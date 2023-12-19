import 'dotenv/config';

export default {
  name: "PixelMuse",
  // ... other configuration ...
  variables: {
    openaiGenerateApi: 'https://api.openai.com/v1/images/generations',
    openaiApiKey: process.env.OPENAI_API_KEY, // Your environment variable
    netlifyBaseUrl: process.env.NETLIFY_BASE_URL,

    // Other variables can be added here
  },
};

