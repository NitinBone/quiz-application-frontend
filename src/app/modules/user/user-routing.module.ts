import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TakeTestComponent } from './components/dashboard/take-test/take-test.component';
import { TestSubmittedComponent } from './components/test-submitted/test-submitted.component';

const routes: Routes = [
  {path:'dashboard',component: DashboardComponent},
  {path:'take-test/:id',component:TakeTestComponent},  {path:'test-submitted',component:TestSubmittedComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
