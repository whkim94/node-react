import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order = 'desc',
  ) {
    return this.invoicesService.findAll(req.user.userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sortBy,
      order: order.toLowerCase() === 'asc' ? 'asc' : 'desc',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user.userId);
  }
}
