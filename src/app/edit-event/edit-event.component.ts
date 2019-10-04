import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { config, Subscription, throwError } from 'rxjs';
import { MeetingService } from '../meeting.service';
import { Location } from '@angular/common';
import {ToastrService} from 'ngx-toastr'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import{SocketService} from '../socket.service'
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    NgbDatepickerConfig
  ]
})
export class EditEventComponent implements OnInit {

  public eventId: string;
  public startDate: Date;
  public endDate: Date;
  public title: string;
  public color = "#7FFF00";
  public event:any={};
  public userId: string;
  public endTime;
  public startTime

  constructor(public SocketService:SocketService,public toastr: ToastrService,private service: MeetingService,private route: ActivatedRoute, private appRouter: Router, private location: Location,private config: NgbDatepickerConfig) {

  const currentDate = new Date();

  config.minDate = {year: currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate() };
  config.maxDate = {year: currentDate.getFullYear(), month: 12, day: 31};
  config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');

    this.service.getSingleEvent(this.eventId).subscribe( data => {
      let x=data['data']
      this.title=x.title
      x.start=new Date(x.start)
      x.end=new Date(x.end);
      this.startTime={hour:x.startHour,minute:x.startMinute}
      this.endTime={hour:x.endHour,minute:x.endMinute}
      this.userId=x.userId
      this.event = data['data'];
    })
  }

  

  public editEvent() {
    this.event.startHour=this.startTime.hour
    this.event.startMinute=this.startTime.minute

   this.event.endHour=this.endTime.hour
   this.event.endMinute=this.endTime.minute

    this.service.edit(this.event, this.event.eventId).subscribe(data => { 
      this.SocketService.eventEdited(Cookie.get('userName'),this.userId,this.title)
      this.appRouter.navigate([`${this.userId}/admindash`])
      //socket function to emit edit event
      setTimeout(() => {
      }, 1000)
    },
      error => {
      })
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

  deleteEvent(eventId) {
this.service.delete(eventId).subscribe(data=>{
  this.SocketService.eventdeleted(Cookie.get('userName'),this.userId,this.title)
  this.toastr.success('Event deleted', 'Success')

})
  }
}
