import { useEffect, useRef, useState } from 'react'
import type { StudyState } from '../types'
import { loadState, saveState, todayLocal, STORAGE_KEY } from './storage'
export type Update=(fn:(s:StudyState)=>StudyState)=>void
export function mergeStates(a:StudyState,b:StudyState):StudyState{
 const union=<T extends {id:string}>(x:T[],y:T[])=>Array.from(new Map([...x,...y].map(v=>[v.id,v])).values())
 const reviews={...a.reviews};for(const [id,r] of Object.entries(b.reviews))if(!reviews[id]||r.lastAt>reviews[id].lastAt)reviews[id]=r
 return {...a,...b,readSectionIds:[...new Set([...a.readSectionIds,...b.readSectionIds])],attempts:union(a.attempts,b.attempts).sort((x,y)=>x.at.localeCompare(y.at)),examResults:union(a.examResults,b.examResults).sort((x,y)=>x.endedAt.localeCompare(y.endedAt)),reviews,hardQuestionIds:[...new Set([...a.hardQuestionIds,...b.hardQuestionIds])],caseResults:{...a.caseResults,...b.caseResults},activityDays:[...new Set([...a.activityDays,...b.activityDays])].sort(),studySeconds:Math.max(a.studySeconds,b.studySeconds),activeExam:a.activeExam??b.activeExam}
}
export function useStudy(){
 const [initial]=useState(loadState);const [state,setState]=useState(initial.state);const [error,setError]=useState(initial.error);const [blocked,setBlocked]=useState(!!initial.error);const current=useRef(state)
 const update:Update=fn=>{if(blocked)return;const next=fn(current.current);const err=saveState(next);current.current=next;setState(next);setError(err)}
 const replace=(s:StudyState)=>{const err=saveState(s);if(err){setError(err);return false}current.current=s;setState(s);setError(null);setBlocked(false);return true}
 useEffect(()=>{const handler=(e:StorageEvent)=>{if(e.key!==STORAGE_KEY)return;const result=loadState();if(result.error){setError(result.error);setBlocked(true)}else {current.current=result.state;setState(result.state)}};window.addEventListener('storage',handler);return()=>window.removeEventListener('storage',handler)},[])
 useEffect(()=>{let last=Date.now();let active=Date.now();const touch=()=>{active=Date.now()};const tick=()=>{const now=Date.now();const seconds=Math.min(15,Math.floor((now-last)/1000));last=now;if(document.visibilityState==='visible'&&document.hasFocus()&&now-active<120000&&seconds>0&&!blocked){const next={...current.current,studySeconds:current.current.studySeconds+seconds,activityDays:[...new Set([...current.current.activityDays,todayLocal()])]};const err=saveState(next);current.current=next;setState(next);if(err)setError(err)}};const timer=setInterval(tick,15000);window.addEventListener('pointerdown',touch);window.addEventListener('keydown',touch);window.addEventListener('focus',touch);return()=>{clearInterval(timer);window.removeEventListener('pointerdown',touch);window.removeEventListener('keydown',touch);window.removeEventListener('focus',touch)}},[blocked])
 return {state,update,error,blocked,replace}
}
