import { TFile } from "obsidian";
import SummariesTitlesAndTagsPlugin from "src/main";
import { sanitizeFilename } from "./string-processes";

//////////////
//////////////

export async function applyTags(tags: string[], file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    const s = plugin.settings;

    try {
        await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {      
        if(!frontmatter[s.frontmatterTagsKeyword]) {
            frontmatter[s.frontmatterTagsKeyword] = tags.join(' ');
        } else {
            frontmatter[s.frontmatterTagsKeyword] += ' ' + tags.join(' ');
        }
        });
    } catch (error) {
        console.log(`Error adding tags to the file's frontmatter.`);
    }
}

export async function applyShortSummary(shortSummary: string, file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    const s = plugin.settings;

    try {
        await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter[s.frontmatterShortSummaryKeyword] = shortSummary;
        });
    } catch (error) {
        console.log(`Error adding short summary to the file's frontmatter.`);
    }
}

export async function applyLongSummary(longSummary: string, file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    const s = plugin.settings;

    try {
        await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter[s.frontmatterSummaryKeyword] = longSummary;
        });
    } catch (error) {
        console.log(`Error adding long summary to the file's frontmatter.`);
    }
}

export async function applyTitle(title: string, file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    const s = plugin.settings;

    try {
        const lastSlashIndex = file.path.lastIndexOf('/');
        let path = file.path.substring(0, lastSlashIndex + 1);
        await this.app.vault.rename(file, path + sanitizeFilename(title) + '.md');
    } catch (error) {
        console.error('Failed to change note title:', error);
    }
}