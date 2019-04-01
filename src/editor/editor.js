import { html, Component } from 'htm/preact/standalone.mjs'
import clsx from 'clsx';

import {LoadingRing} from './loading-ring';
import {SiteSettings} from './site-settings';
import {Pages} from './pages';
import {Stats} from './stats';

const COMPONENT_LIST = [
	'/component/text.js'
]

export class Editor extends Component {
	constructor() {
		super();

		let editorPos = window.localStorage.getItem('editorPos');
		if(editorPos !== null) {
			editorPos = JSON.parse(editorPos);
		}

		this.editorResizing = null;
		this.editorMoving = null;
		this.state = {
			editorLeft: editorPos !== null ? editorPos.editorLeft : 0,
			editorTop: editorPos !== null ? editorPos.editorTop : 0,
			editorWidth: editorPos !== null ? editorPos.editorWidth : 300,
			editorHeight: editorPos !== null ? editorPos.editorHeight : 300,
			loadPercentage: 0.0,
			selectedTab: 'pages'
		};
	}

	componentDidMount() {
		this.loadComponents();
	}

	loadComponents() {
		const components = [];
		for(const component of COMPONENT_LIST) {
			components.push(component);
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
		this.editorMoving = document.getElementById('lotus-editor');
	}

	resizeOn(e) {
		e.preventDefault();
		this.editorResizing = document.getElementById('lotus-editor');
	}

	draggingOff() {
		this.editorMoving = null;
		this.editorResizing = null;

		window.localStorage.setItem('editorPos', JSON.stringify({
			editorLeft: this.state.editorLeft,
			editorTop: this.state.editorTop,
			editorWidth: this.state.editorWidth,
			editorHeight: this.state.editorHeight
		}));
	}

	moveMouse(e) {
		if(this.editorMoving !== null) {
			const rect = this.editorMoving.getBoundingClientRect();
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

		if(this.editorResizing !== null) {
			const rect = this.editorResizing.getBoundingClientRect();
			let width = rect.width + e.movementX;
			let height = rect.height + e.movementY;
	
			if(width < 300) {
				width = 300;
			}
			if(width + rect.left > window.innerWidth) {
				width = rect.width;
			}
	
			if(height < 300) {
				height = 300;
			}
			if(height + rect.top > window.innerHeight) {
				height = rect.height;
			}
	
			this.setState({
				editorWidth: width,
				editorHeight: height
			});
		}
	}

	componentWillMount() {
		window.addEventListener('mouseup', this.draggingOff.bind(this));
		window.addEventListener('mousemove', this.moveMouse.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.draggingOff);
		window.removeEventListener('mousemove', this.moveMouse);
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

		return html`<div class="lotus-editor" id="lotus-editor"
				style=${{left: state.editorLeft+'px', top: state.editorTop+'px', width: state.editorWidth, height: state.editorHeight}}>
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
				stroke-linecap="round" stroke-linejoin="round" class="lotus-resize"
				onmousedown=${this.resizeOn.bind(this)}>
				<line x1="0" y1="10" x2="10" y2="0"/>
				<line x1="4" y1="10" x2="10" y2="4"/>
				<line x1="8" y1="10" x2="10" y2="8"/>
			</svg>
		</div>`;
	}
}