import {AfterViewInit, Component, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {TimerComponent} from '../timer/timer.component';
import {Timer} from '../models/timer.model';
import {Subscription} from 'rxjs';
import {Clock} from '../models/clock.model';
import {HeartbeatService} from '../services/heartbeat.service';
import {OptionsService} from '../services/options.service';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.sass']
})
export class ClockComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(TimerComponent)
  timerComponents: TimerComponent[];

  private done: Subscription;

  public clock: Clock = {name: 'Vrijmibo', target: {weekday: 5, hour: 16, minute: 0, second: 0}, active: true};

  timers: Timer[] = [
    {title: 'dagen', max: 7, color: '#d86b6b', heartbeat: this.heartbeatService.dayHeartbeat},
    {title: 'uren', max: 24, color: '#ecefcb', heartbeat: this.heartbeatService.hourHeartbeat},
    {title: 'minuten', max: 60, color: '#acc742', heartbeat: this.heartbeatService.minHeartbeat},
    {title: 'seconden', max: 60, color: '#7895d5', heartbeat: this.heartbeatService.secHeartbeat}
  ];

  constructor(private heartbeatService: HeartbeatService, private optionsService: OptionsService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.startClock();
  }

  ngOnDestroy(): void {
    this.done.unsubscribe();
  }

  private finished(): void {
    this.stopClock();
    this.soundAlarm();
  }

  private soundAlarm(): void {
    const audio: HTMLAudioElement = new Audio();
    audio.src = '/assets/sound/Air-Horn-Sound-Effect.mp3';
    audio.load();
    audio.play();
  }

  public startClock(): void {
    this.done = this.heartbeatService.doneEvent.subscribe(() => this.finished());
    this.heartbeatService.start(this.clock.target);
    this.optionsService.currentClock.subscribe(clock => {
      this.heartbeatService.start(clock.target);
      this.timerComponents.forEach(timer => timer.run());
    });
  }

  public stopClock(): void {
    this.timerComponents.forEach(timer => timer.stop());
  }

}
