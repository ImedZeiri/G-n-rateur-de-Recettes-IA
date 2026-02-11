
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { TranslationService } from './translation.service';

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  youtubeUrl: string;
  isPinned?: boolean;
}

// Interface for the raw Gemini response, including search queries.
interface GeminiRecipeResponse {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageSearchQuery: string;
  youtubeSearchQuery: string;
}

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private translationService = inject(TranslationService);
  private ai: GoogleGenAI;
  private readonly recipeSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        recipeName: {
          type: Type.STRING,
          description: "The name of the recipe.",
        },
        description: {
          type: Type.STRING,
          description: "A short, appealing description of the dish, 1-2 sentences."
        },
        ingredients: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A specific ingredient with its quantity, e.g., '2 chicken breasts'."
          },
          description: "The list of ingredients for the recipe.",
        },
        instructions: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single step in the cooking process."
          },
          description: "The step-by-step instructions to prepare the dish."
        },
        imageSearchQuery: {
            type: Type.STRING,
            description: "A simple, effective English search query for a stock photo website to find a high-quality, appealing image of the finished dish. For example: 'gourmet spaghetti carbonara photo'."
        },
        youtubeSearchQuery: {
            type: Type.STRING,
            description: "An effective English YouTube search query to find a cooking tutorial video for this recipe. For example: 'how to make classic carbonara'."
        }
      },
      required: ["recipeName", "description", "ingredients", "instructions", "imageSearchQuery", "youtubeSearchQuery"],
    },
  };

  constructor() {
    // WARNING: Do not expose API keys in client-side code in a real production app.
    // This is for demonstration purposes in the Applet environment where process.env is available.
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateRecipes(ingredients: string, cuisine: string): Promise<Recipe[]> {
    const langCode = this.translationService.language();
    const languageMap = {
      fr: 'French',
      en: 'English',
      es: 'Spanish',
      ar: 'Arabic'
    };
    const targetLanguage = languageMap[langCode];

    let prompt = `Generate 3 diverse and delicious recipes using the following ingredients: ${ingredients}.`;
    if (cuisine && cuisine !== 'any') {
      prompt = `Generate 3 diverse and delicious ${cuisine} recipes using the following ingredients: ${ingredients}.`;
    }
    prompt += ` For each recipe, also provide an 'imageSearchQuery' (a simple English query for a stock photo site) and a 'youtubeSearchQuery' (an English query for a video tutorial). The recipe details (name, description, etc.) must be in ${targetLanguage}, but the search queries must be in English.`;


    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: this.recipeSchema,
        },
      });

      const jsonText = response.text.trim();
      const baseRecipes = JSON.parse(jsonText) as GeminiRecipeResponse[];

      // Augment the recipes with our dynamic fields
      const recipes: Recipe[] = baseRecipes.map(recipe => {
        return {
          recipeName: recipe.recipeName,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          // Use the model-generated search query for Unsplash to get a more relevant image.
          imageUrl: `https://source.unsplash.com/600x400/?${encodeURIComponent(recipe.imageSearchQuery)}`,
          // Use the model-generated search query for a more relevant YouTube search.
          youtubeUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(recipe.youtubeSearchQuery)}`
        };
      });

      return recipes;

    } catch (error) {
      console.error('Error generating recipes with Gemini API:', error);
      return [];
    }
  }
}