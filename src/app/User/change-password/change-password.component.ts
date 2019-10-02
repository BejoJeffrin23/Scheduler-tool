import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MeetingService } from '../../meeting.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public userId: any;
  public password1: any;
  public password: any;
  public issued: any;

  constructor(public toastr: ToastrService, public Service: MeetingService, public _route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('userId');
  }

  public reset = () => {
    if (!this.password1) {
      this.toastr.warning('Enter the new password')
    } else if (!this.password) {
      this.toastr.warning('Confirm the new password')
    } else if (this.password != this.password1) {
      this.toastr.warning('Enter same password in both section')
    }
    else {
      let data = {
        password: this.password,
      }

      this.Service.resetPassword(this.userId, data).subscribe(
        data => {
          this.toastr.success('Password reset successfully .Enter your new password to login')
          this.router.navigate(["/login"])
        })
    }
  }
}
