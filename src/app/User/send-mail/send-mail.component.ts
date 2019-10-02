import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MeetingService } from '../../meeting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {
  public email: String;
  constructor(public service: MeetingService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }
  //function to send mail
  public sendMail: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else {
      let data = {
        email: this.email,
      }
      this.service.sendMail(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Link to change password sent to your mail successfully')
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(apiResponse.message)
          }

        }, (err) => {
          this.toastr.warning('some error occured')

        });

    } // end condition

  } // end of sendmail Function
}
