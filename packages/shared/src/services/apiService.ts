import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

// Type pour les options de configuration
export interface ApiServiceOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Classe pour gérer les appels API
class ApiService {
  private api: AxiosInstance;
  
  constructor(options: ApiServiceOptions = {}) {
    this.api = axios.create({
      baseURL: options.baseURL || 'https://api.cesieat.fr/api',
      timeout: options.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    // Intercepteur pour les requêtes
    this.api.interceptors.request.use(
      (config) => {
        // Récupérer le token depuis le localStorage ou sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Intercepteur pour les réponses
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Gérer les erreurs globalement
        if (error.response) {
          // Erreur de réponse serveur (4xx, 5xx)
          if (error.response.status === 401) {
            // Non autorisé - déconnecter l'utilisateur
            this.handleUnauthorized();
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Méthode privée pour gérer les erreurs 401
  private handleUnauthorized(): void {
    // Supprimer le token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Rediriger vers la page de login
    // Utilisez votre mécanisme de redirection
    window.location.href = '/login';
  }
  
  // Méthodes pour les requêtes HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }
  
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

// Exporte une instance par défaut avec la configuration de base
export default ApiService;