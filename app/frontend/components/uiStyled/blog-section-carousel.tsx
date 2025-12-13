'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useBlogs } from '@/lib/hooks/useBlogs';

export default function BlogSectionCarousel() {
  const { blogs, loading, error } = useBlogs(5);

  if (loading) return <p className="text-center py-20">Chargement des blogs...</p>;
  if (error)
    return (
      <p className="text-center py-20 text-red-500">
        Impossible de charger les blogs : {error}
      </p>
    );
  if (blogs.length === 0)
    return <p className="text-center py-20">Aucun blog disponible.</p>;

  return (
    <section id="blogs" className="py-20 bg-[var(--color-bg-alt)] text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-12">
        Nos Blogs
      </h2>
      <div className="flex justify-center">
        <Carousel className="w-full max-w-2xl">
          <CarouselContent>
            {blogs.map((blog) => (
              <CarouselItem key={blog.id}>
                <div className="p-4">
                  <Card className="bg-[var(--color-surface)] shadow-md rounded-2xl overflow-hidden">
                    {blog.imageUrl && (
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-[var(--color-text-light)]">{blog.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-[var(--color-primary)]" />
          <CarouselNext className="text-[var(--color-primary)]" />
        </Carousel>
      </div>
    </section>
  );
}
