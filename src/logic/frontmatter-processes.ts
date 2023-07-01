import { TAbstractFile, TFile } from "obsidian";
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
    const v = plugin.app.vault;

    
    try {
        const lastSlashIndex = file.path.lastIndexOf('/');
        const path = file.path.substring(0, lastSlashIndex + 1);
        const safeFilename = sanitizeFilename(title);
        let fileSuffix = 1;
        let fullPath = `${path + safeFilename}.md`;
        if(fullPath === file.path) {
            // It's already got this filename and title, so just skip renaming
            console.log('ALREADY NAMED THIS, so skipping');
            return;
        }

        let existingFile: TAbstractFile | null;
        existingFile = v.getAbstractFileByPath(fullPath);
        while(existingFile) {
            // File already exists, so give it a suffix or increment it and try again
            fullPath = `${path + safeFilename} ${++fileSuffix}.md`;
            console.log(`filename is already used for '${existingFile.name}', so trying '${fullPath}'`);
            existingFile = v.getAbstractFileByPath(fullPath);
        }        
        await this.app.vault.rename(file, fullPath);

    } catch (error) {
        console.error('Failed to change note title:', error);
    }
}