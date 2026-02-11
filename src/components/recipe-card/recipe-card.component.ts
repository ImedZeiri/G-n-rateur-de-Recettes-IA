
import { ChangeDetectionStrategy, Component, input, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Recipe } from '../../services/gemini.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
  translationService = inject(TranslationService);
  
  play = output<Recipe>();
  togglePin = output<Recipe>();
  viewInstructions = output<Recipe>();

  isExpanded = signal(false);

  get t() {
    return this.translationService.translate;
  }
  
  onPlayVideo(): void {
    this.play.emit(this.recipe());
  }

  onTogglePin(): void {
    this.togglePin.emit(this.recipe());
  }

  toggleInstructions(): void {
    if (!this.isExpanded()) {
        this.viewInstructions.emit(this.recipe());
    }
    this.isExpanded.update(v => !v);
  }
}
