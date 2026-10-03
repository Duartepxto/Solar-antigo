export interface Recognition {
  lang:string; continuous:boolean; interimResults:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:((event:{error:string})=>void)|null;
  onend:(()=>void)|null; onstart:(()=>void)|null;
  start():void; stop():void; abort():void;
}
export type RecognitionConstructor=new()=>Recognition;
export function browserRecognition():RecognitionConstructor|undefined {
  const browser=window as Window & {SpeechRecognition?:RecognitionConstructor;webkitSpeechRecognition?:RecognitionConstructor};
  return browser.SpeechRecognition??browser.webkitSpeechRecognition;
}

// Results contain the entire current session, including rewritten interim words.
// Replace that suffix instead of appending it again on every result.
export function beginDictation(Recognition:RecognitionConstructor,base:string,language:string,callbacks:{text:(text:string)=>void;error:(code:string)=>void;listening:(value:boolean)=>void}) {
  const recognition=new Recognition();let closed=false;
  recognition.lang=language;recognition.continuous=true;recognition.interimResults=true;
  recognition.onresult=event=>{
    if(closed)return;
    const transcript=Array.from(event.results,result=>result[0]?.transcript??'').join(' ').trim();
    callbacks.text([base.trimEnd(),transcript].filter(Boolean).join(' '));
  };
  recognition.onstart=()=>{if(!closed)callbacks.listening(true);};
  recognition.onerror=event=>{if(!closed){callbacks.error(event.error);callbacks.listening(false);}};
  recognition.onend=()=>{if(!closed)callbacks.listening(false);};
  try{recognition.start();}catch{callbacks.error('audio-capture');callbacks.listening(false);}
  return {
    stop(){try{recognition.stop();}catch{callbacks.listening(false);}},
    dispose(){closed=true;recognition.onresult=recognition.onerror=recognition.onend=recognition.onstart=null;recognition.abort();},
  };
}
