export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type AppName = 'CESIEAT-Technical' | 'CESIEAT-Client' | 'CESIEAT-Livreur' | 'CESIEAT-Restaurant' | 'CESIEAT-Commercial' | 'CESIEAT-Developer';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  appName: AppName;
  data?: any;
  component?: string;
  user?: string | null;
}

class LogService {
  private logs: LogEntry[] = [];
  private remoteLoggingEndpoint?: string;
  private appName: AppName;
  
  constructor(appName: AppName) {
    this.appName = appName;
    // Configuration commune pour tous les frontends
    this.remoteLoggingEndpoint = process.env.VITE_LOGS_ENDPOINT || 'https://api.cesieat.fr/api/logs';
  }

  debug(message: string, data?: any, component?: string): void {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string): void {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string): void {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string): void {
    this.log('error', message, data, component);
  }

  private log(level: LogLevel, message: string, data?: any, component?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      appName: this.appName,
      data,
      component,
      user: localStorage.getItem('user') || sessionStorage.getItem('user') || null
    };

    // Ajouter au tableau interne
    this.logs.push(entry);
    
    // Afficher dans la console selon le niveau
    switch (level) {
      case 'debug':
        console.debug(`[${this.appName}][${component || 'App'}] ${message}`, data || '');
        break;
      case 'info':
        console.log(`[${this.appName}][${component || 'App'}] ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${this.appName}][${component || 'App'}] ${message}`, data || '');
        break;
      case 'error':
        console.error(`[${this.appName}][${component || 'App'}] ${message}`, data || '');
        break;
    }
    
    // Envoyer le log au backend centralisé
    this.sendRemoteLog(entry);
  }

  private sendRemoteLog(entry: LogEntry): void {
    if (!this.remoteLoggingEndpoint) return;
    
    fetch(this.remoteLoggingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...entry,
        clientInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          url: window.location.href
        }
      }),
      keepalive: true
    }).catch(e => console.error("Erreur d'envoi du log distant:", e));
  }

  // Méthodes utiles
  componentLoaded(componentName: string): void {
    this.info(`Composant chargé: ${componentName}`, null, componentName);
  }

  userLogin(userId: string, details?: any): void {
    this.info(`Utilisateur connecté: ${userId}`, details, 'Authentication');
  }

  userLogout(userId: string): void {
    this.info(`Utilisateur déconnecté: ${userId}`, null, 'Authentication');
  }

  apiCall(endpoint: string, method: string, status: number, duration: number): void {
    this.info(`API ${method} ${endpoint}: ${status}`, { duration }, 'API');
  }

  exportLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export default LogService;