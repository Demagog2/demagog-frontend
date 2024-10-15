import { Expert } from '../model/Expert'

export function createExpertFromQuery(expert: {
  id: string
  firstName: string
  lastName: string
}): Expert {
  return new Expert(expert.id, expert.firstName, expert.lastName)
}
