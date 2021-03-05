import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHostFinder]',
})
export class HostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
