import { LitElement, html, css } from 'lit';

export default class EasyExtensions extends LitElement {
  static get properties() {
    return {
      resultsUrl: { type: String },
    };
  }

  constructor() {
    super();
    this.resultsUrl = '';
  }

  connectedCallback() {
    super.connectedCallback();
    const dt = document.querySelector('#Extn-List');
    const dataUrl = dt.getAttribute('config-data-url');

    dt.dataTable({
      processing: true,
      paging: false,
      ajax: {
        url: dataUrl,
        dataSrc: '',
        data() {},
      },
      columns: [{ data: 'name' }, { data: 'version' }, { data: 'init' }],
    });
  }

  static get styles() {
    return css`
      @import 'https://unpkg.com/fundamental-styles@latest/dist/fundamental-styles.css';
      @import 'https://unpkg.com/@sap-theming/theming-base-content/content/Base/baseLib/sap_fiori_3/css_variables.css';
      @import 'https://unpkg.com/fundamental-styles@latest/dist/theming/sap_fiori_3.css';
    `;
  }

  render() {
    return html`
      <div class="fd-row">
        <div class="fd-col">
          <div id="listExt">
            <div id="configTableWrapper" style="margin-top: 10px;">
              <table id="Extn-List" style="width: 100%" config-data-url="${this.resultsUrl}">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Groovy</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div id="Refresh">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('easy-extensions', EasyExtensions);
