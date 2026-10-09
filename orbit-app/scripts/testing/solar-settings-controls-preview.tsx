import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { List, Field, Actions, ChipRow } from '../../src/orbit/detail/primitives';
import { SettingRow, Switch } from '../../src/components/SettingsPrimitives';
import { t } from '../../src/lib/i18n';
import '../../src/styles.css';
import '../../src/orbit/solar.css';
import '../../src/orbit/solar-settings.css';

document.documentElement.setAttribute('data-solar', '');
document.documentElement.classList.add('dark');
document.body.classList.add('jarvis-solar');

function Preview() {
  const [upkeep, setUpkeep] = useState(true);
  const [voice, setVoice] = useState(false);
  const [compact, setCompact] = useState(true);
  const [field, setField] = useState('Jarvis');
  return <main className="solar-settings mx-auto flex max-w-[560px] flex-col gap-5 px-6 py-8">
    <h1 className="text-[19px] text-ink">Solar settings · control fixture</h1>
    <List title={t('orbit.p.memory.upkeep')} items={[
      { key: 'upkeep', name: t('orbit.p.memory.upkeepSwitch'), on: upkeep, onClick: () => setUpkeep(!upkeep) },
      { key: 'voice', name: 'Voice replies', meta: 'Per agent', on: voice, onClick: () => setVoice(!voice) },
      { key: 'disabled', name: 'Disabled enabled setting', on: true, disabled: true, onClick: () => {} },
      { key: 'long', name: 'A longer translated setting label that must wrap without covering the switch', on: true, onClick: () => {} },
      { key: 'status', name: 'Connected engine', meta: 'Ready', dot: '#38d591' },
    ]}/>
    <p className="text-[12px] leading-[1.5] text-ink/55">{t('orbit.p.memory.upkeepDesc')}</p>
    <SettingRow title="Compact toggle"><Switch aria-label="Compact toggle" checked={compact} onClick={() => setCompact(!compact)}/></SettingRow>
    <SettingRow title="Disabled compact toggle"><Switch aria-label="Disabled compact toggle" checked disabled/></SettingRow>
    <Field label="Agent name" value={field} onChange={setField}/>
    <ChipRow label="Output" chips={[{ label: 'Text', active: true }, { label: 'Voice' }, { label: 'Unavailable', disabled: true }]}/>
    <Actions actions={[{ label: 'Save preferences', onClick: () => {} }, { label: 'Unavailable action', onClick: () => {}, disabled: true }]}/>
  </main>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
