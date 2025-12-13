import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPartnerRepository } from '../domain/Ipartner.repository';
import { Partner } from '../domain/partner.entity';
import { ActivityService } from '../../activity/app/activity.service';
import { ActivityType } from '@prisma/client';
import { deleteUploadedFile } from '../../../common/utils/file.utils';

@Injectable()
export class PartnerService {
  constructor(
    @Inject('IPartnerRepository')
    private readonly partnerRepo: IPartnerRepository,
    private readonly activityService: ActivityService,
  ) {}

  // Get one Partner by ID
  async getById(id: string): Promise<Partner> {
    const partner = await this.partnerRepo.findById(id);
    if (!partner)
      throw new NotFoundException(`Partner with ID ${id} not found`);
    return partner;
  }

  // Get all Partners
  async getAll(): Promise<Partner[]> {
    return this.partnerRepo.findAll();
  }

  // Create a new Partner
  async create(partner: Partner): Promise<Partner> {
    const created = await this.partnerRepo.create(partner);

    // Record activity
    await this.activityService.recordActivity(
      ActivityType.PARTNER_ADDED,
      `Nouveau partenire : ${created.companyName}`,
    );

    return created;
  }
  // Update an existing Partner
  async update(partner: Partner): Promise<Partner> {
    const existing = await this.partnerRepo.findById(partner.id);
    if (!existing)
      throw new NotFoundException(`Partner with ID ${partner.id} not found`);
    return this.partnerRepo.update(partner);
  }

  // Delete a Partner
  async delete(id: string): Promise<void> {
    const existing = await this.partnerRepo.findById(id);
    if (!existing)
      throw new NotFoundException(`Partner with ID ${id} not found`);
    await deleteUploadedFile(existing.logoUrl);
    return this.partnerRepo.delete(id);
  }
}
