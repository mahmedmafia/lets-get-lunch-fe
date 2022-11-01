import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EventRoutingModule } from './event-routing.module';
import { EventCreateComponent } from './event-create/event-create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EventCreateComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule
  ]
})
export class EventModule { }
