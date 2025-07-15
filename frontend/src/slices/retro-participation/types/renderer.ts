// Format-Agnostic Renderer Types
// These types define the interface for different retrospective format renderers

export interface RetroItem {
  id: string
  content: string
  author: string
  votes: number
  createdAt: Date
  updatedAt: Date
  column?: string // For column-based formats
  position?: { x: number; y: number } // For canvas-based formats
  category?: string // For categorized formats
  order?: number // Position in column (for drag-and-drop)
}

export interface RetroColumn {
  id: string
  title: string
  description?: string
  icon?: string
  color?: string
  items: RetroItem[]
  maxItems?: number
}

export interface RetroSession {
  id: string
  title: string
  format: RetroFormat
  columns?: RetroColumn[] // For column-based formats
  items?: RetroItem[] // For free-form formats
  participants: string[]
  facilitator: string
  phase: 'collection' | 'discussion' | 'voting' | 'action-planning' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface RetroFormat {
  id: string
  name: string
  description: string
  type: 'column' | 'timeline' | 'canvas' | 'form'
  config: RetroFormatConfig
}

export interface RetroFormatConfig {
  // Column-based format configuration
  columns?: {
    id: string
    title: string
    description?: string
    color?: string
    icon?: string
  }[]

  // Timeline-based format configuration
  timeline?: {
    startDate?: Date
    endDate?: Date
    milestones?: string[]
  }

  // Canvas-based format configuration
  canvas?: {
    width: number
    height: number
    background?: string
    zones?: {
      id: string
      title: string
      x: number
      y: number
      width: number
      height: number
    }[]
  }

  // Form-based format configuration
  form?: {
    questions: {
      id: string
      text: string
      type: 'text' | 'textarea' | 'rating' | 'multiple-choice'
      required?: boolean
      options?: string[]
    }[]
  }
}

export interface RendererProps {
  session: RetroSession
  readonly?: boolean
  onItemAdd?: (item: Omit<RetroItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  onItemUpdate?: (itemId: string, updates: Partial<RetroItem>) => void
  onItemDelete?: (itemId: string) => void
  onItemVote?: (itemId: string, increment: boolean) => void
}

export interface BaseRenderer {
  name: string
  type: RetroFormat['type']
  component: any // Vue component
  supports: (format: RetroFormat) => boolean
  validate: (config: RetroFormatConfig) => boolean
}

// Predefined format configurations
export const PREDEFINED_FORMATS: Record<string, RetroFormat> = {
  'four-column': {
    id: 'four-column',
    name: '4-Column Retrospective',
    description:
      "Traditional retrospective with four columns: What went well, What didn't go well, What have I learned, What still puzzles me",
    type: 'column',
    config: {
      columns: [
        {
          id: 'went-well',
          title: 'What went well?',
          description: 'Things that worked well during the sprint',
          color: 'positive',
          icon: 'thumb_up',
        },
        {
          id: 'didnt-go-well',
          title: "What didn't go well?",
          description: 'Things that could have been better',
          color: 'negative',
          icon: 'thumb_down',
        },
        {
          id: 'learned',
          title: 'What have I learned?',
          description: 'New insights and knowledge gained',
          color: 'info',
          icon: 'lightbulb',
        },
        {
          id: 'puzzles',
          title: 'What still puzzles me?',
          description: 'Questions and uncertainties',
          color: 'warning',
          icon: 'help',
        },
      ],
    },
  },

  'start-stop-continue': {
    id: 'start-stop-continue',
    name: 'Start, Stop, Continue',
    description: 'Focus on actions: What to start doing, stop doing, and continue doing',
    type: 'column',
    config: {
      columns: [
        {
          id: 'start',
          title: 'Start',
          description: 'What should we start doing?',
          color: 'positive',
          icon: 'play_arrow',
        },
        {
          id: 'stop',
          title: 'Stop',
          description: 'What should we stop doing?',
          color: 'negative',
          icon: 'stop',
        },
        {
          id: 'continue',
          title: 'Continue',
          description: 'What should we continue doing?',
          color: 'info',
          icon: 'trending_up',
        },
      ],
    },
  },
}
