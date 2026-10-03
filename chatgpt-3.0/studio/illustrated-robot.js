// Original flat vector drawing. SVG paths are the illustration, not a projected mesh.
export const states = { idle: 'Repouso', thinking: 'Pensar', working: 'Trabalhar', talking: 'Falar', happy: 'Concluir', waiting: 'Aprovação', error: 'Erro' };
export const agents = [
  { name: 'Jarvis', role: 'Coordenação', accent: '#edb376', pale: '#f7dcb6' },
  { name: 'Investigador', role: 'Pesquisa', accent: '#88bdda', pale: '#cce4ef' },
  { name: 'Programador', role: 'Desenvolvimento', accent: '#97bba0', pale: '#d3e5d5' },
  { name: 'Designer', role: 'Design', accent: '#cf9eb8', pale: '#efdae5' },
];

export function robotMarkup(agent, state = 'idle') {
  const happy = state === 'happy', error = state === 'error', talking = state === 'talking';
  const eyes = happy
    ? '<path d="M145 171q13-17 26 0m42 0q13-17 26 0" fill="none" stroke="#fff3db" stroke-width="7"/>'
    : error
      ? '<path d="m149 157 18 22m0-22-18 22m65-22 18 22m0-22-18 22" fill="none" stroke="#f6ac96" stroke-width="6"/>'
      : '<path d="M152 160q0-9 7-9t7 9v15q0 9-7 9t-7-9Zm67 0q0-9 7-9t7 9v15q0 9-7 9t-7-9Z" fill="#fff3db" stroke="none"/>';
  const mouth = talking
    ? '<path d="M183 197q9-6 18 0v7q-9 10-18 0Z" fill="#fff3db" stroke="none"/>'
    : error
      ? '<path d="M183 203q9-9 18 0" fill="none" stroke="#f6ac96" stroke-width="3"/>'
      : '<path d="M182 197q10 9 20 0" fill="none" stroke="#fff3db" stroke-width="3"/>';
  const leftPose = happy ? 'rotate(60 147 261)' : state === 'working' ? 'rotate(-28 147 261)' : '';
  const rightPose = happy ? 'rotate(-60 238 261)' : state === 'thinking' ? 'rotate(-142 238 261)' : state === 'working' ? 'rotate(28 238 261)' : talking ? 'rotate(-65 238 261)' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 420" class="robot-drawing" style="--robot-accent:${agent.accent};--robot-pale:${agent.pale}" data-expression="${state}" role="img" aria-label="${agent.name}: ${states[state]}">
    <title>${agent.name} — ${states[state]}</title>
    <style>
      .ink{stroke:#303332;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
      .shell{fill:#efe9dc}.paper{fill:#faf5e9}.accent{fill:var(--robot-accent)}.pale{fill:var(--robot-pale)}
      .line{fill:none;stroke:#8e9288;stroke-width:2;stroke-linecap:round}
    </style>
    <g class="robot-character" data-motion="body">
      <g class="robot-pack ink"><path class="accent" d="M124 245q-13-3-17 11l-4 46q-1 17 17 18l14-1 8-69Z"/><path class="pale" d="m110 273 17 2-3 21-17-2Z"/></g>
      <g class="robot-legs ink">
        <path class="shell" d="m151 319-4 25q-1 13 16 13h12q12-2 10-15l-3-21Zm53 2 1 23q-1 14 13 14h10q16-1 13-15l-5-26Z"/>
        <path class="accent" d="M147 345q-21 4-18 17 4 9 29 8l22-2q7-2 6-13l-3-10Zm60 0-2 13q-1 10 8 11l30 1q20-1 19-11-4-11-27-14Z"/>
        <path class="line" d="m141 359 30 1m45 0h31"/>
      </g>
      <g class="robot-torso ink">
        <path class="shell" d="M154 231q-22 9-25 43l-2 37q0 25 64 25t65-25l-3-37q-4-34-27-43Z"/>
        <path class="pale" d="M157 241q34 15 68 0l-2 19q-31 17-65 0Z"/>
        <path class="paper" d="M163 275q28-8 56 0l5 33q-30 11-65 0Z"/>
        <path class="accent" d="m191 275 10 11-10 11-10-11Z"/>
        <path class="line" d="m151 318 11 3m65 0 11-3"/>
      </g>
      <g transform="${leftPose}"><g class="robot-arm left-arm ink" data-motion="left-arm">
        <path class="shell" d="M143 250q-15-2-22 15l-12 32q-3 13 11 17t21-10l12-33q5-16-10-21Z"/>
        <path class="pale" d="m112 289 24 8-5 13-23-7Z"/>
        <path class="paper" d="M110 305q-13 2-12 15 2 12 14 16 14 3 20-9 3-9-4-15l-7-4Z"/>
        <path class="line" d="m106 318 1 6m7-9 2 8"/>
      </g></g>
      <g transform="${rightPose}"><g class="robot-arm right-arm ink" data-motion="right-arm">
        <path class="shell" d="M240 250q15-2 22 15l12 32q3 13-11 17t-21-10l-12-33q-5-16 10-21Z"/>
        <path class="pale" d="m272 289-24 8 5 13 23-7Z"/>
        <path class="paper" d="M274 305q13 2 12 15-2 12-14 16-14 3-20-9-3-9 4-15l7-4Z"/>
        <path class="line" d="m278 318-1 6m-7-9-2 8"/>
      </g></g>
      <g class="robot-head" data-motion="head">
        <g class="robot-sprout ink" data-motion="sprout">
          <path d="M192 104q3-27-3-47" fill="none" stroke="#8b9b75" stroke-width="4"/>
          <path d="M190 76q-27 0-30-27 28-1 30 27Z" fill="#9fbb86"/>
          <path d="M192 67q-2-26 29-29-1 28-29 29Z" fill="#c1cf9b"/>
          <path d="m167 55 16 14m29-24-14 16" fill="none" stroke="#6b8769" stroke-width="1.5"/>
        </g>
        <g class="ink">
          <path class="accent" d="M106 141q-18-3-22 15l-1 28q2 19 21 17l12-10v-41Zm172 0q18-3 22 15l1 28q-2 19-21 17l-12-10v-41Z"/>
          <path class="paper" d="M96 146q-9 0-10 12l-1 23q0 13 10 14l6-4v-41Zm192 0q9 0 10 12l1 23q0 13-10 14l-6-4v-41Z"/>
          <path class="shell" d="M191 92q-78-1-89 52-6 28 1 60 8 40 89 41 82 0 89-41 8-32 1-61-11-51-91-51Z"/>
          <path class="paper" d="M113 138q22-33 80-32 56 0 76 31-24-20-77-19-52 0-79 20Z" stroke="none"/>
          <path d="M137 133q54-17 110 0 18 6 19 30l-1 28q-3 29-73 29-69 0-73-29l-1-28q0-23 19-30Z" fill="#242c2f"/>
          <path class="accent" d="M175 99h33q2 7-16 8-18-1-17-8Z" stroke="none"/>
          <path class="line" d="m183 235 18 0"/>
        </g>
        <g class="robot-eyes" data-motion="eyes" stroke-linecap="round">${eyes}</g>
        <g class="robot-mouth" data-motion="mouth" stroke-linecap="round">${mouth}</g>
        ${happy ? '<path d="M135 192h10m95 0h10" fill="none" stroke="#cf9f88" stroke-width="4" stroke-linecap="round"/>' : ''}
      </g>
    </g>
    ${state === 'working' ? `<g class="robot-device ink"><path fill="#414e50" d="m138 297 106 0 15 61H122Z"/><path fill="#59686a" d="m138 297 106 0 12 52H125Z"/><path class="pale" d="m191 315-8 11 8 11 8-11Z"/><path fill="#c8cec5" d="M122 351h137l-7 9H129Z"/></g>` : ''}
    ${state === 'thinking' ? `<g class="state-mark" data-motion="mark"><path d="M279 95q0-16 15-16t15 13q0 9-15 15v8m0 10v1" fill="none" stroke="${agent.accent}" stroke-width="4" stroke-linecap="round"/></g>` : ''}
    ${state === 'waiting' ? `<g class="state-mark ink" data-motion="mark"><path class="pale" d="M266 98q0-22 23-22h13q24 0 24 23t-24 23h-23l-14 11 4-21Z"/><path d="M280 99h1m12 0h1m12 0h1" fill="none" stroke="#303332" stroke-width="5"/></g>` : ''}
    ${happy ? `<g class="state-mark" data-motion="mark" fill="none" stroke="${agent.accent}" stroke-width="3" stroke-linecap="round"><path d="m90 98-8-10m3 27-13-1m222-16 8-10m-3 27 13-1"/></g>` : ''}
    ${error ? '<path d="M301 99V79m0 31v1" fill="none" stroke="#f6ac96" stroke-width="5" stroke-linecap="round"/>' : ''}
  </svg>`;
}
