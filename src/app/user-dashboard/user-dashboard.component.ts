import { Component, ViewChild, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { subMonths, addMonths, addWeeks, subWeeks, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { MeetingService } from '../meeting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router'
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { SocketService } from '../socket.service'
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
// ng calendar setups
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
//end of ng calendar setup
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,


})
export class UserDashboardComponent implements OnInit {
  public userId: string;
  public events: CalendarEvent[] = [];
  public start: any;
  public end: any;
  public p: Number = 1;
  public count: Number = 5;
  public userName: String;
  public html;
  public date = new Date().getMinutes()
  constructor(public toastr: ToastrService, public SocketService: SocketService, public _route: ActivatedRoute, public router: Router, private modal: NgbModal, private service: MeetingService) { this.dateOrViewChanged(); }


  ngOnInit() {

    this.userName = Cookie.get('userName')

    this.SocketService.alarmNotify().subscribe((data) => {
      if (data.userId == this.userId) {

        this.toastr.success(`hii has edited his issue`)
        this.html = false;
        setTimeout(() => {
          this.html = true;
        }, 3000)
      }
    })

    //socket function to notify about created event
    this.SocketService.createNotify().subscribe((data) => {
      console.log(data)
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has scheduled an event ${data.title}`)
      }


    })

    //socket function to notify about created event

    this.SocketService.editNotify().subscribe((data) => {
      console.log(data)
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has changed the scheduled event ${data.title}`)
      }

    })

    this.SocketService.deleteNotify().subscribe((data) => {
      console.log(data)
      if (data.userId == Cookie.get('userId')) {
        this.toastr.success(`${data.adminName} has cancelled a scheduled event ${data.title}`)
      }

    })


    this.userId = this._route.snapshot.paramMap.get('userId');
    this.service.getEvents(this.userId).subscribe(data => {
      for (let x of data.data) {
        x.start = startOfDay(new Date(x.start))
        x.start.setHours(x.startHour, x.startMinute)
        x.end = endOfDay(new Date(x.end))
        x.end.setHours(x.endHour, x.endMinute)
        //
        let datam = { userId: this.userId, startHour: x.startHour, startMinute: x.startMinute }
        this.SocketService.alarm(datam)
        //
        x.color = { primary: x.color }
        var startdate = new Date(x.start),
          month = ("0" + (startdate.getMonth() + 1)).slice(-2),
          day = ("0" + startdate.getDate()).slice(-2);
        this.start = [day, month, startdate.getFullYear()].join("-");

        var enddate = new Date(x.end),
          month = ("0" + (enddate.getMonth() + 1)).slice(-2),
          day = ("0" + enddate.getDate()).slice(-2);
        this.end = [day, month, enddate.getFullYear()].join("-");
      }
      this.events = data.data;



    })
  }
  // ng calendar releted functionalities
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();


  activeDayIsOpen: boolean = true;


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

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;

  }






  minDate: Date = subMonths(new Date(), new Date().getMonth());

  maxDate: Date = addMonths(new Date(), 12 - new Date().getMonth());

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

  //end of ng calendar related functionalities

  //start of logout function
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



