import { TFile } from "obsidian";
import SummariesTitlesAndTagsPlugin from "src/main";
import { applyTags, applyTitle } from "./frontmatter-processes";


////////////////
////////////////


export async function randomiseNoteName(file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    console.log(`PROCESSING `, file.basename);
    const s = plugin.settings;
    
    const newName = crypto.randomUUID();
    await applyTitle(newName, file, plugin);
}

export async function deleteNoteFrontmatter(file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    console.log(`PROCESSING `, file.basename);

    try {
        await plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
            for(const key in frontmatter) {
                delete frontmatter[key];
            }
        });
    } catch (error) {
        console.log(`Error deleting file's frontmatter.`);
    }
}