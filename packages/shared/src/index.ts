// Exporter les services
export * from './services';

// Exporter les utilitaires
export * as dateUtils from './utils/dateUtils';

// Exporter les composants (à développer plus tard)
// export * from './components';

// Exporter les constantes et types communs
export const API_BASE_URL = 'https://api.cesieat.fr/api';

export const APP_NAMES = {
  TECHNICAL: 'CESIEAT-Technical' as const,
  CLIENT: 'CESIEAT-Client' as const,
  LIVREUR: 'CESIEAT-Livreur' as const,
  RESTAURANT: 'CESIEAT-Restaurant' as const,
  COMMERCIAL: 'CESIEAT-Commercial' as const,
  DEVELOPER: 'CESIEAT-Developer' as const
};