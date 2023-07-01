import SummariesTitlesAndTagsPlugin from "src/main";
import { getFileExtension } from "./string-processes";
import { Notice, TFile } from "obsidian";
import { processNote } from "./llm-processes";
import { deleteNoteFrontmatter, randomiseNoteName } from "./dev-processes";




export async function processAllUnprocessedNotes(plugin: SummariesTitlesAndTagsPlugin) {
    console.log('PROCESSING ALL NOTES');
    // const s = plugin.settings;
    const v = plugin.app.vault;
        
    const allFiles = v.getFiles();
    
    let filesToProcess: Array<TFile> = [];
    allFiles.forEach( (file) => {
        if(getFileExtension(file.name) !== 'md') return;
        if(file.parent?.path !== '/') return; // Don't do any files not in the root
        
        filesToProcess.push(file);
    })
    
    // TODO: Order the list according to how they're seeing it in the active file-explorer
    
    for(let i = 0; i < filesToProcess.length; i++) {
        const percComplete = i/filesToProcess.length * 100;
        const file = filesToProcess[i];
        plugin.updateProgress(file.basename, percComplete);
        await processNote(file, plugin);
    }
    plugin.updateProgress('Done', 100);
    new Notice('Finished processing all notes');
}

export async function randomiseAllNoteNames(plugin: SummariesTitlesAndTagsPlugin) {
    console.log('RANDOMISING NAMES OF ALL NOTES');
    
    const v = plugin.app.vault;
    const allFiles = v.getFiles();
    
    let filesToProcess: Array<TFile> = [];
    allFiles.forEach( (file) => {
        if(getFileExtension(file.name) !== 'md') return;
        if(file.parent?.path !== '/') return;   // Don't do any files not in the root
        
        filesToProcess.push(file);
    })
    

    for(let i = 0; i < filesToProcess.length; i++) {
        const percComplete = i/filesToProcess.length * 100;
        const file = filesToProcess[i];
        plugin.updateProgress(file.basename, percComplete);
        await randomiseNoteName(file, plugin);
    }
    plugin.updateProgress('Finished randomising names', 100);
    new Notice('Finished randomising names of all notes');
}

export async function deleteFrontmatterFromAllNotes(plugin: SummariesTitlesAndTagsPlugin) {
    console.log('DELETING FRONTMATTER FROM ALL NORTES');
    
    const v = plugin.app.vault;
    const allFiles = v.getFiles();
    
    let filesToProcess: Array<TFile> = [];
    allFiles.forEach( (file) => {
        if(getFileExtension(file.name) !== 'md') return;
        if(file.parent?.path !== '/') return;   // Don't do any files not in the root
        
        filesToProcess.push(file);
    })
    

    for(let i = 0; i < filesToProcess.length; i++) {
        const percComplete = i/filesToProcess.length * 100;
        const file = filesToProcess[i];
        plugin.updateProgress(file.basename, percComplete);
        await deleteNoteFrontmatter(file, plugin);
    }
    plugin.updateProgress('Finished deleting frontmatter', 100);
    new Notice('Finished deleting frontmatter from all notes');
}