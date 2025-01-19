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
    - Also include files like package.json,tsconfig, tailwind.config.js etc give all the files
    - Give me the proper content for each file according to the project
    - Give the proper file structure in the response.

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
app.use(express.json());

// Function to clean and normalize content strings
const cleanContentString = (str) => {
  return str
    .replace(/\r?\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\\\\n/g, "\n")
    .replace(/\\\\t/g, "\t")
    .replace(/\\\"/g, '"')
    .replace(/```(json)?|```/g, '')
    .trim();
};

// Function to prepare response for JSON parsing
const prepareJsonResponse = (responseStr) => {
  try {
    // Remove any markdown code block syntax
    let cleaned = responseStr.replace(/^```json\s*|\s*```$/g, '');
    
    // Remove any non-printable characters
    cleaned = cleaned.replace(/[^\x20-\x7E\n\t]/g, '');
    
    // Attempt to find the JSON object boundaries
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('Invalid JSON structure');
    }
    
    // Extract just the JSON portion
    cleaned = cleaned.slice(startIdx, endIdx + 1);
    
    return cleaned;
  } catch (error) {
    throw new Error(`Failed to prepare JSON response: ${error.message}`);
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
    
    // Clean and prepare the response for parsing
    const cleanedResponse = prepareJsonResponse(responseData);
    console.log(cleanedResponse);
    // Parse the cleaned response
    let responseJson = JSON.parse(cleanedResponse);
    
    // Clean up each file's content
    responseJson.code.files = responseJson.code.files.map(file => ({
      ...file,
      content: cleanContentString(file.content)
    }));

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(responseJson);

  } catch (error) {
    console.error("Error processing response:", error);
    res.status(500).json({ 
      error: "An error occurred while processing the response.",
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});