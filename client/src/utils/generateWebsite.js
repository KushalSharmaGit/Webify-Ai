import axios from 'axios';

export const generateWebsite = async (userPrompt) => {
  console.log("called api");
  try {
    const response = await axios.post("http://localhost:5000/generate-website", {
      prompt: userPrompt,
    });

    return response.data; // Return the response data, which contains the generated files and explanation
  } catch (error) {
    console.error("Error generating website:", error);
    throw error;
  }
};