import type { ReactNode } from 'react'
import { moduleForEntity, module1 } from '../content'
import { publicUrl } from '../lib/assets'
import { ArrowUpRight, BookOpen, Check, Clock3 } from 'lucide-react'
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <section className={'card '+className}>{children}</section>}
export function Bar({value,label}:{value:number;label?:string}){return <div className="bar" role="progressbar" aria-label={label??'Voortgang'} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div style={{width:Math.min(100,Math.max(0,value))+'%'}}/></div>}
export function Badge({children,tone='teal'}:{children:ReactNode;tone?:'teal'|'amber'|'muted'}){return <span className={'badge '+tone}>{children}</span>}
export function Empty({title,children,action}:{title:string;children:ReactNode;action?:ReactNode}){return <div className="empty"><BookOpen size={30}/><h3>{title}</h3><p>{children}</p>{action}</div>}
export function Stat({label,value,caption,icon}:{label:string;value:ReactNode;caption:string;icon?:ReactNode}){return <Card className="stat"><div className="stat-label">{label}<span className="stat-icon">{icon??<ArrowUpRight size={17}/>}</span></div><strong>{value}</strong><small>{caption}</small></Card>}
export function PageTitle({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:ReactNode}){return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
export function SourceLink({pages,entityId}:{pages:number[];entityId?:string}){const source=entityId?moduleForEntity.get(entityId)?.content?.sourceFile:module1.sourceFile;return <a className="source-link" href={publicUrl(source??module1.sourceFile)+'#page='+pages[0]} target="_blank" rel="noreferrer"><BookOpen size={13}/> PDF p. {pages.join(', ')} <ArrowUpRight size={12}/></a>}
export function Duration({minutes}:{minutes:number}){return <span className="inline"><Clock3 size={14}/>{minutes} min</span>}
export function CheckIcon(){return <span className="check-icon"><Check size={14}/></span>}
