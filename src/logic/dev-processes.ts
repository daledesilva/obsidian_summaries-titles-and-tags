import { TFile } from "obsidian";
import SummariesTitlesAndTagsPlugin from "src/main";
import { applyTitle } from "./frontmatter-processes";


////////////////
////////////////


export async function randomiseNoteName(file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    console.log(`PROCESSING `, file.basename);
    const s = plugin.settings;
    
    const newName = crypto.randomUUID();
    await applyTitle(newName, file, plugin);
}

export async function deleteFrontmatter(file: TFile, plugin: SummariesTitlesAndTagsPlugin) {
    console.log(`PROCESSING `, file.basename);
    const s = plugin.settings;
    
    // await applyTags(responseData.tags, file, plugin);
}