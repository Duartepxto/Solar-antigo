import { cn } from "@/lib/cn";
import { MAUS_COLORS, type MausColor } from "@/lib/mascot";
import { useStore } from "@/state/store";
import { SolarIdentity } from './SolarIdentity';

/** A live character face. The Orbit scene draws the bot's particle character
 * (or You, with id "you") into every such canvas on screen, every few frames,
 * so a face in a chat header, a pill or a list row matches the map. A bot
 * that is not on the map (archived, on another computer, a draft, a deleted
 * sender) is drawn at rest in `color`. */
export function OrbitFace({ id, size = 24, className, label, color, dim = false }: {
  id: string;
  size?: number;
  className?: string;
  label?: string;
  /** the bot's colour, for a face the map does not draw */
  color?: string;
  /** an archived or absent bot: drawn fainter */
  dim?: boolean;
}) {
  if (import.meta.env.VITE_JARVIS_SOLAR === 'true') return <SolarIdentity id={id} size={size} className={className} label={label} dim={dim} />;
  return (
    <canvas data-orbit-face={id} data-orbit-color={color} data-orbit-dim={dim || undefined}
      style={{ width: size, height: size }} className={cn("shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })} />
  );
}

type FaceBot = { id?: string; name?: string; color?: MausColor | string; hidden?: boolean };
type FaceProps = { size?: number; label?: string; className?: string; dim?: boolean };

/** A bot's face anywhere in the chrome: always Orbit's particle character,
 * never another mascot. Pass the bot, or just its id to look it up. */
export function BotFace({ bot, id, ...props }: FaceProps & { bot?: FaceBot; id?: string }) {
  return bot ? <FaceOf bot={bot} {...props} /> : id ? <FaceById id={id} {...props} /> : null;
}

function FaceById({ id, ...props }: FaceProps & { id: string }) {
  const { state } = useStore();
  const bot = state.bots.find((b) => b.id === id);
  if (bot) return <FaceOf bot={bot} {...props} />;
  // a sender that no longer exists
  return <OrbitFace id={id} size={props.size} className={props.className} label={props.label} color={MAUS_COLORS.blue} dim />;
}

function FaceOf({ bot, size = 24, label, className, dim }: FaceProps & { bot: FaceBot }) {
  const color = bot.color ? (MAUS_COLORS as Record<string, string>)[bot.color] ?? bot.color : MAUS_COLORS.blue;
  // a draft has no id yet: key its face by name so it stays the same while typed
  const key = bot.id ?? `draft:${bot.name ?? ""}`;
  return <OrbitFace id={key} size={size} className={className} label={label ?? bot.name} color={color} dim={dim ?? bot.hidden} />;
}
