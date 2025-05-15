import { z } from 'zod'

// Define the topics and their subtopics
export const topic = {
  'Extreme weather events': {
    label: 'Extreme weather events',
    subtopic: [
      { id: 'subtopic-a-1', label: 'Increasing temperatures' },
      { id: 'subtopic-a-2', label: 'Heatwaves' },
      { id: 'subtopic-a-3', label: 'Floods' },
      { id: 'subtopic-a-4', label: 'Water scarcity' },
      { id: 'subtopic-a-5', label: 'Other' },
    ],
  },
  Transport: {
    label: 'Transport',
    subtopic: [
      { id: 'subtopic-b-1', label: 'Eletric cars', value: 'electric-cars' },
      { id: 'subtopic-b-2', label: 'Other', value: 'other' },
    ],
  },
}

export const distortionTypes = [
  { label: 'Fabricated information', value: 'fabricated' },
  { label: 'Distortion type B', value: 'distortion-b' },
]

export const formatTypes = [
  { label: 'Video', value: 'video' },
  { label: 'Text', value: 'text' },
  { label: 'Obrázek', value: 'picture' },
]

// Create a type for the topic IDs
type TopicId = keyof typeof topic

export type Topic = typeof topic
export type TopicKey = keyof Topic

// Create a type for the subtopic IDs
type SubtopicId = (typeof topic)[TopicId]['subtopic'][number]['id']

// Create the form schema
export const euroclimateFormSchema = z
  .object({
    topic: z.enum(['Extreme weather events', 'Transport'], {
      required_error: 'Zvolte téma',
    }),
    subtopic: z.array(z.string()).min(1, 'Zvolte alespoň jedno podtéma'),
    distortionType: z
      .array(z.string())
      .min(1, 'Vyberte alespoň jeden typ dezinformace'),
    appearanceUrl: z.string().min(1, 'Zadejte URL'),
    appearanceDate: z.string(),
    archiveUrl: z.string().optional(),
    format: z.enum(['video', 'text', 'picture'], {
      required_error: 'Vyberte formát',
    }),
  })
  .refine(
    (data) => {
      // Validate that the selected subtopic belongs to the selected topic
      const selectedTopic = topic[data.topic as TopicId]
      return data.subtopic.every((subtopicId) =>
        selectedTopic.subtopic.some((subtopic) => subtopic.id === subtopicId)
      )
    },
    {
      message: 'Invalid subtopic for selected topic',
      path: ['subtopic'],
    }
  )
