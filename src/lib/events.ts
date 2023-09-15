// Key events
export function onEnterKey(event: KeyboardEvent, callback: CallableFunction): void {
	if (event.key == 'Enter') callback();
}

export function onCtrlEnterKey(event: KeyboardEvent, callback: CallableFunction): void {
	if (event.key == 'Enter' && event.ctrlKey) callback();
}
// Other events
export function focus(el: HTMLElement): void {
	el.focus();
}
