const { OpenRouter } = require('@openrouter/agent');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function generatedesc(url) {
  try {
    const interaction = await openrouter.callModel({
      model: 'openai/gpt-5.2',
      input: [
        {
          type: "input_text",
          text: `Generate a single line caption for the video.
          Keep it short and concise, 10 to 15 words.
          Use a hashtag and an emoji.
          Generate the caption like a food blog video.`
        },
        {
          type: "input_file",
          fileUrl: url
        }
      ]
    });

    return interaction.getText();

  } catch (error) {
    console.log("error");
  }
}

module.exports = {
  generatedesc
};