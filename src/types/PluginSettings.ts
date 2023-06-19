// Type definitions for plugin settings
///////////////////////////////////////

// These are passed into the API configuration so they must match https://platform.openai.com/docs/models/models
export enum AiModel {
	Gpt35 = 'gpt-3.5-turbo',
	Gpt4 = 'gpt-4',
};

export enum TagFormat {
	CamelCase = 'camelCase',
	PascalCase = 'PascalCase',
	KebabCase = 'kebab-case',
	SnakeCase = 'snake_case',
};

export enum TitleFormat {
	Straightforward = 'Straightforward',
	Creative = 'Creative',
};

export enum TitleCapitalisation {
	Smart = 'Smart',
	None = 'None',
};

export enum TitleExistsAction {
    AddIncrements = 'Add Increments',
	AppendDate = 'Append Date',
	ReprocessTitle = 'Reprocess Title',
};

export interface PluginSettings {
    aiModel: AiModel,
    openApiKey: string,

    language: string,

    autoAddTags: boolean,
    useFrontMatterForTags: boolean, // Store in frontmatter
    frontmatterTagsKeyword: string,
    tagFormat: TagFormat,
    allowEmojisInTags: boolean,
    allowAcronymsInTags: boolean,
    allowUnusedTags: boolean, // Previously unused tags
    autoAddUnusedTags: boolean, // Previously unused tags
    
    autoAddTitle: boolean,
    minTitleChars: number,
    maxTitleChars: number,
    titleFormat: TitleFormat,
    titleCapitalisation: TitleCapitalisation,
    allowArticlesFirstInTitles: boolean, // (ie. The, A, An)
    titleExistsAction: TitleExistsAction,

    autoAddShortSummary: boolean,
    useFrontmatterForShortSummary: boolean, // Store in frontmatter
    frontmatterShortSummaryKeyword: string,
    minShortSummaryWords: number,
    maxShortSummaryWords: number,

    autoAddSummary: boolean,
    useFrontmatterForSummary: boolean, // Store in frontmatter
    frontmatterSummaryKeyword: string,
    minSummaryWords: number,
    maxSummaryWords: number,

    // Never automatically process items in these folders

    // Place auto processed items in this folder after successful processing

}
