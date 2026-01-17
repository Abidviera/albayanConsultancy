import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageContainerComponent } from './components/landing-page-container/landing-page-container.component';
import { TestComponent } from './components/test/test.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
   { path: '', component: LandingPageContainerComponent },
   { path: 't', component: TestComponent },
   { path: 'about', component: AboutComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
