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

  async searchDocuments(index: string, search: any) {
    return await this.elasticsearchService.search(index, search);
  }
}
