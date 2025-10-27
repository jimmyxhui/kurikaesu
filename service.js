import Service from '@ember/service';

export default class NotificationService extends Service {
  hasPermission = false;

  // Request permission on service creation
  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        this.hasPermission = permission === 'granted';
      });
    } else {
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  // Trigger a desktop notification
  trigger() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Timer Finished!', {
        body: 'Your timer has completed.',
        icon: '/assets/icons/timer-icon.png', // Optional: add an icon in public/
        tag: 'timer-complete',
        requireInteraction: true
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.trigger();
        }
      });
    }
  }
}
