import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Toggle } from "./Toggle.vue"

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-stone-100 hover:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-stone-100 data-[state=on]:text-stone-900 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:hover:bg-stone-800 dark:hover:text-stone-400 dark:focus-visible:ring-stone-300 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-50',
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          'border border-stone-200 bg-transparent shadow-sm hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-50',
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
