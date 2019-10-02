import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { config, Subscription, throwError } from 'rxjs';
import { MeetingService } from '../meeting.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../socket.service'


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    NgbDatepickerConfig
  ]
})
export class CreateEventComponent implements OnInit {


  public eventId: string;
  public startDate: Date;
  public endDate: Date;
  public title: string;
  public Location: string;
  public purpose: string;
  public startTime: any;
  public endTime: any;
  public color: string = "#7FFF00";
  public event;
  public adminName;
  public userId: string;
  public start;
  public end;

  constructor(public toastr: ToastrService, private SocketService: SocketService, private service: MeetingService, private _route: ActivatedRoute, private appRouter: Router, private location: Location, private config: NgbDatepickerConfig) {
    //configuring Datepicker
    const currentDate = new Date();

    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.maxDate = { year: currentDate.getFullYear(), month: 12, day: 31 };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('userId');
    this.adminName = Cookie.get('userName')

  }


  create() {
    this.start = new Date(this.startDate)
    this.end = new Date(this.endDate)
    let eventData;

    let starting = this.startDate.getTime();
    let ending = this.endDate.getTime();
    if (starting >= ending) {
      this.toastr.warning("The end date and time has to be in future than the start date and time");
    }
    else{
      eventData = {
        start: this.startDate,
        end: this.endDate,
        startHour: this.startTime.hour,
        startMinute: this.startTime.minute,
        endHour: this.endTime.hour,
        endMinute: this.endTime.minute,
        title: this.title,
        color: this.color,
        userId: this.userId,
        adminName: this.adminName,
        adminId: Cookie.get('userId'),
        location: this.Location,
        purpose: this.purpose
      };
    
    this.service.create(eventData).subscribe((data) => {
      console.log(data)
      if (data.status == 200) {
        this.SocketService.eventCreated(Cookie.get('userName'), data.data.userId,data.data.title)
        this.toastr.success('Event created successfully')
        this.appRouter.navigate([`${this.userId}/admindash`])
      }
    });}
  }

  public logout = () => {

    this.service.logout().subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        this.SocketService.disconnect()
        this.SocketService.exitSocket()
        Cookie.delete('authToken');
        Cookie.delete('userName');
        Cookie.delete('userId')
        this.appRouter.navigate(['/login']);

      } else {
        this.toastr.error(apiResponse.message)
      } // end condition

    }, (err) => {
      this.toastr.error('Internal Server Error occured')

    });

  }
  // end of log-out function

}







