import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { LandingPageContainerComponent } from './components/landing-page-container/landing-page-container.component';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './components/test/test.component';


@NgModule({
  declarations: [
    LandingPageContainerComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule
  ]
})
export class FeaturesModule { }
