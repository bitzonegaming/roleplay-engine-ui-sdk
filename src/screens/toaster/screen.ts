import { Screen } from '../../core/screen/screen';
import { ScreenType } from '../../core/screen/screen-type';
import { ScreenNotification } from '../../core/screen/screen-notification';
import { ScreenEvents } from '../../core/screen/events/events';
import { TemplateLocalization } from '../../core/screen/template-localization';
import { TemplateConfiguration } from '../../core/screen/template-configuration';

export type ToasterScreenNotification = {
  screen: ScreenType.Toaster;
  type: 'INFO' | 'ERROR' | 'WARN';
  title: string;
  message: string;
};

export interface ToasterScreenEvents extends ScreenEvents {
  notification: ToasterScreenNotification;
}

export class ToasterScreen<
  TLocalization extends TemplateLocalization,
  TConfiguration extends TemplateConfiguration,
> extends Screen<ToasterScreenEvents, TLocalization, TConfiguration> {
  constructor() {
    super(ScreenType.Toaster);
  }

  protected async onInit(): Promise<void> {
    this.onShell('notification', this.handleNotification);
    return super.onInit();
  }

  private handleNotification(notification: ScreenNotification) {
    if (notification.screen !== ScreenType.Toaster) {
      return;
    }

    this.emit('notification', notification as ToasterScreenNotification);
  }
}
