
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
        }
      },
      required: ["recipeName", "description", "ingredients", "instructions"],
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
    prompt += ` The entire response, including recipe names, descriptions, ingredients, and instructions, must be in ${targetLanguage}.`;


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
      // The Gemini response is just the array, not the full Recipe object with our extra fields.
      const baseRecipes = JSON.parse(jsonText) as Omit<Recipe, 'imageUrl' | 'youtubeUrl' | 'isPinned'>[];

      // Augment the recipes with our dynamic fields
      const recipes: Recipe[] = baseRecipes.map(recipe => {
        const searchQuery = encodeURIComponent(recipe.recipeName + ' recipe');
        return {
          ...recipe,
          // Use Unsplash to get a relevant image based on the recipe name.
          imageUrl: `https://source.unsplash.com/600x400/?${encodeURIComponent(recipe.recipeName + ', food')}`,
          // Create an embeddable YouTube URL from a search query
          youtubeUrl: `https://www.youtube.com/embed?listType=search&list=${searchQuery}`
        };
      });

      return recipes;

    } catch (error) {
      console.error('Error generating recipes with Gemini API:', error);
      return [];
    }
  }
}
