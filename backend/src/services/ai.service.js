const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apikey: process.env.GEMINI_API_KEY
});

async function generatedesc(url) {

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: [
      { 
        type: "text", 
        text: `you generate a single line caption for the video.
            your caption should be short and concise of 10 to 15 words.
            you use a hastag and a emojie in the caption.
            generate caption as for a food blog video.` },
      {
        type: "video",
        uri: url,
      }
    ]

  });
  return interaction.output_text;
}

module.exports = {
  generatedesc
}