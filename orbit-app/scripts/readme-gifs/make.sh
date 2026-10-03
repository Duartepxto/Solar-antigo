#!/bin/sh
# Re-record the README GIFs from docs/design/orbit/prototype (macOS: needs
# Google Chrome and ffmpeg). Writes docs/screenshots/orbit*.gif.
#   sh scripts/readme-gifs/make.sh
set -e
root="$(cd "$(dirname "$0")/../.." && pwd)"
work="$(mktemp -d)"
url="file://$root/docs/design/orbit/prototype/orbit.dc.html"
rec() { # name width colors crop steps
  rm -rf "$work/profile"
  node "$root/scripts/readme-gifs/record.mjs" "$url" "$work/$1" "$5" | grep -v '^pressed' || true
  ffmpeg -loglevel error -y -f concat -safe 0 -i "$work/$1/frames.txt" \
    -vf "fps=20,${4:+crop=$4,}scale=${2}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${3}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    "$root/docs/screenshots/$6.gif"
  echo "$6.gif"
}
# the welcome flow up to a given step, without filming
welcome='{"cmdk":1},{"wait":500},{"type":"welcome"},{"wait":400},{"text":"Replay the welcome tour"},{"wait":1000}'
skip=''; for b in Continue Next Next Next Next Next Continue Continue Continue Continue; do skip="$skip,{\"any\":[\"$b\"]},{\"wait\":700}"; done
tour=''; for i in 1 2 3 4 5 6 7; do tour="$tour,{\"any\":[\"Next\"]},{\"film\":1500}"; done

rec hero 860 96 "" '[{"film":3500},{"move":[410,305]},{"film":400},{"click":[410,305]},{"film":4800},{"key":"Escape"},{"film":2600}]' orbit
rec map 800 96 "" '[{"wait":5000},{"film":9000}]' orbit-map
rec offer 800 96 "" '[{"wait":2500},{"filmUntil":"View"},{"film":1200},{"text":"View"},{"film":6000}]' orbit-show
rec welcome 600 128 600:640:420:130 "[$welcome,{\"film\":1000},{\"button\":\"Continue\"},{\"film\":1800},{\"button\":\"Next\"},{\"film\":1500},{\"button\":\"Next\"},{\"film\":1500},{\"any\":[\"Next\"]},{\"any\":[\"Next\"]},{\"any\":[\"Next\"]},{\"wait\":900},{\"button\":\"Continue\"},{\"film\":1900},{\"button\":\"Continue\"},{\"film\":1200},{\"any\":[\"Continue\"]},{\"any\":[\"Continue\"]},{\"wait\":900},{\"film\":1800}]" orbit-welcome
rec tour 800 80 "" "[$welcome$skip,{\"film\":600},{\"button\":\"Start chatting\"},{\"film\":2600},{\"filmUntil\":\"Next\"},{\"film\":1500}$tour,{\"any\":[\"Finish\"]},{\"film\":1200}]" orbit-tour
rm -rf "$work"
