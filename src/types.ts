export interface LessonSection { id:string; code:string; title:string; body:string; example:string; selfCheck:string; pages:number[]; sourceKind:string }
export interface Subchapter { id:string; title:string; lessonIds:string[] }
export interface Chapter { subchapters?:Subchapter[]; id:string; number:number; title:string; part:string; pages:number[]; learningObjectives:string[]; sections:LessonSection[] }
export interface PracticeCase { id:string; number:number; chapterId:string; lessonId:string; title:string; prompt:string; modelAnswer:string; pages:number[] }
export type QuestionKind='single'|'boolean'|'multi'|'fill'|'match'
export interface Question { id:string; chapterId:string; lessonId:string; kind:QuestionKind; prompt:string; choices:string[]; correct:string; explanation:string; pages:number[]; difficulty:'begrip'|'toepassing'; origin:'pdf'|'editorial'; accepted?:string[]; matchLabels?:string[] }
export interface ModuleContent { id:string; title:string; contentVersion:string; sourceDate:string; sourceTitle:string; sourceType:string; sourceFile:string; sourcePageCount:number; sourceSha256:string; chapters:Chapter[]; questions:Question[]; cases:PracticeCase[]; coverage:{page:number;kind:string;processed:boolean;text:string;lessonIds:string[];questionIds:string[]}[]; sourceLinks:{title:string;url:string}[] }
export interface ModuleSlot { id:'m1'|'m2'|'m3'|'m4';label:string;content:ModuleContent|null }
export interface Attempt { id:string;questionId:string;chapterId:string;selected:string;correct:boolean;mode:'oefening'|'herhaling'|'examen';at:string }
export interface ReviewItem { questionId:string;ease:number;intervalDays:number;repetitions:number;dueAt:string;lastAt:string;wrongCount:number }
export interface ExamResult { id:string;startedAt:string;endedAt:string;scope:string;questionIds:string[];answers:Record<string,string>;score:number;total:number;durationSeconds:number }
export interface ActiveExam { id:string;startedAt:string;deadlineAt:string|null;scope:string;questionIds:string[];answers:Record<string,string>;currentIndex:number }
export interface StudyState { schemaVersion:3;contentVersions:Record<string,string>;readSectionIds:string[];attempts:Attempt[];reviews:Record<string,ReviewItem>;hardQuestionIds:string[];caseResults:Record<string,{knewAnswer:boolean;at:string;answer?:string}>;examResults:ExamResult[];activeExam:ActiveExam|null;activityDays:string[];studySeconds:number;plan:{examDate:string;minutesPerDay:number};thresholds:{repeat:number;mastered:number;excellent:number};theme:'light'|'dark' }
