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
import { GetInvoicesDto } from './dto/get-invoices.dto';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Query() queryParams: GetInvoicesDto,
  ) {
    return this.invoicesService.findAll(req.user.userId, queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.invoicesService.findOne(id, req.user.userId);
  }
}
