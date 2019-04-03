import { render } from 'preact';
import html from './html';

import {Editor} from './editor/editor';

//Expose html as a global so the components have access
global.components = {};
global.html = html;
global.lotusRegisterComponent = function(component) {
	console.log(`Registering component ${component.name} ${component.url}`);
	global.components[component.url] = component;
}

render(html`<${Editor} />`, document.getElementById('lotus-app'));