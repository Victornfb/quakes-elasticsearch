import { Module } from '@nestjs/common';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ElasticsearchModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
