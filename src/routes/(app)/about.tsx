import { createFileRoute } from '@tanstack/react-router'
import About from '@/pages/About.tsx'

export const Route = createFileRoute('/(app)/about')({
  component: About,
})