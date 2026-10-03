/** Spoken consent must be the whole utterance, in English or Portuguese.
 * Never interpret a sentence containing an incidental “sim” as permission. */
export function solarCallDecision(text: string): 'allow' | 'deny' | null {
  const phrase = text.trim().toLocaleLowerCase().replace(/[.!?,]+$/g, '').trim();
  if (['yes','yeah','yep','sure','ok','okay','go ahead','do it','allow','approve','approved','sim','podes','pode','podes avançar','avança','aprovo','aprovar','permitir','autorizar','autorizo'].includes(phrase)) return 'allow';
  if (['no','nope','stop','deny','denied','cancel','never','skip it','não','nao','parar','para','cancelar','nega','negar','recuso'].includes(phrase)) return 'deny';
  return null;
}
