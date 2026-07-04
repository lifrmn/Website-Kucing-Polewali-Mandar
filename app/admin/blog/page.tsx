'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blogService';
import { Button, Badge, EmptyState, LoadingState, PageHeader, Toolbar, Tabs } from '@/components/admin';
import { Plus, Edit, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AppIcon from '@/components/AppIcon';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  category?: string | null;
  is_published: boolean;
  published_at?: Date | string | null;
  created_at: Date | string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    filterPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, posts]);

  const loadPosts = async () => {
    setLoading(true);
    const response = await blogService.getAllPosts();
    if (response.success && response.data) {
      setPosts(response.data);
      setFilteredPosts(response.data);
    }
    setLoading(false);
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => 
        statusFilter === 'published' ? post.is_published : !post.is_published
      );
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    const response = await blogService.deletePost(id);
    if (response.success) {
      loadPosts();
    } else {
      alert(response.error || 'Gagal menghapus artikel');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const response = await blogService.updatePost(id, {
      is_published: !currentStatus,
    });

    if (response.success) {
      loadPosts();
    } else {
      alert(response.error || 'Gagal mengubah status publikasi');
    }
  };

  const statusTabs = [
    { id: 'all', label: 'Semua', count: posts.length },
    { id: 'published', label: 'Dipublikasi', count: posts.filter(p => p.is_published).length },
    { id: 'draft', label: 'Draft', count: posts.filter(p => !p.is_published).length },
  ];

  if (loading) {
    return <LoadingState message="Memuat artikel..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Blog"
        subtitle={`Kelola artikel dan konten blog · ${posts.length} total artikel`}
        actions={
          <Button onClick={() => router.push('/admin/blog/new')} size="lg">
            <AppIcon icon={Plus} size="sm" />
            Tulis Artikel
          </Button>
        }
      />

      {/* Tabs & Search */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <Tabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onChange={(tabId) => setStatusFilter(tabId as 'all' | 'published' | 'draft')}
        />
        <div className="p-4 border-t border-border">
          <Toolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Cari judul atau kategori artikel..."
            filters={[]}
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          />
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border">
          <EmptyState
            icon={BookOpen}
            title={searchQuery || statusFilter !== 'all' ? 'Artikel tidak ditemukan' : 'Belum ada artikel'}
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Coba sesuaikan filter atau kata kunci pencarian Anda'
                : 'Mulai berbagi pengetahuan dengan menulis artikel pertama Anda'
            }
            action={
              searchQuery || statusFilter !== 'all'
                ? undefined
                : {
                    label: 'Tulis Artikel',
                    onClick: () => router.push('/admin/blog/new'),
                  }
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-surface rounded-lg border border-border hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex gap-4">
                  {post.featured_image && (
                    <div className="w-32 h-24 relative flex-shrink-0 rounded-lg overflow-hidden bg-surface2">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-text mb-1 line-clamp-1">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                      <Badge variant={post.is_published ? 'success' : 'muted'} size="sm">
                        {post.is_published ? 'Dipublikasi' : 'Draft'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted">
                      {post.category && (
                        <Badge size="sm">{post.category}</Badge>
                      )}
                      <span>{formatDate(new Date(post.created_at))}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                      >
                        <AppIcon icon={Edit} size="sm" />
                        <span className="leading-none">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(post.id, post.is_published)}
                      >
                        {post.is_published ? (
                          <>
                            <AppIcon icon={EyeOff} size="sm" />
                            <span className="leading-none">Sembunyikan</span>
                          </>
                        ) : (
                          <>
                            <AppIcon icon={Eye} size="sm" />
                            <span className="leading-none">Publikasikan</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                      >
                        <AppIcon icon={Trash2} size="sm" className="text-danger" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
