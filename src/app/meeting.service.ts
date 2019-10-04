import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
//for localhost
 private url = 'http://localhost:4001/api/v1/users';

 //for aws
//private url ="/api/v1/users"

  constructor(
    public http: HttpClient
  ) { }

  //function to get data from cookies
  public getUserInfoInLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  //function to save data from cookies
  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  //start of signup function
  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/login`, params);
  } // end of signinFunction function.

  //start of sign up function
  public signupFunction(data): Observable<any> {
    console.log(data)
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('userName', data.userName)
      .set('isAdmin', data.isAdmin)
      .set('country',data.country)

    return this.http.post(`${this.url}/signup`, params);

  } // end of signupFunction function.

  //start of log out function
  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'));

    return this.http.post(`${this.url}/logout?authToken=${Cookie.get('authToken')}`, params);

  } // end logout function

//fetch all users
  public allUser(): any {
    return this.http.get(`${this.url}/allUsers?authToken=${Cookie.get('authToken')}`)
  }

//send mail to reset password
  public sendMail(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)

    return this.http.post(`${this.url}/reset`, params);
  }

//reset password
  public resetPassword(userId, data): Observable<any> {
    const params = new HttpParams()
      .set('password', data.password)

    return this.http.post(`${this.url}/${userId}/change`, params);
  }

//create new event function
  public create(data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('start', data.start)
      .set('startHour', data.startHour)
      .set('startMinute', data.startMinute)
      .set('end', data.end)
      .set('endHour', data.endHour)
      .set('endMinute', data.endMinute)
      .set('creatorId', data.creatorId)
      .set('creatorName', data.creatorName)
      .set('userId', data.userId)
      .set('color', data.color)
      .set('adminId', data.adminId)
      .set('adminName', data.adminName)
      .set('purpose', data.purpose)
      .set('location', data.location)

    return this.http.post(`${this.url}/create?authToken=${Cookie.get('authToken')}`, params);

  } // end of signupFunction function.

//function to fetch single event
  public getSingleEvent(eventId): any {
    return this.http.get(`${this.url}/${eventId}/viewevent?authToken=${Cookie.get('authToken')}`, eventId)

  }

//function to fetch all events of user
  public getEvents(userId): any {
    return this.http.get(`${this.url}/${userId}/view?authToken=${Cookie.get('authToken')}`, userId)

  }

//edit the event
  public edit(data, eventId) {

    return this.http.put(`${this.url}/${eventId}/edit?authToken=${Cookie.get('authToken')}`, data);

  } 

//delete the event
  public delete(eventId) {

    return this.http.post(`${this.url}/${eventId}/delete?authToken=${Cookie.get('authToken')}`, eventId);
  }
}