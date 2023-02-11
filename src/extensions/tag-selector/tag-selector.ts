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
	emojiListPlugin,
    baseTheme,
    options.step == null ? [] : stepSize.of(options.step),
    showStripes
  ]
}






export class EmojiWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = "👉";

		return div;
	}
}

const decoration = Decoration.replace({
	widget: new EmojiWidget()
});




class EmojiListPlugin implements PluginValue {
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

		// view.state.doc.iterRange({
		// 	from,
		// 	to,
		// 	enter(node) {
		// 	  console.log('node.type.name', node.type.name);
		// 	  console.log('node.name', node.name);
		// 	  console.log('node', JSON.parse(JSON.stringify(node)));
		// 	}
		// })


		syntaxTree(view.state).iterate({
			from,
			to,
			enter(node) {
				// console.log('node', JSON.parse(JSON.stringify(node)));
				
				// console.log('-');
				
				// console.log('node.name', node.name);
				// console.log('node.type.name', node.type.name);
				const textNode = view.state.doc.slice(node.from, node.to);
				const textStr = view.state.doc.sliceString(node.from, node.to);
				// console.log('textNode', textNode);
				console.log('textStr', textStr);
				// console.log('from', node.from);
				// console.log('to', node.to);


				let startPos = 0;
				let daleIndex = textStr.indexOf('Dale', startPos);
				while(daleIndex >= 0) {
					console.log("Found Dale");
					const docDaleIndex = node.from + daleIndex;
					builder.add(
						docDaleIndex,
						docDaleIndex + 4,
						Decoration.replace({
							widget: new EmojiWidget(),
						})
					);
					startPos = daleIndex + 4;
					daleIndex = textStr.indexOf('Dale', startPos);
				}

				
				if (node.type.name.startsWith("list")) {
					// Position of the '-' or the '*'.
					const listCharFrom = node.from - 2;
	
					builder.add(
						listCharFrom,
						listCharFrom + 1,
						Decoration.replace({
							widget: new EmojiWidget(),
						})
					);
				}
			},
		});
	  }
  
	  return builder.finish();
	}
  }
  
  const pluginSpec: PluginSpec<EmojiListPlugin> = {
	decorations: (value: EmojiListPlugin) => value.decorations,
  };
  
  const emojiListPlugin = ViewPlugin.fromClass(
	EmojiListPlugin,
	pluginSpec
  );









// StateField
// This allows changing any sections of the document by adding replacing and removing things.
// But is still only affecting the representation layer, not the underlyoing markdown.


// export const emojiListField = StateField.define<DecorationSet>({
// 	create(state): DecorationSet {
// 	  return Decoration.none;
// 	},
// 	update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
// 	  const builder = new RangeSetBuilder<Decoration>();

// 	//   syntaxTree(transaction.state).iterate({
// 	// 	enter(node) {
// 	// 	  if (node.type.name.startsWith("list")) {
// 	// 		// Position of the '-' or the '*'.
// 	// 		const listCharFrom = node.from - 2;
  
// 	// 		builder.add(
// 	// 		  listCharFrom,
// 	// 		  listCharFrom + 1,
// 	// 		  Decoration.replace({
// 	// 			widget: new EmojiWidget(),
// 	// 		  })
// 	// 		);
// 	// 	  }
// 	// 	},
// 	//   });
  
// 	  return builder.finish();
// 	},
// 	provide(field: StateField<DecorationSet>): Extension {
// 	  return EditorView.decorations.from(field);
// 	},
//   });


//   const addUnderline = StateEffect.define<{from: number, to: number}>({
// 	map: ({from, to}, change) => ({
// 		from: change.mapPos(from),
// 		to: change.mapPos(to)
// 	})
//   })







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