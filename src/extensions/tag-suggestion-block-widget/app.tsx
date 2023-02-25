import classNames from "classnames";
import * as React from "react";
import { useState } from "react";
import KeepPlugin from "src/main";
import { useSelector, useDispatch } from 'react-redux';

import { TagSuggestion } from 'src/react-components/tag-suggestion/tag-suggestion';

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './styles.scss';
import { State, Suggestion } from "src/logic/store";




interface Props {
	plugin: KeepPlugin;
}


export const App = (props: Props) => {
  const {plugin} = props;
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = useSelector((state) => state.store.suggestions);  // TODO: How to define this type?

  console.log('suggestions', suggestions);


  return <>
    <div
      className = {classNames(
        'uo_tag-suggestions',
        isOpen && 'uo_is-open',
      )}
      >
      
      <h2>Tag Suggestions</h2>

      <div className='uo_tags'>
        {suggestions.map( (suggestion: Suggestion) => (
          <TagSuggestion
            tagName = {suggestion.tag}
            plugin = {plugin}
          />
        ))}
      </div>

    </div>
  </>;
};



