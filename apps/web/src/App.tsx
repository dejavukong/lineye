import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Activity, Mail, Plus, Trash2, User, Users, Zap } from 'lucide-react';

import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Separator } from '@repo/ui/components/separator';

import { getTRPCClient, trpc } from './lib/trpc';

function AppContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const healthQuery = trpc.health.useQuery();
  const usersQuery = trpc.user.list.useQuery();
  const createUserMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      setName('');
      setEmail('');
    },
  });
  const deleteUserMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      createUserMutation.mutate({ name, email });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Full-stack Starter</h1>
              <p className="text-xs text-muted-foreground">
                Vite + React + Fastify + tRPC
              </p>
            </div>
          </div>
          {healthQuery.data?.status === 'ok' ? (
            <Badge variant="outline" className="gap-1.5 text-green-600">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              API Online
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-muted-foreground" />
              Connecting...
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* API Health Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">System Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {healthQuery.isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    <span className="text-sm">Checking connection...</span>
                  </div>
                ) : healthQuery.error ? (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    Connection failed: {healthQuery.error.message}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        API Status
                      </span>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                        {healthQuery.data?.status}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Check
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          healthQuery.data?.timestamp ?? '',
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create User Form */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">Add New User</CardTitle>
                </div>
                <CardDescription>
                  Create a new user in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" />
                        Create User
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User List */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">User Directory</CardTitle>
                </div>
                {usersQuery.data && usersQuery.data.length > 0 && (
                  <Badge variant="secondary">
                    {usersQuery.data.length} user
                    {usersQuery.data.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {usersQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : usersQuery.error ? (
                <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
                  Failed to load users
                </div>
              ) : usersQuery.data?.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                    <Users className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No users yet</p>
                  <p className="text-xs text-muted-foreground">
                    Add your first user to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {usersQuery.data?.map((user, index) => (
                    <div key={user.id}>
                      {index > 0 && <Separator className="my-2" />}
                      <div className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {user.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            deleteUserMutation.mutate({ id: user.id })
                          }
                          disabled={deleteUserMutation.isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Built with Drizzle ORM + SQLite</p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => getTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
