


export const singleOrPlural = (count: number, singleVersion: string, pluralVersion?: string) => {
	if(count == 1 || count == -1) {
		return singleVersion;
	} else {
		if(pluralVersion) {
			// custom plural version passed in
			return pluralVersion;
		} else {
			// just add an s
			return `${singleVersion}s`;
		}
	}
}



export function sanitizeFilename(str: string) {
	let newStr = str;

	// Remove characters obsidian doesn't support in filenames
	newStr = newStr.split('/').join('-');
	newStr = newStr.split('\\').join('-');	// Single slash escaped
	newStr = newStr.split(':').join(' -');
	
	// Remove characters obsidian supports in filenames but will break linkability
	newStr = newStr.split('#').join('');
	newStr = newStr.split('^').join(' ');
	newStr = newStr.split('[').join('(');
	newStr = newStr.split(']').join(')');
	newStr = newStr.split('|').join('-');
	
	// Remove characters that are just best not used in filenames aesthetically
	newStr = newStr.split('"').join('');

	// Remove leading and trailing spaces
	newStr = newStr.trim();

	return newStr;
}

export function sanitizeKebabCase(str: string) {
	let newStr = str;

	// Remove characters obsidian doesn't support in tags
	newStr = newStr.split('\\').join('-');	// Single slash escaped
	newStr = newStr.split(':').join('-');
	newStr = newStr.split('#').join('');
	newStr = newStr.split('^').join('');
	newStr = newStr.split('[').join('');
	newStr = newStr.split(']').join('');
	newStr = newStr.split('|').join('-');
	newStr = newStr.split('"').join('');
	newStr = newStr.split('\'').join('');

	// Specific to kebab-case
	newStr = newStr.trim();
	newStr = newStr.split(' ').join('-');
	newStr = newStr.toLowerCase();

	return newStr;
}



export function removeFrontmatter(str: string) {
	const frontmatterRegex = /^---[\s\S]*?---/;
	const newStr = str.replace(frontmatterRegex, '');
	return newStr;
}



// TODO: This messes with headings, also, hashtags can be words in a sentence too so shouldn't really be removed entirely
export function removeBodyTags(str: string) {
	const hashtagRegex = /#[^\s]+/g;
	const newStr = str.replace(hashtagRegex, '');
	return newStr;
}



export function countWords(input: string): number;
export function countWords(input: string[]): number;
export function countWords(input: string | string[]): number {
	const wordsRegex = /\s+/g;
	let count = 0;

	if (typeof input === 'string') {
		const words = input.trim().split(wordsRegex);
		count = words.length;
	} else if (Array.isArray(input)) {
		for (let i = 0; i < input.length; i++) {
			count += countWords(input[i]);
		}
	}

  return count;
}


function splitMarkdownAtHeadings(markdown: string): string[] {
	const headingsRegex = /\n(?=#{1,3} )/g;
	return markdown.split(headingsRegex);
}

function splitStringIntoParagraphs(str: string): string[] {
	const paragraphsRegex = /\n{2,}/g;
	return str.split(paragraphsRegex);
}

function splitStringIntoSentences(str: string) {
	const sentencesRegex = /(\.|\?|!)(\s+|$)/g;
	return str.split(sentencesRegex);
}

function splitStringIntoWords(str: string): string[] {
	const wordsRegex = /\s+/g;
	return str.split(wordsRegex);
}

function combineUpTo1000Words(clumps: string[]): string[] {
	const outputClumps = [];
	let wipClump = '';

	for (const clump of clumps) {
		if (countWords(wipClump + ' ' + clump) <= 1000) {
			// It can fit the next clump and stay valid, so add it
			wipClump += ' ' + clump;

		} else {
			// Next clump would make it invalid, so just accept it as is
			outputClumps.push(wipClump.trim());
			// Use this clump to start the next wipClump
			wipClump = clump;
		}
	}
	// Add the leftover clump that was adding up and not accepted, or just started with the last item
	outputClumps.push(wipClump.trim());

	return outputClumps;
}

function cleanArray(arr: string[]): string[] {
	// Filter out empty items
	const cleanArr = arr.filter(n => n);
	return cleanArr;
}



export function splitMarkdownIntoClumps(markdown: string): string[] {
	
	// Break into chapters
	//////////////////////
	
	const chapters = combineUpTo1000Words( splitMarkdownAtHeadings(markdown) );
	
	// Break large chapters into paragraphs
	///////////////////////////////////////
	
	const chaptersOrParagraphs: string[] = [];

	for (let i = 0; i < chapters.length; i++) {
	  const section = chapters[i].trim();
  
	  if (countWords(section) <= 1000) {
		// This chapter is already valid, so just accept it
		chaptersOrParagraphs.push(section);

	  } else {
		// This one needs breaking down further
		const paragraphs = splitStringIntoParagraphs(section);
		chaptersOrParagraphs.push( ...combineUpTo1000Words(paragraphs) )
	  }
	}

	// Break large paragraphs into sentences
	///////////////////////////////////////
	
	const chaptersParagraphsOrSentences: string[] = [];

	for (let i = 0; i < chaptersOrParagraphs.length; i++) {
	  const section = chaptersOrParagraphs[i].trim();
  
	  if (countWords(section) <= 1000) {
		// This section is already valid, so just accept it
		chaptersParagraphsOrSentences.push(section);

	  } else {
		// This one needs breaking down further
		const sentences = splitStringIntoSentences(section);
		chaptersParagraphsOrSentences.push( ...combineUpTo1000Words(sentences) )
	  }
	}

	// Break large paragraphs into sentences
	///////////////////////////////////////
	
	const chaptersParagraphsSentencesOrWords: string[] = [];

	for (let i = 0; i < chaptersParagraphsOrSentences.length; i++) {
	  const section = chaptersParagraphsOrSentences[i].trim();
  
	  if (countWords(section) <= 1000) {
		// This section is already valid, so just accept it
		chaptersParagraphsSentencesOrWords.push(section);

	  } else {
		// This one needs breaking down further
		const words = splitStringIntoWords(section);
		chaptersParagraphsSentencesOrWords.push( ...combineUpTo1000Words(words) )
	  }
	}
  
	return cleanArray( chaptersParagraphsSentencesOrWords );
  }