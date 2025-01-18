const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

// Define the context and prompt
const context = {
  prompt: `For all designs I ask you to create, prioritize beauty, originality, and functionality. 
    The webpages should not be cookie-cutter but rather fully feature-rich and production-ready, with a polished, professional aesthetic.
    
    Default design considerations:
    - Use JSX syntax with Tailwind CSS classes for styling, React hooks for state management, and Lucide React for icons.
    - Avoid installing extra UI theme packages, icon sets, or dependencies unless explicitly requested. 
    - For logos and icons, default to Lucide React icons.
    - For images, use stock photos from Unsplash (using valid URLs) without downloading them.

    The designs should be responsive, accessible, and optimized for performance, ensuring a great user experience across devices. Focus on intuitive UI, with clear navigation, smooth animations, and high attention to visual details such as spacing, typography, and color schemes.
  `,
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

// API endpoint to get website code
app.post("/generate-website", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      stream: true,
    });
    console.log(req.body.prompt);

    const enhancedPrompt = `
        As an AI assistant specializing in web development:

        Context:
        ${JSON.stringify(context)}

        Task:
        ${req.body.prompt}
        The app must have the following considerations:
        - Use Tailwind CSS for responsive and modern design.
        - Use Lucide React icons for all buttons and actions.
        - Provide accessible components and ensure high contrast for readability.
        - Use state management with React hooks.
        - Provide proper error handling and form validation.
        -  Responsiveness for mobile and desktop views.
        - Clear and interactive UI elements with smooth animations.

        Please provide the response in the following JSON structure:
        {
        "code": {
            "files": [
            {
                "path": "string", 
                "content": "string", 
                "type": "create|update|delete"
            }
            ]
        },
        "explanation": "Detailed explanation of how the app is built, including structure, components, and any notable design decisions.",
        "dependencies": {
            "npm": ["react", "tailwindcss", "lucide-react", "react-router-dom"],
            "commands": ["npm install", "npm start"]
        }
        }
        `;

    const result = await model.generateContentStream(enhancedPrompt);

    res.setHeader("Content-Type", "application/json");

    // Stream the response back to the client
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end(); // End the response when the stream is done
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "An error occurred while generating the website content." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
