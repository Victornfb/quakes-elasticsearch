import { Injectable } from '@nestjs/common';
import { Client } from 'elasticsearch';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({ host: 'http://localhost:9200' });
  }

  async search(index: string, search: any) {
    const result = await this.client.search({
      index,
      body: search,
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  async create(index: string, id: any = null, document: any) {
    try {
      return await this.client.create({
        index,
        type: '_doc',
        id: id || uuidv4(),
        body: document,
      });
    } catch (err) {
      return;
    }
  }

  async update(index: string, id: string, document: any) {
    return await this.client.update({
      index,
      id,
      type: '_doc',
      body: {
        doc: document,
      },
    });
  }

  async delete(index: string, id: string) {
    return await this.client.delete({
      index,
      type: '_doc',
      id,
    });
  }
}
