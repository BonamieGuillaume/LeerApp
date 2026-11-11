import { allQuestions, allChapters, questionById } from '../content'
import { todayLocal } from './storage'
import type { Question, StudyState, Attempt, ReviewItem } from '../types'
export const allLessons=allChapters.flatMap(c=>c.sections)
export const lessonById=new Map(allLessons.map(s=>[s.id,s]))
export const uid=()=>crypto.randomUUID()
export const percent=(n:number,d:number)=>d?Math.round(100*n/d):0
const normal=(s:string)=>s.trim().toLocaleLowerCase('nl-BE').replace(/\s+/g,' ')
export function grade(q:Question,a:string){if(q.kind==='fill')return [q.correct,...(q.accepted??[])].some(v=>normal(v)===normal(a));return a===q.correct}
export function answerLabel(q:Question,a:string){if(q.kind==='fill')return a||'Niet ingevuld';if(!a)return 'Niet beantwoord';if(q.kind==='match')return a.split('|').map((v,i)=>`${q.matchLabels?.[i]}: ${q.choices[Number(v)]??'—'}`).join('; ');return a.split('|').map(v=>q.choices[Number(v)]??'—').join('; ')}
export function schedule(old:ReviewItem|undefined,correct:boolean,hard:boolean,now=new Date()):ReviewItem{
 const ease=Math.max(1.3,(old?.ease??2.5)+(correct?(hard?-0.1:0.1):-0.2));const repetitions=correct?(old?.repetitions??0)+1:0
 const intervalDays=!correct?0:hard?1:repetitions===1?1:repetitions===2?3:Math.max(4,Math.round((old?.intervalDays??3)*ease))
 return {questionId:old?.questionId??'',ease,intervalDays,repetitions,dueAt:new Date(now.getTime()+(correct?intervalDays*86400000:600000)).toISOString(),lastAt:now.toISOString(),wrongCount:(old?.wrongCount??0)+(correct?0:1)}
}
export function recordAnswer(s:StudyState,q:Question,selected:string,mode:Attempt['mode'],now=new Date()):StudyState{
 const correct=grade(q,selected);const previous=s.reviews[q.id];const review=previous&&Date.parse(previous.lastAt)>now.getTime()?previous:schedule(previous,correct,s.hardQuestionIds.includes(q.id),now);review.questionId=q.id
 return {...s,attempts:[...s.attempts,{id:uid(),questionId:q.id,chapterId:q.chapterId,selected,correct,mode,at:now.toISOString()}],reviews:{...s.reviews,[q.id]:review},activityDays:[...new Set([...s.activityDays,todayLocal(now)])]}
}
export function currentAttempts(s:StudyState){return s.attempts.filter(a=>questionById.has(a.questionId))}
const latestCache=new WeakMap<StudyState['attempts'],Map<string,Attempt>>()
export function latest(s:StudyState){const cached=latestCache.get(s.attempts);if(cached)return cached;const m=new Map<string,Attempt>();currentAttempts(s).forEach(a=>{const old=m.get(a.questionId);if(!old||Date.parse(a.at)>=Date.parse(old.at))m.set(a.questionId,a)});latestCache.set(s.attempts,m);return m}
export function mastery(s:StudyState,lessonId:string){const qs=allQuestions.filter(q=>q.lessonId===lessonId);const m=latest(s);const checked=qs.filter(q=>m.has(q.id));return {tested:checked.length,total:qs.length,score:percent(checked.filter(q=>m.get(q.id)!.correct).length,checked.length)}}
export function mastered(s:StudyState,lessonId:string){const qs=allQuestions.filter(q=>q.lessonId===lessonId);const m=latest(s);const allTested=qs.every(q=>m.has(q.id));const score=mastery(s,lessonId).score;const reviewed=qs.some(q=>{const a=s.attempts.filter(a=>a.questionId===q.id&&a.correct);return a.length>=2&&new Date(a[a.length-1].at).getTime()-new Date(a[0].at).getTime()>=86400000});return allTested&&score>=s.thresholds.mastered&&reviewed&&!qs.some(q=>s.hardQuestionIds.includes(q.id)||m.get(q.id)?.correct===false)}
export function lessonStatus(s:StudyState,id:string){if(mastered(s,id))return 'Beheerst';const m=mastery(s,id);if(m.tested&&m.score<s.thresholds.repeat)return 'Herhaling nodig';if(m.tested)return 'Oefeningen gemaakt';if(s.readSectionIds.includes(id))return 'Theorie doorlopen';if(s.caseResults[id])return 'Bezig';return 'Niet gestart'}
export function dueQuestions(s:StudyState,now=new Date()){return allQuestions.filter(q=>{const r=s.reviews[q.id];return r&&new Date(r.dueAt)<=now}).sort((a,b)=>(s.reviews[b.id]?.wrongCount??0)-(s.reviews[a.id]?.wrongCount??0))}
export function weakLessons(s:StudyState){return allLessons.filter(l=>{const m=mastery(s,l.id);return m.tested&&m.score<s.thresholds.mastered}).sort((a,b)=>mastery(s,a.id).score-mastery(s,b.id).score)}
export function streak(s:StudyState){let n=0;const d=new Date();if(!s.activityDays.includes(todayLocal(d)))d.setDate(d.getDate()-1);while(s.activityDays.includes(todayLocal(d))){n++;d.setDate(d.getDate()-1)}return n}
export function shuffle<T>(a:T[]):T[]{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
export function chapterStats(s:StudyState,id:string){const ch=allChapters.find(c=>c.id===id)!;const qs=allQuestions.filter(q=>q.chapterId===id);const m=latest(s);const tested=qs.filter(q=>m.has(q.id));return {read:ch.sections.filter(l=>s.readSectionIds.includes(l.id)).length,total:ch.sections.length,mastered:ch.sections.filter(l=>mastered(s,l.id)).length,score:percent(tested.filter(q=>m.get(q.id)?.correct).length,tested.length),tested:tested.length}}
export function finishExam(s:StudyState,now=new Date()):StudyState{
 const e=s.activeExam;if(!e||s.examResults.some(r=>r.id===e.id))return {...s,activeExam:null}
 const end=e.deadlineAt&&new Date(e.deadlineAt)<now?new Date(e.deadlineAt):now
 let next=s;let score=0
 for(const id of e.questionIds){const q=questionById.get(id);if(!q)continue;const value=e.answers[id]??'';if(grade(q,value))score++;next=recordAnswer(next,q,value,'examen',end)}
 return {...next,activeExam:null,examResults:[...next.examResults,{id:e.id,startedAt:e.startedAt,endedAt:end.toISOString(),scope:e.scope,questionIds:e.questionIds,answers:e.answers,score,total:e.questionIds.length,durationSeconds:Math.max(0,Math.round((end.getTime()-new Date(e.startedAt).getTime())/1000))}].sort((a,b)=>Date.parse(a.endedAt)-Date.parse(b.endedAt))}
}

export function chapterStatus(s:StudyState,id:string){const ch=allChapters.find(c=>c.id===id);if(!ch)return 'Niet gestart';const statuses=ch.sections.map(l=>lessonStatus(s,l.id));if(statuses.every(x=>x==='Beheerst'))return 'Beheerst';if(statuses.some(x=>x==='Herhaling nodig'))return 'Herhaling nodig';const qs=allQuestions.filter(q=>q.chapterId===id);const m=latest(s);if(qs.length&&qs.every(q=>m.has(q.id)))return 'Oefeningen gemaakt';if(ch.sections.every(l=>s.readSectionIds.includes(l.id)))return 'Theorie doorlopen';if(statuses.some(x=>x!=='Niet gestart'))return 'Bezig';return 'Niet gestart'}
