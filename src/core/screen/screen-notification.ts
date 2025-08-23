import { LoginScreenNotification } from '../../screens/login/screen';
import { ToasterScreenNotification } from '../../screens/toaster/screen';

import { ScreenType } from './screen-type';

export type ScreenNotification =
  | { screen: ScreenType }
  | LoginScreenNotification
  | ToasterScreenNotification;
