import { getFastAPI } from "../../../api/api"
import type { StudyActivityInput } from "../../../api/api.schemas.ts"

const api = getFastAPI()

export const studyService = {
  createActivity: async (interactionId: number, data: StudyActivityInput) => {
    const res =
      await api.createStudyActivityStudyActivityInteractionIdCreatePost(
        interactionId,
        data,
            {
            baseURL: "http://localhost:8000" // 👈 ép tại đây
            }
      );

    return res.data; // 👈 FIX Ở ĐÂY
  },
};
