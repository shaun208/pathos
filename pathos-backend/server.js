const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: "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" });

app.post('/api/survey', async (req, res) => {
  try {
    const { messages } = req.body;

    const formattedMessages = messages.map(m => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a life coach AI. Analyze user goals. Ask max 4 follow-up questions. If you have enough info, return a JSON object with 'isComplete': true and a 'pathway' array of objects with 'step' and 'description'. Otherwise, return 'isComplete': false and 'nextQuestion'. Output valid JSON only."
        },
        ...formattedMessages
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));

  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

app.listen(3000);