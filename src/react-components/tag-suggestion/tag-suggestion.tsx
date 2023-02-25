import { TFile, Vault } from "obsidian";
import * as React from "react";
import { useState } from "react";
import { useContext } from 'react';
import { VaultContext } from 'src/extensions/tag-suggestion-block-widget/tag-suggestion-block-widget';

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';


interface TagOptions {
	tagName: string,
  file: TFile,
}

export const TagSuggestion = (options: TagOptions) => {

  const { tagName, file } = options;
  const [isOpen, setIsOpen] = useState(false);
  const vault = useContext(VaultContext);

  console.log('vault', vault);
  // Change tag name to lowercase

  // Check if tag name should suggest a different word


  return <>
    <div
      className = 'uo_tag-suggestion'
      >

      <button
        className = 'uo_tag-name'
        // onClick = {() => addTag(tagName, file, vault)}
        >
        {tagName}
      </button>

      <button
        className = 'uo_tag-overflow'
        onClick = {() => setIsOpen(true)}
        >
        &#8230;
      </button>

    </div>
  </>;
};




function addTag(tagName: string, file: TFile, vault: Vault) {

  // Add in tags to represent Keep properties
  try {
    vault.append(file, `#${tagName} `);
  } catch (error) {
    console.log(`Error adding tag ${tagName} to the file.`);
  }


}
