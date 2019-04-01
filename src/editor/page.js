import { render, html, Component } from 'htm/preact/standalone.mjs'

const PAGE = [
	{id: 1, page_id: 2, url: 'github.com/StreatCodes/sample-component', title: 'Home', props: {content: 'Hello'}},
	{id: 2, page_id: 2, url: 'github.com/StreatCodes/sample-component', title: 'Develop', props: {content: 'world'}},
	{id: 3, page_id: 2, url: 'github.com/StreatCodes/sample-component', title: 'Host', props: {content: 'from'}},
	{id: 4, page_id: 2, url: 'github.com/StreatCodes/sample-component', title: 'Support', props: {content: 'mort'}},
];

export class Page extends Component {
	constructor() {
		super();

		this.state = {
			selectComponent: null
		}
	}


	renderWebPage() {
		const components = PAGE.map(component => {
			return global.components[component.url].render(component.props)
		});

	render(html`<div>${components}</div>`, document.getElementById('website'));
	}

	render(props, state) {
		this.renderWebPage();

        return html`<div class="lotus-page">
            <div>Page settings</div>
		</div>`;
	}
}