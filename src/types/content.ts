export type MCQSection = {
  type: 'mcq';
  prompt: string;
  choices: string[];
  correctIndex: number;
  rationales: string[];
};

export type ShortAnswerSection = {
  type: 'short_answer';
  prompt: string;
  rubric: string[];
  answer: string;
};

export type NotebookGateSection = {
  type: 'notebook_gate';
  prompt: string;
  reflection: { placeholder: string };
};

export type InteractiveExploreSection = {
  type: 'interactive_explore';
  pattern: 'number_line_slider';
  config: { min: number; max: number; target: number };
};

export type Section =
  | MCQSection
  | ShortAnswerSection
  | NotebookGateSection
  | InteractiveExploreSection;

export type Lesson = {
  id: string;
  title: string;
  version: number;
  status: 'draft' | 'published';
  estimatedMinutes: number;
  sections: Section[];
};


