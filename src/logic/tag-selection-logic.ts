import { TAbstractFile, TFile, Vault } from "obsidian";





export const updateTagSelector = async (vault: Vault, file: TFile) => {
	let newData = '';
    console.log('file', file);

    let data = await vault.read(file);

    let tags = getTagSeeds(data);
    
    newData += addSuggestedTagSelector();
    newData += addTags(tags);
    newData += addDivider();
    newData += data;
    
    await vault.modify(file, newData);
    console.log('newData', newData);
    // vault.modify(file, 'Hello');
}


function getTagSeeds(data) : Array<string> {

    // Use regexp to find words, then put it in a map and order by most used
    // Can include numbers

    let words = data.toLowerCase();
    words = words.split('.').join();
    words = words.split('#').join();
    words = words.split('\n').join();
    words = words.split(' ');
    return words;
}


function addSuggestedTagSelector() : string {
    return '<Button>Test button</Button>\n\n';
}

function addTags(tags: Array<string>) : string {
    let tagStr = '#' + tags.join(' #');
    return `${tagStr}\n\n`;
}

function addDivider() : string {
    return '---\n\n';
}