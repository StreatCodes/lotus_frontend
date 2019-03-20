const component = {
	name: 'Simple Text',
	url: 'github.com/StreatCodes/sample-component',
	description: 'A simple text component',
	props: {
		content: {type: 'text'}
	}
}

function render(props) {
	return html`
		<h1>${props.content}</h1>
	`;
}

lotusRegisterComponent(render, component);