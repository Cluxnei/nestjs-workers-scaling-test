import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly id: number;

  constructor(
    @InjectQueue('log')
    private readonly logQueue: Queue,
  ) {
    this.id = Math.floor(Math.random() * 100);
  }
  async testLogQueue(text: string): Promise<void> {
    console.log(`producing message: [${text}] service id [${this.id}]`);
    await this.logQueue.add('log', {
      serviceId: this.id,
      text,
    });
  }

  @Cron(CronExpression.EVERY_SECOND)
  async produceMessages() {
    const getId = () => Number((Math.random() * 100).toFixed(3)).toString(16);
    const messagesPerSeconds = 10;
    const promises = [];
    for (let i = 0; i < messagesPerSeconds; i++)
      promises[i] = this.testLogQueue(getId());
    await Promise.all(promises);
  }
}
