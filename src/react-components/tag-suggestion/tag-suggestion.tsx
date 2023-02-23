import * as React from "react";
import { useState } from "react";

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';


interface TagOptions {
	tagName: string,
}

export const TagSuggestion = (options: TagOptions) => {

  const { tagName } = options;
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <div
      className = 'uo_tag-suggestion'
      >

      <button
        className = 'uo_tag-name'
        // onClick = {() => addTag()}
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

