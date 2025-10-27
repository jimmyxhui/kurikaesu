import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TimerComponent extends Component {
  @service notification;

  @tracked minutes = 1;
  @tracked seconds = 0;
  @tracked remainingSeconds = 0;
  @tracked totalSeconds = 0;
  @tracked isRunning = false;
  @tracked isPaused = false;
  @tracked status = 'Set time and click Start';
  @tracked showPermissionNotice = false;

  intervalId = null;

  constructor() {
    super(...arguments);
    this.notification.requestPermission();
  }

  get formattedTime() {
    const mins = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const secs = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  @action
  updateMinutes(event) {
    const value = parseInt(event.target.value) || 0;
    if (value >= 0 && value <= 59) {
      this.minutes = value;
    }
  }

  @action
  updateSeconds(event) {
    const value = parseInt(event.target.value) || 0;
    if (value >= 0 && value <= 59) {
      this.seconds = value;
    }
  }

  @action
  startTimer() {
    if (this.isRunning) return;

    const total = this.minutes * 60 + this.seconds;
    if (total <= 0) {
      this.status = 'Please set a valid time!';
      return;
    }

    if (!this.isPaused) {
      this.totalSeconds = total;
      this.remainingSeconds = total;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.status = 'Timer running...';

    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        this.notification.trigger();
        this.remainingSeconds = this.totalSeconds; // Repeat
      }
    }, 1000);
  }

  @action
  pauseTimer() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.isPaused = true;
    this.status = 'Timer paused.';
  }

  @action
  resetTimer() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.isPaused = false;
    this.remainingSeconds = 0;
    this.status = 'Set time and click Start';
  }
}
