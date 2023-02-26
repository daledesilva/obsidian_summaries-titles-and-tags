import { Suggestion } from "./store";


export function createSuggestions(inputStr: string): Suggestion[] {
    let wipStr = inputStr;

    // TODO: Create array of alias phrases found (Try both with and without sanitisation?)
    wipStr = morphEnglishToValidTags(wipStr);
    wipStr = removeExistingTags(wipStr);
    let validWords = getAllValidWords(wipStr);
    // TODO: Removed ignored words
    // TODO: Replace single word aliases

    return wordsToSuggestions(validWords);
}


function morphEnglishToValidTags(text: string): string {
    // Remove all apostrophies as they can't be in the hashtags to be created later
    text = text.split("'").join('');

    // Convert all to lowercase
    text = text.toLowerCase();

    return text;
}


function removeExistingTags(inputStr: string): string {
    let outputStr: string, outputTags: string[];

    // Match any single hashtag followed by valid tag characters... that are at the start of the string, after a space, or after a new line
    const tags = /(?<=^|\s|\n)\#[\w\/\-]+/;
    // console.log( inputStr.match( new RegExp(tags.source, 'g') ) );

    // Remember all existing hashtags
    // outputTags = inputStr.match(new RegExp(tags, 'g')) as string[];

    // Remove all existing hashtags
    outputStr = inputStr.split(new RegExp(tags, 'g')).join('');

    // Convert these to lowercase too so they can be equated to new words
    // REVIEW: Perhaps they should be copied to the top of the file automatically?

    return outputStr;
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