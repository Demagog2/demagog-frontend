export const trueLabel = 'true'
export const falseLabel = 'untrue'
export const unverifiable = 'unverifiable'
export const misleading = 'misleading'

export type AssessmentVeracity =
  | 'true'
  | 'untrue'
  | 'unverifiable'
  | 'misleading'

export const ASSESSMENT_VERACITY_LABELS = {
  [trueLabel]: 'pravda',
  [falseLabel]: 'nepravda',
  [unverifiable]: 'neověřitelné',
  [misleading]: 'zavádějící',
}
