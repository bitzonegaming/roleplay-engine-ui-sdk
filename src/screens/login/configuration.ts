import { ExternalLoginIdentifierType } from '@bitzonegaming/roleplay-engine-sdk';

export interface LoginScreenConfiguration {
  usernameRegex: string;
  emailRequired: boolean;
  emailVerificationRequired: boolean;
  usernamePassword?: {
    passwordRegex: string;
    registrationEnabled: boolean;
  };
  externalLogin?: {
    identifierType: ExternalLoginIdentifierType;
  };
  discord?: {
    flow: 'IMPLICIT' | 'OAUTH2';
    autoLogin: boolean;
  };
}
