import { LitElement, html } from 'lit';

export default class EasyRepoForm extends LitElement {
  static get properties() {
    return {
      configUpdateUrl: { type: String },
      redeployBeanUrl: { type: String },
      redeployExtUrl: { type: String },
      validateUrl: { type: String },
      csrfParam: { type: String },
      csrf: { type: String },
      shouldStoreSecret: { type: Boolean },
      inRepoUrl: { type: String },
      inRepoBranch: { type: String },
      inRepoUsername: { type: String },
      inRepoPwd: { type: String },
      credentials: { type: Boolean },
      validated: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.configUpdateUrl = '';
    this.csrf = '';
    this.shouldStoreSecret = false;
    this.credentials = false;
    this.validated = false;
  }

  toggleCheck() {
    this.credentials = !this.credentials;
  }

  // eslint-disable-next-line class-methods-use-this
  buttonClick(event) {
    const button = event.target;
    const f = document.querySelector('#gitDetails');
    const actionUrl = button.getAttribute('data-url');
    fetch(actionUrl, {
      method: f.method,
      body: new FormData(f),
    })
      .then(async (res) => {
        const data = await res.text();
        // eslint-disable-next-line no-undef
        dataTable.api().clear();
        if (res.ok) {
          switch (data) {
            case 'DONE':
              // eslint-disable-next-line no-undef
              hac.global.notify('Git settings are valid.');
              break;
            case 'configparam.redeploy.ext.event.success':
              // eslint-disable-next-line no-undef
              hac.global.notify('Redeploying Extensions successfull.');
              // eslint-disable-next-line no-undef
              dataTable.api().ajax.reload();
              break;
            case 'configparam.redeploy.ext.error':
              // eslint-disable-next-line no-undef
              hac.global.error('Error in redeploying extensions', 1000);
              // eslint-disable-next-line no-undef
              dataTable.api().ajax.reload();
              break;
            case 'configparam.redeploy.beans.error':
              // eslint-disable-next-line no-undef
              hac.global.error('Error in redeploying beans', 1000);
              // eslint-disable-next-line no-undef
              dataTable.api().ajax.reload();
              break;
            case 'configparam.redeploy.beans.event.success':
              // eslint-disable-next-line no-undef
              hac.global.notify('Redeploying Easy Beans successfull.');
              break;
            case 'configparam.gitrepo.error':
              // eslint-disable-next-line no-undef
              hac.global.error("Could not connect to the Repo. Invalid configuration parameters! Click 'Validate' first");
              break;
            case 'configparam.gitrepo.nochange':
              // eslint-disable-next-line no-undef
              hac.global.error('No change in configuration parameters!');
              break;
            case 'configparam.gitrepo.update.success':
              // eslint-disable-next-line no-undef
              hac.global.notify('Updated config params and Easy Extensions deployed.');
              break;
            default:
          }
          // eslint-disable-next-line no-undef
          dataTable.api().ajax.reload();

          this.validated = true;
          return Promise.resolve();
        }
        this.validated = false;
        const error = data || res.status;
        // eslint-disable-next-line no-undef
        hac.global.error(`Error in Git settings ${error}`, 2000);
        return Promise.reject(error);
      })
      .catch((error) => {
        console.error(error);
        // eslint-disable-next-line no-undef
        hac.global.error('Error in communication with server', 2000);
        return Promise.reject(error);
      });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="fd-row">
        <div class="fd-col fd-col--12 fd-col-md--8 fd-col-lg--6" id="configProps">
          <form
            id="gitDetails"
            action="${this.configUpdateUrl}"
            redeploy-bean-url="${this.redeployBeanUrl}"
            redeploy-ext-url="${this.redeployExtUrl}"
            data-url="${this.validateUrl}"
            method="POST"
          >
            <input type="hidden" name="${this.csrfParam}" value="${this.csrf}" />
            <div class="fd-form-item">
              <label class="fd-form-label" for="repoURL">Repo URL</label>
              <input class="fd-input" type="text" id="repoURL" name="repoURL" .value=${this.inRepoUrl} placeholder="Git repository URL" />

              <label class="fd-form-label" for="repoBranch">Repo Branch</label>
              <input class="fd-input" type="text" id="repoBranch" name="repoBranch" .value=${this.inRepoBranch} placeholder="Git branch" />

              <fieldset class="fd-fieldset">
                <legend class="fd-fieldset__legend">Authentication</legend>
                <div class="fd-form-group">
                  <div class="fd-form-item">
                    <input
                      type="checkbox"
                      @click="${this.toggleCheck}"
                      .checked=${this.credentials}
                      class="fd-checkbox"
                      id="add-authentication"
                      name="add-authentication"
                    />
                    <label class="fd-checkbox__label" for="add-authentication">
                      <div class="fd-checkbox__label-container">
                        <span class="fd-checkbox__text">Add user/password authentication</span>
                      </div>
                    </label>
                  </div>

                  <div class="fd-form-item">
                    <label class="fd-form-label" for="userId">User name (optional)</label>
                    <input
                      class="fd-input"
                      type="text"
                      id="userId"
                      name="userId"
                      .value=${this.inRepoUsername}
                      placeholder="User name"
                      .disabled=${!this.credentials}
                    />
                  </div>

                  <div class="fd-form-item">
                    <label class="fd-form-label" for="secret">Secret (optional)</label>
                    <input
                      class="fd-input"
                      type="password"
                      id="secret"
                      name="secret"
                      .value=${this.inRepoPwd}
                      placeholder="Secret / password"
                      .disabled=${!this.credentials}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </form>
        </div>
      </div>
      <div class="fd-row">
        <div class="fd-col">
          <div class="prepend-top">Click <strong>Update Configuration</strong> to connect to the Repo and deploy latest extensions</div>
          <div class="fd-message-strip fd-message-strip--warning fd-message-strip--dismissible" ?hidden=${this.shouldStoreSecret} role="alert" id="fwYq4606">
            <p class="fd-message-strip__text">
              System property is set to not store password in-memory configuration map, but use it every time from input field above. To change
              "easy.repository.secret.store" to
              <strong>true</strong>.
            </p>
            <button class="fd-button fd-button--transparent fd-button--compact fd-message-strip__close" aria-controls="fwYq4606" aria-label="Close">
              <i class="sap-icon--decline"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="fd-row">
        <div class="prepend-top append-bottom fd-col">
          <button class="fd-button fd-button--negative fd-button--toggled" @click=${this.buttonClick} id="validate-button" data-url="${this.validateUrl}">
            <span class="fn-button__text">Validate</span>
            <span class="sap-icon icon-refresh"></span>
          </button>
          <button
            class="fd-button fd-button--emphasized"
            @click=${this.buttonClick}
            .disabled=${!this.validated}
            id="updateConfig-button"
            data-url="${this.configUpdateUrl}"
          >
            Update Configuration
          </button>
          <button
            class="fd-button fd-button--emphasized"
            @click=${this.buttonClick}
            .disabled=${!this.validated}
            id="redeployBean-button"
            data-url="${this.redeployBeanUrl}"
          >
            Reload Beans
          </button>
          <button
            class="fd-button fd-button--emphasized"
            @click=${this.buttonClick}
            .disabled=${!this.validated}
            id="redeployExtn-button"
            data-url="${this.redeployExtUrl}"
          >
            Redeploy Extensions
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('easy-repoform', EasyRepoForm);
