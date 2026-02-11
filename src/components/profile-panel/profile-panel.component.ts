
import { ChangeDetectionStrategy, Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../services/gemini.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-profile-panel',
  templateUrl: './profile-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ProfilePanelComponent {
  translationService = inject(TranslationService);
  
  history = input.required<Recipe[]>();
  pinned = input.required<Recipe[]>();
  
  close = output<void>();
  unpin = output<Recipe>();

  activeTab = signal<'history' | 'pinned'>('history');

  get t() {
    return this.translationService.translate;
  }

  onUnpin(recipe: Recipe): void {
    this.unpin.emit(recipe);
  }
}
