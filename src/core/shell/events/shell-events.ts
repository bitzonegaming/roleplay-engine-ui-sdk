import { ServerTemplateConfiguration } from '@bitzonegaming/roleplay-engine-sdk/template/models/server-template-configuration';
import { Locale } from '@bitzonegaming/roleplay-engine-sdk';

import { SessionContext } from '../../context/context';
import { ScreenNotification } from '../../screen/screen-notification';
import { ScreenType } from '../../screen/screen-type';
import { ServerConfiguration } from '../../server/server-configuration';
import { TemplateTextLocalization } from '../../screen/template-localization';

export interface ShellEvents {
  initializeScreen: ShellInitializeScreen;
  localeChanged: ShellLocaleChanged;
  notification: ScreenNotification;
}

export interface ShellLocaleChanged {
  screen: ScreenType;
  locale: string;
  localization: TemplateTextLocalization;
}

export interface ShellInitializeScreen {
  screen: ScreenType;
  context: SessionContext;
  localization: TemplateTextLocalization;
  templateConfiguration: Array<ServerTemplateConfiguration>;
  serverConfiguration: ServerConfiguration;
  locales: Locale[];
  defaultLocale: string;
}
