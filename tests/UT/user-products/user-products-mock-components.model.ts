import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ProductWrapperDisplayType, Product } from '@core/models/products';
import { DiaryAction } from '@core/models/products/diary-action.interface';
import { MealEatTimeType, UserProduct } from '@core/models/user-products';
import { MealContainerAction } from '@main-content/diary/meals-container/meals-container.component';

@Component({
  selector: 'app-meals-container',
  template: '',
})
export class MealsContainerComponent implements OnInit, OnDestroy {
  @Input()
  public mealEatTimeType: MealEatTimeType;

  @Input()
  public title: string;

  @Output()
  public action: EventEmitter<MealContainerAction> = new EventEmitter<MealContainerAction>();

  public display = ProductWrapperDisplayType.DIARY_SUMMARY;
  public columns: string[] = ['protein', 'carbohydrates', 'fats', 'kcal'];
  public userProducts: UserProduct[] = [];
  public product: Partial<Product> = {};

  public ngOnInit(): void {}
  public ngOnDestroy(): void {}
  public onDiaryAction(action: DiaryAction): void {}
  public onAddClick(): void {}

  public triggerAction(action: MealContainerAction): void {
    this.action.emit(action);
  }
}

@Component({
  selector: 'app-meals-conatainer-list',
  template: '',
})
export class MealsConatainerListComponent {
  @Output()
  public action: EventEmitter<MealContainerAction> = new EventEmitter<MealContainerAction>();

  public display = ProductWrapperDisplayType.DIARY_SUMMARY;
  public mealEatTimeType = MealEatTimeType;

  public onAction(action: MealContainerAction): void {}

  public triggerAction(action: MealContainerAction): void {
    this.action.emit(action);
  }
}
