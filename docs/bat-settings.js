class SettingPage extends HTMLElement {
    constructor() {
        super()
        this.root = this.attachShadow({mode: 'open'});
        this.render();
    }
    render() {
        this.root.innerHTML = '<h1>Hello Shadow DOM</h1>';
    }
}
window.customElements.define('bat-settings', SettingPage);