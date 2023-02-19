import {
	Extension,
	StateEffect,
	StateField,
	RangeSetBuilder,
 } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	WidgetType,
	keymap,
} from "@codemirror/view";

// Import scss file so that compiler adds it
import './block-widget.scss';




export class MyWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const blockDiv = document.createElement('div');
		blockDiv.addClass('block-widget');
		blockDiv.addClass('external-styling');
		blockDiv.createEl('h2').innerText = 'Block Widget';
		blockDiv.createEl('p').innerText = 'This is a block widget placed in a static position at the top of the document.';
		return blockDiv;
	}
}
const myWidget = Decoration.widget({widget: new MyWidget()});

// Define the class to apply and the related styling
// const myTheme = EditorView.baseTheme({
// 	".block-widget": {
// 		backgroundColor: '#000000',
// 		borderColor: '#444444',
// 		borderRadius: '5px',
// 		padding: '0.1em 1.2em',

// 	}
// })

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



export function blockWidgetExtension(): Extension {
	return [
		myStateField,
	]
}



