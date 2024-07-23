export interface Config {
  useAzureLlm: boolean;
  azureLlmApiKey: string;
  azureLlmEndpoint: string;
  openAiEndpoint: string;
  openAiApiKey: string;
  rateLimitRequestsPerMinute: number;
  corsAllowedOrigin: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  xApiKey: string;
}
