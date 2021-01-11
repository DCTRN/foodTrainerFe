import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ComponentLoader } from '@core/models/component-loader.interface';

@Injectable({
  providedIn: 'root',
})
export class ComponentLoaderService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public loadComponent(
    viewContainerRef: ViewContainerRef,
    componentLoader: ComponentLoader
  ): Observable<ComponentRef<unknown>> {
    return from(componentLoader.loadComponent()).pipe(
      map((component: any) =>
        this.componentFactoryResolver.resolveComponentFactory(component)
      ),
      map((componentFactory) =>
        viewContainerRef.createComponent(componentFactory)
      )
    );
  }
}
