import {
  EuroClimateDistortion,
  EuroClimateFormat,
  EuroClimateSubtopic,
  EuroClimateTopic,
} from '@/__generated__/graphql'
import { z } from 'zod'

// Define the topics and their subtopics
export const topics: Record<
  EuroClimateTopic,
  {
    label: string
    subtopics: Array<{ id: EuroClimateSubtopic; label: string }>
  }
> = {
  [EuroClimateTopic.ExtremeWeatherEvents]: {
    label: 'Extrémní výkyvy počasí',
    subtopics: [
      {
        id: EuroClimateSubtopic.IncreasingTemperatures,
        label: 'Rostoucí teploty',
      },
      {
        id: EuroClimateSubtopic.Heatwaves,
        label: 'Vlny veder',
      },
      {
        id: EuroClimateSubtopic.Floods,
        label: 'Povodně',
      },
      {
        id: EuroClimateSubtopic.WaterScarcity,
        label: 'Nedostatek vody',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.Transport]: {
    label: 'Doprava',
    subtopics: [
      {
        id: EuroClimateSubtopic.ElectricCars,
        label: 'Elektrická auta',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.Renewables]: {
    label: 'Obnovitelné zdroje',
    subtopics: [
      {
        id: EuroClimateSubtopic.WindEnergy,
        label: 'Větrná energie',
      },
      {
        id: EuroClimateSubtopic.SolarPv,
        label: 'Solární panely',
      },
      {
        id: EuroClimateSubtopic.OffshoreWindEnergy,
        label: 'Pobřežní větrná energie',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.ConspiracyTheories]: {
    label: 'Konspirační teorie',
    subtopics: [
      {
        id: EuroClimateSubtopic.Chemtrails,
        label: 'Chemtrails',
      },
      {
        id: EuroClimateSubtopic.Agenda_2030,
        label: 'Agenda 2030',
      },
      {
        id: EuroClimateSubtopic.FifteenMinuteCities,
        label: 'Patnáctiminutová města',
      },
      {
        id: EuroClimateSubtopic.Haarp,
        label: 'HAARP',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.FossilFuels]: {
    label: 'Fosilní paliva',
    subtopics: [
      {
        id: EuroClimateSubtopic.NaturalGas,
        label: 'Zemní plyn',
      },
      {
        id: EuroClimateSubtopic.Oil,
        label: 'Ropa',
      },
      {
        id: EuroClimateSubtopic.Coal,
        label: 'Uhlí',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.Waste]: {
    label: 'Odpad',
    subtopics: [
      {
        id: EuroClimateSubtopic.Plastic,
        label: 'Plasty',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
  [EuroClimateTopic.Other]: {
    label: 'Jiné',
    subtopics: [
      {
        id: EuroClimateSubtopic.ClimateChangeDenial,
        label: 'Popírání změny klimatu',
      },
      {
        id: EuroClimateSubtopic.MeatConsumption,
        label: 'Spotřeba masa',
      },
      {
        id: EuroClimateSubtopic.Other,
        label: 'Jiné',
      },
    ],
  },
}

export const distortionType = [
  { label: 'Neprokázané', value: EuroClimateDistortion.Unproven },
  {
    label: 'Satira považovaná za pravdivou',
    value: EuroClimateDistortion.SatireBelievedToBeTrue,
  },
  {
    label:
      'Špatně označené, nesprávně přiřazené nebo nesprávně identifikované informace',
    value:
      EuroClimateDistortion.MislabelledMisattributedOrMisidentifiedInformation,
  },
  {
    label: 'Zavádějící informace',
    value: EuroClimateDistortion.MisleadingInformation,
  },
  {
    label: 'Nadhodnocené / podhodnocené',
    value: EuroClimateDistortion.OverstatedUnderstated,
  },
  {
    label: 'Zaměněné nebo smíchané informace',
    value: EuroClimateDistortion.Conflated,
  },
  { label: 'Upravený obsah', value: EuroClimateDistortion.EditedContent },
  {
    label: 'Nahraný (inscenovaný) obsah',
    value: EuroClimateDistortion.StagedContent,
  },
  {
    label: 'Přetvořený obsah',
    value: EuroClimateDistortion.TransformedContent,
  },
  {
    label: 'Vykonstruované informace',
    value: EuroClimateDistortion.FabricatedInformation,
  },
  { label: 'Podvodný obsah', value: EuroClimateDistortion.ImposterContent },
  {
    label: 'Koordinované neautentické chování',
    value: EuroClimateDistortion.CoordinatedInauthenticBehaviour,
  },
  { label: 'Pravdivé', value: EuroClimateDistortion.True },
]

export const formatType = [
  { label: 'Obrázek', value: EuroClimateFormat.Image },
  { label: 'Video', value: EuroClimateFormat.Video },
  { label: 'Text', value: EuroClimateFormat.Text },
  { label: 'Zvuk', value: EuroClimateFormat.Audio },
  { label: 'Jiné', value: EuroClimateFormat.Other },
]

// Create a type for the topic IDs
type TopicId = keyof typeof topics

// Create the form schema
export const euroclimateFormSchema = z
  .object({
    articleId: z.string(),
    topic: z.nativeEnum(EuroClimateTopic, {
      required_error: 'Zvolte téma',
    }),
    subtopics: z
      .array(z.nativeEnum(EuroClimateSubtopic))
      .min(1, 'Zvolte alespoň jedno podtéma'),
    distortions: z
      .array(z.nativeEnum(EuroClimateDistortion))
      .min(1, 'Vyberte alespoň jeden typ dezinformace'),
    appearance: z.object({
      appearanceUrl: z.string().url('Zadejte platnou URL'),
      appearanceDate: z.string().min(1, 'Zadejte datum výskytu'),
      archiveUrl: z
        .string()
        .url('Zadejte platnou URL')
        .optional()
        .or(z.literal('')),
      format: z.nativeEnum(EuroClimateFormat, {
        required_error: 'Vyberte formát',
      }),
    }),
  })
  .refine(
    (data) => {
      // Validate that the selected subtopic belongs to the selected topic
      const selectedTopic = topics[data.topic as TopicId]
      return data.subtopics.every((subtopicId) =>
        selectedTopic.subtopics.some((subtopic) => subtopic.id === subtopicId)
      )
    },
    {
      message: 'Invalid subtopic for selected topic',
      path: ['subtopics'],
    }
  )
