import { useCreateActivity } from "../hooks/useStudy"

const StudyForm = () => {
  const { mutate, isPending, error, data } = useCreateActivity()

  const handleSubmit = () => {
    mutate({
      interactionId: 1,
      data: {
        prompt: "Learn vocab",
        activity_type: "REVIEW",
        activity_format: "FLASHCARDS",
        subject_type: "ENGLISH"
      }
    })
  }

  return (
  <button
    onClick={() => {
      console.log("clicked")
      handleSubmit()
    }}
  >
    Create
  </button>
)


}

export default StudyForm