import {
	syntaxTree
} from "@codemirror/language";
import {
	Facet,
	Extension,
	RangeSetBuilder,
	StateEffect,
	StateField,
	Transaction,
 } from "@codemirror/state";
import {
	Decoration,
	ViewPlugin,
	DecorationSet,
	ViewUpdate,
	PluginValue,
	WidgetType,
	EditorView,
} from "@codemirror/view";


import {keymap} from "@codemirror/view";










// Mark decoration based on content
///////////////////////////////////





// Replacing decoration
///////////////////////



// Line decoration
//////////////////



// Inline Widget decoration
///////////////////////////



// Block Widget decoration
//////////////////////////









// const addTagSelector = StateEffect.define<{from: number, to: number}>({
// 	map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
// })

// const tagSelectorField = StateField.define<DecorationSet>({
// 	create() {
// 		return Decoration.none
// 	},
// 	update(underlines, tr) {
// 		underlines = underlines.map(tr.changes)
// 		for (let e of tr.effects) if (e.is(addTagSelector)) {
// 		underlines = underlines.update({
// 			add: [tagSelectorMark.range(e.value.from, e.value.to)]
// 		})
// 		}
// 		return underlines
// 	},
// 	provide: f => EditorView.decorations.from(f)
// })

// const tagSelectorMark = Decoration.mark({class: "cm-underline"})

// const tagSelectorTheme = EditorView.baseTheme({
// 	".cm-underline": { textDecoration: "underline 3px red" }
// })

// export function createTagSelector(view: EditorView) {
// 	let effects: StateEffect<unknown>[] = view.state.selection.ranges
// 		.filter(r => !r.empty)
// 		.map(({from, to}) => addTagSelector.of({from, to}))

// 	if (!effects.length) return false

// 	if (!view.state.field(tagSelectorField, false))
// 		effects.push(StateEffect.appendConfig.of([tagSelectorField, tagSelectorTheme]))

// 	view.dispatch({effects})
// 	return true
// }











// const tagSelector = Facet.define<number, number>({
// 	combine: values => values.length ? Math.min(...values) : 2
// })
  

// const something = EditorView.decorations(underlineMark) {

// }







// Example using panels https://codemirror.net/examples/panel/



// function tagSelector(): Facet<DecorationSet> {

// 	Facet.define

// 	Facet.define<number, number>({
// 		combine: values => values.length ? Math.min(...values) : 2
// 	  })

// 	return 
// }


// const addTagSelector = StateEffect.define<{from: number, to: number}>({
// 	map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
//   })
  
//   const tagSelectorField = StateField.define<DecorationSet>({

// 	create() {
// 	  return Decoration.none
// 	},

// 	update(underlines, tr) {
// 	  underlines = underlines.map(tr.changes)
// 	  for (let e of tr.effects) if (e.is(addTagSelector)) {
// 		underlines = underlines.update({
// 		  add: [underlineMark.range(e.value.from, e.value.to)]
// 		})
// 	  }
// 	  return underlines
// 	},

// 	provide: f => EditorView.decorations.from(f)
	
//   })
  
//   const underlineMark = Decoration.mark({class: "cm-underline"})

//   const tagSelectorTheme = EditorView.baseTheme({
// 	".cm-underline": { textDecoration: "underline 3px red" }
//   })
  
//   export function underlineSelection(view: EditorView) {
// 	let effects: StateEffect<unknown>[] = view.state.selection.ranges
// 	  .filter(r => !r.empty)
// 	  .map(({from, to}) => addTagSelector.of({from, to}))
// 	if (!effects.length) return false
  
// 	if (!view.state.field(underlineField, false))
// 	  effects.push(StateEffect.appendConfig.of([underlineField,
// 												tagSelectorTheme]))
// 	view.dispatch({effects})
// 	return true
//   }


//   export const underlineKeymap = keymap.of([{
// 	key: "Mod-u",
// 	preventDefault: true,
// 	run: underlineSelection
//   }])




// const tagSelector = Facet.define<number, number>({
// 	combine: values => values.length ? Math.min(...values) : 2
// })



// class ButtonFacet extends Facet {
// 	constructor(options) {
// 	  super(options);
  
// 	  // Create the button element
// 	  this.button = document.createElement("button");
// 	  this.button.textContent = options.text || "Click me";
  
// 	  // Add an event listener to the button
// 	  this.button.addEventListener("click", options.onClick);
  
// 	  // Attach the button to the facet
// 	  this.attach(this.button);
// 	}
//   }



// const hello = (dfs: number, h: string)









const baseTheme = EditorView.baseTheme({
  ".cm-zebraStripe": {backgroundColor: "#444"}
//   "&light .cm-zebraStripe": {backgroundColor: "#d4fafa"},
//   "&dark .cm-zebraStripe": {backgroundColor: "#1a2727"}
})


const stepSize = Facet.define<number, number>({
  combine: values => values.length ? Math.min(...values) : 2
})


export function zebraStripes(options: {step?: number} = {}): Extension {
  return [
	myCodeMirrorPlugin,
    baseTheme, // Not needed if I use a css file
    showStripes,
	underlineKeymap,
	// tagSelector,
  ]
}






export class MyWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");
		div.innerText = "👉";
		return div;
	}
}





class MyCodeMirrorPlugin implements PluginValue {
	decorations: DecorationSet;
  
	constructor(view: EditorView) {
	  this.decorations = this.buildDecorations(view);
	}
  
	update(update: ViewUpdate) {
	  if (update.docChanged || update.viewportChanged) {
		this.decorations = this.buildDecorations(update.view);
	  }
	}
  
	destroy() {}
  
	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		
		// Must be done via a facet
		// builder.add(
		// 	1,
		// 	1,
		// 	Decoration.widget({
		// 		widget: new MyWidget(),
		// 		side: 1,
		// 		block: true,
		// 	})
		// );


	
		for (let { from, to } of view.visibleRanges) {

			let line = view.state.doc.lineAt(from);
			let content = line.text;
			let words = content.split(' ');
			for(let i=0; i<words.length; i++) {
				if(words[i] == 'emoji') {
					words[i]
				}
			}
			console.log('************************************************');


			// Iterate through doc node by node covering both outer nodes and inner nodes.
			// Plain text over multiple lines counts as 1 node.
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
					const textNode = view.state.doc.slice(node.from, node.to);
					const textStr = view.state.doc.sliceString(node.from, node.to);

					// Find a string and replace it with a widget
					let startPos = 0;
					let daleIndex = textStr.indexOf('Dale', startPos);
					while(daleIndex >= 0) {
						console.log("Found Dale");
						const docDaleIndex = node.from + daleIndex;
						
						builder.add(
							docDaleIndex,
							docDaleIndex + 4,
							Decoration.replace({
								widget: new MyWidget(),
							})
						);

						startPos = daleIndex + 4;
						daleIndex = textStr.indexOf('Dale', startPos);
					}

					
					// if (node.type.name.startsWith("list")) {
					// 	// Position of the '-' or the '*'.
					// 	const listCharFrom = node.from - 2;

					// 	builder.add(
					// 		listCharFrom,
					// 		listCharFrom + 1,
					// 		Decoration.replace({
					// 			widget: new MyWidget(),
					// 		})
					// 	);
					// }
				},
			});
		}
  
	  return builder.finish();
	}
  }
  
  const pluginSpec: PluginSpec<MyCodeMirrorPlugin> = {
	decorations: (value: MyCodeMirrorPlugin) => value.decorations,
  };
  
  const myCodeMirrorPlugin = ViewPlugin.fromClass( MyCodeMirrorPlugin, pluginSpec );















// View Plugin
// This only allows styling the view area of the document.


const stripe = Decoration.line({
  attributes: {class: "cm-zebraStripe"}
})

function stripeDeco(view: EditorView) {
  let step = view.state.facet(stepSize)
  let builder = new RangeSetBuilder<Decoration>()

  for (let {from, to} of view.visibleRanges) {

    for (let pos = from; pos <= to;) {

      let line = view.state.doc.lineAt(pos)
	  
	
      if ((line.number % step) == 0) {
		  builder.add(line.from, line.from, stripe)
	  }
      pos = line.to + 1

	}
  }
  return builder.finish()
}


class ExamplePlugin implements PluginValue {
	decorations: DecorationSet

	constructor(view: EditorView) {
		this.decorations = stripeDeco(view)
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = stripeDeco(update.view)
			console.log('update');
		}
	}

	destroy() {

	}
}

const showStripes = ViewPlugin.fromClass(ExamplePlugin, {
	decorations: v => v.decorations
})