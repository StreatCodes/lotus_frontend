import { Component, render, Fragment } from 'preact';
import html from '../html';

const PAGE = [
	{id: 1, page_id: 2, url: 'github.com/StreatCodes/sample-component', width: 4, title: 'Home', props: {content: 'Hello'}},
	{id: 2, page_id: 2, url: 'github.com/StreatCodes/sample-component', width: 4, title: 'world', props: {content: 'world'}},
	{id: 3, page_id: 2, url: 'github.com/StreatCodes/sample-component', width: 4, title: 'from', props: {content: 'from'}},
	{id: 4, page_id: 2, url: 'github.com/StreatCodes/sample-component', width: 4, title: 'mort', props: {content: 'mort'}},
];

export class Page extends Component {
	constructor() {
		super();

		this.state = {
			selectComponent: null
		}
	}


	renderWebPage() {
		//Loop through components and render them with their props,
		//insert a lotus id so we can track it more easily
		const components = PAGE.map(component => {
			const comp = global.components[component.url].render(component.props);
			
			comp.props['lotus-id'] = component.id;

			//Add grid cell class
			if(comp.props.class === undefined) {
				comp.props.class = '';
			}
			const classList = comp.props.class.split(' ');
			classList.push('lotus-cell-'+component.width);
			comp.props.class = classList.join(' ').trim();
			
			return comp;
		});

		render(html`<${Fragment}>${components}<//>`, document.getElementById('website'));
	}

	highlightComponent(id) {
		document.querySelector(`[lotus-id="${id}"]`).classList.add('lotus-highlight');
	}

	unHighlightComponent(id) {
		document.querySelector(`[lotus-id="${id}"]`).classList.remove('lotus-highlight');
	}

	render(props, state) {
		this.renderWebPage();

		const components = PAGE.map(component => {
			return html`
			<div class=${'lotus-cell-' + component.width}
				onmouseover=${() => this.highlightComponent(component.id)}
				onmouseout=${() => this.unHighlightComponent(component.id)}>
				${component.title}
			</div>`
		});

		return html`<div class="lotus-page">
			<div class="lotus-grid">
				${components}
			</div>
		</div>`;
	}
}