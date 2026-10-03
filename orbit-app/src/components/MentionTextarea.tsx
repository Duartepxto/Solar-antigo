import { useCallback, useLayoutEffect, useRef, type RefObject, type TextareaHTMLAttributes } from "react";
import { type MentionPeer } from "@/lib/mentions";
import { MentionText } from "./MentionText";

/** A native textarea retains selection, undo, IME and accessibility. Its
 * aria-hidden mirror paints mentions without changing wrapping or caret offsets. */
export function MentionTextarea({ inputRef, peers, everyone = false, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  peers: readonly MentionPeer[];
  everyone?: boolean;
}) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const sync = useCallback(() => {
    const input = inputRef.current;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;
    mirror.style.width = `${input.clientWidth}px`;
    // the caret belongs to the textarea and the letters to the mirror, so
    // they must share every metric: take them from the textarea itself,
    // whatever size a composer gives it (a 0.5px difference drifts the
    // caret a letter behind across a line)
    const style = getComputedStyle(input);
    for (const key of ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "wordSpacing", "textIndent"] as const) {
      if (mirror.style[key] !== style[key]) mirror.style[key] = style[key];
    }
    mirror.scrollTop = input.scrollTop;
    mirror.scrollLeft = input.scrollLeft;
  }, [inputRef]);
  // the width the current height was measured at: a draft cleared while the
  // row was briefly narrower (a send swapping its buttons) must re-measure
  // once the width settles, even though the value no longer changes
  const measuredWidth = useRef<number | undefined>(undefined);
  const resize = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    measuredWidth.current = input.clientWidth;
    const scrollTop = input.scrollTop;
    const line = parseFloat(getComputedStyle(input).lineHeight) || 24;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, line * 6)}px`;
    input.scrollTop = scrollTop;
    sync();
  }, [inputRef, sync]);
  // the placeholder counts too: a longer one while the bot works can wrap
  useLayoutEffect(resize, [props.value, props.placeholder, resize]);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      // Width changes can wrap an unchanged draft onto more lines. Compare
      // width only so setting the measured height cannot create a resize loop.
      if (inputRef.current?.clientWidth !== measuredWidth.current) resize();
      else sync();
    });
    if (inputRef.current) observer.observe(inputRef.current);
    return () => observer.disconnect();
  }, [inputRef, resize, sync]);
  return <div className="mention-editor relative min-w-0 flex-1 self-center">
    <div ref={mirrorRef} dir={props.dir} aria-hidden="true" className="mention-editor-mirror pointer-events-none absolute inset-0 overflow-hidden">
      <MentionText text={String(props.value ?? "")} peers={peers} everyone={everyone} />{"\n"}
    </div>
    <textarea {...props} ref={inputRef} onScroll={(event) => { sync(); props.onScroll?.(event); }} />
  </div>;
}
