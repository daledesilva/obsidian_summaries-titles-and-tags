import SummariesTitlesAndTagsPlugin from "src/main";
import { Configuration, OpenAIApi } from "openai";

//////////////
//////////////

export async function askOpenAi(query: string, plugin: SummariesTitlesAndTagsPlugin) {
  const s = plugin.settings;

  const configuration = new Configuration({
    apiKey: s.openApiKey,
  });
  delete configuration.baseOptions.headers['User-Agent']; // This prevents the error: Refused to set unsafe header "User-Agent"
  const openai = new OpenAIApi(configuration);
  let response;
  try {
    response = await openai.createChatCompletion({
      model: s.aiModel,
      messages: [
        // {"role": "system", "content": "You are a helpful assistant that translates English to French."},
        { "role": "user", "content": query }
        // {"role": "user", "content": context + '\n' + question}
      ],
      // temperature: 0,
      // max_tokens: 10,
      top_p: 1,
      temperature: 1,
      // stream: true,
      // maxRetries: 0,
    });
  } catch (error) {
    if (error.response) {
      const headers = error.response.headers;
      const body = error.response.body;

      console.log('Headers:', headers);
      console.log('Body:', body);
    } else {
      console.log('Error:', error);
    }
  }

  return response;
}
