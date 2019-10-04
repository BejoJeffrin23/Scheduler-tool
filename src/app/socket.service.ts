import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
//for aws 
 private url ="http://13.234.217.245:4001"

 //for localhost
 // private url='http://localhost:4001';
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
        
        //public alarm=(data)=>{
       //   this.socket.emit('alarm',data)
       // }

        public alarm=()=>{
          return Observable.create((observer)=>{
            this.socket.on('alarm',(data)=>{
              observer.next(data)
            })
          })
          }
       public alarmnotify=(Adminname,userId,title)=>{
            this.socket.emit('alarm-notify',Adminname,userId,title)
          }
        
      }
