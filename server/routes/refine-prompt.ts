import { RequestHandler } from "express";

export interface RefinePromptRequest {
  roughIdea: string;
  useCase: "chat" | "image" | "code" | "content";
}

export interface RefinePromptResponse {
  refinedPrompt: string;
  success: boolean;
  error?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const promptTemplates = {
  chat: (idea: string) => `Transform this rough idea into a detailed, professional AI chat prompt: "${idea}"

Create a prompt that:
- Clearly defines the AI's role and expertise
- Provides specific context and guidelines
- Includes instructions for tone, style, and approach
- Asks for comprehensive, helpful responses
- Considers multiple perspectives when relevant

Make it professional, clear, and effective for AI chat interactions.`,

  image: (idea: string) => `Transform this rough idea into a detailed AI image generation prompt: "${idea}"

Create a prompt that:
- Describes the subject clearly and specifically
- Includes style, lighting, and composition details
- Specifies quality, resolution, and technical aspects
- Mentions mood, atmosphere, and visual aesthetic
- Uses descriptive adjectives and artistic terms
- Follows best practices for AI image generation

Make it detailed, specific, and optimized for high-quality image generation.`,

  code: (idea: string) => `Transform this rough idea into a detailed AI code generation prompt: "${idea}"

Create a prompt that:
- Clearly specifies the programming language/framework
- Defines the exact functionality needed
- Includes requirements for code quality and style
- Asks for proper documentation and comments
- Mentions error handling and edge cases
- Specifies testing requirements if applicable
- Includes performance and security considerations

Make it precise, technical, and complete for code generation.`,

  content: (idea: string) => `Transform this rough idea into a detailed AI content creation prompt: "${idea}"

Create a prompt that:
- Defines the content type and format
- Specifies the target audience
- Includes tone, style, and voice guidelines
- Outlines structure and organization requirements
- Mentions key points to cover
- Includes SEO or engagement considerations if relevant
- Specifies length and formatting requirements

Make it comprehensive and optimized for engaging content creation.`
};

export const handleRefinePrompt: RequestHandler = async (req, res) => {
  try {
    const { roughIdea, useCase } = req.body as RefinePromptRequest;

    if (!roughIdea || !useCase) {
      return res.status(400).json({
        success: false,
        error: "Missing roughIdea or useCase",
        refinedPrompt: ""
      } as RefinePromptResponse);
    }

    // If no Gemini API key is available, use template-based refinement
    if (!GEMINI_API_KEY) {
      console.log("No Gemini API key found, using template-based refinement");
      
      const templates = {
        chat: `You are an expert assistant specializing in ${roughIdea}. Provide detailed, accurate, and helpful responses. Consider multiple perspectives and include relevant examples when appropriate. Your goal is to be comprehensive yet clear in your explanations. Always maintain a professional yet approachable tone, and ask clarifying questions when needed to provide the most relevant assistance.`,
        
        image: `Create a high-quality, detailed image of ${roughIdea}. Style: photorealistic, professional composition, excellent lighting. Technical specs: high resolution, sharp details, vibrant colors, balanced composition. Mood: ${roughIdea.includes('dark') || roughIdea.includes('moody') ? 'atmospheric and moody' : 'bright and engaging'}. Camera angle: optimal perspective for the subject. Ensure the image is visually appealing and technically excellent with proper depth of field and color balance.`,
        
        code: `Write clean, efficient, and well-documented code for ${roughIdea}. Requirements: Follow best practices and modern conventions, include comprehensive error handling, add clear comments explaining the logic, consider edge cases and performance optimization, write maintainable and scalable code. Use appropriate design patterns and ensure the code is production-ready with proper testing considerations.`,
        
        content: `Create engaging, well-structured content about ${roughIdea}. Format: Use clear headings, bullet points, and examples where appropriate. Tone: Professional yet accessible, tailored to the target audience. Structure: Introduction, main points with supporting details, and conclusion. Include relevant keywords naturally and ensure the content is informative, actionable, and valuable to readers. Optimize for both readability and engagement.`
      };

      return res.json({
        success: true,
        refinedPrompt: templates[useCase],
        error: undefined
      } as RefinePromptResponse);
    }

    // Use Gemini API for more sophisticated refinement
    const prompt = promptTemplates[useCase](roughIdea);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const refinedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Unable to refine prompt. Please try again.";

    res.json({
      success: true,
      refinedPrompt,
      error: undefined
    } as RefinePromptResponse);

  } catch (error) {
    console.error("Error refining prompt:", error);
    res.status(500).json({
      success: false,
      error: "Failed to refine prompt. Please try again.",
      refinedPrompt: ""
    } as RefinePromptResponse);
  }
};
