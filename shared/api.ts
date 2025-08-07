/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Types for /api/refine-prompt endpoint
 */
export interface RefinePromptRequest {
  roughIdea: string;
  useCase: "chat" | "image" | "code" | "content";
}

export interface RefinePromptResponse {
  refinedPrompt: string;
  success: boolean;
  error?: string;
}
