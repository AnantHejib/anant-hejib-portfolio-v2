"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FaArrowRight, FaTrashCan, FaXmark } from "react-icons/fa6";

type Source={url:string;title:string};
type Message={role:"assistant"|"user";content:string;sources?:Source[];mode?:"portfolio"|"assistant"|"analysis"|"web"};

const welcome:Message={role:"assistant",content:"Good to have you here. I’m Lucy — Anant Hejib’s personal intelligence system. I can brief you on his work, research a topic, untangle code, plan a project, or help you reason through almost anything. What shall we work on?",mode:"assistant"};
const starters=["Brief me on Anant","Diagnose a technical problem","Explore an idea with me"];
const memoryKey="lucy-conversation-v1";

export default function LucyChat() {
  const [open,setOpen]=useState(false);
  const [messages,setMessages]=useState<Message[]>([welcome]);
  const [input,setInput]=useState("");
  const [sending,setSending]=useState(false);
  const [memoryReady,setMemoryReady]=useState(false);
  const listRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(memoryKey)||"null") as Message[]|null;
      if(Array.isArray(saved)&&saved.length) setMessages(saved.slice(-24));
    }catch{}
    setMemoryReady(true);
  },[]);
  useEffect(()=>{if(memoryReady) try{localStorage.setItem(memoryKey,JSON.stringify(messages.slice(-24)));}catch{}},[messages,memoryReady]);
  useEffect(()=>{if(open) requestAnimationFrame(()=>{if(listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight;});},[open,messages,sending]);

  const clearConversation=()=>{setMessages([welcome]);try{localStorage.removeItem(memoryKey);}catch{}};

  const ask=async(question:string)=>{
    const clean=question.trim();
    if(!clean||sending) return;
    const next=[...messages,{role:"user" as const,content:clean}];
    setMessages(next);setInput("");setSending(true);
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),35_000);
    try{
      const response=await fetch("/api/lucy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next.slice(-16).map(({role,content})=>({role,content}))}),signal:controller.signal});
      const data=await response.json().catch(()=>({})) as {answer?:string;error?:string;sources?:Source[];mode?:Message["mode"]};
      setMessages((current)=>[...current,{role:"assistant",content:response.ok&&data.answer?data.answer:(data.error||"I lost the connection for a moment. Please try again."),sources:Array.isArray(data.sources)?data.sources:[],mode:data.mode}]);
    }catch(error){
      const timedOut=error instanceof DOMException&&error.name==="AbortError";
      setMessages((current)=>[...current,{role:"assistant",content:timedOut?"That request took too long, so I stopped it safely. Please try once more or make the question a little more specific.":"I’m offline for a moment. Check your connection and try again.",mode:"assistant"}]);
    }finally{
      window.clearTimeout(timeout);
      setSending(false);
    }
  };

  const submit=(event:FormEvent)=>{event.preventDefault();void ask(input);};

  return <aside className="lucy-shell fixed z-[95]" aria-label="Lucy, Anant Hejib's personal AI assistant">
    {open&&<section className="lucy-panel" role="dialog" aria-modal="false" aria-labelledby="lucy-title">
      <header className="lucy-header"><div className="lucy-avatar" aria-hidden><span>L</span></div><div><div className="flex items-center gap-2"><h2 id="lucy-title">LUCY</h2><i/></div><p>PERSONAL INTELLIGENCE // ONLINE</p></div><div className="lucy-header__actions"><button suppressHydrationWarning type="button" onClick={clearConversation} aria-label="Clear conversation" title="Clear conversation"><FaTrashCan/></button><button suppressHydrationWarning type="button" onClick={()=>setOpen(false)} aria-label="Close Lucy"><FaXmark/></button></div></header>
      <div ref={listRef} className="lucy-messages" aria-live="polite">
        {messages.map((message,index)=><article key={`${message.role}-${index}`} className={`lucy-message lucy-message--${message.role}`}><div className="lucy-message__meta"><span>{message.role==="assistant"?"LUCY":"YOU"}</span>{message.role==="assistant"&&message.mode&&<i>{message.mode==="web"?"WEB RESEARCH":message.mode==="portfolio"?"ANANT'S PORTFOLIO":"PERSONAL ASSISTANT"}</i>}</div><p>{message.content}</p>{message.sources&&message.sources.length>0&&<div className="lucy-sources"><b>SOURCES</b>{message.sources.map((source)=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>}</article>)}
        {sending&&<div className="lucy-typing" aria-label="Lucy is thinking"><i/><i/><i/></div>}
      </div>
      {messages.length===1&&<div className="lucy-starters">{starters.map((starter)=><button suppressHydrationWarning type="button" key={starter} onClick={()=>void ask(starter)}>{starter}</button>)}</div>}
      <form onSubmit={submit} className="lucy-form"><label className="sr-only" htmlFor="lucy-input">Ask Lucy a question</label><input suppressHydrationWarning id="lucy-input" value={input} onChange={(event)=>setInput(event.target.value)} maxLength={2000} autoComplete="off" placeholder="ASK LUCY ANYTHING..."/><button suppressHydrationWarning type="submit" disabled={sending||!input.trim()} aria-label="Send message"><FaArrowRight/></button></form>
      <p className="lucy-disclaimer">Lucy remembers this browser conversation. AI answers may be imperfect; verify important information.</p>
    </section>}
    <button suppressHydrationWarning type="button" className="lucy-launch" onClick={()=>setOpen((value)=>!value)} aria-expanded={open} aria-controls="lucy-title"><span className="lucy-launch__core">L</span><span className="lucy-launch__label"><b>ASK LUCY</b><i>PERSONAL INTELLIGENCE</i></span></button>
  </aside>;
}
