export * from './useGeolocation';
export * from './useProviderInject';
export * from './useUpdater';

export { default as useHighPrecisionTimer } from './useHighPrecisionTimer';
export type { optionsType as HighPrecisionTimerOptions } from './useHighPrecisionTimer/hp-time';
export type {
  argsType as ProviderContextConfig,
  ataticType as ProviderContextType,
} from './useProviderInject';
export type { Options as UpdaterOptions } from './useUpdater';
