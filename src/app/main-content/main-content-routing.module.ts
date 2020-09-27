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
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'friends',
        loadChildren: () =>
          import('./friends/friends.module').then((m) => m.FriendsModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainContentRoutingModule {}
