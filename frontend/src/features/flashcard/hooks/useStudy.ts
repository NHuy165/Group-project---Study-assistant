import { useMutation } from "@tanstack/react-query"
import { studyService } from "../services/study.service"
import type { CreateActivityParams } from "../types/study"

export const useCreateActivity = () => {
  return useMutation({
    mutationFn: ({ interactionId, data }: CreateActivityParams) =>
      studyService.createActivity(interactionId, data)
  })
}
