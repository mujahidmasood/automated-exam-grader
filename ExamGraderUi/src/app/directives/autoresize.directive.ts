import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'ion-textarea[autoresize]',
  standalone: true,
})
export class AutoresizeDirective {
  constructor(public element: ElementRef) {}

  @HostListener('input')
  onInput(): void {
    this.adjust();
  }

  ngOnInit(): void {
    this.adjust();
  }

  adjust(): void {
    const ta = this.element.nativeElement.querySelector('textarea');
    if (ta) {
      ta.style.overflow = 'hidden';
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }
}
