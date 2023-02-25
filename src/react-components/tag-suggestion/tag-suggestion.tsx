import { Editor, EditorPosition, MarkdownView, TFile, Vault } from "obsidian";
import * as React from "react";
import { useState } from "react";
import { useContext } from 'react';
import KeepPlugin from "src/main";

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';


interface TagOptions {
	tagName: string,
  plugin: KeepPlugin,
}

export const TagSuggestion = (options: TagOptions) => {

  const { tagName, plugin } = options;
  const [isOpen, setIsOpen] = useState(false);

  console.log('plugin', plugin);


  // Change tag name to lowercase

  // Check if tag name should suggest a different word


  return <>
    <div
      className = 'uo_tag-suggestion'
      >

      <button
        className = 'uo_tag-name'
        onClick = {() => addTag(tagName, plugin)}
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




function addTag(tagName: string, plugin: KeepPlugin) {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);

  if(!view) {
    console.log(`No active view`);
    return;
  }

  try {
    const firstLineLength = view.editor.getLine(0).length;
    const range: EditorPosition = {
      line: 0,
      ch: firstLineLength,
    }
    if(firstLineLength > 0) {
      view.editor.replaceRange(` #${tagName}`, range);
    } else {
      view.editor.replaceRange(`#${tagName}`, range);
    }
    
  } catch (error) {
    console.log(`Error adding tag ${tagName} to the file.`);
  }


}
