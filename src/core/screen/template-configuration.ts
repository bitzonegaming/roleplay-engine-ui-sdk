import { ConfigTypeValueMap, ServerTemplateConfigType } from '@bitzonegaming/roleplay-engine-sdk';

export interface TemplateConfig<T extends ServerTemplateConfigType> {
  /**
   *
   * @type {T}
   * @memberof TemplateConfig
   */
  type: T;
  /**
   *
   * @type {ConfigTypeValueMap[T]}
   * @memberof TemplateConfig
   */
  value: ConfigTypeValueMap[T];
}

/**
 * Interface for template configuration containing all possible config keys
 * @export
 * @interface TemplateConfiguration
 */
export interface TemplateConfiguration {
  [key: string]: TemplateConfig<ServerTemplateConfigType>;
}
