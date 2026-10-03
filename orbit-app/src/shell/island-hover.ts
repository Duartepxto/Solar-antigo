// Whether the pointer is over talk mode's island, so the click-through
// window takes the mouse there (a click ends listening, stops a turn or
// quiets Orbit). Two sources: main, which watches the pointer while talk is
// on screen (the one that counts on a Mac: macOS forwards no moves to a
// click-through panel over the notch or the menu bar), and the mouse moves
// the window forwards to the page where it does. Both test the same rect
// (the island grown by 6 pt), so the newest report wins and main hears each
// change once. Pure: TalkSurface feeds it, the tests drive it.

export interface IslandPointerOutputs {
  /** stop / start ignoring the mouse over the island (clicks) */
  interactive(take: boolean): void;
}

export class IslandPointer {
  private over = false;
  private last: "page" | "main" | null = null;
  private taking = false;
  private takes = false;

  constructor(private readonly out: IslandPointerOutputs) {}

  /** Is the pointer over the island, as the newest report says? */
  get isOver(): boolean {
    return this.over;
  }

  /** A forwarded mouse move (or the page leaving) tested against the rect. */
  fromPage(over: boolean) {
    this.report("page", over);
  }

  /** Main's pointer watch: enter / leave. */
  fromMain(over: boolean) {
    this.report("main", over);
  }

  /** The island changed size under the last forwarded point: test it again,
   * unless main spoke since (that point may be long stale; main tests the
   * new size itself). */
  retest(over: boolean) {
    if (this.last === "page") this.report("page", over);
  }

  /** Talk is on (the island takes a click) or has gone back to rest. */
  setTakes(takes: boolean) {
    this.takes = takes;
    this.apply();
  }

  private report(source: "page" | "main", over: boolean) {
    this.last = source;
    this.over = over;
    this.apply();
  }

  private apply() {
    const take = this.over && this.takes;
    if (take !== this.taking) {
      this.taking = take;
      this.out.interactive(take);
    }
  }
}
