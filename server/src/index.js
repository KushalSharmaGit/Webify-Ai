const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Define the context object
const context = {
  prompt: `For all designs I ask you to create, prioritize beauty, originality, and functionality. 
    The webpages should not be cookie-cutter but rather fully feature-rich and production-ready, with a polished, professional aesthetic.
    
    Default design considerations:
    - Use JSX syntax with Tailwind CSS classes for styling, React hooks for state management, and Lucide React for icons.
    - Avoid installing extra UI theme packages, icon sets, or dependencies unless explicitly requested. 
    - For logos and icons, default to Lucide React icons.
    - For images, use stock photos from Unsplash (using valid URLs) without downloading them.
    - Give me all the files of the project just do not include the node_modules folder
    - Also include files like package.json,tsconfig, tailwind.config.js, index.css, main.tsx, index.html, App.tsx,postcss.config.jss and all the other config files
    - Keep the index.html in the root folder and follow correct folder structure.
    - Keep the index.css in the src folder and follow the correct folder structure
    - index.html is the entry point of our application so use it for the main in the package.json
    -Use export in each file including postcss.config.js and do not use module.export anywhere because be have set the type as module.
    -Also Give the type in package.json as module and use module type exports in each file and follow all other rules as well.
    - Also include the files which you need according to the project like components, pages etc files they are optional only give is they are required.
    - Ensure giving the correct tsconfig.json file in order the application works as expexted and can import modules.
    - Also make sure that the package.json contains all the dependencies required with correct form
    - Give me the proper content for each file according to the project
    - Give the proper file structure in the response.

    Alert: The Location of the index.html(in the root folder) and index.css(in the src folder) is very important place it very carefully and place all the config files like postcss.config.js, tsconfig.json, tailwind.config.js, and the package.json should also be in root folder.
     
    Note(Important): The response should be of the type that it can be eassily be converted into the json.

    The designs should be responsive, accessible, and optimized for performance, ensuring a great user experience across devices. Focus on intuitive UI, with clear navigation, smooth animations, and high attention to visual details such as spacing, typography, and color schemes.`,
  projectContext: {
    framework: "react",
    styling: "tailwind",
    theme: "dark",
    requirements: {
      responsive: true,
      accessibility: true,
      performance: true
    }
  }
};

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

// Function to extract JSON from response
const extractJsonFromResponse = (text) => {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('No valid JSON found in response');
  }
  return text.slice(jsonStart, jsonEnd);
};

// Function to safely parse JSON
const safeJsonParse = (text) => {
  try {
    // First try direct parsing
    return JSON.parse(text);
  } catch (e) {
    // If direct parsing fails, try to clean the string
    try {
      // Handle the specific escape sequence issue in package.json
      const fixedText = text.replace(/\\\n/g, '\\n')
                           .replace(/\\{2,}/g, '\\')
                           .replace(/\r\n/g, '\n')
                           .replace(/\t/g, '\\t');
      return JSON.parse(fixedText);
    } catch (e2) {
      throw new Error(`Failed to parse JSON: ${e2.message}`);
    }
  }
};

app.post("/generate-website", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      stream: false,
    });

    const enhancedPrompt = `${context.prompt}\n${req.body.prompt}\n
    Return a valid JSON object with the following structure (no markdown, no backticks):
    {
      "code": {
        "files": [
          {
            "path": "string",
            "content": "string",
            "type": "string"
          }
        ]
      },
      "explanation": "string",
      "dependencies": {
        "npm": ["string"],
        "commands": ["string"]
      }
    }`;

    const result = await model.generateContent(enhancedPrompt);

    if (!result?.response?.candidates?.[0]?.content) {
      return res.status(500).json({ error: "Invalid response from AI model." });
    }

    let responseData = result.response.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonString = extractJsonFromResponse(responseData);
    
    // Parse the JSON
    const parsedData = safeJsonParse(jsonString);

    // Send the response
    res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error processing response:", error);
    res.status(500).json({ 
      error: "An error occurred while processing the response.",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});