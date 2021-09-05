import { DatePipe } from '@angular/common';
import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentLoader } from '@core/models/component-loader.interface';
import { MealEatTimeType } from '@core/models/user-products';
import { ComponentLoaderService } from '@core/services/component-loader/component-loader.service';
import { UserProductsAction } from '@core/stores/user-products/user-products.actions';
import {
  decrementDateByDay,
  incrementDateByDay,
} from '@core/util-functions/util-functions';
import { Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { skip, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { MealsConatainerListComponent } from './meals-container-list/meals-conatainer-list.component';
import { MealContainerAction } from './meals-container/meals-container.component';
import { MealsSearchListComponent } from './meals-search-list/meals-search-list.component';

export enum DiaryComponents {
  MEALS_CONTAINER_LIST = 'MEALS_CONTAINER_LIST',
  MEALS_SEARCH_LIST = 'MEALS_SEARCH_LIST',
}

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  public container: ViewContainerRef;

  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public date = new FormControl(new Date().toISOString());
  public columns: string[] = ['protein', 'carbohydrates', 'fats', 'kcal'];
  public mealEatTimeType: MealEatTimeType;

  private currentDate = new Date();

  private readonly components: { [key: string]: ComponentLoader } = {
    [DiaryComponents.MEALS_CONTAINER_LIST]: {
      loadComponent: () =>
        import('./meals-container-list/meals-conatainer-list.component').then(
          (m) => m.MealsConatainerListComponent
        ),
    },
    [DiaryComponents.MEALS_SEARCH_LIST]: {
      loadComponent: () =>
        import('./meals-search-list/meals-search-list.component').then(
          (m) => m.MealsSearchListComponent
        ),
    },
  };

  constructor(
    private store: Store<AppState>,
    private componentLoader: ComponentLoaderService
  ) {}

  public ngOnInit(): void {
    this.getUserProductsByCurrentDate();
    this.loadComponent(DiaryComponents.MEALS_CONTAINER_LIST);
    this.date.valueChanges.pipe().subscribe((date) => {
      console.warn(date);
      this.currentDate = date;
      this.getUserProductsByCurrentDate();
    });
  }

  public onAction(action: MealContainerAction): void {
    this.mealEatTimeType = action.mealEatTimeType;
    this.loadComponent(DiaryComponents.MEALS_SEARCH_LIST);
  }

  public onIcrementDateClick(): void {
    this.date.setValue(incrementDateByDay(this.currentDate));
  }
  public onDecrementDateClick(): void {
    this.date.setValue(decrementDateByDay(this.currentDate));
  }

  private loadComponent(component: DiaryComponents): void {
    this.container.clear();
    this.componentLoader
      .loadComponent(this.container, this.components[component])
      .pipe(
        take(1),
        tap((componentRef: ComponentRef<unknown>) =>
          this.componentCreationhandler(componentRef)
        )
      )
      .subscribe();
  }

  private componentCreationhandler(componentRef: ComponentRef<unknown>): void {
    this.listCreationHandler(componentRef);
    this.searchlistCreationhandler(componentRef);
  }

  private searchlistCreationhandler(componentRef: ComponentRef<unknown>): void {
    if (componentRef.componentType === MealsSearchListComponent) {
      this.mealsSearchListComponentHandler(
        componentRef.instance as MealsSearchListComponent
      );
    }
  }

  private listCreationHandler(componentRef: ComponentRef<unknown>): void {
    if (componentRef.componentType === MealsConatainerListComponent) {
      this.mealsConatainerListComponentHandler(
        componentRef.instance as MealsConatainerListComponent
      );
    }
  }

  private mealsConatainerListComponentHandler(
    component: MealsConatainerListComponent
  ): void {
    component.action.pipe(take(1)).subscribe((action: MealContainerAction) => {
      this.onAction(action);
    });
  }

  private mealsSearchListComponentHandler(
    component: MealsSearchListComponent
  ): void {
    component.mealEatTimeType = this.mealEatTimeType;
    component.date = this.currentDate;
    component.action
      .pipe(take(1))
      .subscribe(() =>
        this.loadComponent(DiaryComponents.MEALS_CONTAINER_LIST)
      );
  }

  private getUserProductsByCurrentDate(): void {
    this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST({
        userProductsBy: {
          date: this.currentDate,
        },
      })
    );
  }
}
