# shadcn/ui Setup Guide

## Installation Commands

Run these commands from the `frontend` directory:

### Install Button Component
```bash
npx shadcn-ui@latest add button
```

### Install Card Component
```bash
npx shadcn-ui@latest add card
```

### Install Input Component
```bash
npx shadcn-ui@latest add input
```

### Install Label Component
```bash
npx shadcn-ui@latest add label
```

### Install Toast/Toaster Component
```bash
npx shadcn-ui@latest add toast
```

### Install All Components at Once
```bash
npx shadcn-ui@latest add button card input label toast
```

## File Structure

After installation, your structure will be:
```
frontend/
├── components.json          # shadcn/ui configuration
├── src/
│   ├── components/
│   │   └── ui/             # shadcn/ui components will be installed here
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── toast.tsx
│   └── lib/
│       └── utils.ts        # cn() helper function
```

## Usage Example

After installation, you can use components like this:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

function App() {
  const { toast } = useToast();

  return (
    <>
      <Card>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
        <Button onClick={() => toast({ title: "Hello!" })}>
          Click me
        </Button>
      </Card>
      <Toaster />
    </>
  );
}
```

