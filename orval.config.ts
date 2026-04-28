export default {
  studyAssistantApi: {
    input: 'http://localhost:8000/openapi.json', 
    output: {
      mode: 'split',
      target: './frontend/src/api/generated/api.ts', // Back to .ts
      client: 'axios',
      override: {
        mutator: {
          path: './frontend/src/api/axiosClient.ts', // Back to .ts
          name: 'customMutator', 
        },
      },
    },
  },
};