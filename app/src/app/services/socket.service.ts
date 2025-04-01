import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = inject(Socket);
  private connectedPeopleInRoom: string[] = []
  public get connectedPeople() {
    return this.connectedPeopleInRoom;
  }

  constructor() {
    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
  }

  private test() {
    console.log('Test function called');
    this.createRoom()
      .then((roomId: string) => {
        console.log(`Room created with ID: ${roomId}`);
      }).catch((error: string) => {
        console.error(`Error creating room: ${error}`);
      });
  }

  private onConnect() {
    console.log('Socket connected');

    this.test();
  }

  private onDisconnect(reason: string) {
    console.log(`Socket disconnected due to ${reason}`);
  }

  public createRoom() {
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('createRoom', (roomId: string) => {
        if (roomId) {
          console.log(`Room created with ID: ${roomId}`);
          resolve(roomId);
        } else {
          reject('Failed to create room');
        }
      });
    });
  }
}
