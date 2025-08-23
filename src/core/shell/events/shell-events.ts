import { ServerTemplateConfiguration } from '@bitzonegaming/roleplay-engine-sdk/template/models/server-template-configuration';

import { SessionContext } from '../../context/context';
import { ScreenNotification } from '../../screen/screen-notification';
import { ScreenType } from '../../screen/screen-type';
import { ServerConfiguration } from '../../server/server-configuration';
import { TemplateLocalization } from '../../screen/template-localization';

export interface ShellEvents {
  initializeScreen: {
    screen: ScreenType;
    context: SessionContext;
    localization: TemplateLocalization;
    templateConfiguration: Array<ServerTemplateConfiguration>;
    serverConfiguration: ServerConfiguration;
  };
  localeChanged: { screen: ScreenType; locale: string; localization: TemplateLocalization };
  notification: ScreenNotification;
}
