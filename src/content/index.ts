import rawModule1 from './module1.json'
import type { ModuleContent, ModuleSlot } from '../types'

export const module1 = rawModule1 as ModuleContent

// IDs and slots are permanent. New PDF conversions fill an empty slot without
// changing existing IDs or browser progress keys.
export const modules: ModuleSlot[] = [
  { id: 'm1', label: 'Module 1', content: module1 },
  { id: 'm2', label: 'Module 2', content: null },
  { id: 'm3', label: 'Module 3', content: null },
  { id: 'm4', label: 'Module 4', content: null },
]

export const allChapters = modules.flatMap(module => module.content?.chapters ?? [])
export const allQuestions = modules.flatMap(module => module.content?.questions ?? [])
export const allCases = modules.flatMap(module => module.content?.cases ?? [])
export const chapterById = new Map(allChapters.map(chapter => [chapter.id, chapter]))
export const questionById = new Map(allQuestions.map(question => [question.id, question]))

export const moduleForEntity = new Map<string, ModuleSlot>()
for (const module of modules) {
  if (!module.content) continue
  moduleForEntity.set(module.id, module)
  for (const chapter of module.content.chapters) {
    moduleForEntity.set(chapter.id, module)
    chapter.sections.forEach(lesson => moduleForEntity.set(lesson.id, module))
  }
  module.content.questions.forEach(question => moduleForEntity.set(question.id, module))
  module.content.cases.forEach(item => moduleForEntity.set(item.id, module))
}
