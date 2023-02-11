import { MarkdownRenderChild, MarkdownViewModeType } from "obsidian";





export class TagSelector extends MarkdownRenderChild {
	el: HTMLElement;
	// plugin: NltPlugin;
	viewMode: MarkdownViewModeType;

	constructor(
		el: HTMLElement,
		viewMode: MarkdownViewModeType
	) {
		super(el);
		this.el = el;
		this.viewMode = viewMode;
	}

	async onload() {
		const rootEl = this.el.createEl("div");
		// this.root = createRoot(rootEl);
		// this.root.render(
		// 	<Provider store={store}>
		// 		<App
		// 			plugin={this.plugin}
		// 			tableId={this.tableId}
		// 			viewMode={this.viewMode}
		// 		/>
		// 	</Provider>
		// );

		// this.el.children[0].replaceWith('<div>hello</div>');
		// const test = rootEl.createDiv();//.replaceWith('<div>hello</div>');
        // test.setText('Hello');
        rootEl.innerHTML = '<div>This is <button>interesting</button></div>'
        // console.log(test);
	}

	async onunload() {
		// this.root.unmount();
	}
}