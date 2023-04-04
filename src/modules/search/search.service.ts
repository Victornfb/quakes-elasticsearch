import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

interface Quake {
  place: string;
  time: number;
  tz: any;
  url: string;
  detail: string;
  felt: any;
  cdi: any;
  alert: any;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  sources: string;
  nst: any;
  dmin: any;
  rms: number;
  mag: number;
  magType: string;
  type: string;
}

interface IResponse {
  features: {
    id: string;
    type: string;
    geometry: {
      coordinates: number[];
      type: string;
    };
    properties: Quake;
  }[];
}

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ingestData(): Promise<void> {
    let response: IResponse;
    try {
      response = (
        await axios.get(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
          {
            headers: {
              'Content-Type': ['application/json', 'charset=utf-8'],
            },
          },
        )
      ).data;
    } catch (err) {
      throw new UnprocessableEntityException(
        'Error while ingesting earthquakes data',
      );
    }

    const results = response.features;

    results.map(async (result) => {
      const quake: Quake = result.properties;
      const [longitude, latitude, depth] = result.geometry.coordinates;

      const quakeObject = {
        ...quake,
        longitude,
        latitude,
        depth,
      };

      await this.elasticsearchService.create(
        'earthquakes',
        result.id,
        quakeObject,
      );
    });

    return;
  }

  async createDocument(document: any) {
    return await this.elasticsearchService.create(
      'earthquakes',
      null,
      document,
    );
  }

  async searchDocuments(index: string, search: any) {
    return await this.elasticsearchService.search(index, search);
  }
}
