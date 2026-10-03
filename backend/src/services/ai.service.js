const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


async function generateDesc(url) {
  try {
    const contents = [
      {
        fileData: {
          fileUri: url,
        },
      },
      {
        text: `You are a social media copywriter who writes captions for short-form video reels.
          Watch the provided video carefully and write a description based only on what actually happens in it.
          Write 2-3 short, engaging sentences in a friendly, conversational tone that hook the viewer in the first line.
          Add 2-3 relevant hashtags at the end, and use at most 1-2 emojis.
          Keep the total length under 100 characters, with no headings, quotes, or extra explanation.
          Return only the final description text, ready to display directly under the video.` }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
    });

    return response.text;

  } catch (error) {
    return "Delicious for you"
  }
  
}

module.exports = generateDesc;