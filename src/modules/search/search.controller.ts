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

  @Post()
  @ApiOperation({ summary: 'Create a document' })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created.',
  })
  async createDocument(@Body() document: any) {
    await this.searchService.createDocument(document);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create a batch of documents' })
  @ApiResponse({
    status: 201,
    description: 'The documents has been successfully created.',
  })
  async createDocumentsInBatch(@Body() documents: any[]) {
    await this.searchService.createDocumentsInBatch(documents);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a batch of documents by file' })
  @ApiResponse({
    status: 201,
    description: 'The documents has been successfully created.',
  })
  async createDocumentsByFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.searchService.createDocumentsByFile(file);
  }

  @Get(':index')
  @ApiOperation({ summary: 'Search documents' })
  @ApiResponse({ status: 200, description: 'The documents were found.' })
  async searchDocuments(@Param('index') index: string, @Body() query: any) {
    return await this.searchService.searchDocuments(index, query);
  }
}
