import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('ingest')
  @ApiOperation({ summary: 'Create a document' })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created.',
  })
  async ingestData() {
    return await this.searchService.ingestData();
  }

  @Post('document')
  @ApiOperation({ summary: 'Create a document' })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created.',
  })
  async createDocument(@Body() document: any) {
    await this.searchService.createDocument(document);
  }

  @Get(':index')
  @ApiOperation({ summary: 'Search documents' })
  @ApiResponse({ status: 200, description: 'The documents were found.' })
  async searchDocuments(@Param('index') index: string, @Body() query: any) {
    return await this.searchService.searchDocuments(index, query);
  }
}
