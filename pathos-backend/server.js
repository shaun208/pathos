const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' })); 

const groq = new Groq({ apiKey: "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" });


app.post('/api/survey', async (req, res) => {
  try {
    const { messages } = req.body;
    const formattedMessages = messages.map(m => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }));

    const turnCount = Math.floor(messages.length / 2) + 1;
    let systemPrompt = "";

    const strictJSON = `
    You MUST return ONLY a JSON object exactly matching this structure:
    {
      "isComplete": false,
      "nextQuestion": "The exact question text here",
      "inputType": "mcq",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }
    Output valid JSON only. Do not add any other keys.`;

    
    if (turnCount >= 10) {
      systemPrompt = `You are a diagnostic life coach. You have the user's data on Productivity, Stress, Emotions, Social Confidence, Body/Diet Goals, Work Goals, Skincare Diagnosis, and schedule.
      You MUST return ONLY a JSON object exactly matching this structure:
      {
        "isComplete": true,
        "pathway": [
          { "id": 1, "time": "07:00 AM", "task": "Morning Skincare: Salicylic Acid Cleanser & SPF", "xp": 10, "isFocusSession": false, "completed": false },
          { "id": 2, "time": "07:30 AM", "task": "Breakfast: 3 eggs (2500 cal bulk)", "xp": 10, "isFocusSession": false, "completed": false }
        ]
      }
      CRITICAL RULES:
      1. GENERATE A FULL SCHEDULE from wake to sleep.
      2. If they provided a Skincare Diagnosis, you MUST schedule a specific "Morning Skincare" and "Night Skincare" task incorporating the exact products recommended.
      3. Incorporate their specific Work/Study goals into Focus Sessions.
      4. Name specific foods for meals based on calorie goals.
      Output valid JSON only.`;
    }
    else if (turnCount === 9) {
      systemPrompt = `Ask EXACTLY: "How many hours a day do you typically dedicate to deep work or classes?" Set inputType to "mcq" and provide 4 options.` + strictJSON;
    } 
    else if (turnCount === 8) {
      systemPrompt = `Ask EXACTLY: "To map out your master blueprint, use the slider to set your typical wake and sleep times." Set inputType to "time-slider" and options to [].` + strictJSON;
    } 
    else if (turnCount === 7) {
      systemPrompt = `Ask EXACTLY: "What are your specific work, study, or personal goals for today?" Set inputType to "text" and options to [].` + strictJSON;
    } 
    
    else if (turnCount === 6) {
      systemPrompt = `The user just provided their skincare diagnosis. DO NOT ask them about their schedule or wake times yet! 
      Shift focus to Physical Health. Ask EXACTLY: "I've saved your custom skincare routine! Next, what are your current body goals and target daily calories?" 
      Set inputType to "text" and options to [].` + strictJSON;
    }
    else if (turnCount === 5) {
      systemPrompt = `Shift focus to Self-Care and Skincare. Ask EXACTLY: "Let's optimize your skincare routine. Take a quick selfie so my AI can analyze your skin." 
      Set inputType to "camera" and options to [].` + strictJSON;
    }
    else if (turnCount === 4) {
      systemPrompt = `Shift focus to Social Confidence. Ask the user directly about their personal feelings. Example: "How do you react in crowded environments?" DO NOT ask general knowledge or trivia questions. Set inputType to "mcq" and provide 4 personal behavioral options.` + strictJSON;
    }
    else if (turnCount === 3) {
      systemPrompt = `Shift focus to Emotional Balance. Ask the user directly about their personal emotional responses. Example: "When facing a setback, what is your immediate reaction?" DO NOT ask general knowledge or trivia questions. Set inputType to "mcq" and provide 4 personal behavioral options.` + strictJSON;
    }
    else if (turnCount === 2) {
      systemPrompt = `Shift focus to Stress. Ask the user directly about their personal signs of stress. Example: "How does stress manifest physically for you?" DO NOT ask general knowledge or trivia questions. Set inputType to "mcq" and provide 4 personal behavioral options.` + strictJSON;
    }
    else {
      systemPrompt = `Read the history. If they selected an emotional/social topic, explore it. Otherwise, diagnose Productivity. Ask the user directly about their personal habits. Example: "What usually derails your daily focus?" DO NOT ask general knowledge or trivia questions. Set inputType to "mcq" and provide 4 personal behavioral options.` + strictJSON;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...formattedMessages],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI failed to return valid JSON.");
    }

    res.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Survey API Error:", error.message || error);
    res.status(500).json({ error: "Server error." });
  }
});


app.post('/api/analyze-face', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `You are an expert dermatologist. Analyze this face. Determine their skin type (e.g., oily, dry, acne-prone) and any concerns (dark circles, redness). Create a specific morning and night routine with generic product types. 
              
              Output ONLY a JSON object exactly matching this structure:
              { 
                "diagnosis": "Detailed skin diagnosis", 
                "morningRoutine": "Step 1, Step 2...", 
                "nightRoutine": "Step 1, Step 2..." 
              }` 
            },
            { 
              type: "image_url", 
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` } 
            }
          ]
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    res.json(JSON.parse(cleanedText));

  } catch (error) {
    console.error("Vision Error Caught:", error.message || error); 
    res.status(500).json({ error: "Server error during face scan." });
  }
});



app.post('/api/task-coach', async (req, res) => {
  try {
    const { taskName } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Analyze the task: "${taskName}".
          Choose ONE type exactly from this list:
          1. "breathing"
          2. "goal_setter"
          3. "focus_timer"
          4. "recipe" (For food/meals)
          5. "routine" (Use this ONLY for step-by-step physical routines like Skincare, Stretching, etc.)

          Return ONLY a JSON object exactly matching this structure:
          {
            "type": "breathing" | "goal_setter" | "focus_timer" | "recipe" | "routine",
            "title": "Short title",
            "prompt": "Instruction",
            "duration": 1500,
            "recipeDetails": {
              "ingredients": ["1 cup oats"],
              "instructions": ["Boil water"],
              "macros": "Protein: 40g"
            },
            "routineDetails": {
              "steps": ["Step 1: Cleanse face", "Step 2: Apply Vitamin C serum", "Step 3: Moisturize"]
            }
          }
          CRITICAL RULES: 
          1. If type is "recipe", YOU MUST FILL OUT recipeDetails WITH REAL FOOD INGREDIENTS AND INSTRUCTIONS. Do NOT leave it null or empty.
          2. If the task is Skincare, you MUST use the "routine" type and list the exact application steps in routineDetails.
          3. If type is "routine", fill routineDetails and set recipeDetails to null.
          4. If it's a timer, breathing, or goal_setter, set both details objects to null.
          Output valid JSON only, no markdown formatting.`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const responseText = completion.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return valid JSON.");

    res.json(JSON.parse(jsonMatch[0]));

  } catch (error) {
    console.error("Task Coach Error:", error.message || error);
    res.status(500).json({ error: "Server error." });
  }
});
app.post('/api/breakdown-goals', async (req, res) => {
  try {
    const { goals } = req.body;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "Break down the daily goals into short, actionable steps." }, { role: "user", content: goals }],
      model: "llama-3.3-70b-versatile"
    });
    res.json({ breakdown: completion.choices[0].message.content });
  } catch (error) { res.status(500).json({ error: "Server error." }); }
});

app.listen(3000, () => console.log('10-Phase God Mode Server Running'));