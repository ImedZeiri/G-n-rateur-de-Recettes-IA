
import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const translations = {
  en: {
    title: 'AI Recipe Generator',
    heroSubtitle: 'Discover delicious recipes with the power of AI.',
    searchLabel: 'What ingredients do you have?',
    searchPlaceholder: 'e.g., chicken breast, broccoli, garlic',
    searchExample: 'Separate ingredients with commas.',
    searchButton: 'Find Recipes',
    loadingButton: 'Searching...',
    errorTitle: 'An Error Occurred',
    apiError: 'Could not fetch recipes. The API might be unavailable. Please try again later.',
    noRecipesFoundError: 'No recipes found for these ingredients. Try being more specific or using different ingredients.',
    resultsTitle: 'Recipe Suggestions',
    getStartedTitle: 'Ready to cook?',
    getStartedBody: 'Enter some ingredients above and let AI find the perfect recipe for you!',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    youtubeButton: 'Watch Tutorial',
    profileTitle: 'Profile, History and Pinned Recipes',
    historyTab: 'History',
    pinnedTab: 'Pinned',
    noHistoryTitle: 'No History Yet',
    noHistoryBody: 'Your recently generated recipes will appear here.',
    noPinnedTitle: 'No Pinned Recipes',
    noPinnedBody: 'Pin your favorite recipes to see them here.',
    seeMore: 'See More',
    seeLess: 'See Less',
    pinRecipe: 'Pin Recipe',
    unpinRecipe: 'Unpin Recipe',
  },
  fr: {
    title: 'Générateur de Recettes IA',
    heroSubtitle: "Découvrez de délicieuses recettes avec la puissance de l'IA.",
    searchLabel: 'Quels ingrédients avez-vous ?',
    searchPlaceholder: 'ex: poitrine de poulet, brocoli, ail',
    searchExample: 'Séparez les ingrédients par des virgules.',
    searchButton: 'Trouver des recettes',
    loadingButton: 'Recherche en cours...',
    errorTitle: 'Une erreur est survenue',
    apiError: "Impossible de récupérer les recettes. L'API est peut-être indisponible. Veuillez réessayer plus tard.",
    noRecipesFoundError: 'Aucune recette trouvée pour ces ingrédients. Essayez d\'être plus précis ou d\'utiliser des ingrédients différents.',
    resultsTitle: 'Suggestions de Recettes',
    getStartedTitle: 'Prêt à cuisiner ?',
    getStartedBody: 'Entrez quelques ingrédients ci-dessus et laissez l\'IA trouver la recette parfaite pour vous !',
    ingredients: 'Ingrédients',
    instructions: 'Instructions',
    youtubeButton: 'Voir le Tuto',
    profileTitle: 'Profil, Historique et Recettes Épinglées',
    historyTab: 'Historique',
    pinnedTab: 'Épinglées',
    noHistoryTitle: 'Aucun Historique',
    noHistoryBody: 'Vos recettes récemment générées apparaîtront ici.',
    noPinnedTitle: 'Aucune Recette Épinglée',
    noPinnedBody: 'Épinglez vos recettes préférées pour les voir ici.',
    seeMore: 'Voir Plus',
    seeLess: 'Voir Moins',
    pinRecipe: 'Épingler la recette',
    unpinRecipe: 'Désépingler la recette',
  },
  es: {
    title: 'Generador de Recetas con IA',
    heroSubtitle: 'Descubre deliciosas recetas con el poder de la IA.',
    searchLabel: '¿Qué ingredientes tienes?',
    searchPlaceholder: 'ej: pechuga de pollo, brócoli, ajo',
    searchExample: 'Separa los ingredientes con comas.',
    searchButton: 'Buscar Recetas',
    loadingButton: 'Buscando...',
    errorTitle: 'Ocurrió un Error',
    apiError: 'No se pudieron obtener las recetas. La API podría no estar disponible. Por favor, inténtalo de nuevo más tarde.',
    noRecipesFoundError: 'No se encontraron recetas para estos ingredients. Intenta ser más específico o usar ingredientes diferentes.',
    resultsTitle: 'Sugerencias de Recetas',
    getStartedTitle: '¿Listo para cocinar?',
    getStartedBody: '¡Introduce algunos ingredientes arriba y deja que la IA encuentre la receta perfecta para ti!',
    ingredients: 'Ingredientes',
    instructions: 'Instrucciones',
    youtubeButton: 'Ver Tutorial',
    profileTitle: 'Perfil, Historial y Recetas Guardadas',
    historyTab: 'Historial',
    pinnedTab: 'Guardadas',
    noHistoryTitle: 'No Hay Historial',
    noHistoryBody: 'Tus recetas generadas recientemente aparecerán aquí.',
    noPinnedTitle: 'No Hay Recetas Guardadas',
    noPinnedBody: 'Guarda tus recetas favoritas para verlas aquí.',
    seeMore: 'Ver Más',
    seeLess: 'Ver Menos',
    pinRecipe: 'Guardar Receta',
    unpinRecipe: 'Quitar Receta',
  },
  ar: {
    title: 'مولد وصفات الذكاء الاصطناعي',
    heroSubtitle: 'اكتشف وصفات لذيذة بقوة الذكاء الاصطناعي.',
    searchLabel: 'ما هي المكونات التي لديك؟',
    searchPlaceholder: 'مثال: صدر دجاج، بروكلي، ثوم',
    searchExample: 'افصل المكونات بفاصلة.',
    searchButton: 'ابحث عن وصفات',
    loadingButton: 'جاري البحث...',
    errorTitle: 'حدث خطأ',
    apiError: 'لا يمكن جلب الوصفات. قد تكون واجهة برمجة التطبيقات غير متاحة. يرجى المحاولة مرة أخرى في وقت لاحق.',
    noRecipesFoundError: 'لم يتم العثور على وصفات لهذه المكونات. حاول أن تكون أكثر تحديدًا أو استخدم مكونات مختلفة.',
    resultsTitle: 'اقتراحات الوصفات',
    getStartedTitle: 'هل أنت جاهز للطبخ؟',
    getStartedBody: 'أدخل بعض المكونات أعلاه ودع الذكاء الاصطناعي يجد لك الوصفة المثالية!',
    ingredients: 'المكونات',
    instructions: 'التعليمات',
    youtubeButton: 'شاهد الشرح',
    profileTitle: 'الملف الشخصي، السجل والوصفات المثبتة',
    historyTab: 'السجل',
    pinnedTab: 'المثبتة',
    noHistoryTitle: 'لا يوجد سجل حتى الآن',
    noHistoryBody: 'ستظهر وصفاتك التي تم إنشاؤها مؤخرًا هنا.',
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
