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
  prompt: `For all designs, prioritize beauty, originality, and functionality. The webpages must be fully feature-rich, production-ready, and visually polished. The designs should reflect a professional aesthetic and follow best practices.

Design and Development Guidelines
Code Requirements:

Use JSX syntax for React components.
Style components with Tailwind CSS classes.
Use React hooks for state management.
Use Lucide React icons for all icons and logos (default icon set).
Do not install extra UI theme libraries, icon sets, or dependencies unless explicitly requested.
Assets and Media:

Use stock images sourced from Unsplash via valid URLs (do not download images).
File and Folder Structure:

Ensure a clear and well-organized folder structure with files placed correctly:
Index.html:
Located in the root folder.
Serves as the entry point for the application.
Includes proper references to scripts and styles for Tailwind CSS setup.
Index.css:
Located in the src folder.
Import this file in the main.tsx file for global styles.
Configuration Files:
All configuration files, such as package.json, tsconfig.json, tailwind.config.js, and postcss.config.js, must be in the root folder.
Ensure no configuration files are placed in the src folder.
Config and Dependencies:

Include all required files for the project, such as:
package.json
tsconfig.json
tailwind.config.js
postcss.config.js
index.css
index.html
main.tsx
App.tsx
Ensure the configurations enable Tailwind CSS to work correctly out-of-the-box without errors.
Include dependencies such as:
"@emotion/react": "^11.14.0"
Use module type exports in all files and set "type": "module" in package.json.
Ensure proper setup of Tailwind CSS in postcss.config.js and tailwind.config.js.
Project Context:

The project uses React, styled with Tailwind CSS, and defaults to a dark theme.
Ensure the design is:
Responsive: Adapt seamlessly across devices.
Accessible: Meet accessibility standards.
Optimized: High performance with efficient and clean code.
Output Expectations:

Provide proper content for each file according to the project requirements.
Ensure the correct location of all files and folders.
Place all configuration files in the root folder, not in src.
The package.json should include all necessary dependencies and scripts for seamless execution.
Tailwind CSS must work without inaccuracies in configuration files.
Critical Notes:
The location of index.html (in the root folder) and index.css (in the src folder) is critical.
All configuration files (package.json, postcss.config.js, tailwind.config.js, tsconfig.json, etc.) must be placed in the root folder—no exceptions.
Ensure all references to files, folders, and dependencies are accurate to avoid runtime errors.
Provide a response that can easily be converted into a JSON-compatible format this is important as it may break the application.
Key Deliverables:
Fully functional project setup with proper folder structure and correct placement of all files.
Accurate and functional Tailwind CSS integration with all configurations in the root folder.
A visually stunning, production-ready design with a professional and polished look.`,
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