import { fileSyntax } from 'esbuild-sass-plugin/lib/utils';
import { App, ButtonComponent, DataWriteOptions, debounce, Editor, MarkdownView, MarkdownViewModeType, Modal, Notice, Plugin, PluginSettingTab, setIcon, Setting, TFile, TFolder, Vault } from 'obsidian';
import { AiModel, PluginSettings, TagFormat, TitleCapitalisation, TitleExistsAction, TitleFormat } from 'src/types/PluginSettings';
import { tagSuggestionExtension } from './extensions/tag-suggestion-block-widget/tag-suggestion-block-widget';
import { refreshTagSuggestions } from './logic/tag-calculations';

import store, { replaceSuggestions } from 'src/logic/store';
import { createSuggestions, getAllValidWords, getSuggestions, morphEnglishToValidTags, removeExistingTags, separateExistingTags } from './logic/note-scraping';
import { processNote } from './logic/llm-processes';
import { MySettingsTab } from './tabs/settings-tab/settings-tab';
import { createProgressBar, ProgressBar } from './components/progress-bar/progress-bar';



/**
 * The default settings that a new install starts with
 */
export const DEFAULT_SETTINGS: PluginSettings = {
	openApiKey: '',
	aiModel: AiModel.Gpt35,

    language: 'English',

    autoAddTags: true,
	allowUnusedTags: true, // Previously unused tags
    autoAddUnusedTags: false, // TODO: Turn this into a option between add | suggest
    useFrontMatterForTags: true, // Store in frontmatter
	frontmatterTagsKeyword: 'Tags',
    tagFormat: TagFormat.CamelCase,
    allowEmojisInTags: false,
    allowAcronymsInTags: true,
	
    autoAddTitle: true,
    minTitleChars: 5,
    maxTitleChars: 20,
    titleFormat: TitleFormat.Straightforward,
    titleCapitalisation: TitleCapitalisation.Smart,
    allowArticlesFirstInTitles: false, // (ie. The, A, An)
	titleExistsAction: TitleExistsAction.AddIncrements,

    autoAddShortSummary: true,
    useFrontmatterForShortSummary: true, // Store in frontmatter
	frontmatterShortSummaryKeyword: 'Condensed Summary',
    minShortSummaryWords: 5,
    maxShortSummaryWords: 20,

    autoAddSummary: true,
    useFrontmatterForSummary: true, // Store in frontmatter
	frontmatterSummaryKeyword: 'Summary',
    minSummaryWords: 5,
    maxSummaryWords: 50,
}




/**
 * The base plugin class initialised by Obsidian on launch
 */
export default class SummariesTitlesAndTagsPlugin extends Plugin {
	settings: PluginSettings;
	pluginUpdatedFileLast: boolean;
	statusBarItem: HTMLElement;
	updateProgress: Function;

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

		this.addCommand({
			id: 'aet_process-note',
			name: 'Process note',
			callback: () => {
				const mdEditorView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if(!mdEditorView) return;
				
				const activeFile = mdEditorView.file as TFile;				
				processNote(activeFile, this);
				
			}
		});

		// this.registerEvent(this.app.vault.on('create', (file) => {
		// 	console.log('a new file has entered the arena')
		// 	console.log('file', file);
		// }));

		// this.registerEvent(this.app.vault.on('modify', (file) => {
		// 	if(file instanceof TFile) {
				// refreshTagSuggestions(file)
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


		this.addSettingTab(new MySettingsTab(this.app, this));



		this.app.workspace.onLayoutReady(() => {
			setTimeout(() => {
				this.statusBarItem = this.addStatusBarItem();
				// this.statusBarItem.addClass("MiniSettings-statusbar-button");
				// this.statusBarItem.addClass("mod-clickable");
			
				// setAttributes(this.statusBarItem, {
				// 	"aria-label": "Configure Snippets",
				// 	"aria-label-position": "top",
				// });

				// setIcon(this.statusBarItem, "newspaper");
				const { updateProgress } = createProgressBar(this.statusBarItem);
				this.updateProgress = updateProgress;
				updateProgress('filename boy!', 25)
			
				this.statusBarItem.addEventListener("click", () => {
					// snippetsMenu(this.app, this, this.settings);
					console.log("status bar clicked");
				});
			
				// this.addCommand({
				// 	id: `open-snippets-menu`,
				// 	name: `Open snippets in status bar`,
				// 	icon: `pantone-line`,
				// 	callback: async () => {
				// 		snippetsMenu(this.app, this, this.settings);
				// 	},
				// 	});
				// 	this.addCommand({
				// 	id: `open-snippets-create`,
				// 	name: `Create new CSS snippet`,
				// 	icon: `ms-css-file`,
				// 	callback: async () => {
				// 		new CreateSnippetModal(this.app, this).open();
				// 	},
				// });
			});
		});





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

