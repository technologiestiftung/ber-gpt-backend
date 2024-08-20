export interface Config {
  useAzureLlm: boolean;
  azureLlmApiKey: string;
  azureLlmEndpointGpt35Turbo: string;
  azureLlmEndpointGpt4oMini: string;
  openAiEndpoint: string;
  openAiApiKey: string;
  rateLimitRequestsPerMinute: number;
  corsAllowedOrigin: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  xApiKey: string;
}
