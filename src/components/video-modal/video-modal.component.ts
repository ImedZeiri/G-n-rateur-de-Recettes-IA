import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
// Fix: Import `SafeResourceUrl` for explicit typing of the computed signal.
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class VideoModalComponent {
  videoUrl = input.required<string>();
  close = output<void>();

  // Fix: Explicitly type `sanitizer` to resolve a type inference issue where it was being treated as `unknown`.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  sanitizedUrl = computed<SafeResourceUrl>(() => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl());
  });

  closeModal(): void {
    this.close.emit();
  }
}
