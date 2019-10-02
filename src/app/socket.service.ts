import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url ="http://ec2-13-234-217-245.ap-south-1.compute.amazonaws.com"
  //'http://localhost:4001';
public socket;


  constructor() { 
    this.socket=io(this.url)

  }

  public verifyUser=(authToken)=>{
    this.socket.emit('set-user', authToken);

    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
        observer.next(data)
      })
    })
  }

  public disconnect=()=>{
    return Observable.create((observer)=>{
     this.socket.emit('disconnect',()=>{
       observer.next()
     
     })})
   }
 
  public exitSocket = () =>{
         this.socket.disconnect();
  }

  public eventCreated=(Adminname,userId,title)=>{
    this.socket.emit('event-created',Adminname,userId,title)
  }
  
  public createNotify=()=>{
    return Observable.create((observer)=>{
      this.socket.on('event-created-notification',(data)=>{
        observer.next(data)
      })
    })
    }
  
    public eventEdited=(Adminname,userId,title)=>{
      console.log(Adminname)
      this.socket.emit('event-edited',Adminname,userId,title)
    }
    
    public editNotify=()=>{
      return Observable.create((observer)=>{
        this.socket.on('event-edited-notification',(data)=>{
          observer.next(data)
        })
      })
      }

      public eventdeleted=(Adminname,userId,title)=>{
        this.socket.emit('event-deleted',Adminname,userId,title)
      }
      
      public deleteNotify=()=>{
        return Observable.create((observer)=>{
          this.socket.on('event-deleted-notification',(data)=>{
            observer.next(data)
          })
        })
        }
        
        public alarm=(data)=>{
          this.socket.emit('alarm',data)
        }

        public alarmNotify=()=>{
          return Observable.create((observer)=>{
            this.socket.on('alarm-notification',(data)=>{
              observer.next(data)
            })
          })
          }
        
      }
