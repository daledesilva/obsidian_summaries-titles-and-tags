import { fileSyntax } from 'esbuild-sass-plugin/lib/utils';
import { App, DataWriteOptions, Editor, MarkdownView, MarkdownViewModeType, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder, Vault } from 'obsidian';
import { PluginSettings } from 'src/types/PluginSettings';
import { showStripes, zebraStripes } from './extensions/tag-selector/tag-selector';
import { updateTagSelector } from './logic/tag-selection-logic';
import { MySettingsTab } from './tabs/settings-tab/settings-tab';




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
		// 	if(!this.pluginUpdatedFileLast) {
		// 		updateTagSelector(this.app.vault, file as TFile);
		// 		this.pluginUpdatedFileLast = true;
		// 	} else {
		// 		this.pluginUpdatedFileLast = false;
		// 	}
		// }));
		
		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new MySettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });



		this.registerEditorExtension([zebraStripes()]);



		

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


