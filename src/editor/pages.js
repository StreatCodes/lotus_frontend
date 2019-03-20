import { html, Component } from 'htm/preact/standalone.mjs'

const PAGES = [
	{id: 1, title: 'Home', parent: null},
	{id: 2, title: 'Develop', url: 'develop', parent: null},
	{id: 3, title: 'Host', url: 'host', parent: null},
	{id: 4, title: 'Support', url: 'support', parent: null},
	{id: 5, title: 'About', url: 'about', parent: null},
	{id: 6, title: 'Partners', url: 'partners', parent: 5},
	{id: 7, title: 'Help', url: 'help', parent: null},
];

export class Pages extends Component {
	constructor() {
		super();
	}

	renderPages(parentID) {
		const relevantPages = PAGES.filter(page => page.parent === parentID);

		return relevantPages.map(page => {
			const children = this.renderPages(page.id);

			return html`<div class="page" id="page-${page.id}">
				<span>${page.title}</span>
				${children}
			</div>`;
		});
	}

	render(props, state) {
		const pages = this.renderPages(null);

		return html`<div class="lotus-pages">
			<div class="lotus-pages-controls">
				<input type="text" placeholder="Filter"/>
				<button>Create</button>
			</div>
			${pages}
		</div>`;
	}
}