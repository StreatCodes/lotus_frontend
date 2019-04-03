import { Component } from 'preact';
import html from '../html';

export class LoadingRing extends Component {
	constructor() {
		super();
	}

	render(props, state) {
		let offset = (100 - props.percentage) * Math.PI;
		return html`<svg class="loading-ring" height="110" width="110">
			<circle cx="55" cy="55" r="50" stroke-width="2" transform="rotate(-90, 55, 55)"
				stroke-dasharray=${Math.PI * 100} stroke-dashoffset=${offset}>
			</circle>
			<text x="55" y="55" text-anchor="middle" dominant-baseline="middle">${Math.ceil(props.percentage)}%</text>
		</svg>`;
	}
}