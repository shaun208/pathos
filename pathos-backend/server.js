const express = require('express');
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyAtUiUPUS_SVRvZoC5_WcggxLe4mnrhLdg");

// Define the schema so the AI CANNOT mess up the JSON format
const surveySchema = {
  type: SchemaType.OBJECT,
  properties: {
    isComplete: { type: SchemaType.BOOLEAN },
    nextQuestion: { type: SchemaType.STRING, nullable: true },
    pathway: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          step: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING }
        }
      }
    }
  }
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Use Flash for speed in a hackathon
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: surveySchema,
  },
});

app.post('/api/survey', async (req, res) => {
  const { messages } = req.body;
  
  const systemPrompt = "You are a life coach AI. Analyze user goals in emotional, social, or mental health. Ask max 4 follow-up questions to tailor a plan. If you have enough info, set isComplete to true and provide the pathway.";

  // Convert your message history into Gemini's format
  const chat = model.startChat({
    history: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(systemPrompt);
  res.json(JSON.parse(result.response.text()));
});

app.listen(3000, () => console.log('Gemini Backend running on port 3000'));