import {
  ServerTemplateConfiguration,
  TemplateTextTranslation,
} from '@bitzonegaming/roleplay-engine-sdk';

import { SessionContext } from '../context/context';
import { UIEventEmitter } from '../events/event-emitter';
import { ScreenType } from '../screen/screen-type';
import { ServerConfiguration } from '../server/server-configuration';
import { TemplateLocalization } from '../screen/template-localization';

import { ShellEvents } from './events/shell-events';
import { UIEvents } from './events/ui-events';

export class ShellBridge {
  private shellEmitter: UIEventEmitter<ShellEvents>;
  private sessionContext: SessionContext | null = null;
  private isInitialized = false;

  constructor(protected screen: ScreenType) {
    this.shellEmitter = new UIEventEmitter<ShellEvents>();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('initializeScreen', this.onInitialize.bind(this));
    window.addEventListener('localeChanged', this.onLocaleChanged.bind(this));
    window.addEventListener('message', this.onWindowMessage.bind(this));
  }

  private onInitialize(event: Event) {
    const customEvent = event as CustomEvent<{
      screen: ScreenType;
      context: SessionContext;
      localization: {
        [key: string]: TemplateTextTranslation;
      };
      templateConfiguration: Array<ServerTemplateConfiguration>;
      serverConfiguration: ServerConfiguration;
    }>;

    return this.handleShellInitialize({
      screen: customEvent.detail.screen,
      context: customEvent.detail.context,
      localization: customEvent.detail.localization,
      templateConfiguration: customEvent.detail.templateConfiguration,
      serverConfiguration: customEvent.detail.serverConfiguration,
    });
  }

  private onLocaleChanged(event: Event) {
    const customEvent = event as CustomEvent<{
      screen: ScreenType;
      locale: string;
      localization: TemplateLocalization;
    }>;

    return this.handleShellLocaleChanged({
      screen: customEvent.detail.screen,
      locale: customEvent.detail.locale,
      localization: customEvent.detail.localization,
    });
  }

  private onWindowMessage(event: MessageEvent) {
    const { type, payload } = event.data;

    switch (type) {
      case 'initializeScreen':
        return this.handleShellInitialize({
          screen: payload.screen,
          context: payload.context,
          localization: payload.localization,
          templateConfiguration: payload.templateConfiguration,
          serverConfiguration: payload.serverConfiguration,
        });
      case 'localeChanged':
        return this.handleShellLocaleChanged({
          screen: payload.screen,
          locale: payload.locale,
          localization: payload.localization,
        });
      default:
        this.shellEmitter.emit(type, payload);
    }
  }

  private handleShellInitialize({
    screen,
    context,
    localization,
    templateConfiguration,
    serverConfiguration,
  }: {
    screen: ScreenType;
    context: SessionContext;
    localization: TemplateLocalization;
    templateConfiguration: Array<ServerTemplateConfiguration>;
    serverConfiguration: ServerConfiguration;
  }) {
    if (screen !== this.screen) {
      return;
    }

    this.sessionContext = context;
    this.isInitialized = true;
    this.shellEmitter.emit('initializeScreen', {
      screen: this.screen,
      context: this.sessionContext,
      localization,
      templateConfiguration,
      serverConfiguration,
    });
  }

  private handleShellLocaleChanged({
    screen,
    locale,
    localization,
  }: {
    screen: ScreenType;
    locale: string;
    localization: TemplateLocalization;
  }) {
    if (screen !== this.screen) {
      return;
    }

    if (this.sessionContext) {
      this.sessionContext.locale = locale;
    }
    this.shellEmitter.emit('localeChanged', { screen, locale, localization });
  }

  emitToShell<E extends keyof UIEvents>(event: E, payload: UIEvents[E]) {
    const customEvent = new CustomEvent(`ui:${this.screen}:${String(event)}`, {
      detail: payload,
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(customEvent);

    // Also emit via postMessage (for cross-origin)
    window.parent.postMessage(
      {
        type: `UI:${this.screen}:${String(event).toUpperCase().replace(/-/g, '_')}`,
        payload,
      },
      '*',
    );
  }

  onShellEvent<E extends keyof ShellEvents>(event: E, listener: (payload: ShellEvents[E]) => void) {
    this.shellEmitter.on(event, listener);
  }

  offShellEvent<E extends keyof ShellEvents>(
    event: E,
    listener?: (payload: ShellEvents[E]) => void,
  ) {
    this.shellEmitter.off(event, listener);
  }

  get context(): SessionContext | null {
    return this.sessionContext;
  }

  async getContext(): Promise<SessionContext> {
    if (this.sessionContext) {
      return this.sessionContext;
    }

    return new Promise((resolve) => {
      this.shellEmitter.once('initializeScreen', ({ context }) => {
        resolve(context);
      });
    });
  }

  getContextSync(): SessionContext | null {
    return this.sessionContext;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}
