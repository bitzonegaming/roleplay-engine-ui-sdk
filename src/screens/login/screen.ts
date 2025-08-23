import {
  Account,
  AccountAuthRequest,
  DiscordUserAccountInfo,
  ExternalLoginAuthRequest,
  ExternalLoginIdentifierType,
  GrantAccessResult,
  RedirectUri,
  RegisterAccountRequest,
} from '@bitzonegaming/roleplay-engine-sdk';

import { Screen } from '../../core/screen/screen';
import { ScreenType } from '../../core/screen/screen-type';
import { ScreenEvents } from '../../core/screen/events/events';
import { TemplateLocalization } from '../../core/screen/template-localization';
import { TemplateConfiguration } from '../../core/screen/template-configuration';
import { GamemodeAccountApi } from '../../gamemode/account/api';
import { ImplicitDiscordAuthApiRequest } from '../../gamemode/account/request/implicit-discord-auth.api-request';
import { DiscordOAuthTokenApiRequest } from '../../gamemode/account/request/discord-oauth-token.api-request';

import { LoginScreenConfiguration } from './configuration';

export type LoginScreenNotification = { screen: ScreenType.Login };

export type LoginScreenEvents = ScreenEvents;

export class LoginScreen<
  TLocalization extends TemplateLocalization,
  TConfiguration extends TemplateConfiguration,
> extends Screen<LoginScreenEvents, TLocalization, TConfiguration> {
  private _configuration: LoginScreenConfiguration | undefined;
  private _accountApi: GamemodeAccountApi | undefined;

  constructor() {
    super(ScreenType.Login);
  }

  protected async onInit(): Promise<void> {
    this._configuration = this.mapConfiguration();
    this._accountApi = new GamemodeAccountApi(this.gamemodeClient);
    return super.onInit();
  }

  public get screenConfiguration(): LoginScreenConfiguration {
    if (!this._configuration) {
      throw new Error('Screen is not initialized');
    }

    return this._configuration;
  }

  public register(request: RegisterAccountRequest): Promise<Account> {
    return this.accountApi.register(request);
  }

  public authWithPassword(request: AccountAuthRequest): Promise<GrantAccessResult> {
    return this.accountApi.authWithPassword(request);
  }

  public authExternalLogin(request: ExternalLoginAuthRequest): Promise<GrantAccessResult> {
    return this.accountApi.authExternalLogin(request);
  }

  public authDiscordImplicitFlow(
    request: ImplicitDiscordAuthApiRequest,
  ): Promise<GrantAccessResult> {
    return this.accountApi.authDiscordImplicitFlow(request);
  }

  public authDiscordOAuthFlow(request: DiscordOAuthTokenApiRequest): Promise<GrantAccessResult> {
    return this.accountApi.authDiscordOAuthFlow(request);
  }

  public getDiscordOAuthAuthorizeUrl(): Promise<RedirectUri> {
    return this.accountApi.getDiscordOAuthAuthorizeUrl();
  }

  public getDiscordUser(): Promise<DiscordUserAccountInfo> {
    return this.accountApi.getDiscordUser();
  }

  private mapConfiguration(): LoginScreenConfiguration {
    let configuration: LoginScreenConfiguration = {
      usernameRegex: this.serverConfiguration.ACCOUNT_USERNAME_REGEX.value.expression,
      emailRequired: this.serverConfiguration.ACCOUNT_EMAIL_REQUIRED.value,
      emailVerificationRequired: this.serverConfiguration.ACCOUNT_EMAIL_VERIFICATION_REQUIRED.value,
    };

    if (this.serverConfiguration.USERNAME_PASSWORD_FLOW_ENABLED.value.enabled) {
      configuration = {
        ...configuration,
        usernamePassword: {
          passwordRegex: this.serverConfiguration.ACCOUNT_PASSWORD_REGEX.value.expression,
          registrationEnabled:
            this.serverConfiguration.USERNAME_PASSWORD_FLOW_REGISTRATION_ENABLED.value,
        },
      };
    }

    if (this.serverConfiguration.EXTERNAL_LOGIN_FLOW_ENABLED.value.enabled) {
      configuration = {
        ...configuration,
        externalLogin: {
          identifierType: this.serverConfiguration.EXTERNAL_LOGIN_FLOW_IDENTIFIER_TYPE.value
            .key as ExternalLoginIdentifierType,
        },
      };
    }

    if (this.serverConfiguration.DISCORD_LOGIN_FLOW_ENABLED.value.enabled) {
      configuration = {
        ...configuration,
        discord: {
          flow: this.serverConfiguration.DISCORD_LOGIN_FLOW_IN_GAME_METHOD.value.key as
            | 'IMPLICIT'
            | 'OAUTH2',
          autoLogin: this.serverConfiguration.DISCORD_LOGIN_FLOW_AUTO_LOGIN.value,
        },
      };
    }

    return configuration;
  }

  private get accountApi(): GamemodeAccountApi {
    if (!this._accountApi) {
      throw new Error('Screen is not initialized');
    }
    return this._accountApi;
  }
}
