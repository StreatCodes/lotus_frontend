const component = {
	name: 'Simple Text',
	url: 'github.com/StreatCodes/sample-component',
	description: 'A simple text component',
	props: {
		content: {type: 'text'}
	}
}

component.render = function(props) {
	return html`
		<h1>${props.content}</h1>
	`;
}

lotusRegisterComponent(component);