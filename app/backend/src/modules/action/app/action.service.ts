import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IActionRepository } from '../domain/Iaction.repository';
import { Action } from '../domain/action.entity';
import { ActivityService } from '../../activity/app/activity.service';
import { ActivityType } from '@prisma/client';
import { deleteUploadedFile } from '../../../common/utils/file.utils';

@Injectable()
export class ActionService {
  constructor(
    @Inject('IActionRepository')
    private readonly actionRepo: IActionRepository,
    private readonly activityService: ActivityService,
  ) {}

  // Get by id
  async getById(id: string): Promise<Action> {
    const action = await this.actionRepo.findById(id);
    if (!action) throw new NotFoundException(`Action ${id} not found`);
    return action;
  }

  async getAll(params?: {
    limit?: number;
    published?: boolean;
  }): Promise<Action[]> {
    return this.actionRepo.findAll(params);
  }

  async create(action: Action): Promise<Action> {
    const created = await this.actionRepo.create(action);

    // record activity
    await this.activityService.recordActivity(
      ActivityType.ACTION_PUBLISHED,
      `Nouvelle prestation publié : ${created.title}`,
    );

    return created;
  }

  async update(action: Action): Promise<Action> {
    const existing = await this.actionRepo.findById(action.id);
    if (!existing) throw new NotFoundException(`Action ${action.id} not found`);
    return this.actionRepo.update(action);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.actionRepo.findById(id);
    if (!existing) throw new NotFoundException(`Action ${id} not found`);
    await deleteUploadedFile(existing.imageUrl);
    return this.actionRepo.delete(id);
  }

  async publish(id: string): Promise<Action> {
    const action = await this.actionRepo.findById(id);
    if (!action) throw new NotFoundException(`Action ${id} not found`);
    return this.actionRepo.publish(action);
  }

  async unpublish(id: string): Promise<Action> {
    const action = await this.actionRepo.findById(id);
    if (!action) throw new NotFoundException(`Action ${id} not found`);
    return this.actionRepo.unpublish(action);
  }
}
