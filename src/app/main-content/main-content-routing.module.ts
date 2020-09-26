import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './main-content.component';

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: '',
        redirectTo: '/main/diary',
        pathMatch: 'full',
      },
      {
        path: 'diary',
        loadChildren: () =>
          import('./diary/diary.module').then((m) => m.DiaryModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainContentRoutingModule {}
