import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './User/sign-up/sign-up.component';
import { LogInComponent } from './User/log-in/log-in.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { SendMailComponent } from './User/send-mail/send-mail.component';
import { ChangePasswordComponent } from './User/change-password/change-password.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { PlannerRouteGaurdService } from './planner-route-gaurd.service';
import { UserEventViewComponent } from './user-event-view/user-event-view.component';

export function getAuthServiceConfigs() { }

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    SendMailComponent,
    ChangePasswordComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    CreateEventComponent,
    EditEventComponent,
    AdminHomeComponent,
    UserEventViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }
    ),
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgbModalModule,
    NgbModule,
    FlatpickrModule.forRoot(),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

    RouterModule.forRoot([

      { path: 'signup', component: SignUpComponent },
      { path: 'login', component: LogInComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'sendmail', component: SendMailComponent },
      { path: ':userId/change', component: ChangePasswordComponent},
      { path: ':userId/userdash', component: UserDashboardComponent, canActivate: [PlannerRouteGaurdService] },
      { path: ':userId/admindash', component: AdminDashboardComponent, canActivate: [PlannerRouteGaurdService] },
      { path: ':userId/create', component: CreateEventComponent, canActivate: [PlannerRouteGaurdService] },
      { path: ':eventId/edit', component: EditEventComponent, canActivate: [PlannerRouteGaurdService] },
      { path: ':eventId/view', component: UserEventViewComponent, canActivate: [PlannerRouteGaurdService] },
      { path: 'adminhome', component: AdminHomeComponent, canActivate: [PlannerRouteGaurdService] }
    ])
  ],
  providers: [PlannerRouteGaurdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
