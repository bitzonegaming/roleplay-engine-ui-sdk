import { PublicConfig } from '@bitzonegaming/roleplay-engine-sdk';

export type ServerConfiguration = {
  [K in PublicConfig['key']]: Extract<PublicConfig, { key: K }>;
};
