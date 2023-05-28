import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin, { DEFAULT_SETTINGS } from "src/main";
import { ConfirmationModal } from "src/modals/confirmation-modal/confirmation-modal";
import { AiModel, TagFormat } from "src/types/PluginSettings";



export class MySettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		const s = this.plugin.settings;

		containerEl.empty();

		containerEl.createEl('h1', {text: 'Summaries, Titles & Tags'});
		containerEl.createEl('p', {text: 'Chat GPT and what not.'});

		containerEl.createEl('hr');
		containerEl.createEl('h2', {text: 'Basics'});


		new Setting(containerEl)
			.setClass('gki_setting-mapping')
			.setName('Open AI API Key')
			.addText((text) => {
				text.setValue(s.openApiKey);
				text.inputEl.addEventListener('blur', async (e) => {
					const value = text.getValue();
					s.openApiKey = value;
					await this.plugin.saveSettings();
				});
			})
		
		new Setting(containerEl)
            // .setClass('gki_setting')
            .setName('Model')
            // .setDesc('Automatically adjust mapping below to prevent errors on the selected kinds of devices and operating systems.')
            .addDropdown((dropdown) => {
                dropdown.addOption(AiModel.Gpt35, AiModel.Gpt35);
                dropdown.addOption(AiModel.Gpt4, AiModel.Gpt4);
                dropdown.setValue(s.aiModel);
                dropdown.onChange(async (value) => {
					s.aiModel = value as AiModel;
                    await this.plugin.saveSettings();
                });
            })
		
		new Setting(containerEl)
			.setClass('gki_setting-mapping')
			.setName('Language')
			.addText((text) => {
				text.setValue(s.language);
				text.inputEl.addEventListener('blur', async (e) => {
					const value = text.getValue();
					s.language = value;
					await this.plugin.saveSettings();
				});
			})


		// Tag settings
		///////////////

		new Setting(containerEl)
            .setClass('gki_setting')
            .setName('Automatically add established tags')
            .setDesc('When processing a file, this will cause tags that you already use in your library to be added immediately to this note if applicable.')
            .addToggle(toggle => {
                toggle.setValue(s.autoAddTags)
                toggle.onChange(async (value) => {
                    s.autoAddTags = value;
                    await this.plugin.saveSettings();
                });
            })

		new Setting(containerEl)
            .setClass('gki_setting')
            .setName('Automatically add new tags')
            .setDesc('When processing a file, this will cause tags that are new to your library to be added immediately to this note if applicable. Otherwise, they will only be suggested.')
            .addToggle(toggle => {
                toggle.setValue(s.autoAddTags)
                toggle.onChange(async (value) => {
                    s.autoAddTags = value;
                    await this.plugin.saveSettings();
                });
            })

		// TODO: option to use Front Matter (radio button tab set)

		new Setting(containerEl)
			.setClass('gki_setting-mapping')
			.setName('Keyword for tag section in frontmatter')
			.addText((text) => {
				text.setValue(s.frontmatterTagsKeyword);
				text.inputEl.addEventListener('blur', async (e) => {
					const value = text.getValue();
					s.frontmatterTagsKeyword = value;
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
            // .setClass('gki_setting')
            .setName('Tag Format')
            // .setDesc('Automatically adjust mapping below to prevent errors on the selected kinds of devices and operating systems.')
            .addDropdown((dropdown) => {
                dropdown.addOption(TagFormat.CamelCase, TagFormat.CamelCase);
                dropdown.addOption(TagFormat.KebabCase, TagFormat.KebabCase);
                dropdown.addOption(TagFormat.PascalCase, TagFormat.PascalCase);
                dropdown.addOption(TagFormat.SnakeCase, TagFormat.SnakeCase);
                dropdown.setValue(s.tagFormat);
                dropdown.onChange(async (value) => {
					s.tagFormat = value as TagFormat;
                    await this.plugin.saveSettings();
                });
            })

		// TODO: Emojis
		// TODO: Acronyms
		


	}
}