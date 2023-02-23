import classNames from "classnames";
import * as React from "react";
import { useState } from "react";

import { TagSuggestion } from 'src/react-components/tag-suggestion/tag-suggestion';

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';


export const App = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        />
        <TagSuggestion
          tagName = 'tom'
        />
        <TagSuggestion
          tagName = 'lisa'
        />
      </div>

    </div>
  </>;
};

