// const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require('openai');


// const configuration = new Configuration({
//   apiKey: process.env.OPENAPI_KEY,
// });
// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
  apiKey: process.env['OPENAPI_KEY'], // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true, // defaults to false
});

export default openai