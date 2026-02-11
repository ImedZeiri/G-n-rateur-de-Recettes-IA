import { ChangeDetectionStrategy, Component, inject, signal, computed, ElementRef } from '@angular/core';
import { TranslationService, Language, LanguageOption } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Fix: Moved host listener into the component decorator metadata per Angular best practices.
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class LanguageSwitcherComponent {
  translationService = inject(TranslationService);
  private elementRef = inject(ElementRef);
  
  isDropdownOpen = signal(false);
  
  languages = this.translationService.languages;
  currentLanguage = this.translationService.language;
  
  selectedLanguage = computed(() => 
    this.languages().find(lang => lang.code === this.currentLanguage())
  );

  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }
  
  selectLanguage(lang: LanguageOption) {
    this.translationService.setLanguage(lang.code);
    this.isDropdownOpen.set(false);
  }
}
