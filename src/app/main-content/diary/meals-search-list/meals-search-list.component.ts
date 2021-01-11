import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ButtonAction,
  Product,
  ProductAction,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { MealEatTimeType, UserProduct } from '@core/models/user-products';
import { UserProductsAction } from '@core/stores/user-products/user-products.actions';
import { convertToPrecision } from '@core/util-functions/util-functions';
import { SearchPanelButtonAction } from '@main-content/products/user-products-list/user-products-list.component';
import { Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { MealsSearchListService } from './meals-search-list.service';

@Component({
  selector: 'app-meals-search-list',
  templateUrl: './meals-search-list.component.html',
  styleUrls: ['./meals-search-list.component.scss'],
  providers: [MealsSearchListService],
})
export class MealsSearchListComponent implements OnInit, OnDestroy {
  @Input()
  public mealEatTimeType: MealEatTimeType;

  @Input()
  public date: Date;

  @Output()
  public action: EventEmitter<void> = new EventEmitter<void>();

  public products: Product[] = [];
  public display: ProductWrapperDisplayType =
    ProductWrapperDisplayType.DIARY_SEARCH;
  public buttonAction = SearchPanelButtonAction;

  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public search = new FormControl('', [Validators.minLength(1)]);

  private actionHandlers = {
    [ButtonAction.ADD]: (action: ProductAction) => {
      this.addActionHandler(action);
    },
  };

  private buttonActionHandlers = {
    [SearchPanelButtonAction.SEARCH]: () => {
      this.mealsSearchListService
        .findProductsBy(this.search.value)
        .pipe(take(1))
        .subscribe((p) => {
          this.products = p;
        });
    },
    [SearchPanelButtonAction.CLEAR]: () => {
      this.products = [];
    },
  };

  constructor(
    private store: Store<AppState>,
    private mealsSearchListService: MealsSearchListService
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public onBackClick(): void {
    this.action.emit();
  }

  public onAction(action: ProductAction): void {
    this.actionHandlers[action.action](action);
  }

  public buttonActionClick(action: SearchPanelButtonAction): void {
    this.buttonActionHandlers[action]();
  }

  private addActionHandler(action: ProductAction): void {
    this.store.dispatch(
      UserProductsAction.ADD_USER_PRODUCT_REQUEST({
        userProduct: {
          productId: action.product.id,
          amount: convertToPrecision(action.product.amount),
          date: this.date,
          mealTimeType: this.mealEatTimeType,
        },
      })
    );
  }
}
