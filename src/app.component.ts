
import { ChangeDetectionStrategy, Component, signal, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';

import { GeminiService, Recipe } from './services/gemini.service';
import { TranslationService } from './services/translation.service';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { ProfilePanelComponent } from './components/profile-panel/profile-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CommonModule,
    LanguageSwitcherComponent,
    RecipeCardComponent,
    VideoModalComponent,
    ProfilePanelComponent,
  ],
})
export class AppComponent {
  geminiService = inject(GeminiService);
  translationService = inject(TranslationService);
  private document: Document = inject(DOCUMENT);

  private readonly HISTORY_KEY = 'recipe_history';
  private readonly PINNED_KEY = 'recipe_pinned';

  ingredients = signal<string>('tomates, basilic, ail');
  recipes = signal<Recipe[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedVideoUrl = signal<string | null>(null);

  isProfileOpen = signal(false);
  history = signal<Recipe[]>([]);
  pinnedRecipes = signal<Recipe[]>([]);

  constructor() {
    this.loadStateFromLocalStorage();

    effect(() => {
      const lang = this.translationService.language();
      this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });

    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history()));
        localStorage.setItem(this.PINNED_KEY, JSON.stringify(this.pinnedRecipes()));
      }
    });
  }

  get t() {
    return this.translationService.translate;
  }
  
  private loadStateFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(this.HISTORY_KEY);
      if (savedHistory) {
        this.history.set(JSON.parse(savedHistory));
      }
      const savedPinned = localStorage.getItem(this.PINNED_KEY);
      if (savedPinned) {
        this.pinnedRecipes.set(JSON.parse(savedPinned));
      }
    }
  }

  async findRecipes() {
    if (!this.ingredients() || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    this.recipes.set([]);

    try {
      const result = await this.geminiService.generateRecipes(this.ingredients());
      if (result.length === 0) {
        this.error.set(this.t('noRecipesFoundError'));
      } else {
        const pinnedNames = new Set(this.pinnedRecipes().map(p => p.recipeName));
        const newRecipes = result.map(r => ({ ...r, isPinned: pinnedNames.has(r.recipeName) }));
        this.recipes.set(newRecipes);
      }
    } catch (e) {
      console.error(e);
      this.error.set(this.t('apiError'));
    } finally {
      this.loading.set(false);
    }
  }

  markAsVisited(recipeToVisit: Recipe) {
    const alreadyVisited = this.history().some(r => r.recipeName === recipeToVisit.recipeName);
    if (!alreadyVisited) {
        this.history.update(current => 
            [recipeToVisit, ...current].slice(0, 30)
        );
    }
  }

  togglePin(recipeToToggle: Recipe) {
    this.markAsVisited(recipeToToggle);
    const isPinned = this.pinnedRecipes().some(p => p.recipeName === recipeToToggle.recipeName);

    if (isPinned) {
      this.pinnedRecipes.update(p => p.filter(r => r.recipeName !== recipeToToggle.recipeName));
    } else {
      this.pinnedRecipes.update(p => [{ ...recipeToToggle, isPinned: true }, ...p]);
    }
    
    const updatePinStatus = (recipe: Recipe): Recipe => {
        const isNowPinned = this.pinnedRecipes().some(p => p.recipeName === recipe.recipeName);
        return { ...recipe, isPinned: isNowPinned };
    };

    this.recipes.update(recipes => recipes.map(r => r.recipeName === recipeToToggle.recipeName ? updatePinStatus(r) : r));
    this.history.update(history => history.map(r => r.recipeName === recipeToToggle.recipeName ? updatePinStatus(r) : r));
  }
  
  openVideoModal(recipe: Recipe): void {
    this.selectedVideoUrl.set(recipe.youtubeUrl);
    this.markAsVisited(recipe);
  }

  closeVideoModal(): void {
    this.selectedVideoUrl.set(null);
  }

  toggleProfilePanel(): void {
    this.isProfileOpen.update(v => !v);
  }
}
