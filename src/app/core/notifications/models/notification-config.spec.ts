import { NotificationColor } from './notification-color';
import { NotificationConfig } from './notification-config';

describe('NotificationConfig', () => {
  it('should create an empty instance', () => {
    expect(new NotificationConfig()).toBeTruthy();
  });

  it('should create full instance', () => {
    const config = new NotificationConfig();
    const message = 'TestMessage';
    const duration = 3000;

    config
      .setMessage(message)
      .setDuration(duration)
      .setColor(NotificationColor.PURPLE)
      .setPosition({ vertical: 'top', horizontal: 'left' });

    expect(config.getMessage()).toEqual(message);
    expect(config.getDuration()).toEqual(duration);
    expect(config.getColor()).toEqual(NotificationColor.PURPLE);
    expect(config.getPosition()).toEqual({
      vertical: 'top',
      horizontal: 'left',
    });
  });
});
