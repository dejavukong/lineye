# @repo/ui

> shadcn/ui component library

## Tech

Radix UI, Tailwind CSS 4, class-variance-authority, lucide-react

## Structure

```
src/
  components/    # UI components
  lib/utils.ts   # cn() helper
  globals.css    # CSS variables
```

## Add Component

```bash
cd packages/ui
pnpm add-component [component]

# or
npx shadcn@latest add [component]
```

## Components

alert-dialog, avatar, badge, button, card, checkbox,
dialog, dropdown-menu, input, label, popover,
scroll-area, select, separator, sheet, sonner,
switch, table, tabs, textarea, tooltip

## Usage

```typescript
// Import components via subpath
import { Button } from '@repo/ui/components/button';
import { Card, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';

// Import utils
import { cn } from '@repo/ui/lib/utils';
```
