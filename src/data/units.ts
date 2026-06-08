import { Unit } from "../types/learning";

export const units: Unit[] = [
  // ==========================================
  // SPANISH UNITS
  // ==========================================
  {
    id: "es_unit_1",
    languageId: "es",
    title: "Unit 1: First Steps",
    description: "Greet people, introduce yourself, and order basic items at a café.",
    order: 1,
    lessonIds: ["es_lesson_1", "es_lesson_2"],
  },

  // ==========================================
  // FRENCH UNITS
  // ==========================================
  {
    id: "fr_unit_1",
    languageId: "fr",
    title: "Unit 1: Conversational Basics",
    description: "Start greeting people and learning introductory phrases.",
    order: 1,
    lessonIds: ["fr_lesson_1"],
  },

  // ==========================================
  // CHINESE UNITS
  // ==========================================
  {
    id: "zh_unit_1",
    languageId: "zh",
    title: "Unit 1: Tones & Hello",
    description: "Master basic greetings in Mandarin and understand tone basics.",
    order: 1,
    lessonIds: ["zh_lesson_1"],
  },
];
