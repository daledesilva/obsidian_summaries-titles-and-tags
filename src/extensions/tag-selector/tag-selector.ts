import {EditorView} from "@codemirror/view"
import {Facet} from "@codemirror/state"
import {Extension} from "@codemirror/state"
import {Decoration} from "@codemirror/view"
import {RangeSetBuilder} from "@codemirror/state"
import {ViewPlugin, DecorationSet, ViewUpdate, PluginValue} from "@codemirror/view"




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
    baseTheme,
    options.step == null ? [] : stepSize.of(options.step),
    showStripes
  ]
}



const stripe = Decoration.line({
  attributes: {class: "cm-zebraStripe"}
})

function stripeDeco(view: EditorView) {
  let step = view.state.facet(stepSize)
  let builder = new RangeSetBuilder<Decoration>()

  for (let {from, to} of view.visibleRanges) {

    for (let pos = from; pos <= to;) {

      let line = view.state.doc.lineAt(pos)
	//   console.log('line', line);
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