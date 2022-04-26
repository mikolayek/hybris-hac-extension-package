/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';

export default class EasyHac extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      @font-face {
        font-family: SAP-icons;
        src: url(/static/SAP-icons.ttf) format('truetype');
      }

      .icon-refresh:before {
        content: '\e00a';
      }
    `;
  }

  constructor() {
    super();
    this.title = 'My app';
  }

  render() {
    return html`
      <div class="prepend-top fd-container" id="content">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('easy-hac', EasyHac);
