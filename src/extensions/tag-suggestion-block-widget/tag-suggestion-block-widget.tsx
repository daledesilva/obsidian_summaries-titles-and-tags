import {
	Extension,
	StateField,
 } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	WidgetType,
} from "@codemirror/view";
import * as React from "react";
import * as ReactDom from "react-dom";
import { createRoot } from "react-dom/client";
import { App } from './app';


import { createContext } from 'react';
export const PluginContext = createContext('test-plugin');
export const VaultContext = createContext('test-vault');


export class TagSuggestionBlockWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const rootEl = document.createElement('div');
		const root = createRoot(rootEl);

		console.log('view', view);
		// console.log('view.plugin', view.plugin();
		// console.log('view.plugin.vault', view.plugin);

		root.render(
			// <Provider store={store}>
			<PluginContext.Provider value={this.plugin}>
			<VaultContext.Provider value={this.vault}>
				<App
					// viewMode={this.viewMode}
				/>
			</VaultContext.Provider>
			</PluginContext.Provider>
			// </Provider>
		);
		return rootEl;
	}
}
const myWidget = Decoration.widget({widget: new TagSuggestionBlockWidget()});


// Define a StateField to monitor the state of all underline decorations in the set
const myStateField = StateField.define<DecorationSet>({

	// Starts with an empty DecorationSet
	create(): DecorationSet {
		let set = Decoration.none;
		set = set.update({
			add: [myWidget.range(0)]
		})
		return set;
	},
	
	update(oldState, transaction): DecorationSet {
		// No updates needed
		return oldState;
	},

	// Tell the editor to use these decorations (ie. provide them from this statefield)
	provide(thisStateField): Extension {
		return EditorView.decorations.from(thisStateField);
	}
})



export function tagSuggestionExtension(): Extension {
	return [
		myStateField,
	]
}


