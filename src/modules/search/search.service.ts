import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createDocument(document: any) {
    return await this.elasticsearchService.create('my_index', document);
  }

  async createDocumentsInBatch(documents: any[]) {
    const result = [];
    for (const document of documents) {
      result.push(await this.elasticsearchService.create('my_index', document));
    }
    return result;
  }

  async createDocumentsByFile(file: Express.Multer.File) {
    const result = [];
    let isFirstRowResolved = false;

    await new Promise<string[]>((resolve, reject) => {
      const parser = parse(file.buffer, {
        delimiter: [','],
      });

      parser.on('data', async (row) => {
        if (!isFirstRowResolved) isFirstRowResolved = true;
        result.push(
          await this.elasticsearchService.create('nyc_traffic_accidents', row),
        );
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', () => {
        if (!isFirstRowResolved) {
          reject(new BadRequestException('No rows were found in the file.'));
        }
      });
    });

    return result;
  }

  async searchDocuments(index: string, query: any) {
    return await this.elasticsearchService.search(index, query);
  }
}
