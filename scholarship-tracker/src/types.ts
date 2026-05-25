export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export type ProgressStep =
  | 'found'
  | 'research'
  | 'outline'
  | 'draft'
  | 'edit'
  | 'review'
  | 'submit';

export interface EssayPrompt {
  prompt: string;
  wordLimit?: number;
  done: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  fieldOfStudy: string;
  educationLevel: string;
  timeCommitmentHours: number;
  essayPrompts: EssayPrompt[];
  website?: string;
  notes?: string;
  currentStep: ProgressStep;
  completedSteps: ProgressStep[];
  savedAt: string;
  submittedAt?: string;
  status: 'active' | 'submitted' | 'saved';
}

export interface SprintSession {
  scholarshipId: string;
  step: ProgressStep;
  startedAt: string;
  durationMinutes: number;
}

export const PROGRESS_STEPS: { id: ProgressStep; label: string; description: string }[] = [
  { id: 'found',    label: 'Found',     description: 'Identified the scholarship' },
  { id: 'research', label: 'Research',  description: 'Review all requirements' },
  { id: 'outline',  label: 'Outline',   description: 'Bullet-point essay outline' },
  { id: 'draft',    label: 'Draft',     description: 'Write first messy draft' },
  { id: 'edit',     label: 'Edit',      description: '10-min polish sprint' },
  { id: 'review',   label: 'Review',    description: 'Get feedback from one person' },
  { id: 'submit',   label: 'Submit',    description: 'Final check & submit early' },
];

export const EDUCATION_LEVELS = [
  'High School',
  'Undergraduate (Freshman)',
  'Undergraduate (Sophomore)',
  'Undergraduate (Junior)',
  'Undergraduate (Senior)',
  'Graduate (Master\'s)',
  'Graduate (PhD)',
  'Vocational / Trade School',
  'Community College',
];

export const FIELD_OF_STUDY_OPTIONS = [
  'Any / Undecided',
  'Business & Finance',
  'Computer Science & Tech',
  'Education',
  'Engineering',
  'Fine Arts & Design',
  'Health & Medicine',
  'Humanities & Liberal Arts',
  'Law & Political Science',
  'Natural Sciences',
  'Social Sciences',
  'Nursing',
  'Other',
];
