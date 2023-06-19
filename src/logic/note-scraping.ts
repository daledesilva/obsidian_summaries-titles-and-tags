import { MarkdownView } from "obsidian";
import SummariesTitlesAndTagsPlugin from "src/main";
import { Suggestion } from "./store";


export function createSuggestions(inputStr: string, plugin: SummariesTitlesAndTagsPlugin): Suggestion[] {
    let wipStr = inputStr;

    // TODO: Create array of alias phrases found (Try both with and without sanitisation?)
    wipStr = morphEnglishToValidTags(wipStr);
    let textAndTags = separateTextAndTags(wipStr, plugin);
    let words = getAllValidWords(textAndTags.text);
    // TODO: Removed ignored words
    // TODO: Replace single word aliases

    // Remove words that are the same as existing tags in the file
    words = removeWords(words, textAndTags.tags); 

    return wordsToSuggestions(words);
}


function morphEnglishToValidTags(text: string): string {
    // Remove all apostrophies as they can't be in the hashtags to be created later
    text = text.split("'").join('');

    // Convert all to lowercase
    text = text.toLowerCase();

    return text;
}


function separateTextAndTags(inputStr: string, plugin: SummariesTitlesAndTagsPlugin): { text: string, tags: string[] } {
    let outputStr: string;

    // Match any single hashtag followed by valid tag characters... that are at the start of the string, after a space, or after a new line
    const tagsEq = /(?<=^|\s|\n)\#[\w\/\-]+/;
    // console.log( inputStr.match( new RegExp(tags.source, 'g') ) );

    // Remember all existing hashtags from note body
    const tags = inputStr.match(new RegExp(tagsEq, 'g')) as string[];
    // Remove # from the start of each
    if(tags) {
        for (let i = 0; i < tags.length; i++) {
            tags[i] = tags[i].slice(1).toLowerCase();
        }
    }
    
    // Remove all existing hashtags from note's body
    outputStr = inputStr.split(new RegExp(tagsEq, 'g')).join('');

    // add all tags from note's frontmatter
    const frontmatterEq = /(?<=^---\n)([\s\S]*?)(?=\n---)/;
    const frontmatter = inputStr.match( new RegExp(frontmatterEq, 'g') );
    if(frontmatter) {
        const fmTagsEq = /(?<=^tags?:)([\s\S]*?)(?=:\s|---)/;
        const fmTags = frontmatter[0].match( new RegExp(fmTagsEq, 'm') );
        if(fmTags) {
            tags.push(...fmTags[0].split(' ').filter(Boolean));
        }
    }
    
    // Remove frontmatter from note's body
    outputStr = inputStr.split(new RegExp(frontmatterEq, 'g')).join('');

    return {
        text: outputStr,
        tags: tags
    }
}


function getAllValidWords(inputStr: string): string[] {
    
    // RegExp Definitions
    /////////////////////

    // Match any number of spaces or new lines
    const gaps = /[\s\n]+/;
    // console.log( contentStr.match( new RegExp(gaps.source, 'g') ) );
    
    // Match any number of non-word characters, forward-slashes, hyphens or underscores... that are followed by a space or new line, or comes last in the string
    const invalidPrecedingGap = /[\W_]+(?=\s|\n|$)/;
    // console.log( contentStr.match( new RegExp(invalidPrecedingGap.source, 'g') ) );
    
    // Match any number of non-word characters, forward-slashes, hyphens or underscores... that is first in the string or comes after a space or new line
    const invalidFollowingGap = /(?<=^|\s|\n)[\W_]+/;
    // console.log( contentStr.match( new RegExp(invalidFollowingGap.source, 'g') ) );

    // Match sections that are only numbers
    const numberOnlyWords = /(?<=^|\s|\n)[0-9]+(?=\s|\n|$)/;
    // console.log( contentStr.match( new RegExp(numberOnlyWords.source, 'g') ) );

    // TODO: Match anything within a code block
    // REVIEW: Do some people put things in code blocks that should be indexed?
    // Definitely more visual input mechanisms for text will be in clode blocks... hmmm

    // TODO: Remove anything in a link

    // TODO: Remove anything <tag>s (but not the content within)
    
    // TODO: Other obsidian features to ignore?

    
    const nonWordsRegExp = new RegExp(`${gaps.source}|${invalidPrecedingGap.source}|${invalidFollowingGap.source}|${numberOnlyWords.source}` , 'g')
    const wordsArr = inputStr.split(nonWordsRegExp).filter(Boolean);
    // console.log('wordsArr', wordsArr);

    return wordsArr;
}


function wordsToSuggestions(words: string[]): Suggestion[] {

    // Count words
    const wordDictionary: {[key: string]: number} = {};
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (wordDictionary[word]) {
            wordDictionary[word]++;
        } else {
            wordDictionary[word] = 1;
        }
    }
    
    // Order by most to least used
    const suggestionsArr = Object.entries(wordDictionary).map(([key, value]) => {
        const suggestion: Suggestion = {
            tag: key,
            relevance: value
        }
        return suggestion
    });
    suggestionsArr.sort((a, b) => {
        return b.relevance - a.relevance;
    });

    return suggestionsArr;
}


function removeWords(baseWords: string[], badWords: string[]): string[] {
    if(!badWords) return baseWords;
    const outputWords = baseWords.filter(word => !badWords.includes(word));
    return outputWords;
}