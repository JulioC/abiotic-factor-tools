import fs from 'fs/promises';
import path from 'path';
import { injectable } from 'tsyringe';

@injectable()
export class BaseExporter {
  isWarm = false;

  async run(outputPath: string) {
    if (!this.isWarm) {
      await this.warmUp();
      this.isWarm = true;
    }

    const name = this.getName();
    const data = await this.getData();

    const filename = path.join(outputPath, `${name}.json`);
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Exported ${name} to ${filename}`);
  }

  protected getName(): string {
    throw new Error('getName not implemented!');
  }

  protected async getData(): Promise<unknown> {
    throw new Error('getData not implemented!');
  }

  protected async warmUp() {
    // Implement warm up logic if necessary
  }
}
