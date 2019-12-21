import {
  IChannelsRepository,
  IPlayCommercialOptions,
  IFollowersOnlyOptions,
  IMarkerOptions,
  TTargetedCommand,
} from './types';
import {ESignal, TChannel} from '../types';

import Socket from '../Socket';
import SharedRepository from '../SharedRepository';

class ChannelsRepository extends SharedRepository<TChannel>
  implements IChannelsRepository {
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    super();
    this.socket = socket;
  }

  public join = (channel: TChannel) => {
    this.socket.send(`${ESignal.Join} #${channel}`);
  };

  public say = (message: string, channel?: TChannel) => {
    if (!channel && !this.assignedPlace) {
      throw new Error(
        'Cannot send message due to channel is not ' +
        'passed. Use assign() to assign channel to client, or pass ' +
        'channel directly',
      );
    }
    const targetChannel = channel || this.assignedPlace;
    this.socket.send(`${ESignal.Message} #${targetChannel} :${message}`);
  };

  public followersOnly = {
    ...this.createModeController('/followers'),
    enable: (options: IFollowersOnlyOptions = {}) => {
      const {duration, channel} = options;
      const message = '/followers' + (duration ? ` ${duration}` : '');

      this.say(message, channel);
    },
  };

  public deleteMessage = (id: string, channel?: TChannel) => {
    this.say(`/delete ${id}`, channel);
  };

  public playCommercial = (options: IPlayCommercialOptions = {}) => {
    const {duration, channel} = options;

    if (duration && duration < 0) {
      throw new Error('Duration must be more than 0');
    }

    const message = '/commercial' + (duration ? ` ${duration}` : '');
    this.say(message, channel);
  };

  public host: TTargetedCommand = (targetChannel, channel?) => {
    this.say(`/host ${targetChannel}`, channel);
  };
  public unhost = this.createChannelCommand('/unhost');

  public raid: TTargetedCommand = (targetChannel, channel?) => {
    this.say(`/raid ${targetChannel}`, channel);
  };
  public unraid = this.createChannelCommand('/unraid');

  public marker = (options: IMarkerOptions = {}) => {
    const {comment, channel} = options;

    const message = '/marker' + (comment ? ` ${comment}` : '');
    this.say(message, channel);
  };

  public mod = this.createUserCommand('/mod');
  public unmod = this.createUserCommand('/unmod');

  public vip = this.createUserCommand('/vip');
  public unvip = this.createUserCommand('/unvip');
}

export default ChannelsRepository;