export interface Language {
  id: string; // e.g. "es", "fr", "zh"
  name: string; // e.g. "Spanish"
  nativeName: string; // e.g. "Español"
  flagEmoji: string; // e.g. "🇪🇸"
  mascotGreeting: string; // Mascot intro dialog line
  themeColor: string; // Hex color for customization (e.g. brand purple "#6B4EFF")
  learnerCount?: string; // e.g. "28.4M learners"
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string; // e.g. "noun", "verb", "adjective"
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
  context?: string; // e.g. "Formal greeting", "In a cafe"
}

export interface AITeacherPrompt {
  id: string;
  teacherName: string;
  personality: string; // Description of personality, e.g. "friendly, speaks slowly"
  roleplayScenario: string; // e.g. "ordering coffee in Madrid"
  systemPrompt: string; // Full prompt instructing the AI Vision Agent / LLM
  welcomeMessage: string; // The opening message spoken/written by the AI
  learningObjectives: string[]; // Goals/Phrases the user should practice
}

export type ActivityType =
  | "vocabulary_review"
  | "multiple_choice"
  | "translate_phrase"
  | "audio_lesson"
  | "chat_tutor"
  | "vision_agent_video";

export interface BaseActivity {
  id: string;
  type: ActivityType;
  instructions: string;
}

export interface VocabularyReviewActivity extends BaseActivity {
  type: "vocabulary_review";
  vocabularyIds: string[];
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: "multiple_choice";
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TranslatePhraseActivity extends BaseActivity {
  type: "translate_phrase";
  phraseId: string;
  direction: "native_to_target" | "target_to_native";
  acceptableAnswers: string[];
}

export interface AudioLessonActivity extends BaseActivity {
  type: "audio_lesson";
  audioUrl: string;
  transcript: string;
  translation: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface ChatTutorActivity extends BaseActivity {
  type: "chat_tutor";
  scenario: string;
  aiPersona: string;
  userRole: string;
  starterMessage: string;
  objectives: string[];
}

export interface VisionAgentVideoActivity extends BaseActivity {
  type: "vision_agent_video";
  aiTeacherPromptId: string; // Reference to an AITeacherPrompt
  durationSeconds: number;
}

export type Activity =
  | VocabularyReviewActivity
  | MultipleChoiceActivity
  | TranslatePhraseActivity
  | AudioLessonActivity
  | ChatTutorActivity
  | VisionAgentVideoActivity;

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  activities: Activity[];
  vocabulary: VocabularyItem[]; // Vocab items specific/introduced in this lesson
  phrases: PhraseItem[];       // Phrases specific/introduced in this lesson
  aiTeacherPrompt?: AITeacherPrompt; // Configuration for AI teacher conversation
}

export interface Unit {
  id: string;
  languageId: string; // e.g. "es"
  title: string; // e.g. "Unit 1: Introductions"
  description: string; // e.g. "Learn greetings and basic personal information"
  order: number;
  lessonIds: string[];
}
