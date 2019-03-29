import { html, Component } from 'htm/preact/standalone.mjs'
import clsx from 'clsx';

import {LoadingRing} from './loading-ring';
import {SiteSettings} from './site-settings';
import {Pages} from './pages';
import {Stats} from './stats';

export class Editor extends Component {
	constructor() {
		super();

		let editorPos = window.localStorage.getItem('editorPos');
		if(editorPos !== null) {
			editorPos = JSON.parse(editorPos);
		}

		this.dragging = null;
		this.state = {
			editorLeft: editorPos !== null ? editorPos.editorLeft : 0,
			editorTop: editorPos !== null ? editorPos.editorTop : 0,
			editorMaxWidth: editorPos !== null ? editorPos.editorMaxWidth : 300,
			editorMaxHeight: editorPos !== null ? editorPos.editorMaxHeight : 300,
			loadPercentage: 0.0,
			selectedTab: 'pages'
		};
	}

	componentDidMount() {
		this.loadComponents();
	}

	loadComponents() {
		const components = [];
		for(let i = 0; i < 1000; i++) {
			components.push('/component/text.js');
		}
		let componentsLoaded = 0;
		
		for(const component of components) {
			const script = document.createElement('script');
			script.onload = e => {
				componentsLoaded += 1;
				const percentage = componentsLoaded / components.length * 100.0;
				this.setState({loadPercentage: percentage});
			};
			script.type = 'module';
			script.src = component;
			
			document.body.append(script);
		}
	}

	draggingOn(e) {
		e.preventDefault();
		this.dragging = e.target.parentElement;
	}

	draggingOff() {
		this.dragging = null;

		window.localStorage.setItem('editorPos', JSON.stringify({
			editorLeft: this.state.editorLeft,
			editorTop: this.state.editorTop
		}));
	}

	moveWindow(e) {
		if(this.dragging !== null) {
			const rect = this.dragging.getBoundingClientRect();
			let left = rect.left + e.movementX;
			let top = rect.top + e.movementY;
	
			if(left < 0) {
				left = 0;
			}
			if(left + rect.width > window.innerWidth) {
				left = window.innerWidth - rect.width;
			}
	
			if(top < 0) {
				top = 0;
			}
			if(top + rect.height > window.innerHeight) {
				top = window.innerHeight - rect.height;
			}
	
			this.setState({
				editorLeft: left,
				editorTop: top
			});
		}
	}

	componentWillMount() {
		window.addEventListener('mouseup', this.draggingOff.bind(this));
		window.addEventListener('mousemove', this.moveWindow.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.draggingOff);
		window.removeEventListener('mousemove', this.moveWindow);
	}

	render(props, state) {
		let body = null;
		if(state.loadPercentage !== 100.0) {
			body = html`<${LoadingRing} percentage=${state.loadPercentage}/>`;
		} else {
			switch(state.selectedTab) {
				case 'pages':
					body = html`<${Pages} />`;
					break;
				case 'site-settings':
					body = html`<${SiteSettings} />`;
					break;
				case 'stats':
					body = html`<${Stats} />`;
					break;
			}
		}

		return html`<div class="lotus-editor"
				style=${{left: state.editorLeft+'px', top: state.editorTop+'px', maxWidth: state.editorMaxWidth, maxHeight: state.editorMaxHeight}}>
			<div class="lotus-header" onmousedown=${this.draggingOn.bind(this)}>
				Editor
			</div>
			<div class="lotus-tabs">
				<div class=${clsx('lotus-tab', state.selectedTab === 'pages' && 'selected')} onclick=${e => {this.setState({selectedTab: 'pages'})}}>Pages</div>
				<div class=${clsx('lotus-tab', state.selectedTab === 'site-settings' && 'selected')} onclick=${e => {this.setState({selectedTab: 'site-settings'})}}>Site Settings</div>
				<div class=${clsx('lotus-tab', state.selectedTab === 'stats' && 'selected')} onclick=${e => {this.setState({selectedTab: 'stats'})}}>Stats</div>
			</div>
			<div class="lotus-body">
				${body}
			</div>
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
				viewBox="0 0 12 12" fill="none" stroke="#666666" stroke-width="1"
				stroke-linecap="round" stroke-linejoin="round" class="lotus-resize">
				<line x1="0" y1="10" x2="10" y2="0"/>
				<line x1="4" y1="10" x2="10" y2="4"/>
				<line x1="8" y1="10" x2="10" y2="8"/>
			</svg>
		</div>`;
	}
}