import type { GetQueryParams } from "@/core/base/base-get.schema";

import { Resource, Action } from "@/generated/prisma";

import { type EstimateDto, type UpsertEstimateData } from "./estimate.schema";

import { BaseRepository } from "@/core/base/base-repository";
import { Transaction } from "@/core/decorators/transaction.decorator";

const estimateSelect = {
  id: true,
  number: true,
  status: true,
  dueDate: true,
  taxPercent: true,
  subtotal: true,
  grandTotal: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  contact: { select: { id: true, firstName: true, lastName: true, emails: true } },
  deal: { select: { id: true, name: true } },
  lineItems: {
    orderBy: { sortOrder: "asc" as const },
    select: { id: true, description: true, quantity: true, unitPrice: true, total: true, sortOrder: true },
  },
} as const;

function mapToDto(row: any): EstimateDto {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    dueDate: row.dueDate,
    taxPercent: row.taxPercent,
    subtotal: row.subtotal,
    grandTotal: row.grandTotal,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    contact: row.contact,
    deal: row.deal,
    lineItems: row.lineItems,
  };
}

function computeTotals(lineItems: { quantity: number; unitPrice: number }[], taxPercent: number) {
  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
  const grandTotal = subtotal * (1 + taxPercent / 100);
  return { subtotal, grandTotal };
}

export class PrismaEstimateRepo extends BaseRepository {
  private get companyWhere() {
    return { companyId: this.user.companyId };
  }

  private canManage() {
    return (
      this.hasPermission(Resource.estimates, Action.create) ||
      this.hasPermission(Resource.estimates, Action.update) ||
      this.hasPermission(Resource.estimates, Action.delete) ||
      this.hasPermission(Resource.estimates, Action.readAll)
    );
  }

  async getAll(params?: GetQueryParams): Promise<{ items: EstimateDto[]; total: number }> {
    const { companyId } = this.user;
    const skip = params?.pagination ? (params.pagination.page - 1) * params.pagination.pageSize : undefined;
    const take = params?.pagination?.pageSize;

    const [rows, total] = await Promise.all([
      this.prisma.estimate.findMany({
        where: { companyId },
        select: estimateSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.estimate.count({ where: { companyId } }),
    ]);

    return { items: rows.map(mapToDto), total };
  }

  async getById(id: string): Promise<EstimateDto | null> {
    const { companyId } = this.user;
    const row = await this.prisma.estimate.findFirst({
      where: { id, companyId },
      select: estimateSelect,
    });
    return row ? mapToDto(row) : null;
  }

  @Transaction
  async upsert(data: UpsertEstimateData): Promise<EstimateDto> {
    const { companyId } = this.user;
    const { id, lineItems, taxPercent, ...rest } = data;

    const itemsWithTotals = (lineItems ?? []).map((li, idx) => ({
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      total: li.quantity * li.unitPrice,
      sortOrder: li.sortOrder ?? idx,
    }));

    const { subtotal, grandTotal } = computeTotals(itemsWithTotals, taxPercent ?? 0);

    if (id) {
      const row = await this.prisma.estimate.update({
        where: { id, companyId },
        data: {
          ...rest,
          taxPercent: taxPercent ?? 0,
          subtotal,
          grandTotal,
          lineItems: { deleteMany: {}, create: itemsWithTotals },
        },
        select: estimateSelect,
      });
      return mapToDto(row);
    }

    const maxRecord = await this.prisma.estimate.findFirst({
      where: { companyId },
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const number = (maxRecord?.number ?? 0) + 1;

    const row = await this.prisma.estimate.create({
      data: {
        companyId,
        number,
        ...rest,
        taxPercent: taxPercent ?? 0,
        subtotal,
        grandTotal,
        lineItems: { create: itemsWithTotals },
      },
      select: estimateSelect,
    });
    return mapToDto(row);
  }

  @Transaction
  async delete(id: string): Promise<EstimateDto> {
    const { companyId } = this.user;
    const row = await this.prisma.estimate.findFirstOrThrow({
      where: { id, companyId },
      select: estimateSelect,
    });
    await this.prisma.estimate.delete({ where: { id } });
    return mapToDto(row);
  }

  async findIds(ids: Set<string>): Promise<Set<string>> {
    if (ids.size === 0) return new Set();
    const { companyId } = this.user;
    const rows = await this.prisma.estimate.findMany({
      where: { id: { in: Array.from(ids) }, companyId },
      select: { id: true },
    });
    return new Set(rows.map((r) => r.id));
  }
}
