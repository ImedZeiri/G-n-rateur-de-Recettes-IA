
import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const translations = {
  en: {
    title: 'Chef AI',
    heroTitle: 'What will you cook today?',
    heroSubtitle: 'Your personal culinary assistant. Turn your ingredients into delicious meals.',
    searchLabel: 'What ingredients do you have?',
    searchPlaceholder: 'e.g., chicken breast, broccoli, garlic',
    searchExample: 'Separate ingredients with commas.',
    searchButton: 'Find Recipes',
    loadingButton: 'Searching...',
    errorTitle: 'An Error Occurred',
    apiError: 'Could not fetch recipes. The API might be unavailable. Please try again later.',
    noRecipesFoundError: 'No recipes found for these ingredients. Try being more specific or using different ingredients.',
    resultsTitle: 'Here are your custom recipes!',
    getStartedTitle: 'Ready to cook?',
    getStartedBody: 'Enter the ingredients you have on hand, and let Chef AI inspire your next meal!',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    youtubeButton: 'Watch Tutorial',
    profileTitle: 'Profile, History & Pinned Recipes',
    historyTab: 'History',
    pinnedTab: 'Pinned',
    noHistoryTitle: 'No History Yet',
    noHistoryBody: 'Your viewed recipes will appear here.',
    noPinnedTitle: 'No Pinned Recipes',
    noPinnedBody: 'Pin your favorite recipes to see them here.',
    seeMore: 'See More',
    seeLess: 'See Less',
    pinRecipe: 'Pin Recipe',
    unpinRecipe: 'Unpin Recipe',
  },
  fr: {
    title: 'Chef AI',
    heroTitle: "Qu'allez-vous cuisiner aujourd'hui ?",
    heroSubtitle: 'Votre assistant culinaire personnel. Transformez vos ingrédients en plats délicieux.',
    searchLabel: 'Quels ingrédients avez-vous ?',
    searchPlaceholder: 'ex: poitrine de poulet, brocoli, ail',
    searchExample: 'Séparez les ingrédients par des virgules.',
    searchButton: 'Trouver des recettes',
    loadingButton: 'Recherche en cours...',
    errorTitle: 'Une erreur est survenue',
    apiError: "Impossible de récupérer les recettes. L'API est peut-être indisponible. Veuillez réessayer plus tard.",
    noRecipesFoundError: 'Aucune recette trouvée pour ces ingrédients. Essayez d\'être plus précis ou d\'utiliser des ingrédients différents.',
    resultsTitle: 'Voici vos recettes personnalisées !',
    getStartedTitle: 'Prêt à cuisiner ?',
    getStartedBody: 'Entrez les ingrédients que vous avez sous la main, et laissez Chef AI inspirer votre prochain repas !',
    ingredients: 'Ingrédients',
    instructions: 'Instructions',
    youtubeButton: 'Voir le Tuto',
    profileTitle: 'Profil, Historique et Recettes Épinglées',
    historyTab: 'Historique',
    pinnedTab: 'Épinglées',
    noHistoryTitle: 'Aucun Historique',
    noHistoryBody: 'Vos recettes consultées apparaîtront ici.',
    noPinnedTitle: 'Aucune Recette Épinglée',
    noPinnedBody: 'Épinglez vos recettes préférées pour les voir ici.',
    seeMore: 'Voir Plus',
    seeLess: 'Voir Moins',
    pinRecipe: 'Épingler la recette',
    unpinRecipe: 'Désépingler la recette',
  },
  es: {
    title: 'Chef AI',
    heroTitle: '¿Qué vas a cocinar hoy?',
    heroSubtitle: 'Tu asistente culinario personal. Convierte tus ingredientes en comidas deliciosas.',
    searchLabel: '¿Qué ingredientes tienes?',
    searchPlaceholder: 'ej: pechuga de pollo, brócoli, ajo',
    searchExample: 'Separa los ingredientes con comas.',
    searchButton: 'Buscar Recetas',
    loadingButton: 'Buscando...',
    errorTitle: 'Ocurrió un Error',
    apiError: 'No se pudieron obtener las recetas. La API podría no estar disponible. Por favor, inténtalo de nuevo más tarde.',
    noRecipesFoundError: 'No se encontraron recetas para estos ingredients. Intenta ser más específico o usar ingredientes diferentes.',
    resultsTitle: '¡Aquí tienes tus recetas personalizadas!',
    getStartedTitle: '¿Listo para cocinar?',
    getStartedBody: '¡Introduce los ingredientes que tienes a mano y deja que Chef AI inspire tu próxima comida!',
    ingredients: 'Ingredientes',
    instructions: 'Instrucciones',
    youtubeButton: 'Ver Tutorial',
    profileTitle: 'Perfil, Historial y Recetas Guardadas',
    historyTab: 'Historial',
    pinnedTab: 'Guardadas',
    noHistoryTitle: 'No Hay Historial',
    noHistoryBody: 'Tus recetas vistas aparecerán aquí.',
    noPinnedTitle: 'No Hay Recetas Guardadas',
    noPinnedBody: 'Guarda tus recetas favoritas para verlas aquí.',
    seeMore: 'Ver Más',
    seeLess: 'Ver Menos',
    pinRecipe: 'Guardar Receta',
    unpinRecipe: 'Quitar Receta',
  },
  ar: {
    title: 'الشيف الذكي',
    heroTitle: 'ماذا ستطبخ اليوم؟',
    heroSubtitle: 'مساعدك الشخصي في الطهي. حوّل مكوناتك إلى وجبات لذيذة.',
    searchLabel: 'ما هي المكونات التي لديك؟',
    searchPlaceholder: 'مثال: صدر دجاج، بروكلي، ثوم',
    searchExample: 'افصل المكونات بفاصلة.',
    searchButton: 'ابحث عن وصفات',
    loadingButton: 'جاري البحث...',
    errorTitle: 'حدث خطأ',
    apiError: 'لا يمكن جلب الوصفات. قد تكون واجهة برمجة التطبيقات غير متاحة. يرجى المحاولة مرة أخرى في وقت لاحق.',
    noRecipesFoundError: 'لم يتم العثور على وصفات لهذه المكونات. حاول أن تكون أكثر تحديدًا أو استخدم مكونات مختلفة.',
    resultsTitle: 'إليك وصفاتك المخصصة!',
    getStartedTitle: 'هل أنت جاهز للطبخ؟',
    getStartedBody: 'أدخل المكونات التي لديك، ودع الشيف الذكي يلهم وجبتك القادمة!',
    ingredients: 'المكونات',
    instructions: 'التعليمات',
    youtubeButton: 'شاهد الشرح',
    profileTitle: 'الملف الشخصي، السجل والوصفات المثبتة',
    historyTab: 'السجل',
    pinnedTab: 'المثبتة',
    noHistoryTitle: 'لا يوجد سجل حتى الآن',
    noHistoryBody: 'الوصفات التي شاهدتها ستظهر هنا.',
    noPinnedTitle: 'لا توجد وصفات مثبتة',
    noPinnedBody: 'ثبّت وصفاتك المفضلة لرؤيتها هنا.',
    seeMore: 'عرض المزيد',
    seeLess: 'عرض أقل',
    pinRecipe: 'تثبيت الوصفة',
    unpinRecipe: 'إلغاء تثبيت الوصفة',
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  languages = signal<LanguageOption[]>([
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]);
  
  language = signal<Language>('fr');

  private currentTranslations = computed(() => translations[this.language()]);

  translate = (key: keyof typeof translations['en']) => {
    return this.currentTranslations()[key] || key;
  };

  setLanguage(lang: Language) {
    this.language.set(lang);
  }
}
