import { Directive, Input, OnInit, OnDestroy, Output, EventEmitter, Renderer2 } from '@angular/core';
import fullpage from 'fullpage.js/dist/fullpage.extensions.min';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fullpage]'
})
export class FullpageDirective implements OnInit, OnDestroy {
  @Input() id;
  @Input() options;
  @Output() ref = new EventEmitter();
  fullpage_api;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.initFullpage();
  }

  initFullpage() {
    this.fullpage_api = new fullpage('#' + this.id, this.options);
    this.addBuildFunction();
    this.ref.emit(this.fullpage_api);
  }

  addBuildFunction() {
    this.fullpage_api.build = () => {
      const activeSection = this.fullpage_api.getActiveSection();
      const activeSlide = this.fullpage_api.getActiveSlide();

      // bug destroy(all) also destroyed angular events such as (click)
      this.destroyFullpage();

      if (activeSection) {
        this.renderer.addClass(activeSection.item, 'active');
      }

      if (activeSlide) {
        this.renderer.addClass(activeSlide.item, 'active');
      }

      this.initFullpage();
    };
  }

  destroyFullpage() {
    if (typeof this.fullpage_api !== 'undefined' && typeof this.fullpage_api.destroy !== 'undefined') {
      this.fullpage_api.destroy('all');
    }
  }

  ngOnDestroy() {
    this.destroyFullpage();
  }
}
