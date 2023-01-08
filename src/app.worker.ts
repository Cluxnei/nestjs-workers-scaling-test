import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('log')
export class AppWorker {
  @Process('log')
  async log(
    job: Job<{
      serviceId: number;
      text: string;
    }>,
  ): Promise<void> {
    console.log(job.data);
  }
}
