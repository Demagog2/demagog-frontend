import { z } from 'zod'

// Define the topics and their subtopics
export const topic = {
  'Extrémní výkyvy počasí': {
    label: 'Extrémní výkyvy počasí',
    subtopics: [
      { id: 'subtopic-a-1', label: 'Rostoucí teploty' },
      { id: 'subtopic-a-2', label: 'Vlny veder' },
      { id: 'subtopic-a-3', label: 'Povodně' },
      { id: 'subtopic-a-4', label: 'Nedostatek vody' },
      { id: 'subtopic-a-5', label: 'Jiné' },
    ],
  },
  Doprava: {
    label: 'Doprava',
    subtopics: [
      {
        id: 'subtopic-b-1',
        label: 'Elektrická auta',
        value: 'Elektrická auta',
      },
      { id: 'subtopic-b-2', label: 'Jiné', value: 'Jiné' },
    ],
  },
  'Obnovitelné zdroje': {
    label: 'Obnovitelné zdroje',
    subtopics: [
      { id: 'subtopic-c-1', label: 'Větrná energie' },
      { id: 'subtopic-c-2', label: 'Solární panely' },
      { id: 'subtopic-c-3', label: 'Pobřežní větrná energie' },
      { id: 'subtopic-c-4', label: 'Jiné' },
    ],
  },
  'Konspirační teorie': {
    label: 'Konspirační teorie',
    subtopics: [
      { id: 'subtopic-d-1', label: 'Chemtrails' },
      { id: 'subtopic-d-2', label: 'Agenda 2030' },
      { id: 'subtopic-d-3', label: 'Patnáctiminutová města' },
      { id: 'subtopic-d-4', label: 'HAARP' },
      { id: 'subtopic-d-5', label: 'Jiné' },
    ],
  },
  'Fosilní paliva': {
    label: 'Fosilní paliva',
    subtopics: [
      { id: 'subtopic-e-1', label: 'Zemní plyn' },
      { id: 'subtopic-e-2', label: 'Ropa' },
      { id: 'subtopic-e-3', label: 'Uhlí' },
      { id: 'subtopic-e-4', label: 'Jiné' },
    ],
  },
  Odpad: {
    label: 'Odpad',
    subtopics: [
      { id: 'subtopic-f-1', label: 'Plasty' },
      { id: 'subtopic-f-4', label: 'Jiné' },
    ],
  },
  Jiné: {
    label: 'Jiné',
    subtopics: [
      { id: 'subtopic-g-1', label: 'Popírání změny klimatu' },
      { id: 'subtopic-g-2', label: 'Spotřeba masa' },
      { id: 'subtopic-g-3', label: 'Jiné' },
    ],
  },
}

export const distortionType = [
  { label: 'Neprokázané', value: 'Nepotvrzene' },
  { label: 'Satira považovaná za pravdivou', value: 'distortion-b' },
  {
    label:
      'Špatně označené, nesprávně přiřazené nebo nesprávně identifikované informace',
    value: 'distortion-c',
  },
  { label: 'Zavádějící informace', value: 'distortion-d' },
  { label: 'Nadhodnocené / podhodnocené', value: 'distortion-e' },
  { label: 'Zaměněné nebo smíchané informace', value: 'distortion-f' },
  { label: 'Upravený obsah', value: 'distortion-g' },
  { label: 'Nahraný (inscenovaný) obsah', value: 'distortion-h' },
  { label: 'Přetvořený obsah', value: 'distortion-i' },
  { label: 'Vykonstruované informace', value: 'distortion-j' },
  { label: 'Podvodný obsah', value: 'distortion-k' },
  { label: 'Koordinované neautentické chování', value: 'distortion-l' },
  { label: 'Pravdivé', value: 'distortion-m' },
]

export const formatType = [
  { label: 'Obrázek', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Text', value: 'text' },
  { label: 'Zvuk', value: 'audio' },
  { label: 'Jiné', value: 'other' },
]

// Create a type for the topic IDs
type TopicId = keyof typeof topic

export type Topic = typeof topic
export type TopicKey = keyof Topic

// Create a type for the subtopic IDs
type SubtopicId = (typeof topic)[TopicId]['subtopics'][number]['id']

// Create the form schema
export const euroclimateFormSchema = z
  .object({
    topic: z.enum(Object.keys(topic) as [string, ...string[]], {
      required_error: 'Zvolte téma',
    }),
    subtopics: z.array(z.string()).min(1, 'Zvolte alespoň jedno podtéma'),
    distortionType: z
      .array(z.string())
      .min(1, 'Vyberte alespoň jeden typ dezinformace'),
    appearances: z
      .array(
        z.object({
          appearanceUrl: z.string().min(1, 'Zadejte URL'),
          appearanceDate: z.string(),
          archiveUrl: z.string().optional(),
          format: z.enum(['image', 'video', 'text', 'audio', 'other'], {
            required_error: 'Vyberte formát',
          }),
        })
      )
      .min(1, 'Musíte přidat alespoň jeden výskyt'),
  })
  .refine(
    (data) => {
      // Validate that the selected subtopic belongs to the selected topic
      const selectedTopic = topic[data.topic as TopicId]
      return data.subtopics.every((subtopicId) =>
        selectedTopic.subtopics.some((subtopic) => subtopic.id === subtopicId)
      )
    },
    {
      message: 'Invalid subtopic for selected topic',
      path: ['subtopics'],
    }
  )
