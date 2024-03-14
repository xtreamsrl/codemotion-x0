export type PipelineInputs = {
  userDescription: string;
};

export type PipelineOutput = {
  code: string;
  path: string;
};

export type ComponentMetadata = {
  name: string;
  description: string;
  usageReason: string;
  extension: string;
  importCode: string;
  info: string;
  usageExamples: string;
}

export type DesignNewComponentOutput = {
  newComponentName: string;
  newComponentDescription: string;
  useLibraryComponents: {
    libraryComponentName: string;
    libraryComponentUsageReason: string;
  }[]
};
