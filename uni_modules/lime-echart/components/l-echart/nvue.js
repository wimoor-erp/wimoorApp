export class Echarts {
	constructor(webview) {
		this.webview = webview
		this.options = null
	}
	setOption() {
		this.options = arguments
		this.webview.evalJs(`setOption(${JSON.stringify(arguments)})`);
	}
	getOption() {
		return this.options
	}
	showLoading() {
		this.webview.evalJs(`showLoading(${JSON.stringify(arguments)})`);
	}
	hideLoading() {
		this.webview.evalJs(`hideLoading()`);
	}
	clear() {
		this.webview.evalJs(`clear()`);
	}
	dispose() {
		this.webview.evalJs(`dispose()`);
	}
	resize(size) {
		if(size) {
			this.webview.evalJs(`resize(${size})`);
		} else {
			this.webview.evalJs(`resize()`);
		}
	}
	on(type, ...args) {
		console.warn('nvue 暂不支持事件')
	}
}