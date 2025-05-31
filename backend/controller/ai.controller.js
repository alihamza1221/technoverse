const { openai } = require("@ai-sdk/openai");
const { CoreMessage, streamText } = require("ai");

const getAIResponse = async (req, res) => {
  //using vercel ai sdk
  const { messages } = req.body;

  const response = await streamText({
    model: openai("gpt-4o"),
    messages: messages,
  });
  return response.toDataStreamResponse();
};

module.exports = { getAIResponse };
