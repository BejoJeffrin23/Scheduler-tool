import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../meeting.service';
import{SocketService} from '../socket.service'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
public userName:string
  public details:any
  public p: Number = 1;
  public count: Number = 10;

  constructor(public toastr:ToastrService,public _route: ActivatedRoute, public router: Router, private service:MeetingService,private SocketService:SocketService) { }

  ngOnInit() {
    this.userName=Cookie.get('userName')
    this.service.allUser().subscribe(data=>{
      this.details=data['data']
    })
  }
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
