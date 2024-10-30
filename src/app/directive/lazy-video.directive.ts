import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyVideo]',
  standalone: true,
})
export class LazyVideoDirective implements OnInit {
  @Input('lazyVideo') videoSrc!: string;

  constructor(private el: ElementRef<HTMLVideoElement>){}
  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.src = this.videoSrc;
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.el.nativeElement);
  }
}
