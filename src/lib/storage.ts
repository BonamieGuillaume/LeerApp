import { modules } from '../content'
import type { StudyState } from '../types'
export const STORAGE_KEY='verzekeringen-leeratelier-progress-v3'
const KEYS=[STORAGE_KEY,'verzekeringen-leeratelier-progress-v2','verzekeringen-leeratelier-progress-v1']
export function todayLocal(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function freshState():StudyState{return {schemaVersion:3,contentVersions:Object.fromEntries(modules.filter(m=>m.content).map(m=>[m.id,m.content!.contentVersion])),readSectionIds:[],attempts:[],reviews:{},hardQuestionIds:[],caseResults:{},examResults:[],activeExam:null,activityDays:[],studySeconds:0,plan:{examDate:'',minutesPerDay:30},thresholds:{repeat:60,mastered:80,excellent:90},theme:'light'}}
const rec=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v)
const strs=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string')
const num=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=0
const date=(v:unknown):v is string=>typeof v==='string'&&Number.isFinite(Date.parse(v))
const answers=(v:unknown)=>rec(v)&&Object.values(v).every(x=>typeof x==='string')
export function migrateState(input:unknown):StudyState{
 if(!rec(input)||![1,2,3].includes(Number(input.schemaVersion)))throw Error('Onbekende gegevensversie. Gebruik een back-up uit deze app.')
 const b=freshState(); const p=rec(input.plan)?input.plan:{}; const t=rec(input.thresholds)?input.thresholds:{}
 const attempts=Array.isArray(input.attempts)?input.attempts:[]
 if(!attempts.every(v=>rec(v)&&typeof v.id==='string'&&typeof v.questionId==='string'&&typeof v.chapterId==='string'&&typeof v.selected==='string'&&typeof v.correct==='boolean'&&date(v.at)&&['oefening','herhaling','examen'].includes(String(v.mode))))throw Error('Ongeldige antwoordgeschiedenis in back-up.')
 const exams=Array.isArray(input.examResults)?input.examResults:[]
 if(!exams.every(v=>rec(v)&&typeof v.id==='string'&&typeof v.scope==='string'&&date(v.startedAt)&&date(v.endedAt)&&strs(v.questionIds)&&answers(v.answers)&&num(v.score)&&num(v.total)&&v.total>0&&v.total===v.questionIds.length&&v.score<=v.total&&num(v.durationSeconds)))throw Error('Ongeldige examens in back-up.')
 const rev=rec(input.reviews)?input.reviews:{}
 if(!Object.entries(rev).every(([k,v])=>rec(v)&&v.questionId===k&&num(v.ease)&&v.ease>=1.3&&num(v.intervalDays)&&num(v.repetitions)&&date(v.dueAt)&&date(v.lastAt)&&num(v.wrongCount)))throw Error('Ongeldige herhalingsgegevens.')
 const cases=rec(input.caseResults)?input.caseResults:{}
 if(!Object.values(cases).every(v=>rec(v)&&typeof v.knewAnswer==='boolean'&&date(v.at)&&(v.answer===undefined||typeof v.answer==='string')))throw Error('Ongeldige zelfbeoordelingen.')
 const active=input.activeExam
 if(active!=null&&!(rec(active)&&typeof active.id==='string'&&typeof active.scope==='string'&&date(active.startedAt)&&(active.deadlineAt===null||date(active.deadlineAt))&&strs(active.questionIds)&&active.questionIds.length>0&&answers(active.answers)&&Number.isInteger(active.currentIndex)&&Number(active.currentIndex)>=0&&Number(active.currentIndex)<active.questionIds.length))throw Error('Ongeldig lopend examen.')
 const threshold={repeat:num(t.repeat)?t.repeat:60,mastered:num(t.mastered)?t.mastered:80,excellent:num(t.excellent)?t.excellent:90}
 if(!(0<threshold.repeat&&threshold.repeat<threshold.mastered&&threshold.mastered<=threshold.excellent&&threshold.excellent<=100))throw Error('Scoregrenzen moeten oplopend zijn en tussen 1 en 100 liggen.')
 const read=input.schemaVersion===1?input.completedLessons:input.readSectionIds
 return {...b,contentVersions:rec(input.contentVersions)&&Object.values(input.contentVersions).every(v=>typeof v==='string')?input.contentVersions as StudyState['contentVersions']:b.contentVersions,
 readSectionIds:strs(read)?[...new Set(read)]:[],attempts:attempts as StudyState['attempts'],reviews:rev as StudyState['reviews'],hardQuestionIds:strs(input.hardQuestionIds)?input.hardQuestionIds:[],caseResults:cases as StudyState['caseResults'],examResults:exams as StudyState['examResults'],activeExam:active==null?null:active as unknown as StudyState['activeExam'],activityDays:strs(input.activityDays)?input.activityDays.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)):[],studySeconds:num(input.studySeconds)?input.studySeconds:0,plan:{examDate:typeof p.examDate==='string'&&(/^\d{4}-\d{2}-\d{2}$/.test(p.examDate)||p.examDate==='')?p.examDate:'',minutesPerDay:num(p.minutesPerDay)&&p.minutesPerDay>=5&&p.minutesPerDay<=480?p.minutesPerDay:30},thresholds:threshold,theme:input.theme==='dark'?'dark':'light'}
}
export function loadState():{state:StudyState;error:string|null}{
 try{for(const key of KEYS){const raw=localStorage.getItem(key);if(raw){return {state:migrateState(JSON.parse(raw)),error:null}}}return {state:freshState(),error:null}}
 catch(e){return {state:freshState(),error:`Je opgeslagen gegevens zijn niet overschreven. Herstel een back-up of download de beschadigde gegevens. ${e instanceof Error?e.message:''}`}}
}
export function saveState(s:StudyState){try{const raw=JSON.stringify(s);const old=localStorage.getItem(STORAGE_KEY);if(old)localStorage.setItem(STORAGE_KEY+'-previous',old);localStorage.setItem(STORAGE_KEY,raw);return null}catch{return 'Opslaan is mislukt. Download meteen een JSON-back-up. Je browseropslag is mogelijk vol of geblokkeerd.'}}
export function backupJson(s:StudyState){return JSON.stringify({format:'verzekeringen-leeratelier-backup',exportedAt:new Date().toISOString(),state:s},null,2)}
export function importBackup(raw:string){const p:unknown=JSON.parse(raw);if(!rec(p)||p.format!=='verzekeringen-leeratelier-backup')throw Error('Geen geldige Leeratelier-back-up.');return migrateState(p.state)}
export function download(name:string,raw:string,type='application/json'){const u=URL.createObjectURL(new Blob([raw],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
