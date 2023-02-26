import { fileSyntax } from 'esbuild-sass-plugin/lib/utils';
import { App, DataWriteOptions, debounce, Editor, MarkdownView, MarkdownViewModeType, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder, Vault } from 'obsidian';
import { PluginSettings } from 'src/types/PluginSettings';
import { tagSuggestionExtension } from './extensions/tag-suggestion-block-widget/tag-suggestion-block-widget';
import { refreshTagSuggestions } from './logic/tag-calculations';

import store, { replaceSuggestions } from 'src/logic/store';
import { createSuggestions, getAllValidWords, getSuggestions, morphEnglishToValidTags, removeExistingTags, separateExistingTags } from './logic/note-scraping';



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
			const mdEditorView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if(!mdEditorView) return;

			const suggestions = createSuggestions(mdEditorView.editor.getValue(), this);
			store.dispatch( replaceSuggestions(suggestions) );		
		}));


		this.registerEvent(this.app.workspace.on('file-open', (file) => {
			const mdEditorView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if(!mdEditorView) return;

			const suggestions = createSuggestions(mdEditorView.editor.getValue(), this);
			store.dispatch( replaceSuggestions(suggestions) );		
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

