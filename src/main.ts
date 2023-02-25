import { fileSyntax } from 'esbuild-sass-plugin/lib/utils';
import { App, DataWriteOptions, debounce, Editor, MarkdownView, MarkdownViewModeType, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder, Vault } from 'obsidian';
import { PluginSettings } from 'src/types/PluginSettings';
import { tagSuggestionExtension } from './extensions/tag-suggestion-block-widget/tag-suggestion-block-widget';
import { refreshTagSuggestions } from './logic/tag-calculations';

import store, { replaceSuggestions } from 'src/logic/store';



export const DEFAULT_SETTINGS: PluginSettings = {
	
}




export default class KeepPlugin extends Plugin {
	settings: PluginSettings;
	pluginUpdatedFileLast: boolean;

	// Function came from Notion like tables code
	private getViewMode = (el: HTMLElement): MarkdownViewModeType | null => {
		const parent = el.parentElement;
		if (parent) {
			return parent.className.includes("cm-preview-code-block")
				? "source"
				: "preview";
		}
		return null;
	};


	async onload() {
		await this.loadSettings();

		// this.addCommand({
		// 	id: 'ublik-om_import-google-keep-jsons',
		// 	name: 'Import backup from Google Keep',
		// 	callback: () => {
		// 		new StartImportModal(this).open();
		// 	}
		// });

		// this.registerEvent(this.app.vault.on('create', (file) => {
		// 	console.log('a new file has entered the arena')
		// 	console.log('file', file);
		// }));

		// this.registerEvent(this.app.vault.on('modify', (file) => {
		// 	if(file instanceof TFile) {
		// 		refreshTagSuggestions(file)
		// 		// debounce(() => refreshTagSuggestions(file), 5000);	// TODO: Why isn't this working?
		// 	}
		// 	console.log('file modified');
		// }));
		this.registerEvent(this.app.vault.on('modify', (file) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if(!view) {
				console.log('File modified, but not the active file in the view.');
				return;
			}

			let contentStr = view.editor.getValue();

			// RegExp Definitions
			/////////////////////

			// Match any single hashtag followed by valid tag characters... that are at the start of the string, after a space, or after a new line
			const tags = /(?<=^|\s|\n)\#[\w\/\-]+/;
			// console.log( contentStr.match( new RegExp(tags.source, 'g') ) );

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

			

			// TODO: Remember all existing hashtags to filter them out of suggestions if used as normal words too (Filter after swapping them for aliases)
			// REVIEW: Perhaps they should be copied to the top of the file automatically?

			// Remove all existing hashtags
			contentStr = contentStr.split(new RegExp(tags, 'g')).join('');

			/// remove all apostrophies as they can't be in the hashtags to be created later
			contentStr = contentStr.split("'").join('');

			// TODO: Remove anything between a code block

			// TODO: Remove anything in a link or other obsidian feature

			// Convert all to lowercase
			contentStr = contentStr.toLowerCase();


			const nonWordsRegExp = new RegExp(`${gaps.source}|${invalidPrecedingGap.source}|${invalidFollowingGap.source}|${numberOnlyWords.source}` , 'g')
			const wordsArr = contentStr.split(nonWordsRegExp).filter(Boolean);
			// console.log('wordsArr', wordsArr);

			
			// Count words
			const dictionary: {[key: string]: number} = {};
			for (let i = 0; i < wordsArr.length; i++) {
				const word = wordsArr[i];
				if (dictionary[word]) {
					dictionary[word]++;
				} else {
					dictionary[word] = 1;
				}
			}
			
			
			// TODO: Removed ignored words
			

			// TODO: Replace aliased phrases/words (By those aliases with the most spaces first - if supporting phrases)
			

			// Order by most to least used
			const suggestionsArr = Object.entries(dictionary).map(([key, value]) => {
				return {
					tag: key,
					relevance: value
				}
			});
			suggestionsArr.sort((a, b) => {
				return b.relevance - a.relevance;
			});
			
			// Add to redux store
			store.dispatch( replaceSuggestions(suggestionsArr) );

		}));
		
		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingsTab(new MySettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });



		this.registerEditorExtension([
			tagSuggestionExtension(this),
		]);		

	}

	onunload() {
		// TODO: Make sure to stop anything here

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async resetSettings() {
		this.settings = JSON.parse( JSON.stringify(DEFAULT_SETTINGS) );
		this.saveSettings();
		new Notice('Plugin settings reset');
	}
}

