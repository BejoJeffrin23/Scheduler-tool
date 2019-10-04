import {
  Component,OnInit,TemplateRef} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeetingService } from '../meeting.service';
import { ActivatedRoute, Router } from '@angular/router'


import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewBeforeRenderEvent
} from 'angular-calendar';
import {
  ViewEncapsulation
} from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import{SocketService} from '../socket.service'
import {
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  

})
export class AdminDashboardComponent implements OnInit {
 public userName:String;
 public userId: string;
public start:any;
public end:any;
public p: Number = 1;
public count: Number = 5;
  ngOnInit(){
    this.userName=Cookie.get('userName')

    this.userId = this._route.snapshot.paramMap.get('userId');
    this.service.getEvents(this.userId).subscribe( data => {


      for(let x of data['data']){
      x.start=startOfDay(new Date(x.start))
      x.start.setHours(x.startHour,x.startMinute)
      x.end=endOfDay(new Date(x.end))
      x.end.setHours(x.endHour,x.endMinute)

        x.color={primary:x.color}
        var startdate = new Date(x.start),
        month = ("0" + (startdate.getMonth() + 1)).slice(-2),
        day = ("0" + startdate.getDate()).slice(-2);
     this.start=[day, month,startdate.getFullYear()].join("-");

     var enddate = new Date(x.end),
     month = ("0" + (enddate.getMonth() + 1)).slice(-2),
     day = ("0" + enddate.getDate()).slice(-2);
  this.end=[day, month,enddate.getFullYear()].join("-");
      }
      this.events =data['data'] ;

    })
    
  }


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
 
  events:any;
  activeDayIsOpen: boolean = true;

  constructor(public toastr:ToastrService,public SocketService:SocketService,private modal: NgbModal,public service:MeetingService,public _route: ActivatedRoute, public router: Router) {      this.dateOrViewChanged();
  }




  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }



  addEvent(): void {
    this.router.navigate([`${this.userId}/create` ])
  }

 

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



  



 
  

 

  
  
  
    minDate: Date = subMonths(new Date(),new Date().getMonth());
  
    maxDate: Date = addMonths(new Date(),12-new Date().getMonth());
  
    prevBtnDisabled: boolean = false;
  
    nextBtnDisabled: boolean = false;
  
   
    increment(): void {
      this.changeDate(addPeriod(this.view, this.viewDate, 1));
    }
  
    decrement(): void {
      this.changeDate(subPeriod(this.view, this.viewDate, 1));
    }
  
    today(): void {
      this.changeDate(new Date());
    }
  
    dateIsValid(date: Date): boolean {
      return date >= this.minDate && date <= this.maxDate;
    }
  
    changeDate(date: Date): void {
      this.viewDate = date;
      this.dateOrViewChanged();
    }
  
    changeView(view: CalendarView): void {
      this.view = view;
      this.dateOrViewChanged();
    }
  
    dateOrViewChanged(): void {
      this.prevBtnDisabled = !this.dateIsValid(
        endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
      );
      this.nextBtnDisabled = !this.dateIsValid(
        startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
      );
      if (this.viewDate < this.minDate) {
        this.changeDate(this.minDate);
      } else if (this.viewDate > this.maxDate) {
        this.changeDate(this.maxDate);
      }
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





 



