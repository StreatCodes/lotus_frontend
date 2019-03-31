import { html, Component } from 'htm/preact/standalone.mjs'

const PAGE = [
	{id: 1, title: 'Home', parent: null},
	{id: 2, title: 'Develop', url: 'develop', parent: null},
	{id: 3, title: 'Host', url: 'host', parent: null},
	{id: 4, title: 'Support', url: 'support', parent: null},
	{id: 5, title: 'About', url: 'about', parent: null},
	{id: 6, title: 'Partners', url: 'partners', parent: 5},
	{id: 7, title: 'Help', url: 'help', parent: null},
];

export class Page extends Component {
	constructor() {
		super();

		this.state = {
			selectComponent: null
		}
	}

	render(props, state) {
        return html`<div class="lotus-page">
            <div>Page settings</div>
		</div>`;
	}
}