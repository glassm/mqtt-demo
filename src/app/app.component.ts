import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private client;

  mqttbroker = '200.200.0.164';
  temp: number;
  humidity: number;
  time: string;

  constructor() { }

  ngOnInit(): void {
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8083), '');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});
  }

  ngOnDestroy(): void {
  }

  public onConnect(): void {
    console.log('onConnect');
    this.client.subscribe('pi4');
  }

  public onConnectionLost(responseObject): void {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  public onMessageArrived(message): void  {
    console.log('onMessageArrived: ' + message.destinationName + ': ' + message.payloadString);
    const dhtData = JSON.parse(message.payloadString);
    if (message.destinationName.indexOf('pi4') !== -1) {
      this.time = dhtData.time;
      this.temp = +dhtData.temp;
      this.humidity = +dhtData.humidity;
    }

  }
}

