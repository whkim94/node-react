import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsufficientPermissionsException } from '../common/exceptions';

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, options: PaginationOptions) {
    const { page, limit, sortBy, order } = options;

    // Ensure limit is a valid number
    const validLimit = Math.max(1, limit);

    // Calculate skip value for pagination
    const skip = (page - 1) * validLimit;

    // Get total count for pagination metadata
    const total = await this.prisma.invoice.count({
      where: { userId },
    });

    // Get paginated invoices
    const invoices = await this.prisma.invoice.findMany({
      where: { userId },
      skip,
      take: validLimit,
      orderBy: { [sortBy]: order },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / validLimit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit: validLimit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      // The PrismaExceptionFilter will catch and transform any Prisma.PrismaClientKnownRequestError
      // with code P2025 into a standardized 404 response
      throw new Error(`Invoice with ID ${id} not found`);
    }

    if (invoice.userId !== userId) {
      throw new InsufficientPermissionsException('invoice');
    }

    return invoice;
  }
}
