import type { StudyActivityInput } from "../../../api/api.schemas.ts"

export type CreateActivityParams = {
  interactionId: number
  data: StudyActivityInput
}
