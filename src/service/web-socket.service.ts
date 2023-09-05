import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket;
  private serverUrl: string = environment.domainName; // Update this to your WebSocket server URL
  constructor() {

    console.log(this.serverUrl)

    
  }

  connect(): void {
    this.socket = io(`${this.serverUrl}`); // Connect to the server
  }

  onData(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('data', (data) => {
        observer.next(data);
      });
    });
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    }
  }

  onDisconnect(): Observable<void> {
    return new Observable<void>((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });
    });
  }
}
