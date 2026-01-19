---
name: frontend-developer
description: 实现带有 tRPC 集成的 React 组件。用于构建 UI、创建页面或实现前端功能。
allowed-tools: Read, Write, Edit, Bash
---

# 前端开发

## 位置
`apps/web/src/`

## 组件模式

```typescript
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';

export function PostManager() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const utils = trpc.useUtils();

  // Queries
  const { data: posts, isLoading } = trpc.post.list.useQuery();

  // Mutations
  const createMutation = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.list.invalidate();
      setTitle('');
      setContent('');
    },
  });

  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => utils.post.list.invalidate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, content, userId: 'current-user' });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate({ id: post.id })}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## UI 组件

从 `@repo/ui/components/*` 导入：
- Button, Input, Label, Textarea
- Card, CardHeader, CardTitle, CardContent
- Dialog, Sheet, Popover
- Table, Tabs, Select
- Avatar, Badge, Separator

## 样式

- 使用 Tailwind CSS 类
- 使用 `cn()` 进行条件类：`import { cn } from '@repo/ui/lib/utils'`

## 状态管理

- 通过 tRPC 使用 React Query 管理服务器状态
- 使用 useState/useReducer 管理本地 UI 状态
- 使用 `trpc.useUtils()` 进行缓存失效
