import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IBlogRepository } from '../domain/Iblog.repository';
import { Blog } from '../domain/blog.entity';
import { MediaType } from '../domain/blog.entity';
import { UpdateBlogDto } from '../interface/dto/update-blog.dto';
import { ActivityService } from '../../activity/app/activity.service';
import { ActivityType } from '@prisma/client';
import { deleteUploadedFile } from '../../../common/utils/file.utils';

@Injectable()
export class BlogService {
  constructor(
    @Inject('IBlogRepository') private readonly blogRepo: IBlogRepository,
    private readonly activityService: ActivityService,
  ) {}

  async getById(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) throw new NotFoundException(`Blog ${id} not found`);
    return blog;
  }

  async getBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepo.findBySlug(slug);
    if (!blog) throw new NotFoundException(`Blog ${slug} not found`);
    return blog;
  }

  async getLatest(limit: number): Promise<Blog[]> {
    return this.blogRepo.findLatest(limit);
  }

  async getPublishedLatest(limit: number): Promise<Blog[]> {
    return this.blogRepo.findLatest(limit, true);
  }

  async create(blog: Blog): Promise<Blog> {
    const created = await this.blogRepo.create(blog);

    // activity record
    await this.activityService.recordActivity(
      ActivityType.BLOG_PUBLISHED,
      `Nouvel article publié : ${created.title}`,
    );

    return created;
  }

  async updateById(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepo.findById(id);
    if (!blog) throw new NotFoundException(`Blog ${id} not found`);

    if (dto.title) blog.updateTitle(dto.title);
    if (dto.content) blog.updateContent(dto.content);
    if (dto.coverImageUrl) blog.setCoverImage(dto.coverImageUrl);
    if (dto.mediaUrl && dto.mediaType) {
      if (!Object.values(MediaType).includes(dto.mediaType)) {
        throw new Error(`Type de média invalide : ${dto.mediaType}`);
      }
      blog.attachMedia(dto.mediaUrl, dto.mediaType);
    }

    if (dto.published !== undefined) blog.setPublished(dto.published);

    return this.blogRepo.update(blog);
  }

  async update(blog: Blog): Promise<Blog> {
    const existing = await this.blogRepo.findById(blog.id);
    if (!existing) throw new NotFoundException(`Blog ${blog.id} not found`);
    return this.blogRepo.update(blog);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.blogRepo.findById(id);
    if (!existing) throw new NotFoundException(`Blog ${id} not found`);
    const filesToDelete = [existing.mediaUrl, existing.coverImageUrl];
    await Promise.all(filesToDelete.map((file) => deleteUploadedFile(file)));
    return this.blogRepo.delete(id);
  }
}
