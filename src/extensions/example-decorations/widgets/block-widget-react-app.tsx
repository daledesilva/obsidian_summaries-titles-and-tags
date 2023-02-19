import * as React from "react";

// Import scss file so that compiler adds it.
// This is instead of injecting it using EditorView.baseTheme
// This allow syou to write scss in an external file and have it refresh during dev better.
import './block-widget.scss';


export const BlockWidgetReactApp = () => {
  return <>
    <div
      className = 'block-widget external-styling'  // Incorporate classnames module
      >
      
      <h2>
        React Based Block Widget
      </h2>

      <p>
        This is a react based block widget placed in a static position at the top of hte document.
      </p>

    </div>
  </>;
};