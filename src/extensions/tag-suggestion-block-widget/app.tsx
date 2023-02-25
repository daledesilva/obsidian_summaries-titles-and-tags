import classNames from "classnames";
import * as React from "react";
import { useState } from "react";
import KeepPlugin from "src/main";


import { TagSuggestion } from 'src/react-components/tag-suggestion/tag-suggestion';

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';




interface Props {
	plugin: KeepPlugin;
}


export const App = (props: Props) => {
  const {plugin} = props;
  const [isOpen, setIsOpen] = useState(false);

  console.log('plugin', plugin);


  return <>
    <div
      className = {classNames(
        'uo_tag-suggestions',
        isOpen && 'uo_is-open',
      )}
      >
      
      <h2>Tag Suggestions</h2>

      <div className='uo_tags'>
        <TagSuggestion
          tagName = 'gary'
          plugin = {plugin}
        />
        <TagSuggestion
          tagName = 'tom'
          plugin = {plugin}
        />
        <TagSuggestion
          tagName = 'lisa'
          plugin = {plugin}
          // file = {plugin.app.vault.file}
        />
      </div>

    </div>
  </>;
};



