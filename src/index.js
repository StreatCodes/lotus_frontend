import { render, html, Component } from 'htm/preact/standalone.mjs';

import {Editor} from './editor/editor';

//Expose html as a global so the components have access
global.html = html;
global.lotusRegisterComponent = function(render, component) {
	console.log(`Registering component ${component.name}`);
	console.log(component);
}

render(html`<${Editor} />`, document.getElementById('lotus-app'));

