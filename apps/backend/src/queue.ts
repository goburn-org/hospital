import Queue from 'bull';

type Names = 'order-creation-sub-task';

export type QueueParam = {
  name: Names;
  message: Record<string, any>;
};
class QueueService {
  private queues: Record<string, Queue.Queue> = {};
  public queue = new Queue('default');

  add(param: QueueParam) {
    this.queue.add(param);
  }
}

export const queueService = new QueueService();
