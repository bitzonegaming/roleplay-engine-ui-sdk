import { ScreenType } from '../../screen/screen-type';
import { ScreenNotification } from '../../screen/screen-notification';

export interface UIEvents {
  readyToInitialize: { screen: ScreenType };
  initialized: { screen: ScreenType; templateId: string };
  localeChanged: { locale: string };
  error: { error: string; details?: unknown };
  navigation: { fromScreen: ScreenType; toScreen: ScreenType; params?: unknown };
  notifyScreen: ScreenNotification;
}
