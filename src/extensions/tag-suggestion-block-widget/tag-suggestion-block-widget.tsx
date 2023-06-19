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

import { Provider } from 'react-redux';
import store from 'src/logic/store';

import SummariesTitlesAndTagsPlugin from "src/main";


export class TagSuggestionBlockWidget extends WidgetType {

	plugin: SummariesTitlesAndTagsPlugin;

	constructor(plugin: SummariesTitlesAndTagsPlugin) {
		super();
		this.plugin = plugin;
	}

	toDOM(view: EditorView): HTMLElement {
		const rootEl = document.createElement('div');
		const root = createRoot(rootEl);


		// TODO: Explicitly decide what to do with different view modes

		root.render(
			<Provider store={store}>
				<App plugin={this.plugin}/>
			</Provider>
		);
		return rootEl;
	}

}



// Define a StateField to monitor the state of all these decorations in the set
function createStatefieldAndWidget(plugin: SummariesTitlesAndTagsPlugin): StateField<DecorationSet> {
	
	const myWidget = Decoration.widget({widget: new TagSuggestionBlockWidget(plugin)});

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

	return myStateField;

}




export function tagSuggestionExtension(plugin: SummariesTitlesAndTagsPlugin): Extension {
	return [
		createStatefieldAndWidget(plugin),
	]
}



