import LIBRARY_COMPONENTS_METADATA from '../data/components.json';

export type DesignNewComponentOutput = {
  newComponentName: string;
  newComponentDescription: string;
  useLibraryComponents: {
    libraryComponentName: string;
    libraryComponentUsageReason: string;
  }[]
};

// JSON Schema to define the output of the design step
export const designNewComponentOutputSchema = {
  type: 'object',
  title: 'NewComponentDesign',
  description: 'Design a new component from the user query using the provided library components.',
  properties: {
    newComponentName: {
      type: 'string',
      description: `The name of the new component to be designed.`,
    },
    newComponentDescription: {
      type: 'string',
      description: 'A description for the component design task strictly based on the user query.',
    },
    useLibraryComponents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          libraryComponentName: {
            type: 'string',
            enum: LIBRARY_COMPONENTS_METADATA.map(component => component.name),
          },
          libraryComponentUsageReason: {
            type: 'string',
            description: `The reason why the library component is being used.`,
          },
        },
        required: ['libraryComponentName', 'libraryComponentUsageReason'],
      },
    },
  },
  required: ['newComponentName', 'newComponentDescription', 'useLibraryComponents'],
} as const;
