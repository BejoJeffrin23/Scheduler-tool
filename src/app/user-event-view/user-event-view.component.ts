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
  selector: 'app-user-event-view',
  templateUrl: './user-event-view.component.html',
  styleUrls: ['./user-event-view.component.css']
})
export class UserEventViewComponent implements OnInit {

 public eventId: string;
 public startDate: Date;
 public endDate: Date;
 public title: string;
 public color:string ;
 public event:any={};
 public userId: string;
 public endHour:Number;
 public endMinute:Number
 public startHour:Number;
 public startMinute:Number;
 public start:any;
 public end:any;
 public pace:string;
 public tpace:string;
 public month;
 public day;
 public html;
  constructor(public SocketService:SocketService,public toastr: ToastrService,private service: MeetingService,private route: ActivatedRoute, private router: Router, private location: Location,private config: NgbDatepickerConfig) {}

  ngOnInit() {


     //socket function to notify about created event
     this.SocketService.createNotify().subscribe((data) => {
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has scheduled an event`)
      }


    })

    //socket function to notify about created event

    this.SocketService.editNotify().subscribe((data) => {
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has changed the scheduled event`)
      }

    })

    this.SocketService.deleteNotify().subscribe((data) => {
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has cancelled a scheduled event`)
      }

    })


    this.eventId = this.route.snapshot.paramMap.get('eventId');

    this.service.getSingleEvent(this.eventId).subscribe( data => {
      let x=data['data']
      this.month = (new Date(x.start).getMonth())
      this.day = (new Date(x.start).getDay())
      this.color=x.color
      x.start=new Date(x.start)
      x.end=new Date(x.end);
      this.SocketService.alarm().subscribe((data) => {
        if (data.min + 2 == x.startMinute && data.hours == x.startHour && data.month == this.month && data.day == this.day) {
          this.SocketService.alarmnotify(x.adminName, x.userId, x.title)
          this.html = false;
          setTimeout(() => {
            this.html = true;
          }, 10000)

        }
      })
      if(x.startHour>12){this.startHour=(x.startHour-12);this.tpace="PM"}
      else {this.startHour=x.startHour;this.tpace="AM"};
      this.startMinute=x.startMinute;
      if(x.endHour>12){this.endHour=(x.endHour-12);this.pace="PM"}
      else if(x.endHour<=12){this.endHour=x.endHour;this.pace="AM"};
      this.endMinute=x.endMinute;
      var startdate = new Date(x.start),
      month = ("0" + (startdate.getMonth() + 1)).slice(-2),
      day = ("0" + startdate.getDate()).slice(-2);
   this.start=[day, month,startdate.getFullYear()].join("-");

   var enddate = new Date(x.end),
   month = ("0" + (enddate.getMonth() + 1)).slice(-2),
   day = ("0" + enddate.getDate()).slice(-2);
this.end=[day, month,enddate.getFullYear()].join("-");
    
      this.userId=x.userId
      this.event = data['data'];
      
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
        this.router.navigate(['/login']);

      } else {
        this.toastr.error(apiResponse.message)
      } // end condition

    }, (err) => {
      this.toastr.error('Internal Server Error occured')

    });

  }
  // end of log-out function


}