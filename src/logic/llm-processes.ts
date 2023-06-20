import { TFile } from "obsidian";
import SummariesTitlesAndTagsPlugin from "src/main";
import { countWords, removeFrontmatter, sanitizeKebabCase, splitMarkdownIntoClumps } from "./string-processes";
import { TitleCapitalisation } from "src/types/PluginSettings";
import { Configuration, OpenAIApi } from "openai";
import { applyLongSummary, applyShortSummary, applyTags, applyTitle } from "./frontmatter-processes";
import { askOpenAi } from "./llm-agents/openai-agent";







export async function processNote(file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
  console.log(`PROCESSING `, file.basename);
  const s = plugin.settings;
  
  // plugin.updateProgress(file.basename, 0);

  const noteContent = await extractRelevantContent(file);
  const promptableContent = await makePromptableLength(noteContent, plugin);
  const query = constructTitleTagsAndSummariesQuery(promptableContent, plugin);
  // console.log('query', query);

  const response = await askOpenAi(query, plugin);
  if(response == null || response == undefined) return;
  // console.log('response', response);
  const responseData = parseResponse(response);
  // console.log('responseData', responseData);

  // await applyTags(responseData.tags, file, plugin);
  // await applyShortSummary(responseData.shortSummary, file, plugin);
  // await applyLongSummary(responseData.longSummary, file, plugin);
  await applyTitle(responseData.title, file, plugin);
  
  // plugin.updateProgress(file.basename, 100);
}




async function extractRelevantContent(file: TFile) {
  let noteContent = await this.app.vault.read(file);
  noteContent = removeFrontmatter(noteContent);
  // noteContent = removeBodyTags(noteContent); // This messes with headings, but also, sometimes hashtags can be words inside a sentence, so not sure I should remove
  return noteContent;
}

// Reduce note if too long
// Make this function recursive when necessary
async function makePromptableLength(str: string, plugin: SummariesTitlesAndTagsPlugin) {
  const splitContent = splitMarkdownIntoClumps(str);
  let promptableContent = '';
  
  if(splitContent.length == 1) {
    promptableContent = splitContent[0];
    
  } else {
    const percGoal = Math.min( Math.floor(1000/countWords(splitContent)*100) );
    // console.log('percGoal: ', percGoal);

    for(let i=0; i<splitContent.length; i++) {
      // console.log("--------------SPLIT "+i);
      // console.log("word count:", countWords(splitContent[i]));
      // console.log(splitContent[i]);
      promptableContent += await shortenToPercentage(splitContent[i], percGoal, plugin);
      // plugin.updateProgress(file.basename, (i/splitContent.length) * 100);
    }
  }

  return promptableContent;
}


function constructTitleTagsAndSummariesQuery(noteContent: string, plugin: SummariesTitlesAndTagsPlugin): string {
  const s = plugin.settings;

  // Create TitleTagsAndSummaries query
  /////////////////////////////////////
  
  // Start Query
  //////////////
  let prompt = `You will be given an article and are to provide several items based off that article in a specified order and formatted according to the provided specifications for each.\n`
  // prompt += `Each item must be seperated by the string '|*|*|*|' and formatted as 1 single line of text.\n`
  prompt += `The whole response must be in the format: "Title<|>ShortSummary<|>LongSummary<|>Tags"\n`
  prompt += `The whole response must be in the ${s.language} language.\n`;

  // Define title
  ///////////////
  prompt += `\nItem 1. A title for the article.\n`;
  prompt += `Title specifications:\n`;
  // Standard
  prompt += `Must not include any of these characters: * " \\ / < > : | ? # ' ^ [ ] _ : ; \n`;
  // Length
  prompt += `Must be ${s.minTitleChars}-${s.maxTitleChars} characters long.\n`
  // Style
  prompt += `Must be written in a ${s.titleFormat} style.\n`
  // Capitalisation
  if( s.titleCapitalisation === TitleCapitalisation.Smart ) {
    prompt += `Capitalize the first letter in the first and last words, as well as the first letter in nouns, verbs, pronouns, adjectives, and adverbs.\n`;
  } else if( s.titleCapitalisation === TitleCapitalisation.None ) {
    prompt += `All letters must be lowercase.\n`;
  }
  // First word
  if( !s.allowArticlesFirstInTitles ) {
    prompt += `Must not start with any article words.\n`;
  }

  // Define short summary
  /////////////////
  prompt += `\nItem 2. A short summary of the article.\n`;
  prompt += `Short summary specifications:\n`;
  // Length
  prompt += `${s.minShortSummaryWords}-${s.maxShortSummaryWords} words.\n`

  // Define long summary
  /////////////////
  prompt += `\nItem 3. A long summary of the article.\n`;
  prompt += `Long summary specifications:\n`;
  // Length
  prompt += `${s.minSummaryWords}-${s.maxSummaryWords} words.\n`

  // Define tags
  /////////////////
  prompt += `\nItem 4. A list of tags that represent the general concepts discussed in the article.\n`;
  prompt += `Tag specifications:\n`;
  // Standard
  prompt += `There must be 1-5 tags only.\n`;
  prompt += `Each tag must use a maximum of 4 words.\n`;
  prompt += `Each tag must not include any of these characters: * " \\ / < > : | ? # ' ^ [ ] _ : ; \n`;
  prompt += `Each tag must be separated by the string '|' and no spaces.\n`;
  // Format
  prompt += `Each tag must be written in ${s.tagFormat} format.\n`;
  // Emojis
  if(s.allowEmojisInTags) {
    `Tags that have well established emojis alternatives should use the emoji instead.\n`
  } else {
    `Tags must not use emojis.\n`;
  }
  // Acronyms
  if(!s.allowAcronymsInTags) {
    `Tags must not use acronyms.\n`;
  }
  // TODO: Pass in existing tags and separate new tags
  // TODO: Specific characters not to use
  // TODO: Handle tags in folder format for those who use it

  // Note Contents
  ////////////////
  prompt += `\nArticle:\n`;
  prompt += noteContent;

  return prompt;
}


function parseResponse(response: object): {tags:string[], shortSummary:string, longSummary:string, title:string} {
  // Parse response
  /////////////////

  const rawResponseContent = response.data.choices[0].message.content;
  // console.log('rawResponseContent', rawResponseContent);
  
  
  // console.log('-------SPLIT-------');
  const parsedResponseContent = rawResponseContent.split('<|>');
  // console.log(parsedResponseContent);
  
  const data = {
    title: parsedResponseContent[0],
    shortSummary: parsedResponseContent[1],
    longSummary: parsedResponseContent[2],
    tags: parsedResponseContent[3].split('|'),
  }

  for(let i=0; i<data.tags.length; i++) {
    data.tags[i] = sanitizeKebabCase(data.tags[i]);
  }
  
  return data;
}




async function shortenToPercentage(str: string, percGoal: number, plugin: SummariesTitlesAndTagsPlugin): Promise<string> {
  // Consider converting percentage to word count
  // console.log('PROCESSING CLUMP');
  const s = plugin.settings;

  let prompt = `You will be given an article and are to provide a summary that is ${percGoal}% of the original article length at most.\n`;
  prompt += "Article:\n";
  prompt += str;
  // console.log('prompt: ', prompt);

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
        {"role": "user", "content": prompt}
      ],
      temperature: 0,
      // max_tokens: 100,
    });

    // console.log('----SUCCESS');
    const content = response.data.choices[0].message.content
    // console.log('result: ', content);
    return content;

  } catch(error) {
    if (error.response) {
      const headers = error.response.headers;
      const body = error.response.body;
  
      console.log('Headers:', headers);
      console.log('Body:', body);
    } else {
      console.log('Error:', error);
    }
  }

  return '';
}