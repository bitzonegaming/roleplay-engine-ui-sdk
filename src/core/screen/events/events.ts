import { ScreenType } from '../screen-type';

export interface ScreenEvents {
  init: { screen: ScreenType };
  localeChanged: { locale: string };
}
