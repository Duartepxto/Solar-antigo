# Solar — índice de interface e código

Revisão de 5 de outubro de 2026; versão 0.1.87; commit 7ac1c04.

Extração estática de componentes, traduções, controlos e referências de API. Uma entrada pode ser condicional, antiga, exclusivamente de outra plataforma ou inacessível no Solar. Não representa um teste de funcionamento. Controlos genéricos e campos dinâmicos podem não ter um rótulo literal extraível.

## orbit-app/src/components/AboutDialog.tsx

Fonte: [orbit-app/src/components/AboutDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| About {app} | `about.title` | [orbit-app/src/components/AboutDialog.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:57) |
| Close | `common.close` | [orbit-app/src/components/AboutDialog.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:58) |
| Bots that do real work on their own computer. Everything runs on this machine; your bots’ files, memory and logins stay here. Apache 2.0 licensed. | `about.bodyPlain` | [orbit-app/src/components/AboutDialog.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:62) |
| {app} is built on {base}: bots that do real work on their own computer. Everything runs on this machine; your bots’ files, memory and logins stay here. Apache 2.0 licensed. | `about.body` | [orbit-app/src/components/AboutDialog.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:62) |
| Version | `about.version` | [orbit-app/src/components/AboutDialog.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:65) |
| Harness | `about.harness` | [orbit-app/src/components/AboutDialog.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:66) |
| Source code on GitHub | `about.source` | [orbit-app/src/components/AboutDialog.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:67) |
| Open | `about.open` | [orbit-app/src/components/AboutDialog.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:69) |
| Documentation | `about.docs` | [orbit-app/src/components/AboutDialog.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:68) |
| Releases | `about.releases` | [orbit-app/src/components/AboutDialog.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:69) |
| License | `about.license` | [orbit-app/src/components/AboutDialog.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:73) |
| View | `about.view` | [orbit-app/src/components/AboutDialog.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:70) |
| Textures · Solar System Scope | `jarvis.solar.textureCredit` | [orbit-app/src/components/AboutDialog.tsx:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:72) |

## orbit-app/src/components/AboutMeSettings.tsx

Fonte: [orbit-app/src/components/AboutMeSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| About me | `settings.profile.aboutMe` | [orbit-app/src/components/AboutMeSettings.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:30) |
| Shared with every bot in private and group chats. Saved automatically. | `settings.profile.aboutMeHelp` | [orbit-app/src/components/AboutMeSettings.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:37) |
| Saving… | `settings.profile.saving` | [orbit-app/src/components/AboutMeSettings.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:48) |
| Saved | `settings.profile.saved` | [orbit-app/src/components/AboutMeSettings.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:49) |
| Could not save. Your changes are still here. | `settings.profile.saveError` | [orbit-app/src/components/AboutMeSettings.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:50) |
| Retry | `settings.profile.retry` | [orbit-app/src/components/AboutMeSettings.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:51) |
| Added by your bots | `settings.profile.learned.title` | [orbit-app/src/components/AboutMeSettings.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:98) |
| Facts your bots learned about you from your own messages. Every bot reads About me; remove anything that's wrong and it won't be added again. | `settings.profile.learned.hint` | [orbit-app/src/components/AboutMeSettings.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:99) |
| from {name} | `settings.profile.learned.from` | [orbit-app/src/components/AboutMeSettings.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:105) |
| Remove | `settings.profile.learned.remove` | [orbit-app/src/components/AboutMeSettings.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:109) |
| Could not update About me. Try again. | `settings.profile.learned.error` | [orbit-app/src/components/AboutMeSettings.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:114) |

## orbit-app/src/components/ActivityRun.tsx

Fonte: [orbit-app/src/components/ActivityRun.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivityRun.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Show every step | `chat.run.showSteps` | [orbit-app/src/components/ActivityRun.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivityRun.tsx:51) |

## orbit-app/src/components/ActivitySection.tsx

Fonte: [orbit-app/src/components/ActivitySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:1). 7 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Changed: {paths} | `activity.changed` | [orbit-app/src/components/ActivitySection.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:35) |
| Before | `activity.before` | [orbit-app/src/components/ActivitySection.tsx:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:41) |
| After | `activity.after` | [orbit-app/src/components/ActivitySection.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:42) |
| Activity | `activity.title` | [orbit-app/src/components/ActivitySection.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:90) |
| Who changed settings, people, access and bots on this workspace, and who answered approval cards. Kept on this server for {days} days; nothing is sent to your organisation's Admin. | `activity.subtitle` | [orbit-app/src/components/ActivitySection.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:90) |
| Who | `activity.who` | [orbit-app/src/components/ActivitySection.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:93) |
| Name or email | `activity.whoPlaceholder` | [orbit-app/src/components/ActivitySection.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:94) |
| What | `activity.what` | [orbit-app/src/components/ActivitySection.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:97) |
| From | `activity.from` | [orbit-app/src/components/ActivitySection.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:103) |
| To | `activity.to` | [orbit-app/src/components/ActivitySection.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:107) |
| Refresh | `activity.refresh` | [orbit-app/src/components/ActivitySection.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:110) |
| Export CSV | `activity.export` | [orbit-app/src/components/ActivitySection.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:114) |
| Couldn't load the activity: {message} | `activity.error` | [orbit-app/src/components/ActivitySection.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:117) |
| Nothing matches in this range. | `activity.empty` | [orbit-app/src/components/ActivitySection.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:118) |
| Showing the newest {shown} of {total}. Narrow the filters, or export CSV for all of them. | `activity.more` | [orbit-app/src/components/ActivitySection.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:124) |

## orbit-app/src/components/AndroidDevicePanel.tsx

Fonte: [orbit-app/src/components/AndroidDevicePanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Connected directly over USB. The screen and controls stay on this computer. | `computer.android.usbSubtitle` | [orbit-app/src/components/AndroidDevicePanel.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:206) |
| USB | `computer.android.usb` | [orbit-app/src/components/AndroidDevicePanel.tsx:210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:210) |
| Unlock the Android phone, accept the “Allow USB debugging” prompt, and optionally choose Always allow from this computer. | `computer.android.unauthorized` | [orbit-app/src/components/AndroidDevicePanel.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:231) |
| The phone is {state}. Reconnect the USB cable and keep USB debugging enabled. | `computer.android.badState` | [orbit-app/src/components/AndroidDevicePanel.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:232) |
| Interactive Android screen for {name} | `computer.android.screenAria` | [orbit-app/src/components/AndroidDevicePanel.tsx:238](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:238) |
| {name} screen | `computer.android.screenAlt` | [orbit-app/src/components/AndroidDevicePanel.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:278) |
| Back | `computer.android.back` | [orbit-app/src/components/AndroidDevicePanel.tsx:297](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:297) |
| Home | `computer.android.home` | [orbit-app/src/components/AndroidDevicePanel.tsx:303](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:303) |
| Recent | `computer.android.recent` | [orbit-app/src/components/AndroidDevicePanel.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:309) |
| Click to tap, drag or use a trackpad to scroll, and type after selecting a field. | `computer.android.hint` | [orbit-app/src/components/AndroidDevicePanel.tsx:313](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:313) |
| First-time USB setup | `computer.android.setupTitle` | [orbit-app/src/components/AndroidDevicePanel.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:326) |
| Connect the phone with a data-capable USB cable and keep it unlocked. | `computer.android.step1` | [orbit-app/src/components/AndroidDevicePanel.tsx:329](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:329) |
| Enable Developer options by tapping {buildNumber} seven times in About phone, then turn on {usbDebugging}. | `computer.android.step2` | [orbit-app/src/components/AndroidDevicePanel.tsx:331](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:331) |
| Accept | `computer.android.step3a` | [orbit-app/src/components/AndroidDevicePanel.tsx:338](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:338) |
| Allow USB debugging | `computer.android.allowUsbDebugging` | [orbit-app/src/components/AndroidDevicePanel.tsx:339](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:339) |
| on the phone. You can choose Always allow for this trusted computer. | `computer.android.step3b` | [orbit-app/src/components/AndroidDevicePanel.tsx:340](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:340) |
| Agent control uses this same authorized USB connection. No phone companion app, account, Tailscale, or wireless pairing is needed. | `computer.android.agentNote` | [orbit-app/src/components/AndroidDevicePanel.tsx:344](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:344) |
| Once connected, ask any compatible Maus to open an Android app or complete a task on your phone. The bundled Phone Harness skill loads automatically for phone requests. | `computer.android.harnessNote` | [orbit-app/src/components/AndroidDevicePanel.tsx:347](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:347) |

## orbit-app/src/components/ApiKeys.tsx

Fonte: [orbit-app/src/components/ApiKeys.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:1). 10 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| About {label} | `keys.aboutAria` | [orbit-app/src/components/ApiKeys.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:144) |
| {label} help | `keys.helpAria` | [orbit-app/src/components/ApiKeys.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:156) |
| API key authenticated. Chat not tested. | `keys.testAuthenticated` | [orbit-app/src/components/ApiKeys.tsx:247](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:247) |
| Model catalog reachable: {models}. Authentication and chat not verified. | `keys.testCatalog` | [orbit-app/src/components/ApiKeys.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:248) |
| Model catalog reachable. Authentication and chat not verified. | `keys.testCatalogNoModels` | [orbit-app/src/components/ApiKeys.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:248) |
| The provider rejected this key. | `keys.testRejected` | [orbit-app/src/components/ApiKeys.tsx:249](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:249) |
| Could not reach the provider from this server. | `keys.testUnreachable` | [orbit-app/src/components/ApiKeys.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:250) |
| The provider answered unexpectedly (status {status}). | `keys.testUnexpected` | [orbit-app/src/components/ApiKeys.tsx:251](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:251) |
| Unsaved key — save it to use it. | `keys.testDraft` | [orbit-app/src/components/ApiKeys.tsx:253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:253) |
| Saved key: | `keys.testSaved` | [orbit-app/src/components/ApiKeys.tsx:253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:253) |
| Optional | `keys.optional` | [orbit-app/src/components/ApiKeys.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:352) |
| Configured | `keys.configured` | [orbit-app/src/components/ApiKeys.tsx:272](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:272) |
| ••••••••  (paste to replace) | `keys.replace` | [orbit-app/src/components/ApiKeys.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:282) |
| Remove the saved key | `keys.removeKey` | [orbit-app/src/components/ApiKeys.tsx:297](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:297) |
| Save | `common.save` | [orbit-app/src/components/ApiKeys.tsx:437](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:437) |
| Clear | `keys.clear` | [orbit-app/src/components/ApiKeys.tsx:389](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:389) |
| Testing… | `keys.testing` | [orbit-app/src/components/ApiKeys.tsx:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:308) |
| Test | `keys.test` | [orbit-app/src/components/ApiKeys.tsx:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:308) |
| Self-hosted VPS | `keys.vps.label` | [orbit-app/src/components/ApiKeys.tsx:350](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:350) |
| Connected | `keys.connected` | [orbit-app/src/components/ApiKeys.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:354) |
| SSH config alias for the Linux VPS. Orbit uses your normal SSH config and agent; it does not store keys or passwords. See the  | `keys.vps.descBefore` | [orbit-app/src/components/ApiKeys.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:357) |
| setup guide | `keys.vps.descLink` | [orbit-app/src/components/ApiKeys.tsx:364](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:364) |
|  for the required SSH alias shape. | `keys.vps.descAfter` | [orbit-app/src/components/ApiKeys.tsx:366](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:366) |
| Self-hosted VPS SSH config alias | `keys.vps.aria` | [orbit-app/src/components/ApiKeys.tsx:375](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:375) |
| Remove the saved alias | `keys.vps.removeAlias` | [orbit-app/src/components/ApiKeys.tsx:387](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:387) |
| OpenAI-compatible base URL | `keys.openaiCompat.url` | [orbit-app/src/components/ApiKeys.tsx:428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:428) |
| OpenRouter by default. Use https://api.openai.com/v1 for OpenAI directly, or your gateway's URL. | `keys.openaiCompat.urlHint` | [orbit-app/src/components/ApiKeys.tsx:440](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:440) |

## orbit-app/src/components/ApprovalCard.tsx

Fonte: [orbit-app/src/components/ApprovalCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| take an action | `approval.tool.takeAction` | [orbit-app/src/components/ApprovalCard.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:35) |
| browser | `approval.browserProfile.anyBrowser` | [orbit-app/src/components/ApprovalCard.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:74) |
| A bot | `approval.browserProfile.someBot` | [orbit-app/src/components/ApprovalCard.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:75) |
| Use your logged-in {browser}? | `approval.browserProfile.title` | [orbit-app/src/components/ApprovalCard.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:77) |
| {name} wants to control the {browser} window you have open, signed in as you: it can act on any site you're logged into. Allow for this conversation? | `approval.browserProfile.body` | [orbit-app/src/components/ApprovalCard.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:78) |
| {name} wants to update its profile | `approval.card.profileWantsToOwn` | [orbit-app/src/components/ApprovalCard.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:118) |
| Someone | `approval.someone` | [orbit-app/src/components/ApprovalCard.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:120) |
| {name} wants to update @{target}'s profile | `approval.card.profileWantsToOther` | [orbit-app/src/components/ApprovalCard.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:119) |
| {name} wants to {action} | `approval.card.namedWantsTo` | [orbit-app/src/components/ApprovalCard.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:138) |
| Wants to {action} | `approval.card.wantsTo` | [orbit-app/src/components/ApprovalCard.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:139) |
| Routine details | `approval.aria.routineDetails` | [orbit-app/src/components/ApprovalCard.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:153) |
| Skill details | `approval.aria.skillDetails` | [orbit-app/src/components/ApprovalCard.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:155) |
| Profile change | `approval.aria.profileChange` | [orbit-app/src/components/ApprovalCard.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:157) |
| Approval details | `approval.aria.details` | [orbit-app/src/components/ApprovalCard.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:158) |
| Expired — ask for a fresh proposal | `approval.status.expired` | [orbit-app/src/components/ApprovalCard.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:178) |
| Profile updated | `approval.status.profileUpdated` | [orbit-app/src/components/ApprovalCard.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:187) |
| Routine confirmed | `approval.status.routineConfirmed` | [orbit-app/src/components/ApprovalCard.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:189) |
| Skill confirmed | `approval.status.skillConfirmed` | [orbit-app/src/components/ApprovalCard.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:191) |
| Allowed | `approval.status.allowed` | [orbit-app/src/components/ApprovalCard.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:192) |
| Cancelled | `approval.status.cancelled` | [orbit-app/src/components/ApprovalCard.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:197) |
| Denied | `approval.status.denied` | [orbit-app/src/components/ApprovalCard.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:198) |
| Waiting for your confirmation below | `approval.status.waitingConfirmation` | [orbit-app/src/components/ApprovalCard.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:204) |
| Waiting for your answer below | `approval.status.waitingAnswer` | [orbit-app/src/components/ApprovalCard.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:205) |

## orbit-app/src/components/ApprovalModeSelector.tsx

Fonte: [orbit-app/src/components/ApprovalModeSelector.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Auto (full access) | `approvalMode.antigravity.label` | [orbit-app/src/components/ApprovalModeSelector.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:60) |
| Auto | `approvalMode.auto.chip` | [orbit-app/src/components/ApprovalModeSelector.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:61) |
| Automatically approve tool requests for this bot, including commands, edits, and computer actions. No automatic review. | `approvalMode.antigravity.desc` | [orbit-app/src/components/ApprovalModeSelector.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:62) |
| This provider has no automatic review; behaves like Ask | `approvalMode.noNativeReview` | [orbit-app/src/components/ApprovalModeSelector.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:66) |
| Command allowlist | `commandAllowlist.title` | [orbit-app/src/components/ApprovalModeSelector.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:168) |
| {mode} for {provider} | `approvalMode.triggerAria` | [orbit-app/src/components/ApprovalModeSelector.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:178) |
| Stop this bot's turn before changing its approval level | `approvalMode.busy` | [orbit-app/src/components/ApprovalModeSelector.tsx:242](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:242) |
| Approval mode for {provider} | `approvalMode.menuAria` | [orbit-app/src/components/ApprovalModeSelector.tsx:210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:210) |
| How should {provider} actions be approved? | `approvalMode.question` | [orbit-app/src/components/ApprovalModeSelector.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:220) |
| Learn more | `approvalMode.learnMore` | [orbit-app/src/components/ApprovalModeSelector.tsx:227](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:227) |
| Custom approval must be changed in the local packaged desktop app | `approvalMode.customLocalOnly` | [orbit-app/src/components/ApprovalModeSelector.tsx:242](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:242) |
| Custom approval must be changed in the local packaged desktop app. | `approvalMode.customLocalOnlyDot` | [orbit-app/src/components/ApprovalModeSelector.tsx:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:273) |
| Auto (full access) is available in the local packaged desktop app. | `approvalMode.antigravityLocalOnly` | [orbit-app/src/components/ApprovalModeSelector.tsx:275](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:275) |
| Full and Custom are available in the packaged desktop app. | `approvalMode.trustedLocalOnly` | [orbit-app/src/components/ApprovalModeSelector.tsx:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:276) |

## orbit-app/src/components/ArchivedBotsDialog.tsx

Fonte: [orbit-app/src/components/ArchivedBotsDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Archive {name}? | `sidebar.confirm.archiveTitle` | [orbit-app/src/components/ArchivedBotsDialog.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:29) |
| {name} leaves the sidebar, but every conversation is kept. You can restore it any time from Archived bots. | `sidebar.confirm.archiveBody` | [orbit-app/src/components/ArchivedBotsDialog.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:30) |
| Archive | `sidebar.bot.archive` | [orbit-app/src/components/ArchivedBotsDialog.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:31) |
| Delete {name}? | `sidebar.confirm.deleteTitle` | [orbit-app/src/components/ArchivedBotsDialog.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:35) |
| This permanently removes {name}, its conversations, files, memory, and any computer it owns — including that computer's files and browser sign-ins. Shared team computers remain. This cannot be undone. | `sidebar.confirm.deleteBody` | [orbit-app/src/components/ArchivedBotsDialog.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:36) |
| Delete | `common.delete` | [orbit-app/src/components/ArchivedBotsDialog.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:90) |
| Delete all archived bots? | `sidebar.archived.deleteAllTitle` | [orbit-app/src/components/ArchivedBotsDialog.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:44) |
| This permanently deletes every archived bot listed here — conversations and workspaces included. This cannot be undone. | `sidebar.archived.deleteAllBody` | [orbit-app/src/components/ArchivedBotsDialog.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:45) |
| Delete all | `sidebar.archived.deleteAll` | [orbit-app/src/components/ArchivedBotsDialog.tsx:209](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:209) |
| Bot | `sidebar.archived.botFallback` | [orbit-app/src/components/ArchivedBotsDialog.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:71) |
| Restore | `sidebar.archived.restore` | [orbit-app/src/components/ArchivedBotsDialog.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:80) |
| Delete {name} | `sidebar.archived.deleteAria` | [orbit-app/src/components/ArchivedBotsDialog.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:86) |
| {name} restored | `sidebar.archived.restored` | [orbit-app/src/components/ArchivedBotsDialog.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:138) |
| 1 bot restored | `sidebar.archived.restoredOne` | [orbit-app/src/components/ArchivedBotsDialog.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:164) |
| {count} bots restored | `sidebar.archived.restoredMany` | [orbit-app/src/components/ArchivedBotsDialog.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:165) |
| Archived bots | `sidebar.archived.title` | [orbit-app/src/components/ArchivedBotsDialog.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:187) |
| Conversations are kept until you choose to delete a bot. | `sidebar.archived.subtitle` | [orbit-app/src/components/ArchivedBotsDialog.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:188) |
| Restore all | `sidebar.archived.restoreAll` | [orbit-app/src/components/ArchivedBotsDialog.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:198) |
| Close archived bots | `sidebar.archived.close` | [orbit-app/src/components/ArchivedBotsDialog.tsx:216](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:216) |
| {count} archived | `sidebar.archived.count` | [orbit-app/src/components/ArchivedBotsDialog.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:223) |

## orbit-app/src/components/AttachmentGallery.tsx

Fonte: [orbit-app/src/components/AttachmentGallery.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This video cannot be played here. You can still save a copy. | `attach.videoUnavailable` | [orbit-app/src/components/AttachmentGallery.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:187) |
| Preview is limited to 25 MB. | `attach.fileTooLarge` | [orbit-app/src/components/AttachmentGallery.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:124) |
| Preview {name} | `attach.previewVideo` | [orbit-app/src/components/AttachmentGallery.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:195) |
| Loading video… | `attach.videoLoading` | [orbit-app/src/components/AttachmentGallery.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:199) |
| Retry | `chat.retry` | [orbit-app/src/components/AttachmentGallery.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:199) |
| Load video | `attach.loadVideo` | [orbit-app/src/components/AttachmentGallery.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:199) |
| Loads on request · up to 25 MB | `attach.videoHint` | [orbit-app/src/components/AttachmentGallery.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:200) |
| Close video preview | `attach.closeVideo` | [orbit-app/src/components/AttachmentGallery.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:204) |
| 1 attachment | `attach.gallerySingle` | [orbit-app/src/components/AttachmentGallery.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:259) |
| {count} attachments | `attach.galleryCount` | [orbit-app/src/components/AttachmentGallery.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:259) |
| Attachments | `attach.gallery` | [orbit-app/src/components/AttachmentGallery.tsx:261](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:261) |
| Image | `attach.image` | [orbit-app/src/components/AttachmentGallery.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:270) |
| Show less | `attach.showLess` | [orbit-app/src/components/AttachmentGallery.tsx:286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:286) |
| Show {count} more | `attach.showMore` | [orbit-app/src/components/AttachmentGallery.tsx:286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:286) |

## orbit-app/src/components/AttachmentPreview.tsx

Fonte: [orbit-app/src/components/AttachmentPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| That file could not be downloaded | `attach.downloadFailed` | [orbit-app/src/components/AttachmentPreview.tsx:226](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:226) |
| This older file reference is no longer available to download | `attach.unavailableOld` | [orbit-app/src/components/AttachmentPreview.tsx:262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:262) |
| That file could not be saved | `attach.saveFailed` | [orbit-app/src/components/AttachmentPreview.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:311) |
| Preview {name} | `attach.previewAria` | [orbit-app/src/components/AttachmentPreview.tsx:602](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:602) |
| {index} of {count} | `attach.position` | [orbit-app/src/components/AttachmentPreview.tsx:425](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:425) |
| Image preview | `attach.imagePreview` | [orbit-app/src/components/AttachmentPreview.tsx:426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:426) |
| Download {name} | `attach.downloadAria` | [orbit-app/src/components/AttachmentPreview.tsx:438](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:438) |
| Download | `attach.download` | [orbit-app/src/components/AttachmentPreview.tsx:439](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:439) |
| Open original {name} | `attach.openOriginalAria` | [orbit-app/src/components/AttachmentPreview.tsx:450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:450) |
| Open original | `attach.openOriginal` | [orbit-app/src/components/AttachmentPreview.tsx:451](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:451) |
| Close image preview | `attach.close` | [orbit-app/src/components/AttachmentPreview.tsx:459](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:459) |
| This image could not be loaded. | `attach.ui.thisImageCouldNotBeLoaded` | [orbit-app/src/components/AttachmentPreview.tsx:476](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:476) |
| Previous image | `attach.previous` | [orbit-app/src/components/AttachmentPreview.tsx:503](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:503) |
| Next image | `attach.next` | [orbit-app/src/components/AttachmentPreview.tsx:511](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:511) |
| Image unavailable | `attach.ui.imageUnavailable` | [orbit-app/src/components/AttachmentPreview.tsx:561](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:561) |
| Retry loading {name} | `attach.retryAria` | [orbit-app/src/components/AttachmentPreview.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:579) |
| Retry | `chat.retry` | [orbit-app/src/components/AttachmentPreview.tsx:581](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:581) |
| Preview attached image {name} | `attach.previewImageAria` | [orbit-app/src/components/AttachmentPreview.tsx:601](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:601) |
| External image hidden for privacy | `attach.externalHidden` | [orbit-app/src/components/AttachmentPreview.tsx:736](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:736) |
| Load image | `attach.loadImage` | [orbit-app/src/components/AttachmentPreview.tsx:737](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:737) |
| This older image reference is no longer available | `attach.oldImage` | [orbit-app/src/components/AttachmentPreview.tsx:741](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:741) |
| Open original | `attachmentPreview.ui.openOriginal` | [orbit-app/src/components/AttachmentPreview.tsx:753](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:753) |
| {name} — unavailable legacy attachment | `attach.legacyFile` | [orbit-app/src/components/AttachmentPreview.tsx:773](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:773) |
| Unavailable | `attach.unavailable` | [orbit-app/src/components/AttachmentPreview.tsx:776](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:776) |
| Saved to {path} | `attach.savedTo` | [orbit-app/src/components/AttachmentPreview.tsx:782](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:782) |
| Retry saving {name} | `attach.retrySaveAria` | [orbit-app/src/components/AttachmentPreview.tsx:791](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:791) |
| Save a copy of {name} | `attach.saveAria` | [orbit-app/src/components/AttachmentPreview.tsx:792](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:792) |
| Downloading… | `attach.downloading` | [orbit-app/src/components/AttachmentPreview.tsx:817](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:817) |
| Downloaded | `attach.downloaded` | [orbit-app/src/components/AttachmentPreview.tsx:819](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:819) |

## orbit-app/src/components/AutomaticRecoverySettings.tsx

Fonte: [orbit-app/src/components/AutomaticRecoverySettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not save automatic recovery. Please try again. | `settings.recovery.error` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:33) |
| Automatic recovery | `settings.recovery.title` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:40) |
| Use a backup model | `settings.recovery.enable` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:42) |
| If an ACP engine (such as Qwen or OpenCode) fails before starting, try a backup once. Work that may have already run is not replayed. | `settings.recovery.help` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:47) |
| Applies to direct bot threads, including Chief and delegated work. Channels are not included. Only this thread switches; bot defaults stay unchanged. | `settings.recovery.scope` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:48) |
| Backup engine | `settings.recovery.engine` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:51) |
| Choose an engine | `settings.recovery.chooseEngine` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:55) |
| {name} (unavailable) | `settings.recovery.unavailable` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:67) |
| Backup model | `settings.recovery.model` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:62) |
| Choose a model | `settings.recovery.chooseModel` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:66) |
| Permissions stay unchanged; some engine switches need confirmation. Using the backup can incur charges from its provider. | `settings.recovery.charges` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:72) |
| Choose an available backup engine and model before saving. | `settings.recovery.required` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:73) |
| Saving… | `settings.threads.saving` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:76) |
| Save | `common.save` | [orbit-app/src/components/AutomaticRecoverySettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:75) |

## orbit-app/src/components/bot-settings/HistorySection.tsx

Fonte: [orbit-app/src/components/bot-settings/HistorySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Loading… | `history.ui.loading` | [orbit-app/src/components/bot-settings/HistorySection.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:42) |
| No changes recorded yet. | `history.ui.noChangesRecordedYet` | [orbit-app/src/components/bot-settings/HistorySection.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:45) |
| Couldn’t refresh history. | `history.ui.couldnTRefreshHistory` | [orbit-app/src/components/bot-settings/HistorySection.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:53) |
| Undo this change | `historySection.ui.undoThisChange` | [orbit-app/src/components/bot-settings/HistorySection.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:74) |

## orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx

Fonte: [orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Additional teams | `managedTeams.ui.additionalTeams` | [orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:18) |
| Create another team to coordinate across teams. | `managedTeams.ui.createAnotherTeamToCoordinateAcross` | [orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:33) |
| Save team access | `managedTeamsSettings.ui.saveTeamAccess` | [orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:37) |

## orbit-app/src/components/bot-settings/PromptPreview.tsx

Fonte: [orbit-app/src/components/bot-settings/PromptPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/PromptPreview.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Couldn’t load the prompt preview. | `promptPreview.ui.couldnTLoadThePromptPreview` | [orbit-app/src/components/bot-settings/PromptPreview.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/PromptPreview.tsx:45) |
| Loading… | `promptPreview.ui.loading` | [orbit-app/src/components/bot-settings/PromptPreview.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/PromptPreview.tsx:48) |

## orbit-app/src/components/bot-settings/RoutinesSection.tsx

Fonte: [orbit-app/src/components/bot-settings/RoutinesSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Routines | `computer.tab.routines` | [orbit-app/src/components/bot-settings/RoutinesSection.tsx:16](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:16) |
| Create schedule | `computer.routines.create` | [orbit-app/src/components/bot-settings/RoutinesSection.tsx:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:18) |
| Run logs | `routines.logs` | [orbit-app/src/components/bot-settings/RoutinesSection.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:19) |
| Open schedules | `computer.routines.openTitle` | [orbit-app/src/components/bot-settings/RoutinesSection.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:23) |

## orbit-app/src/components/bot-settings/SlackSection.tsx

Fonte: [orbit-app/src/components/bot-settings/SlackSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/SlackSection.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Give this agent its own Slack app, with its own name and picture, so your team can message it directly. | `botSlack.body` | [orbit-app/src/components/bot-settings/SlackSection.tsx:11](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/SlackSection.tsx:11) |
| Manage in Admin | `botSlack.manage` | [orbit-app/src/components/bot-settings/SlackSection.tsx:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/SlackSection.tsx:18) |

## orbit-app/src/components/bot-settings/VisibilitySection.tsx

Fonte: [orbit-app/src/components/bot-settings/VisibilitySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Add at least one email address, or choose Admins only. | `botSettings.visibility.needPeople` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:97) |
| Choose who sees this bot, its conversations, the rooms it is in and its files. Admins always can. | `botSettings.visibility.subtitle` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:115) |
| Who can see it | `botSettings.visibility.title` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:116) |
| Email addresses | `botSettings.visibility.peopleLabel` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:133) |
| One email or @company.com per line | `botSettings.visibility.peoplePlaceholder` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:137) |
| A room shows only to people who can see every bot in it, and this bot works only with teammates exactly the same people can see. | `botSettings.visibility.rooms` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:144) |
| These rooms are visible to fewer people than this bot: {rooms}. A room keeps the narrowest audience it has ever had, so taking a bot out or widening one never shows its transcript to more people, and such a room stays out of this bot's recall. When the room's bots are right, widen it here. | `botSettings.visibility.mixedRooms` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:147) |
| Show {room} to everyone its bots allow | `botSettings.visibility.resetRoom` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:157) |
| Saving… | `botSettings.visibility.saving` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:171) |
| Save | `botSettings.visibility.save` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:171) |
| Saved. It applies at once. | `botSettings.visibility.saved` | [orbit-app/src/components/bot-settings/VisibilitySection.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:174) |

## orbit-app/src/components/BotPickerList.tsx

Fonte: [orbit-app/src/components/BotPickerList.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotPickerList.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/BotProjects.tsx

Fonte: [orbit-app/src/components/BotProjects.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:1). 17 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Actions for {name} folder | `folder.actions` | [orbit-app/src/components/BotProjects.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:62) |
| Folder settings | `folder.settings` | [orbit-app/src/components/BotProjects.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:66) |
| Mark folder as read | `folder.markRead` | [orbit-app/src/components/BotProjects.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:67) |
| Move folder up | `folder.moveUp` | [orbit-app/src/components/BotProjects.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:68) |
| Move folder down | `folder.moveDown` | [orbit-app/src/components/BotProjects.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:69) |
| Close folder settings | `folder.close` | [orbit-app/src/components/BotProjects.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:123) |
| Folder name | `folder.name` | [orbit-app/src/components/BotProjects.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:138) |
| Choose folder icon | `folder.icon` | [orbit-app/src/components/BotProjects.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:143) |
| Choose an emoji or paste one below. Leave blank for the default folder icon. | `folder.emojiHint` | [orbit-app/src/components/BotProjects.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:146) |
| Default folder icon | `folder.defaultIcon` | [orbit-app/src/components/BotProjects.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:148) |
| Custom emoji | `folder.emoji` | [orbit-app/src/components/BotProjects.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:151) |
| Keep related threads together under {name}. Moving a thread never changes its model, permissions, or conversation. | `folder.detail` | [orbit-app/src/components/BotProjects.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:155) |
| Cancel | `common.cancel` | [orbit-app/src/components/BotProjects.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:170) |
| Delete this folder? Its threads move out of the folder. All conversation history is kept. | `folder.deleteBody` | [orbit-app/src/components/BotProjects.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:164) |
| Delete folder, keep threads | `folder.deleteConfirm` | [orbit-app/src/components/BotProjects.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:169) |
| Delete folder… | `folder.delete` | [orbit-app/src/components/BotProjects.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:172) |
| New thread | `task.newShort` | [orbit-app/src/components/BotProjects.tsx:190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:190) |
| New thread in {name} | `task.newIn` | [orbit-app/src/components/BotProjects.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:184) |

## orbit-app/src/components/BrowserPanel.tsx

Fonte: [orbit-app/src/components/BrowserPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:1). 18 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| New tab | `browser.ui.newTab` | [orbit-app/src/components/BrowserPanel.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:194) |
| Full screen | `browser.ui.fullScreen` | [orbit-app/src/components/BrowserPanel.tsx:196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:196) |
| Full screen is unavailable in this browser. | `browser.ui.fullScreenIsUnavailableInThis` | [orbit-app/src/components/BrowserPanel.tsx:196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:196) |
| Browser profiles | `browser.ui.browserProfiles` | [orbit-app/src/components/BrowserPanel.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:232) |
| Back | `browser.ui.back` | [orbit-app/src/components/BrowserPanel.tsx:201](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:201) |
| Forward | `browser.ui.forward` | [orbit-app/src/components/BrowserPanel.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:202) |
| Reload page | `browser.ui.reloadPage` | [orbit-app/src/components/BrowserPanel.tsx:203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:203) |
| Browser address | `browser.ui.browserAddress` | [orbit-app/src/components/BrowserPanel.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:205) |
| Browser menu | `browser.ui.browserMenu` | [orbit-app/src/components/BrowserPanel.tsx:211](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:211) |
| Type or paste text… | `browser.ui.typeOrPasteText` | [orbit-app/src/components/BrowserPanel.tsx:213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:213) |
| Reconnect view | `browser.ui.reconnectView` | [orbit-app/src/components/BrowserPanel.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:214) |
| Restart browser… | `browser.ui.restartBrowser` | [orbit-app/src/components/BrowserPanel.tsx:219](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:219) |
| Reconnect | `browser.ui.reconnect` | [orbit-app/src/components/BrowserPanel.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:223) |
| A browser frame could not be decoded. Close and reopen the panel to reconnect. | `browser.ui.aBrowserFrameCouldNotBe` | [orbit-app/src/components/BrowserPanel.tsx:228](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:228) |
| Close browser profiles | `browser.ui.closeBrowserProfiles` | [orbit-app/src/components/BrowserPanel.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:232) |
| Type into the selected page field | `browser.ui.typeIntoTheSelectedPageField` | [orbit-app/src/components/BrowserPanel.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:236) |
| Close typing | `browser.ui.closeTyping` | [orbit-app/src/components/BrowserPanel.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:236) |
| Text for the page | `browser.ui.textForThePage` | [orbit-app/src/components/BrowserPanel.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:240) |
| Type or paste text | `browser.ui.typeOrPasteText2` | [orbit-app/src/components/BrowserPanel.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:240) |
| Type | `browser.ui.type` | [orbit-app/src/components/BrowserPanel.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:240) |
| Only workspace administrators can view or control saved browser sessions. | `browser.ui.onlyWorkspaceAdministratorsCanViewOr` | [orbit-app/src/components/BrowserPanel.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:259) |
| Enable the browser in this bot’s profile to use it. | `browser.ui.enableTheBrowserInThisBot` | [orbit-app/src/components/BrowserPanel.tsx:260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:260) |
| Loading browser… | `browser.ui.loadingBrowser` | [orbit-app/src/components/BrowserPanel.tsx:262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:262) |

## orbit-app/src/components/BrowserProfilesManager.tsx

Fonte: [orbit-app/src/components/BrowserProfilesManager.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:1). 8 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not save browser profiles. | `settings.profiles.saveError` | [orbit-app/src/components/BrowserProfilesManager.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:36) |
| Could not refresh browser profiles. Reload this page before trying again. | `settings.profiles.refreshError` | [orbit-app/src/components/BrowserProfilesManager.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:44) |
| This profile was removed. Choose another browser profile. | `settings.profiles.removed` | [orbit-app/src/components/BrowserProfilesManager.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:153) |
| These bots will switch to their own browser: {names}. | `settings.profiles.deleteUsers` | [orbit-app/src/components/BrowserProfilesManager.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:97) |
| Delete “{name}”?{bots} This permanently signs out of this profile and erases its browser data. | `settings.profiles.confirm` | [orbit-app/src/components/BrowserProfilesManager.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:98) |
| Only the workspace owner can manage browser profiles. | `settings.profiles.ownerOnly` | [orbit-app/src/components/BrowserProfilesManager.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:132) |
| Browser profile | `settings.profiles.browserSession` | [orbit-app/src/components/BrowserProfilesManager.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:141) |
| Own browser | `settings.profiles.own` | [orbit-app/src/components/BrowserProfilesManager.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:149) |
| Temporary — don't save logins | `settings.profiles.temporary` | [orbit-app/src/components/BrowserProfilesManager.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:151) |
| Stop this bot's turn before switching browser profiles. | `settings.profiles.stopToSwitch` | [orbit-app/src/components/BrowserProfilesManager.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:156) |
| Temporary sessions keep logins only while this server is running; they aren't saved to disk. | `settings.profiles.temporaryHint` | [orbit-app/src/components/BrowserProfilesManager.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:156) |
| Your own browser keeps logins private to this bot. Bots on a shared profile use the same logins. | `settings.profiles.sharedHint` | [orbit-app/src/components/BrowserProfilesManager.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:156) |
| Manage profiles | `settings.profiles.manage` | [orbit-app/src/components/BrowserProfilesManager.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:161) |
| New profile name | `settings.profiles.newName` | [orbit-app/src/components/BrowserProfilesManager.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:165) |
| Create profile | `settings.profiles.create` | [orbit-app/src/components/BrowserProfilesManager.tsx:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:166) |
| You can keep up to 20 shared profiles. | `settings.profiles.limit` | [orbit-app/src/components/BrowserProfilesManager.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:168) |
| No shared profiles yet. Each bot still has its own browser. | `settings.profiles.sharedEmpty` | [orbit-app/src/components/BrowserProfilesManager.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:169) |
| Profile name | `settings.profiles.nameAria` | [orbit-app/src/components/BrowserProfilesManager.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:180) |
| Save | `common.save` | [orbit-app/src/components/BrowserProfilesManager.tsx:181](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:181) |
| Cancel | `common.cancel` | [orbit-app/src/components/BrowserProfilesManager.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:182) |
| Rename | `settings.profiles.rename` | [orbit-app/src/components/BrowserProfilesManager.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:186) |
| Delete this profile and forget its logins | `settings.profiles.deleteTitle` | [orbit-app/src/components/BrowserProfilesManager.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:187) |
| Delete | `common.delete` | [orbit-app/src/components/BrowserProfilesManager.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:187) |
| used by {names} | `settings.profiles.usedBy` | [orbit-app/src/components/BrowserProfilesManager.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:191) |
| not in use | `settings.profiles.notInUse` | [orbit-app/src/components/BrowserProfilesManager.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:191) |

## orbit-app/src/components/CallView.tsx

Fonte: [orbit-app/src/components/CallView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Hang up | `orbit.call.hangUp` | [orbit-app/src/components/CallView.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:177) |
| Call | `orbit.call.call` | [orbit-app/src/components/CallView.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:177) |
| On a call · {time} | `orbit.call.onCallFor` | [orbit-app/src/components/CallView.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:184) |
| Call unavailable | `call.ui.callUnavailable` | [orbit-app/src/components/CallView.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:195) |
| Choose This computer | `callView.ui.chooseThisComputer` | [orbit-app/src/components/CallView.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:206) |
| Open agent settings | `callView.ui.openAgentSettings` | [orbit-app/src/components/CallView.tsx:219](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:219) |
| The microphone could not start. Allow microphone access in Windows or your browser, then try again. | `jarvis.call.microphoneError` | [orbit-app/src/components/CallView.tsx:297](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:297) |
| Voice capture stopped. Check microphone access, then try again. | `jarvis.call.captureError` | [orbit-app/src/components/CallView.tsx:348](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:348) |
| Push to talk | `call.ui.pushToTalk` | [orbit-app/src/components/CallView.tsx:567](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:567) |
| Listening | `call.ui.listening` | [orbit-app/src/components/CallView.tsx:568](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:568) |
| One moment | `call.ui.oneMoment` | [orbit-app/src/components/CallView.tsx:570](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:570) |
| Working | `call.ui.working` | [orbit-app/src/components/CallView.tsx:573](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:573) |
| Call mode | `jarvis.call.mode` | [orbit-app/src/components/CallView.tsx:582](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:582) |
| Interrupt | `call.ui.interrupt` | [orbit-app/src/components/CallView.tsx:594](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:594) |
| Release Control + Option to send… | `call.ui.releaseToSend` | [orbit-app/src/components/CallView.tsx:602](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:602) |
| Say something… | `call.ui.saySomething` | [orbit-app/src/components/CallView.tsx:602](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:602) |
| Try microphone again | `call.ui.tryMicrophoneAgain` | [orbit-app/src/components/CallView.tsx:610](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:610) |
| Hold Control + Option to talk · Space interrupts · Esc hangs up | `call.ui.keys` | [orbit-app/src/components/CallView.tsx:615](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:615) |

## orbit-app/src/components/CanvasComputers.tsx

Fonte: [orbit-app/src/components/CanvasComputers.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:1). 15 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Team computers | `canvasComputers.ui.teamComputers` | [orbit-app/src/components/CanvasComputers.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:182) |
| Computers | `canvasComputers.ui.computers` | [orbit-app/src/components/CanvasComputers.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:184) |
| Refresh computers | `canvasComputers.ui.refreshComputers` | [orbit-app/src/components/CanvasComputers.tsx:185](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:185) |
| Close computers | `canvasComputers.ui.closeComputers` | [orbit-app/src/components/CanvasComputers.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:186) |
| Drag a computer onto a team, or choose its team below. Bots on Auto will use it. | `canvasComputers.ui.dragAComputerOntoATeam` | [orbit-app/src/components/CanvasComputers.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:189) |
| Connect your Boat account before creating a cloud computer. | `canvasComputers.ui.connectYourBoatAccountBeforeCreating` | [orbit-app/src/components/CanvasComputers.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:192) |
| Connect Boat | `canvasComputers.ui.connectBoat` | [orbit-app/src/components/CanvasComputers.tsx:193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:193) |
| New Boat computer | `canvasComputers.ui.newBoatComputer` | [orbit-app/src/components/CanvasComputers.tsx:215](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:215) |
| e.g. Engineering desktop | `canvasComputers.ui.eGEngineeringDesktop` | [orbit-app/src/components/CanvasComputers.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:207) |
| Creates a cloud machine in your connected boat.dev account. Your Boat plan and usage charges apply. It stays unassigned until you choose a team. | `canvasComputers.ui.createsACloudMachineInYour` | [orbit-app/src/components/CanvasComputers.tsx:208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:208) |
| Cancel | `canvasComputers.ui.cancel` | [orbit-app/src/components/CanvasComputers.tsx:210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:210) |
| Not assigned | `canvasComputers.ui.notAssigned` | [orbit-app/src/components/CanvasComputers.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:240) |
| Unassign to move to another team. | `canvasComputers.ui.unassignToMoveToAnotherTeam` | [orbit-app/src/components/CanvasComputers.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:243) |
| Start / retry | `canvasComputers.ui.startRetry` | [orbit-app/src/components/CanvasComputers.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:245) |
| Sleep | `canvasComputers.ui.sleep` | [orbit-app/src/components/CanvasComputers.tsx:246](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:246) |
| Pauses bot control while you use the desktop | `canvasComputers.ui.pausesBotControlWhileYouUse` | [orbit-app/src/components/CanvasComputers.tsx:247](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:247) |
| Open desktop | `canvasComputers.ui.openDesktop` | [orbit-app/src/components/CanvasComputers.tsx:255](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:255) |
| Return to bots | `canvasComputers.ui.returnToBots` | [orbit-app/src/components/CanvasComputers.tsx:256](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:256) |
| Another viewer has paused bot control on this desktop | `canvasComputers.ui.anotherViewerHasPausedBotControl` | [orbit-app/src/components/CanvasComputers.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:257) |
| In use | `canvasComputers.ui.inUse` | [orbit-app/src/components/CanvasComputers.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:257) |
| Open secure desktop ↗ | `canvasComputers.ui.openSecureDesktop` | [orbit-app/src/components/CanvasComputers.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:259) |
| Local VM and other computers… | `canvasComputers.ui.localVmAndOtherComputers` | [orbit-app/src/components/CanvasComputers.tsx:262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:262) |

## orbit-app/src/components/ChatFindBar.tsx

Fonte: [orbit-app/src/components/ChatFindBar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Search failed | `chat.find.failed` | [orbit-app/src/components/ChatFindBar.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:43) |
| That message is unavailable | `chat.find.unavailable` | [orbit-app/src/components/ChatFindBar.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:57) |
| Find in this conversation | `chat.find.placeholder` | [orbit-app/src/components/ChatFindBar.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:90) |
| Searching… | `chat.find.searching` | [orbit-app/src/components/ChatFindBar.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:95) |
| {index} of {count} | `chat.find.position` | [orbit-app/src/components/ChatFindBar.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:98) |
| No results | `chat.find.noResults` | [orbit-app/src/components/ChatFindBar.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:99) |
| Previous result | `chat.find.previous` | [orbit-app/src/components/ChatFindBar.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:106) |
| Next result | `chat.find.next` | [orbit-app/src/components/ChatFindBar.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:115) |
| Close find | `chat.find.close` | [orbit-app/src/components/ChatFindBar.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:123) |

## orbit-app/src/components/ChatHeader.tsx

Fonte: [orbit-app/src/components/ChatHeader.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:1). 26 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| More | `orbit.menu.more` | [orbit-app/src/components/ChatHeader.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:89) |
| Edit profile | `orbit.menu.editProfile` | [orbit-app/src/components/ChatHeader.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:98) |
| Overview | `orbit.menu.overview` | [orbit-app/src/components/ChatHeader.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:99) |
| Usage | `orbit.menu.usage` | [orbit-app/src/components/ChatHeader.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:100) |
| Settings history | `orbit.menu.history` | [orbit-app/src/components/ChatHeader.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:101) |
| Unpin | `orbit.menu.unpin` | [orbit-app/src/components/ChatHeader.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:102) |
| Pin to the top of lists | `orbit.menu.pin` | [orbit-app/src/components/ChatHeader.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:102) |
| Move to team | `sidebar.bot.moveToSection` | [orbit-app/src/components/ChatHeader.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:103) |
| Stop being Chief | `orbit.menu.stopChief` | [orbit-app/src/components/ChatHeader.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:106) |
| Make Chief of {team} | `orbit.menu.makeChief` | [orbit-app/src/components/ChatHeader.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:106) |
| Make Chief of Staff | `orbit.menu.makeChiefLoose` | [orbit-app/src/components/ChatHeader.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:106) |
| Mark as Unread | `sidebar.bot.markUnread` | [orbit-app/src/components/ChatHeader.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:108) |
| Duplicate | `sidebar.bot.duplicate` | [orbit-app/src/components/ChatHeader.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:109) |
| Hide from the map | `orbit.menu.hide` | [orbit-app/src/components/ChatHeader.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:110) |
| Archive | `orbit.menu.archive` | [orbit-app/src/components/ChatHeader.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:111) |
| Choose another Chief of Staff first | `sidebar.bot.archiveBlockedChief` | [orbit-app/src/components/ChatHeader.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:112) |
| Keep at least one active bot | `sidebar.bot.archiveBlockedLast` | [orbit-app/src/components/ChatHeader.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:112) |
| New folder | `folder.new` | [orbit-app/src/components/ChatHeader.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:115) |
| Edit folder “{name}” | `orbit.menu.editFolder` | [orbit-app/src/components/ChatHeader.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:117) |
| Find in conversation | `chat.find` | [orbit-app/src/components/ChatHeader.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:120) |
| Download transcript | `orbit.menu.download` | [orbit-app/src/components/ChatHeader.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:122) |
| Copy transcript | `orbit.menu.copy` | [orbit-app/src/components/ChatHeader.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:123) |
| Copy link to this thread | `orbit.menu.copyThreadLink` | [orbit-app/src/components/ChatHeader.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:125) |
| Copy conversation ID | `sidebar.copyConversationId` | [orbit-app/src/components/ChatHeader.tsx:126](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:126) |
| Inspector | `chat.inspector` | [orbit-app/src/components/ChatHeader.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:127) |
| Delete… | `orbit.menu.delete` | [orbit-app/src/components/ChatHeader.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:130) |
| {name} archived | `orbit.archived` | [orbit-app/src/components/ChatHeader.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:143) |
| Delete {name}? | `orbit.menu.deleteTitle` | [orbit-app/src/components/ChatHeader.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:148) |
| Its conversations, memory and routines are removed. Connected apps and computers are not affected. This can’t be undone. | `orbit.menu.deleteBody` | [orbit-app/src/components/ChatHeader.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:149) |
| Delete bot | `orbit.menu.deleteConfirm` | [orbit-app/src/components/ChatHeader.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:150) |
| {count} more | `orbit.threads.more` | [orbit-app/src/components/ChatHeader.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:195) |
| All | `orbit.threads.all` | [orbit-app/src/components/ChatHeader.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:195) |
| Let this turn finish first | `task.newBusy` | [orbit-app/src/components/ChatHeader.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:197) |
| New thread — a fresh conversation | `task.new` | [orbit-app/src/components/ChatHeader.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:197) |
| New thread | `task.newShort` | [orbit-app/src/components/ChatHeader.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:197) |
| Chief of Staff | `chat.chiefOfStaff` | [orbit-app/src/components/ChatHeader.tsx:225](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:225) |
| built in · works across every team | `orbit.agent.scope` | [orbit-app/src/components/ChatHeader.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:214) |
| reports to {name} | `orbit.reportsTo` | [orbit-app/src/components/ChatHeader.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:214) |
| reports to you | `orbit.reportsToYou` | [orbit-app/src/components/ChatHeader.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:214) |
| Open agent profile | `chat.openProfile` | [orbit-app/src/components/ChatHeader.tsx:221](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:221) |
| Open {name}'s profile | `chat.openProfileAria` | [orbit-app/src/components/ChatHeader.tsx:221](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:221) |
| Teammates working | `chat.teammatesWorking` | [orbit-app/src/components/ChatHeader.tsx:228](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:228) |
| Stop this turn | `chat.stopTurn` | [orbit-app/src/components/ChatHeader.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:233) |
| Stop | `chat.stop` | [orbit-app/src/components/ChatHeader.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:235) |

## orbit-app/src/components/ChatMarkdown.tsx

Fonte: [orbit-app/src/components/ChatMarkdown.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:1). 10 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Download snippet as file | `markdown.ui.downloadSnippetAsFile` | [orbit-app/src/components/ChatMarkdown.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:335) |
| Save | `markdown.ui.save` | [orbit-app/src/components/ChatMarkdown.tsx:338](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:338) |
| Copied! | `markdown.ui.copied` | [orbit-app/src/components/ChatMarkdown.tsx:555](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:555) |
| Copy | `markdown.ui.copy` | [orbit-app/src/components/ChatMarkdown.tsx:560](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:560) |
| Mermaid diagram | `markdown.ui.mermaidDiagram` | [orbit-app/src/components/ChatMarkdown.tsx:526](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:526) |
| Mermaid diagram | `chatMarkdown.ui.mermaidDiagram` | [orbit-app/src/components/ChatMarkdown.tsx:527](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:527) |
| Unavailable legacy file reference | `markdown.ui.unavailableLegacyFileReference` | [orbit-app/src/components/ChatMarkdown.tsx:594](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:594) |
| Save a copy | `markdown.ui.saveACopy` | [orbit-app/src/components/ChatMarkdown.tsx:610](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:610) |
| Reveal spoiler | `markdown.ui.revealSpoiler` | [orbit-app/src/components/ChatMarkdown.tsx:678](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:678) |
| Hide spoiler | `markdown.ui.hideSpoiler` | [orbit-app/src/components/ChatMarkdown.tsx:691](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:691) |
| Hide | `chatMarkdown.ui.hide` | [orbit-app/src/components/ChatMarkdown.tsx:695](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:695) |
| Image unavailable | `markdown.ui.imageUnavailable` | [orbit-app/src/components/ChatMarkdown.tsx:801](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:801) |

## orbit-app/src/components/ChatView.tsx

Fonte: [orbit-app/src/components/ChatView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1). 27 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Today | `chat.day.today` | [orbit-app/src/components/ChatView.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:104) |
| Yesterday | `chat.day.yesterday` | [orbit-app/src/components/ChatView.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:105) |
| Copy message | `chat.copyMessage` | [orbit-app/src/components/ChatView.tsx:128](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:128) |
| Driver detail | `computer.mac.permission.driverDetail` | [orbit-app/src/components/ChatView.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:175) |
| About provider safety checks | `chat.ui.aboutProviderSafetyChecks` | [orbit-app/src/components/ChatView.tsx:183](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:183) |
| Retry | `chat.retry` | [orbit-app/src/components/ChatView.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:194) |
| Cancel | `common.cancel` | [orbit-app/src/components/ChatView.tsx:272](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:272) |
| Send | `chat.send` | [orbit-app/src/components/ChatView.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:279) |
| Remember this · “{quote}”  Save this to your memory with memory_update, following your usual memory rules. If memory is full, tidy it first and tell me what you changed. | `orbit.remember.prompt` | [orbit-app/src/components/ChatView.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:305) |
| Remember this | `orbit.remember.action` | [orbit-app/src/components/ChatView.tsx:307](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:307) |
| Let this turn finish first | `orbit.remember.busy` | [orbit-app/src/components/ChatView.tsx:307](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:307) |
| Edit message | `chat.editMessage` | [orbit-app/src/components/ChatView.tsx:417](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:417) |
| Reply to message | `chat.replyToMessage` | [orbit-app/src/components/ChatView.tsx:558](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:558) |
| Reply | `chat.reply` | [orbit-app/src/components/ChatView.tsx:559](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:559) |
| Unpin message | `chat.unpinMessage` | [orbit-app/src/components/ChatView.tsx:978](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:978) |
| Pin message | `chat.pinMessage` | [orbit-app/src/components/ChatView.tsx:573](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:573) |
| Unpin this message | `chat.unpinHint` | [orbit-app/src/components/ChatView.tsx:574](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:574) |
| Pin this message to the top of the thread | `chat.pinHint` | [orbit-app/src/components/ChatView.tsx:574](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:574) |
| Webhook task | `chat.webhookTask` | [orbit-app/src/components/ChatView.tsx:483](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:483) |
| View event payload | `chat.viewPayload` | [orbit-app/src/components/ChatView.tsx:488](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:488) |
| Sent while the bot was working — it saw this before its next step, inside the same turn. | `chat.sentMidTurnHint` | [orbit-app/src/components/ChatView.tsx:504](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:504) |
| sent mid-turn | `chat.sentMidTurn` | [orbit-app/src/components/ChatView.tsx:505](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:505) |
| Show full message | `chat.showFull` | [orbit-app/src/components/ChatView.tsx:510](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:510) |
| Show less | `chat.showLess` | [orbit-app/src/components/ChatView.tsx:515](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:515) |
| Generated image | `chat.generatedImage` | [orbit-app/src/components/ChatView.tsx:520](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:520) |
| Regenerate response | `chat.regenerate` | [orbit-app/src/components/ChatView.tsx:549](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:549) |
| Saved to memory | `orbit.remember.saved` | [orbit-app/src/components/ChatView.tsx:599](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:599) |
| Previous version | `chat.previousVersion` | [orbit-app/src/components/ChatView.tsx:608](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:608) |
| Next version | `chat.nextVersion` | [orbit-app/src/components/ChatView.tsx:619](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:619) |
| delegated a task | `chat.peer.delegated` | [orbit-app/src/components/ChatView.tsx:651](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:651) |
| opened this thread | `chat.peer.openedThread` | [orbit-app/src/components/ChatView.tsx:653](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:653) |
| sent a request | `chat.peer.sent` | [orbit-app/src/components/ChatView.tsx:655](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:655) |
| asked via ask_bot | `chat.peer.asked` | [orbit-app/src/components/ChatView.tsx:656](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:656) |
| From {name} | `orbit.chat.from` | [orbit-app/src/components/ChatView.tsx:661](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:661) |
| Open the conversation with {name} | `chat.openConversationWith` | [orbit-app/src/components/ChatView.tsx:681](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:681) |
| No messages yet | `orbit.chat.empty` | [orbit-app/src/components/ChatView.tsx:772](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:772) |
| Send a message to start the conversation. | `chat.emptyPrompt` | [orbit-app/src/components/ChatView.tsx:774](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:774) |
| You | `chat.you` | [orbit-app/src/components/ChatView.tsx:961](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:961) |
| Jump to the pinned message | `chat.pinnedJump` | [orbit-app/src/components/ChatView.tsx:971](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:971) |
| Unpin | `chat.unpin` | [orbit-app/src/components/ChatView.tsx:982](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:982) |
| Run details · {name} | `routines.executionDetails` | [orbit-app/src/components/ChatView.tsx:1298](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1298) |
| Back to results | `routines.results.back` | [orbit-app/src/components/ChatView.tsx:1299](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1299) |
| Run logs | `routines.logs` | [orbit-app/src/components/ChatView.tsx:1300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1300) |
| That thread is no longer here. Showing {name} instead. | `thread.goneShowing` | [orbit-app/src/components/ChatView.tsx:1308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1308) |
| That thread is no longer here. | `thread.gone` | [orbit-app/src/components/ChatView.tsx:1308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1308) |
| Conversation with {name} | `chat.conversationWith` | [orbit-app/src/components/ChatView.tsx:1372](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1372) |
| Show earlier messages ({count} more) | `chat.showEarlier` | [orbit-app/src/components/ChatView.tsx:1380](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1380) |
| Loading earlier messages… | `chat.loadingEarlier` | [orbit-app/src/components/ChatView.tsx:1390](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1390) |
| Load earlier messages | `chat.loadEarlier` | [orbit-app/src/components/ChatView.tsx:1390](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1390) |
| Show later messages ({count} more) | `chat.showLater` | [orbit-app/src/components/ChatView.tsx:1416](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1416) |
| Setting up this bot's computer… | `chat.provisioning` | [orbit-app/src/components/ChatView.tsx:1424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1424) |
| Jump to latest messages | `chat.jumpToLatestAria` | [orbit-app/src/components/ChatView.tsx:1448](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1448) |
| Jump to latest | `chat.jumpToLatest` | [orbit-app/src/components/ChatView.tsx:1452](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1452) |

## orbit-app/src/components/ClaudeAccountSettings.tsx

Fonte: [orbit-app/src/components/ClaudeAccountSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:1). 8 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Account name | `engines.account.name` | [orbit-app/src/components/ClaudeAccountSettings.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:46) |
| Personal or Work | `engines.account.namePlaceholder` | [orbit-app/src/components/ClaudeAccountSettings.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:50) |
| Advanced | `engines.account.advanced` | [orbit-app/src/components/ClaudeAccountSettings.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:58) |
| Claude configuration directory | `engines.account.configDir` | [orbit-app/src/components/ClaudeAccountSettings.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:60) |
| Use an absolute path on the computer running Orbit to reuse an existing Claude login, including one from T3. Leave blank when adding an account to create a separate private directory. | `engines.account.configDirHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:71) |
| The directory cannot change while bots or conversation history use this account. To switch accounts, add another account and choose it for the bot. Existing credentials are never moved or deleted. | `engines.account.changeDirHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:72) |
| Adding an account saves its configuration, not a signed-in session. Sign in with Claude CLI next, then select this account in each bot’s model picker. | `engines.account.addHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:74) |
| Cancel | `common.cancel` | [orbit-app/src/components/ClaudeAccountSettings.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:77) |
| Save | `common.save` | [orbit-app/src/components/ClaudeAccountSettings.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:80) |
| Add Claude account | `engines.account.add` | [orbit-app/src/components/ClaudeAccountSettings.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:95) |
| workspace API key | `engines.account.apiKey` | [orbit-app/src/components/ClaudeAccountSettings.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:119) |
| Claude connected | `engines.account.connected` | [orbit-app/src/components/ClaudeAccountSettings.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:167) |
| Sign-in required | `model.signInRequired` | [orbit-app/src/components/ClaudeAccountSettings.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:167) |
| Account status unknown | `engines.account.unknown` | [orbit-app/src/components/ClaudeAccountSettings.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:167) |
| Default account | `engines.account.default` | [orbit-app/src/components/ClaudeAccountSettings.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:170) |
| Check account | `engines.account.check` | [orbit-app/src/components/ClaudeAccountSettings.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:172) |
| Manage account and sign-in | `engines.account.manage` | [orbit-app/src/components/ClaudeAccountSettings.tsx:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:176) |
| Run this exact command in a terminal on the computer running Orbit, finish Claude CLI sign-in, then click Check account. If you are viewing Orbit remotely, run it on the server, not this device. | `engines.account.signInHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:178) |
| Use PowerShell for this command. | `engines.account.powershell` | [orbit-app/src/components/ClaudeAccountSettings.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:179) |
| Copy command | `engineSetup.copyCommand` | [orbit-app/src/components/ClaudeAccountSettings.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:180) |
| Signing out… | `engines.account.signingOut` | [orbit-app/src/components/ClaudeAccountSettings.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:187) |
| Sign out of Claude | `engines.account.signOut` | [orbit-app/src/components/ClaudeAccountSettings.tsx:215](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:215) |
| This removes the Claude sign-in stored for this account on the server. Stop running Claude tasks before switching accounts. Someone with owner access can then connect a different Claude subscription. | `engines.account.signOutHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:214) |
| {count} bot(s) use this account. Running tasks are not cancelled by signing out; new tasks need a working Claude connection. | `engines.account.signOutAssigned` | [orbit-app/src/components/ClaudeAccountSettings.tsx:190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:190) |
| Remove account | `engines.account.remove` | [orbit-app/src/components/ClaudeAccountSettings.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:206) |
| Remove {name}? | `engines.account.removeTitle` | [orbit-app/src/components/ClaudeAccountSettings.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:204) |
| This removes the account from Orbit only. Its login credentials and files stay on disk; it does not sign out of Claude. | `engines.account.removeHint` | [orbit-app/src/components/ClaudeAccountSettings.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:205) |
| Sign out {name} on this server? | `engines.account.signOutTitle` | [orbit-app/src/components/ClaudeAccountSettings.tsx:213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:213) |

## orbit-app/src/components/ClaudeSignIn.tsx

Fonte: [orbit-app/src/components/ClaudeSignIn.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This sign-in session is no longer available. Check that this browser is still paired as an owner, then request a new code. | `engineSetup.device.flowEnded` | [orbit-app/src/components/ClaudeSignIn.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:25) |
| Sign-in could not be completed. Try again or check the server's Codex installation. | `engineSetup.device.failed` | [orbit-app/src/components/ClaudeSignIn.tsx:126](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:126) |
| Claude connected. Your models are being refreshed. | `engineSetup.claude.connected` | [orbit-app/src/components/ClaudeSignIn.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:121) |
| Sign-in cancelled. You can request a new code when ready. | `engineSetup.device.cancelled` | [orbit-app/src/components/ClaudeSignIn.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:123) |
| This code expired. Request a new code to try again. | `engineSetup.device.expired` | [orbit-app/src/components/ClaudeSignIn.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:125) |
| Open the Claude sign-in page | `engineSetup.claude.open` | [orbit-app/src/components/ClaudeSignIn.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:138) |
| Paste the code from that page | `engineSetup.claude.codeLabel` | [orbit-app/src/components/ClaudeSignIn.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:141) |
| Checking with Claude Code… | `engineSetup.claude.finishing` | [orbit-app/src/components/ClaudeSignIn.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:158) |
| Finish sign-in | `engineSetup.claude.finish` | [orbit-app/src/components/ClaudeSignIn.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:158) |
| Code expires at {time} | `engineSetup.device.expires` | [orbit-app/src/components/ClaudeSignIn.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:161) |
| Only paste a code from a sign-in you started here. It is handed to Claude Code on this server once and never stored; your password stays with Anthropic. Bots on this server share your subscription's usage limits. | `engineSetup.claude.security` | [orbit-app/src/components/ClaudeSignIn.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:163) |
| Cancelling… | `engineSetup.device.cancelling` | [orbit-app/src/components/ClaudeSignIn.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:165) |
| Cancel sign-in | `engineSetup.device.cancel` | [orbit-app/src/components/ClaudeSignIn.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:165) |
| Claude Code did not return a valid Anthropic sign-in link. Cancel and try again. | `engineSetup.claude.invalidChallenge` | [orbit-app/src/components/ClaudeSignIn.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:169) |
| Preparing sign-in… | `engineSetup.claude.starting` | [orbit-app/src/components/ClaudeSignIn.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:179) |
| Sign in to Claude | `engineSetup.claude.start` | [orbit-app/src/components/ClaudeSignIn.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:179) |

## orbit-app/src/components/ClaudeUpdatePrompt.tsx

Fonte: [orbit-app/src/components/ClaudeUpdatePrompt.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Retry | `chat.retry` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:54) |
| Update Claude Code | `chat.claudeUpdate.aria` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:59) |
| This model needs a newer Claude Code. I can update Claude for you. | `chat.claudeUpdate.offer` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:62) |
| Update Claude for me | `chat.claudeUpdate.doIt` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:69) |
| I'll do it myself | `chat.claudeUpdate.myself` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:76) |
| Updating Claude Code… this can take a minute. | `chat.claudeUpdate.updating` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:83](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:83) |
| Claude updated — {version} | `engines.claudeUpdated` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:89) |
| Run this in Terminal, then retry: | `chat.claudeUpdate.manual` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:97) |
| Copy command | `chat.claudeUpdate.copy` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:108) |
| Try updating again | `chat.claudeUpdate.tryAgain` | [orbit-app/src/components/ClaudeUpdatePrompt.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:122) |

## orbit-app/src/components/CloudBackendPicker.tsx

Fonte: [orbit-app/src/components/CloudBackendPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudBackendPicker.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/CloudScreenPreview.tsx

Fonte: [orbit-app/src/components/CloudScreenPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The screen image could not be displayed. | `computer.preview.imageFailed` | [orbit-app/src/components/CloudScreenPreview.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:23) |
| Open {name}'s live desktop | `computer.openLiveDesktopAria` | [orbit-app/src/components/CloudScreenPreview.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:33) |
| Open live desktop | `computer.openLiveDesktop` | [orbit-app/src/components/CloudScreenPreview.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:34) |
| {name}'s screen | `computer.screenOf` | [orbit-app/src/components/CloudScreenPreview.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:39) |
| Connecting to live desktop… | `computer.preview.connecting` | [orbit-app/src/components/CloudScreenPreview.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:47) |
| Open | `computer.open` | [orbit-app/src/components/CloudScreenPreview.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:47) |
| Starting your bot's computer… | `computer.phase.starting` | [orbit-app/src/components/CloudScreenPreview.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:55) |
| Connecting to the screen… | `computer.preview.connectingScreen` | [orbit-app/src/components/CloudScreenPreview.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:61) |
| Screen updates paused. | `computer.preview.paused` | [orbit-app/src/components/CloudScreenPreview.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:67) |
| Couldn't connect to the screen. | `computer.preview.cantConnect` | [orbit-app/src/components/CloudScreenPreview.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:67) |
| Retry preview | `computer.preview.retry` | [orbit-app/src/components/CloudScreenPreview.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:69) |

## orbit-app/src/components/CodexAccountSettings.tsx

Fonte: [orbit-app/src/components/CodexAccountSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| ChatGPT connected on this server | `engineSetup.device.connectedAccount` | [orbit-app/src/components/CodexAccountSettings.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:52) |
| Check account | `engines.account.check` | [orbit-app/src/components/CodexAccountSettings.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:56) |
| Manage account and sign-in | `engines.account.manage` | [orbit-app/src/components/CodexAccountSettings.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:61) |
| This removes the ChatGPT sign-in that Codex stores on this server. New ChatGPT tasks need a connected account. Stop running Codex tasks before switching accounts; signing out does not cancel work already in progress. | `engineSetup.device.signOutHint` | [orbit-app/src/components/CodexAccountSettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:75) |
| {count} bot(s) use this Codex connection. Running tasks are not cancelled by signing out. | `engineSetup.device.signOutAssigned` | [orbit-app/src/components/CodexAccountSettings.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:64) |
| Signing out… | `engineSetup.device.signingOut` | [orbit-app/src/components/CodexAccountSettings.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:66) |
| Sign out of ChatGPT | `engineSetup.device.signOut` | [orbit-app/src/components/CodexAccountSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:76) |
| Sign out of ChatGPT on this server? | `engineSetup.device.signOutTitle` | [orbit-app/src/components/CodexAccountSettings.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:74) |

## orbit-app/src/components/CodexDeviceSignIn.tsx

Fonte: [orbit-app/src/components/CodexDeviceSignIn.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This sign-in session is no longer available. Check that this browser is still paired as an owner, then request a new code. | `engineSetup.device.flowEnded` | [orbit-app/src/components/CodexDeviceSignIn.tsx:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:20) |
| ChatGPT connected. Your models are being refreshed. | `engineSetup.device.connected` | [orbit-app/src/components/CodexDeviceSignIn.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:53) |
| Sign-in cancelled. You can request a new code when ready. | `engineSetup.device.cancelled` | [orbit-app/src/components/CodexDeviceSignIn.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:54) |
| This code expired. Request a new code to try again. | `engineSetup.device.expired` | [orbit-app/src/components/CodexDeviceSignIn.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:55) |
| Sign-in could not be completed. Try again or check the server's Codex installation. | `engineSetup.device.failed` | [orbit-app/src/components/CodexDeviceSignIn.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:164) |
| Codex did not return a valid OpenAI sign-in link and code. Cancel and try again. | `engineSetup.device.invalidChallenge` | [orbit-app/src/components/CodexDeviceSignIn.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:61) |
| Enter this one-time code on OpenAI's sign-in page: | `engineSetup.device.enterCode` | [orbit-app/src/components/CodexDeviceSignIn.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:66) |
| Copy sign-in code | `engineSetup.device.copyCode` | [orbit-app/src/components/CodexDeviceSignIn.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:71) |
| Open ChatGPT sign-in | `engineSetup.device.openChatGPT` | [orbit-app/src/components/CodexDeviceSignIn.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:79) |
| Waiting for you to finish signing in… | `engineSetup.device.waiting` | [orbit-app/src/components/CodexDeviceSignIn.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:82) |
| Code expires at {time} | `engineSetup.device.expires` | [orbit-app/src/components/CodexDeviceSignIn.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:85) |
| Only enter a code you requested here. This signs Codex in on the server and uses your account's limits. Your password stays with OpenAI; credentials stay on this server. | `engineSetup.device.security` | [orbit-app/src/components/CodexDeviceSignIn.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:87) |
| Cancelling… | `engineSetup.device.cancelling` | [orbit-app/src/components/CodexDeviceSignIn.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:173) |
| Cancel sign-in | `engineSetup.device.cancel` | [orbit-app/src/components/CodexDeviceSignIn.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:173) |
| Getting your sign-in code… | `engineSetup.device.starting` | [orbit-app/src/components/CodexDeviceSignIn.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:178) |
| Connect ChatGPT | `engineSetup.device.start` | [orbit-app/src/components/CodexDeviceSignIn.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:178) |
| Device-code login may need enabling in ChatGPT security settings or by your workspace admin. | `engineSetup.device.enableHint` | [orbit-app/src/components/CodexDeviceSignIn.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:182) |

## orbit-app/src/components/CommandAllowlistDialog.tsx

Fonte: [orbit-app/src/components/CommandAllowlistDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Command allowlist | `commandAllowlist.title` | [orbit-app/src/components/CommandAllowlistDialog.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:120) |
| Saved commands for {name} | `commandAllowlist.forBot` | [orbit-app/src/components/CommandAllowlistDialog.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:121) |
| Close command allowlist | `commandAllowlist.close` | [orbit-app/src/components/CommandAllowlistDialog.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:123) |
| Each rule allows one exact command for this bot, provider and working folder, including other threads using that folder. Rules stay saved until removed. | `commandAllowlist.scope` | [orbit-app/src/components/CommandAllowlistDialog.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:127) |
| Loading allowed commands… | `commandAllowlist.loading` | [orbit-app/src/components/CommandAllowlistDialog.tsx:129](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:129) |
| Retry | `commandAllowlist.retry` | [orbit-app/src/components/CommandAllowlistDialog.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:134) |
| Remove allowed command: {command} | `commandAllowlist.removeAria` | [orbit-app/src/components/CommandAllowlistDialog.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:145) |
| No commands saved yet. | `commandAllowlist.empty` | [orbit-app/src/components/CommandAllowlistDialog.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:151) |
| Provider | `commandAllowlist.provider` | [orbit-app/src/components/CommandAllowlistDialog.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:153) |
| Command | `commandAllowlist.command` | [orbit-app/src/components/CommandAllowlistDialog.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:154) |
| Enter the complete command. Prefixes and wildcards do not create broader permissions. | `commandAllowlist.exact` | [orbit-app/src/components/CommandAllowlistDialog.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:159) |
| Working folder | `commandAllowlist.folder` | [orbit-app/src/components/CommandAllowlistDialog.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:160) |
| This provider cannot use saved command approvals. You can still remove existing rules. | `commandAllowlist.unsupported` | [orbit-app/src/components/CommandAllowlistDialog.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:170) |

## orbit-app/src/components/CommandPalette.tsx

Fonte: [orbit-app/src/components/CommandPalette.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Chief | `orbit.pal.chief` | [orbit-app/src/components/CommandPalette.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:132) |
| Between bots | `orbit.pal.dm` | [orbit-app/src/components/CommandPalette.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:138) |
| Channel | `orbit.pal.channel` | [orbit-app/src/components/CommandPalette.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:138) |
| Thread | `orbit.pal.thread` | [orbit-app/src/components/CommandPalette.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:159) |
| {name} · settings | `orbit.pal.botSettings` | [orbit-app/src/components/CommandPalette.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:163) |
| Inspector | `chat.inspector` | [orbit-app/src/components/CommandPalette.tsx:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:166) |
| Replay the welcome tour | `orbit.pal.replay` | [orbit-app/src/components/CommandPalette.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:170) |
| Onboarding | `orbit.pal.onboarding` | [orbit-app/src/components/CommandPalette.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:170) |
| Keyboard shortcuts | `orbit.pal.shortcuts` | [orbit-app/src/components/CommandPalette.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:171) |
| App · ? | `orbit.pal.app` | [orbit-app/src/components/CommandPalette.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:171) |
| Check for updates | `orbit.pal.updates` | [orbit-app/src/components/CommandPalette.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:172) |
| App | `orbit.pal.appOnly` | [orbit-app/src/components/CommandPalette.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:173) |
| About {app} | `orbit.pal.about` | [orbit-app/src/components/CommandPalette.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:173) |
| You | `orbit.you` | [orbit-app/src/components/CommandPalette.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:175) |
| Settings | `orbit.pal.settingsSection` | [orbit-app/src/components/CommandPalette.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:180) |
| {team} team | `orbit.pal.team` | [orbit-app/src/components/CommandPalette.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:184) |
| Team settings | `orbit.pal.teamSettings` | [orbit-app/src/components/CommandPalette.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:184) |
| New bot | `orbit.empty.newBot` | [orbit-app/src/components/CommandPalette.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:188) |
| Install a team from Markdown | `orbit.pal.install` | [orbit-app/src/components/CommandPalette.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:189) |
| Create team | `team.create` | [orbit-app/src/components/CommandPalette.tsx:190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:190) |
| Archived bots | `orbit.hub.archived` | [orbit-app/src/components/CommandPalette.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:192) |
| {count} archived | `orbit.hub.archivedCount` | [orbit-app/src/components/CommandPalette.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:192) |
| BOTS | `orbit.pal.bots` | [orbit-app/src/components/CommandPalette.tsx:196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:196) |
| CHANNELS | `orbit.pal.channels` | [orbit-app/src/components/CommandPalette.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:197) |
| THREADS | `orbit.pal.threads` | [orbit-app/src/components/CommandPalette.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:198) |
| MESSAGES | `orbit.pal.messages` | [orbit-app/src/components/CommandPalette.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:199) |
| SETTINGS | `orbit.pal.settings` | [orbit-app/src/components/CommandPalette.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:200) |
| ACTIONS | `orbit.pal.actions` | [orbit-app/src/components/CommandPalette.tsx:201](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:201) |
| Search or jump | `orbit.pal.aria` | [orbit-app/src/components/CommandPalette.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:233) |
| Search bots, threads, settings and actions | `orbit.pal.placeholder` | [orbit-app/src/components/CommandPalette.tsx:237](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:237) |
| Nothing matches “{query}” | `orbit.pal.none` | [orbit-app/src/components/CommandPalette.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:244) |
| Nothing to switch to yet | `orbit.pal.empty` | [orbit-app/src/components/CommandPalette.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:244) |
| ↑↓ move | `orbit.pal.move` | [orbit-app/src/components/CommandPalette.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:281) |
| ↵ open | `orbit.pal.open` | [orbit-app/src/components/CommandPalette.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:281) |
| esc close | `orbit.pal.close` | [orbit-app/src/components/CommandPalette.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:281) |

## orbit-app/src/components/CompanionSection.tsx

Fonte: [orbit-app/src/components/CompanionSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Remote access needs attention | `remote.status.attention` | [orbit-app/src/components/CompanionSection.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:109) |
| Ready on {name} | `remote.tailscale.ready` | [orbit-app/src/components/CompanionSection.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:60) |
| Keep Tailscale connected on the host and the device being paired. | `remote.tailscale.readyDetail` | [orbit-app/src/components/CompanionSection.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:61) |
| Tailscale found — MagicDNS is still needed | `remote.tailscale.magicDns` | [orbit-app/src/components/CompanionSection.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:67) |
| Turn on MagicDNS in Tailscale, then check again so the device gets a secure tailnet name. | `remote.tailscale.magicDnsDetail` | [orbit-app/src/components/CompanionSection.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:68) |
| Tailscale is not connected yet | `remote.tailscale.notConnected` | [orbit-app/src/components/CompanionSection.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:74) |
| Open Tailscale on both devices, sign in to the same tailnet, then check again. | `remote.tailscale.notConnectedDetail` | [orbit-app/src/components/CompanionSection.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:75) |
| Already use Tailscale? | `remote.tailscale.already` | [orbit-app/src/components/CompanionSection.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:80) |
| Connect both devices to the same tailnet. Checking turns on Remote access so the other device can reach this computer. | `remote.tailscale.alreadyDetail` | [orbit-app/src/components/CompanionSection.tsx:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:81) |
| Tailscale pairing | `remote.pairing.tailscale.title` | [orbit-app/src/components/CompanionSection.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:281) |
| Private pairing through the tailnet shared by the host and the device being paired. | `remote.pairing.tailscale.subtitle` | [orbit-app/src/components/CompanionSection.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:91) |
| Direct Wi-Fi pairing | `remote.pairing.wifi.title` | [orbit-app/src/components/CompanionSection.tsx:400](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:400) |
| Use only on a trusted network where both devices can see each other. | `remote.pairing.wifi.subtitle` | [orbit-app/src/components/CompanionSection.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:97) |
| Secure HTTPS pairing | `remote.pairing.https.title` | [orbit-app/src/components/CompanionSection.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:101) |
| Recommended — the simplest setup, and it keeps working when the paired device leaves this Wi-Fi. | `remote.pairing.https.subtitle` | [orbit-app/src/components/CompanionSection.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:102) |
| Remote access off | `remote.status.off` | [orbit-app/src/components/CompanionSection.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:110) |
| just now | `remote.time.justNow` | [orbit-app/src/components/CompanionSection.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:121) |
| {count} min ago | `remote.time.minutes` | [orbit-app/src/components/CompanionSection.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:123) |
| {count} h ago | `remote.time.hours` | [orbit-app/src/components/CompanionSection.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:125) |
| {count} d ago | `remote.time.days` | [orbit-app/src/components/CompanionSection.tsx:126](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:126) |
| Managed by {organization}: remote access to this computer is turned off. | `policy.remoteBlocked` | [orbit-app/src/components/CompanionSection.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:144) |
| Managed by {organization} | `policy.managedBy` | [orbit-app/src/components/CompanionSection.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:145) |
| Use {app} from another device | `remote.desktopOnly.title` | [orbit-app/src/components/CompanionSection.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:150) |
| Open Remote access in the desktop app to pair a phone or computer. | `remote.desktopOnly.subtitle` | [orbit-app/src/components/CompanionSection.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:151) |
| Remote access | `remote.title` | [orbit-app/src/components/CompanionSection.tsx:226](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:226) |
| Checking device access… | `remote.checking` | [orbit-app/src/components/CompanionSection.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:158) |
| Wi-Fi | `remote.connection.wifi` | [orbit-app/src/components/CompanionSection.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:172) |
| Nearby discovery | `remote.connection.discovery` | [orbit-app/src/components/CompanionSection.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:174) |
| Local route {index} | `remote.connection.localRoute` | [orbit-app/src/components/CompanionSection.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:179) |
| Works away from home | `remote.worksAway` | [orbit-app/src/components/CompanionSection.tsx:203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:203) |
| Advanced & troubleshooting | `remote.advanced` | [orbit-app/src/components/CompanionSection.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:214) |
| Turn off all remote-device connections to this computer. | `remote.toggleDetail` | [orbit-app/src/components/CompanionSection.tsx:221](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:221) |
| Paired devices | `remote.devices.title` | [orbit-app/src/components/CompanionSection.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:233) |
| Manage the devices that can use this {app}. | `remote.devices.subtitle` | [orbit-app/src/components/CompanionSection.tsx:234](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:234) |
| No devices are paired yet. | `remote.devices.empty` | [orbit-app/src/components/CompanionSection.tsx:234](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:234) |
| Last seen {when} | `remote.devices.lastSeen` | [orbit-app/src/components/CompanionSection.tsx:246](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:246) |
| Remove {name} | `remote.devices.remove` | [orbit-app/src/components/CompanionSection.tsx:251](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:251) |
| Allow computer view | `remote.devices.allowView` | [orbit-app/src/components/CompanionSection.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:259) |
| Full interactive access from this device. | `remote.devices.allowViewDetail` | [orbit-app/src/components/CompanionSection.tsx:260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:260) |
| Computer view access for {name} | `remote.devices.viewAria` | [orbit-app/src/components/CompanionSection.tsx:264](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:264) |
| Optional — for people who already use Tailscale. Secure HTTPS above remains the recommended setup. | `remote.tailscaleCard.subtitle` | [orbit-app/src/components/CompanionSection.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:282) |
| Pair over Tailscale | `remote.pairOverTailscale` | [orbit-app/src/components/CompanionSection.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:311) |
| Checking… | `common.checking` | [orbit-app/src/components/CompanionSection.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:320) |
| Check again | `remote.checkAgain` | [orbit-app/src/components/CompanionSection.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:320) |
| Turn on device access & check | `remote.turnOnAndCheck` | [orbit-app/src/components/CompanionSection.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:320) |
| Keep this computer awake | `remote.keepAwake` | [orbit-app/src/components/CompanionSection.tsx:328](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:328) |
| Keeps remote access and scheduled work available while the screen is off. | `remote.keepAwakeDetail` | [orbit-app/src/components/CompanionSection.tsx:330](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:330) |
| Keep this computer awake while Remote access is on | `remote.keepAwakeAria` | [orbit-app/src/components/CompanionSection.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:335) |
| Secure remote-access account | `remote.account.title` | [orbit-app/src/components/CompanionSection.tsx:346](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:346) |
| Signed in as {email}. | `remote.account.signedIn` | [orbit-app/src/components/CompanionSection.tsx:349](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:349) |
| your account | `remote.account.yourAccount` | [orbit-app/src/components/CompanionSection.tsx:350](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:350) |
| Finishing secure access… | `remote.account.connecting` | [orbit-app/src/components/CompanionSection.tsx:353](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:353) |
| Secure access needs attention. | `remote.account.error` | [orbit-app/src/components/CompanionSection.tsx:355](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:355) |
| You’ll be asked to sign in when you pair a device. | `remote.account.idle` | [orbit-app/src/components/CompanionSection.tsx:356](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:356) |
| Sign out | `remote.account.signOut` | [orbit-app/src/components/CompanionSection.tsx:366](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:366) |
| Trying again… | `remote.account.retrying` | [orbit-app/src/components/CompanionSection.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:376) |
| Retry secure access | `remote.account.retry` | [orbit-app/src/components/CompanionSection.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:376) |
| Connection details | `remote.connection.title` | [orbit-app/src/components/CompanionSection.tsx:383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:383) |
| Reveal or copy an address only when troubleshooting manual pairing. | `remote.connection.detail` | [orbit-app/src/components/CompanionSection.tsx:385](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:385) |
| Secure route | `remote.connection.secureRoute` | [orbit-app/src/components/CompanionSection.tsx:388](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:388) |
| No reachable address is available yet. | `remote.connection.none` | [orbit-app/src/components/CompanionSection.tsx:391](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:391) |
| Use this only when both devices are nearby and the network allows devices to see each other. | `remote.wifi.detail` | [orbit-app/src/components/CompanionSection.tsx:402](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:402) |
| Pair on this Wi-Fi | `remote.wifi.pair` | [orbit-app/src/components/CompanionSection.tsx:411](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:411) |
| Without secure remote access or Tailscale, this computer is reachable only on a compatible local network. | `remote.localOnly` | [orbit-app/src/components/CompanionSection.tsx:417](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:417) |

## orbit-app/src/components/CompanyBackupSettings.tsx

Fonte: [orbit-app/src/components/CompanyBackupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:1). 15 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Date unavailable | `companyBackup.unknownDate` | [orbit-app/src/components/CompanyBackupSettings.tsx:22](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:22) |
| The daily backup setting could not be saved. Unlock your system keychain and check your company connection, then try again. | `companyBackup.scheduleFailed` | [orbit-app/src/components/CompanyBackupSettings.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:186) |
| Company cloud backups | `companyBackup.title` | [orbit-app/src/components/CompanyBackupSettings.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:239) |
| Daily company backups are paused until this computer reconnects to the same organisation with the same account. Turn them off here to stop them. | `companyBackup.savedSchedule` | [orbit-app/src/components/CompanyBackupSettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:75) |
| Daily backups | `companyBackup.daily` | [orbit-app/src/components/CompanyBackupSettings.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:245) |
| Cloud backups could not be loaded. Check your company connection, then refresh. | `companyBackup.loadFailed` | [orbit-app/src/components/CompanyBackupSettings.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:122) |
| This backup operation could not complete. Check the password, available disk space, and company connection before trying again. | `companyBackup.actionFailed` | [orbit-app/src/components/CompanyBackupSettings.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:223) |
| Preparing replacement… | `backup.restoring` | [orbit-app/src/components/CompanyBackupSettings.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:231) |
| Working on your cloud backup… | `companyBackup.working` | [orbit-app/src/components/CompanyBackupSettings.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:231) |
| Backup transfer progress | `companyBackup.progress` | [orbit-app/src/components/CompanyBackupSettings.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:232) |
| {done} of {total} | `companyBackup.transferred` | [orbit-app/src/components/CompanyBackupSettings.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:232) |
| Cancel transfer | `companyBackup.cancelTransfer` | [orbit-app/src/components/CompanyBackupSettings.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:233) |
| Restore this backup | `companyBackup.restore` | [orbit-app/src/components/CompanyBackupSettings.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:263) |
| Delete cloud backup | `companyBackup.delete` | [orbit-app/src/components/CompanyBackupSettings.tsx:300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:300) |
| Enable daily backups | `companyBackup.enableSchedule` | [orbit-app/src/components/CompanyBackupSettings.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:235) |
| Back up this workspace | `companyBackup.create` | [orbit-app/src/components/CompanyBackupSettings.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:254) |
| {organization} · {email} | `companyBackup.account` | [orbit-app/src/components/CompanyBackupSettings.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:239) |
| Your snapshots are available only to your signed-in company account, across your connected computers. Other members cannot restore them. Automatic backups are off unless you enable them. | `companyBackup.managedScope` | [orbit-app/src/components/CompanyBackupSettings.tsx:241](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:241) |
| Once a day while this app's window is open. Busy workspaces wait; missed days are not replayed. | `companyBackup.scheduleHelp` | [orbit-app/src/components/CompanyBackupSettings.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:244) |
| Next attempt: {date} | `companyBackup.nextBackup` | [orbit-app/src/components/CompanyBackupSettings.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:248) |
| Last scheduled backup: {date} | `companyBackup.lastScheduledBackup` | [orbit-app/src/components/CompanyBackupSettings.tsx:249](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:249) |
| The backup is ready to restore. Fully quit Orbit and reopen it to finish. For a self-hosted server, restart the server process, then reload this browser. Do not just close this window. | `backup.restart` | [orbit-app/src/components/CompanyBackupSettings.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:278) |
| Refresh cloud backups | `companyBackup.refresh` | [orbit-app/src/components/CompanyBackupSettings.tsx:255](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:255) |
| Loading your cloud backups… | `companyBackup.loading` | [orbit-app/src/components/CompanyBackupSettings.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:257) |
| {used} of {total} used or reserved · Up to {count} snapshots kept after a successful backup. | `companyBackup.quota` | [orbit-app/src/components/CompanyBackupSettings.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:258) |
| {count} unfinished uploads or cleanups. Only completed, validated snapshots can be restored. | `companyBackup.pending` | [orbit-app/src/components/CompanyBackupSettings.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:259) |
| No completed cloud backups yet. | `companyBackup.empty` | [orbit-app/src/components/CompanyBackupSettings.tsx:260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:260) |
| What’s included and excluded? | `companyBackup.included` | [orbit-app/src/components/CompanyBackupSettings.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:282) |
| Saved account credentials and connections are not included. Reconnect your accounts on a new machine; existing credentials on the destination stay unchanged. External CLI sign-ins and remote VM disks are not included. | `backup.excluded` | [orbit-app/src/components/CompanyBackupSettings.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:282) |
| Chats, drafts, and user files are not automatically redacted and may contain pasted secrets. Only back up data you want stored with this service. | `companyBackup.managedPrivacy` | [orbit-app/src/components/CompanyBackupSettings.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:282) |
| No backup password needed. Archives stay encrypted, with encryption keys protected by the backup service. This is service-managed encryption, not end-to-end encryption. | `companyBackup.managedEncryption` | [orbit-app/src/components/CompanyBackupSettings.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:283) |
| I want this workspace, including future personal data it may contain, backed up to this company account every day. | `companyBackup.scheduleConsent` | [orbit-app/src/components/CompanyBackupSettings.tsx:284](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:284) |
| Download, check, and preview this encrypted backup first. Your current workspace is not replaced until you review the preview and type REPLACE. | `companyBackup.previewHelp` | [orbit-app/src/components/CompanyBackupSettings.tsx:288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:288) |
| Password for this backup | `backup.importPassword` | [orbit-app/src/components/CompanyBackupSettings.tsx:289](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:289) |
| Validate backup | `backup.validate` | [orbit-app/src/components/CompanyBackupSettings.tsx:290](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:290) |
| This replaces the current workspace; it does not merge. A recoverable safety backup of the current workspace is kept before replacement. Restart is required. | `backup.replaceWarning` | [orbit-app/src/components/CompanyBackupSettings.tsx:293](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:293) |
| Only restore backups you trust: instructions, skills, and bot permissions are restored too. Reconnect accounts as needed. Routines, webhooks, and calendar calls arrive paused; pending work is not resumed. | `backup.trustWarning` | [orbit-app/src/components/CompanyBackupSettings.tsx:293](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:293) |
| Type REPLACE to confirm | `backup.confirmReplace` | [orbit-app/src/components/CompanyBackupSettings.tsx:294](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:294) |
| Replace workspace | `backup.replace` | [orbit-app/src/components/CompanyBackupSettings.tsx:295](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:295) |
| Permanently delete only the cloud archive shown above. Your current workspace and other snapshots stay unchanged. This cloud copy cannot be recovered. | `companyBackup.deleteWarning` | [orbit-app/src/components/CompanyBackupSettings.tsx:298](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:298) |
| Type DELETE to confirm | `companyBackup.confirmDelete` | [orbit-app/src/components/CompanyBackupSettings.tsx:299](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:299) |
| Cancel | `companyBackup.cancel` | [orbit-app/src/components/CompanyBackupSettings.tsx:304](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:304) |

## orbit-app/src/components/CompanyModels.tsx

Fonte: [orbit-app/src/components/CompanyModels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Approved models: {count} | `organization.modelCount` | [orbit-app/src/components/CompanyModels.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:43) |
| Not configured | `organization.notConfigured` | [orbit-app/src/components/CompanyModels.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:43) |
| Now using {name}: {names}. To undo, use the bot’s model chip. | `organization.useCompanyDone` | [orbit-app/src/components/CompanyModels.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:48) |
| Can’t run now: {names} | `organization.useCompanyBots` | [orbit-app/src/components/CompanyModels.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:50) |
| Use {name} for 1 bot that can’t run | `organization.useCompanyOne` | [orbit-app/src/components/CompanyModels.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:53) |
| Use {name} for {count} bots that can’t run | `organization.useCompanyMany` | [orbit-app/src/components/CompanyModels.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:54) |
| Only bots whose engine is missing, unavailable, signed out or not allowed by your organisation change. Archived bots and bots that work on a personal engine your organisation allows stay as they are. To undo, use the bot’s model chip. | `organization.useCompanyNote` | [orbit-app/src/components/CompanyModels.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:56) |
| Switch these from their model chip, because they use elevated permissions: {names} | `organization.useCompanyElevated` | [orbit-app/src/components/CompanyModels.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:59) |
| Ready on this computer | `organization.engineReady` | [orbit-app/src/components/CompanyModels.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:70) |
| Company models from this provider run through the {engine} app on this computer, using your organisation’s access. Install it once; you don’t need to sign in to a personal account. | `organization.engineInstallHelp` | [orbit-app/src/components/CompanyModels.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:77) |
| Company access is unavailable. Check your organisation connection and the matching personal engine’s installation; do not sign in to a personal account here. | `organization.engineUnavailable` | [orbit-app/src/components/CompanyModels.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:79) |

## orbit-app/src/components/Composer.tsx

Fonte: [orbit-app/src/components/Composer.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1). 10 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The team | `composer.busy.team` | [orbit-app/src/components/Composer.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:137) |
| A bot | `composer.busy.aBot` | [orbit-app/src/components/Composer.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:137) |
| The bot | `composer.busy.theBot` | [orbit-app/src/components/Composer.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:138) |
| Keep a team working until the goal is complete | `composer.command.goalDesc` | [orbit-app/src/components/Composer.tsx:302](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:302) |
| Draft a reusable skill from this conversation | `composer.command.learnDesc` | [orbit-app/src/components/Composer.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:311) |
| Have this bot interview you and set itself up | `composer.command.setupDesc` | [orbit-app/src/components/Composer.tsx:319](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:319) |
| The selected responder does not support image attachments. | `composer.error.noImages` | [orbit-app/src/components/Composer.tsx:625](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:625) |
| Could not read the clipboard image. Try attaching the image file instead. | `composer.error.clipboardImage` | [orbit-app/src/components/Composer.tsx:630](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:630) |
| Dictation is only available on macOS for now. | `composer.dictation.macOnly` | [orbit-app/src/components/Composer.tsx:708](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:708) |
| Dictation needs Microphone + Speech Recognition access — System Settings → Privacy & Security. | `composer.dictation.permission` | [orbit-app/src/components/Composer.tsx:710](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:710) |
| Dictation isn't available in this build. | `composer.dictation.unavailable` | [orbit-app/src/components/Composer.tsx:723](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:723) |
| Not sent: “{text}” | `composer.failed.notSent` | [orbit-app/src/components/Composer.tsx:746](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:746) |
| attachment | `composer.failed.attachment` | [orbit-app/src/components/Composer.tsx:747](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:747) |
| Retry | `chat.retry` | [orbit-app/src/components/Composer.tsx:755](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:755) |
| Dismiss failed message | `composer.failed.dismissAria` | [orbit-app/src/components/Composer.tsx:760](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:760) |
| Dismiss | `composer.failed.dismiss` | [orbit-app/src/components/Composer.tsx:761](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:761) |
| Composer commands | `composer.commands.aria` | [orbit-app/src/components/Composer.tsx:771](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:771) |
| Commands | `composer.commands.title` | [orbit-app/src/components/Composer.tsx:775](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:775) |
| Tag a bot | `composer.mention.aria` | [orbit-app/src/components/Composer.tsx:812](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:812) |
| Agent | `composer.mention.agent` | [orbit-app/src/components/Composer.tsx:837](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:837) |
| Group chat | `composer.mention.channel` | [orbit-app/src/components/Composer.tsx:837](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:837) |
| Attach a file | `composer.attach` | [orbit-app/src/components/Composer.tsx:920](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:920) |
| Finish together | `composer.goal.aria` | [orbit-app/src/components/Composer.tsx:929](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:929) |
| Finish together — the team keeps working until the goal is complete | `composer.goal.title` | [orbit-app/src/components/Composer.tsx:930](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:930) |
| Goal | `composer.goal.chip` | [orbit-app/src/components/Composer.tsx:954](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:954) |
| Finish group setup to start a thread | `composer.placeholder.locked` | [orbit-app/src/components/Composer.tsx:1052](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1052) |
| Answer the approval above to continue | `composer.placeholder.approval` | [orbit-app/src/components/Composer.tsx:1054](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1054) |
| Attaching files… | `composer.placeholder.attaching` | [orbit-app/src/components/Composer.tsx:1056](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1056) |
| Listening… | `composer.placeholder.listening` | [orbit-app/src/components/Composer.tsx:1058](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1058) |
| {name} is working — press Enter again to steer the queued message into the running turn | `composer.placeholder.steerQueued` | [orbit-app/src/components/Composer.tsx:1061](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1061) |
| {name} is working — Enter sends this into the running turn | `composer.placeholder.steer` | [orbit-app/src/components/Composer.tsx:1062](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1062) |
| {name} is working — Enter queues your message | `composer.placeholder.queueGroup` | [orbit-app/src/components/Composer.tsx:1065](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1065) |
| {name} is working — sends when this turn finishes | `composer.placeholder.queue` | [orbit-app/src/components/Composer.tsx:1066](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1066) |
| Describe what {name} should finish together | `composer.placeholder.goal` | [orbit-app/src/components/Composer.tsx:1069](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1069) |
| Message {name} — {hint} | `composer.placeholder.group` | [orbit-app/src/components/Composer.tsx:1070](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1070) |
| Message {name} | `composer.placeholder.bot` | [orbit-app/src/components/Composer.tsx:1076](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1076) |
| Stop this turn | `chat.stopTurn` | [orbit-app/src/components/Composer.tsx:1085](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1085) |
| Stop | `chat.stop` | [orbit-app/src/components/Composer.tsx:1087](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1087) |
| Stop dictation | `composer.dictation.stop` | [orbit-app/src/components/Composer.tsx:1095](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1095) |
| Start dictation | `composer.dictation.start` | [orbit-app/src/components/Composer.tsx:1095](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1095) |
| Stop dictation (Esc) | `composer.dictation.stopHint` | [orbit-app/src/components/Composer.tsx:1102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1102) |
| Dictate | `composer.dictation.hint` | [orbit-app/src/components/Composer.tsx:1102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1102) |
| Send into the running turn | `composer.send.steer` | [orbit-app/src/components/Composer.tsx:1120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1120) |
| Queue message | `composer.send.queue` | [orbit-app/src/components/Composer.tsx:1115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1115) |
| Send message | `composer.send.message` | [orbit-app/src/components/Composer.tsx:1116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1116) |
| Sends when the current turn finishes | `composer.send.queueHint` | [orbit-app/src/components/Composer.tsx:1122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1122) |
| Send | `chat.send` | [orbit-app/src/components/Composer.tsx:1123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1123) |

## orbit-app/src/components/ComposerAttachments.tsx

Fonte: [orbit-app/src/components/ComposerAttachments.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Drop to attach | `composerAttachments.ui.dropToAttach` | [orbit-app/src/components/ComposerAttachments.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:114) |
| Dismiss | `composer.ui.dismiss` | [orbit-app/src/components/ComposerAttachments.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:124) |
| Display pasted text in chat box | `composer.ui.displayPastedTextInChatBox` | [orbit-app/src/components/ComposerAttachments.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:153) |
| Display in chat box | `composer.ui.displayInChatBox` | [orbit-app/src/components/ComposerAttachments.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:157) |

## orbit-app/src/components/ComposerQueuedMessages.tsx

Fonte: [orbit-app/src/components/ComposerQueuedMessages.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Steering… | `composer.queued.steering` | [orbit-app/src/components/ComposerQueuedMessages.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:79) |
| Steer all | `composer.queued.steerAll` | [orbit-app/src/components/ComposerQueuedMessages.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:82) |
| Steer next | `composer.queued.steerNext` | [orbit-app/src/components/ComposerQueuedMessages.tsx:83](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:83) |
| Steer | `composer.queued.steer` | [orbit-app/src/components/ComposerQueuedMessages.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:84) |
| Stop the running turn and send all {count} queued messages now | `composer.queued.steerAllInterruptHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:88) |
| Stop the running turn and send the next queued message now | `composer.queued.steerNextInterruptHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:89) |
| Stop the running turn and send this message now | `composer.queued.steerInterruptHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:90) |
| Steer all {count} queued messages now | `composer.queued.steerAllHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:93) |
| Steer the next queued message now | `composer.queued.steerNextHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:94) |
| Steer queued message now | `composer.queued.steerHint` | [orbit-app/src/components/ComposerQueuedMessages.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:95) |
| 1 queued message | `composer.queued.regionOne` | [orbit-app/src/components/ComposerQueuedMessages.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:102) |
| {count} queued messages | `composer.queued.regionMany` | [orbit-app/src/components/ComposerQueuedMessages.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:103) |
| Queued — this bot's room turn runs one at a time; it starts when that finishes. | `composer.queued.groupTurn` | [orbit-app/src/components/ComposerQueuedMessages.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:108) |
| Queued — starts when this bot has a free thread slot. | `composer.queued.capacity` | [orbit-app/src/components/ComposerQueuedMessages.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:111) |
| Queued messages | `composer.queued.list` | [orbit-app/src/components/ComposerQueuedMessages.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:113) |
| Steering queued messages | `composer.queued.steeringAria` | [orbit-app/src/components/ComposerQueuedMessages.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:130) |
| Edit queued message {index} of {count} | `composer.queued.editAria` | [orbit-app/src/components/ComposerQueuedMessages.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:147) |
| Edit — move this message back into the composer | `composer.queued.editTitle` | [orbit-app/src/components/ComposerQueuedMessages.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:148) |
| Delete queued message {index} of {count} | `composer.queued.deleteAria` | [orbit-app/src/components/ComposerQueuedMessages.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:157) |
| Delete this queued message | `composer.queued.deleteTitle` | [orbit-app/src/components/ComposerQueuedMessages.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:158) |

## orbit-app/src/components/ComputerPanel.tsx

Fonte: [orbit-app/src/components/ComputerPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1). 31 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The built-in browser is switched off under App Settings → Experimental | `computer.err.browserOff` | [orbit-app/src/components/ComputerPanel.tsx:399](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:399) |
| This model engine cannot use the built-in browser | `computer.err.browserEngine` | [orbit-app/src/components/ComputerPanel.tsx:400](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:400) |
| {name}'s live desktop | `computer.viewerTitle` | [orbit-app/src/components/ComputerPanel.tsx:1058](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1058) |
| Delete {name}'s Local VM? Its private durable workspace will remain. | `computer.confirm.deleteVm` | [orbit-app/src/components/ComputerPanel.tsx:1124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1124) |
| Replace {name}'s Local VM? Its private durable workspace will remain. | `computer.confirm.replaceVm` | [orbit-app/src/components/ComputerPanel.tsx:1125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1125) |
| Replace {name}'s VPS computer with the version required by this Orbit update? Files stored only inside the disposable container will be deleted. | `computer.confirm.replaceVps` | [orbit-app/src/components/ComputerPanel.tsx:1160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1160) |
| Checking… | `computer.phase.checking` | [orbit-app/src/components/ComputerPanel.tsx:1195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1195) |
| Starting your bot's computer… | `computer.phase.starting` | [orbit-app/src/components/ComputerPanel.tsx:1196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1196) |
| Your bot is using this computer right now — the screen appears here as soon as the computer is ready. | `computer.phase.busyBoat` | [orbit-app/src/components/ComputerPanel.tsx:1197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1197) |
| No cloud computer configured | `computer.phase.unconfigured` | [orbit-app/src/components/ComputerPanel.tsx:1198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1198) |
| Auto found no existing computer. Choose Cloud to create one, or pick another destination. | `computer.phase.autoUnavailable` | [orbit-app/src/components/ComputerPanel.tsx:1199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1199) |
| Auto found an existing cloud computer. It was not opened or changed. | `computer.phase.showReadyBoat` | [orbit-app/src/components/ComputerPanel.tsx:1201](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1201) |
| Auto found a sleeping cloud computer. It was not woken or changed. | `computer.phase.showSleepingBoat` | [orbit-app/src/components/ComputerPanel.tsx:1202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1202) |
| Auto found an existing cloud computer that is not ready. It was not changed. | `computer.phase.showPendingBoat` | [orbit-app/src/components/ComputerPanel.tsx:1203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1203) |
| No managed VPS computer is configured for this bot | `computer.phase.vpsUnconfigured` | [orbit-app/src/components/ComputerPanel.tsx:1204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1204) |
| This VPS computer belongs to an earlier Orbit version | `computer.phase.vpsIncompatible` | [orbit-app/src/components/ComputerPanel.tsx:1205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1205) |
| The managed VPS computer is stopped | `computer.phase.vpsStopped` | [orbit-app/src/components/ComputerPanel.tsx:1206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1206) |
| Local computer control isn't ready. | `computer.phase.localUnavailable` | [orbit-app/src/components/ComputerPanel.tsx:1207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1207) |
| The Local VM isn't available for this bot | `computer.phase.vmUnavailable` | [orbit-app/src/components/ComputerPanel.tsx:1208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1208) |
| This bot works in the built-in browser — no desktop here | `computer.phase.browser` | [orbit-app/src/components/ComputerPanel.tsx:1209](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1209) |
| This bot's computer is off | `computer.phase.off` | [orbit-app/src/components/ComputerPanel.tsx:1210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1210) |
| Couldn't reach the computer | `computer.phase.error` | [orbit-app/src/components/ComputerPanel.tsx:1211](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1211) |
| Resize panel | `computer.resizeAria` | [orbit-app/src/components/ComputerPanel.tsx:1229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1229) |
| Bot settings | `computer.botSettings` | [orbit-app/src/components/ComputerPanel.tsx:1253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1253) |
| Bot panel view | `computer.ui.botPanelView` | [orbit-app/src/components/ComputerPanel.tsx:1258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1258) |
| Computer | `computer.tab.computer` | [orbit-app/src/components/ComputerPanel.tsx:1267](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1267) |
| In use now | `place.live` | [orbit-app/src/components/ComputerPanel.tsx:1302](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1302) |
| Routines | `computer.tab.routines` | [orbit-app/src/components/ComputerPanel.tsx:1804](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1804) |
| Android | `computer.tab.android` | [orbit-app/src/components/ComputerPanel.tsx:1285](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1285) |
| Browser | `computer.tab.browser` | [orbit-app/src/components/ComputerPanel.tsx:1301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1301) |
| {name}'s screen | `computer.screenOf` | [orbit-app/src/components/ComputerPanel.tsx:1388](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1388) |
| Team default | `computer.ui.teamDefault` | [orbit-app/src/components/ComputerPanel.tsx:1337](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1337) |
| this computer | `computer.badge.local` | [orbit-app/src/components/ComputerPanel.tsx:1338](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1338) |
| Local VM | `vm.dest.vm` | [orbit-app/src/components/ComputerPanel.tsx:1339](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1339) |
| cloud boat · Auto · read-only | `computer.badge.autoBoat` | [orbit-app/src/components/ComputerPanel.tsx:1341](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1341) |
| self-hosted VPS | `computer.badge.vps` | [orbit-app/src/components/ComputerPanel.tsx:1343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1343) |
| Open {name}'s live desktop | `computer.openLiveDesktopAria` | [orbit-app/src/components/ComputerPanel.tsx:1372](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1372) |
| Open live desktop | `computer.openLiveDesktop` | [orbit-app/src/components/ComputerPanel.tsx:1660](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1660) |
| Open | `computer.open` | [orbit-app/src/components/ComputerPanel.tsx:1382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1382) |
| Watch-only preview | `computer.watchOnly` | [orbit-app/src/components/ComputerPanel.tsx:1390](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1390) |
| Waiting for the first frame… | `computer.waitingFrame` | [orbit-app/src/components/ComputerPanel.tsx:1405](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1405) |
| Auto found an existing cloud computer. Choose Cloud to open it. | `computer.autoChooseCloudOpen` | [orbit-app/src/components/ComputerPanel.tsx:1407](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1407) |
| Capturing the Local VM screen… | `computer.capturingVm` | [orbit-app/src/components/ComputerPanel.tsx:1409](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1409) |
| Ready for approved bot actions. Start the separate preview below when you want to watch the screen. | `computer.linuxReady` | [orbit-app/src/components/ComputerPanel.tsx:1412](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1412) |
| No frames yet — the preview needs Screen Recording permission. After granting, relaunch the app. | `computer.needsScreenPerm` | [orbit-app/src/components/ComputerPanel.tsx:1414](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1414) |
| Capturing this computer's screen… | `computer.capturingLocal` | [orbit-app/src/components/ComputerPanel.tsx:1415](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1415) |
| Shared files and signed-in accounts. Auto uses this Boat, not a private computer. | `computer.ui.sharedFilesAndSignedInAccounts` | [orbit-app/src/components/ComputerPanel.tsx:1419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1419) |
| Open Team map | `computer.ui.openTeamMap` | [orbit-app/src/components/ComputerPanel.tsx:1421](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1421) |
| Refresh shared computer status | `computer.ui.refreshSharedComputerStatus` | [orbit-app/src/components/ComputerPanel.tsx:1423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1423) |
| Open Settings | `computer.openSettings` | [orbit-app/src/components/ComputerPanel.tsx:1430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1430) |
| Open the Browser tab | `computer.openBrowserTab` | [orbit-app/src/components/ComputerPanel.tsx:1438](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1438) |
| Choose Cloud to wake | `computer.chooseCloudWake` | [orbit-app/src/components/ComputerPanel.tsx:1448](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1448) |
| Choose Cloud to open | `computer.chooseCloudOpen` | [orbit-app/src/components/ComputerPanel.tsx:1450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1450) |
| Choose Cloud to manage | `computer.chooseCloudManage` | [orbit-app/src/components/ComputerPanel.tsx:1451](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1451) |
| Create {name}'s VM | `computer.createVm` | [orbit-app/src/components/ComputerPanel.tsx:1465](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1465) |
| Replace {name}'s VM | `computer.replaceVm` | [orbit-app/src/components/ComputerPanel.tsx:1466](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1466) |
| Open Local VM setup | `computer.openVmSetup` | [orbit-app/src/components/ComputerPanel.tsx:1473](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1473) |
| Open VPS settings | `computer.openVpsSettings` | [orbit-app/src/components/ComputerPanel.tsx:1536](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1536) |
| Start VPS computer | `computer.startVps` | [orbit-app/src/components/ComputerPanel.tsx:1493](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1493) |
| Prepare VPS computer | `computer.prepareVps` | [orbit-app/src/components/ComputerPanel.tsx:1493](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1493) |
| Replace VPS computer | `computer.replaceVps` | [orbit-app/src/components/ComputerPanel.tsx:1504](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1504) |
| Add a Boat API key to give this bot a cloud computer — it spins up right here. | `computer.addBoatKey` | [orbit-app/src/components/ComputerPanel.tsx:1519](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1519) |
| Configure the VPS SSH alias in App Settings → Connections. Auto only reuses an existing ready container. | `computer.vpsAliasHint` | [orbit-app/src/components/ComputerPanel.tsx:1530](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1530) |
| Watch two Local VM desktops together without pausing either bot | `computer.twoDesktopsTitle` | [orbit-app/src/components/ComputerPanel.tsx:1550](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1550) |
| Open two desktops | `computer.twoDesktops` | [orbit-app/src/components/ComputerPanel.tsx:1553](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1553) |
| asked for your hands: | `computer.askedHands` | [orbit-app/src/components/ComputerPanel.tsx:1561](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1561) |
| Take control | `computer.takeControl` | [orbit-app/src/components/ComputerPanel.tsx:1650](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1650) |
| Dismiss | `computer.dismiss` | [orbit-app/src/components/ComputerPanel.tsx:1579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1579) |
| You have the wheel — the bot's clicks and keystrokes are refused until you hand it back. | `computer.youHaveWheel` | [orbit-app/src/components/ComputerPanel.tsx:1587](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1587) |
| Use “Open live desktop” to drive. | `computer.useOpenDesktop` | [orbit-app/src/components/ComputerPanel.tsx:1588](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1588) |
| Use “Open live desktop” to drive — the preview here is watch-only. | `computer.useOpenDesktopVm` | [orbit-app/src/components/ComputerPanel.tsx:1589](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1589) |
| Hand control back | `computer.handBack` | [orbit-app/src/components/ComputerPanel.tsx:1600](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1600) |
| Open the Local VM's live desktop inside Orbit | `computer.openVmDesktopTitle` | [orbit-app/src/components/ComputerPanel.tsx:1609](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1609) |
| Pause the bot's hands and open the Local VM's live desktop | `computer.takeControlVmTitle` | [orbit-app/src/components/ComputerPanel.tsx:1620](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1620) |
| Stop this bot's turn before deleting its VM | `computer.deleteVmBlocked` | [orbit-app/src/components/ComputerPanel.tsx:1631](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1631) |
| Delete {name}'s Local VM | `computer.deleteVmTitle` | [orbit-app/src/components/ComputerPanel.tsx:1631](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1631) |
| Delete this bot's VM | `computer.deleteVm` | [orbit-app/src/components/ComputerPanel.tsx:1634](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1634) |
| Pause the bot's hands and drive this computer yourself | `computer.takeControlTitle` | [orbit-app/src/components/ComputerPanel.tsx:1647](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1647) |
| Put the computer to sleep | `computer.sleepTitle` | [orbit-app/src/components/ComputerPanel.tsx:1669](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1669) |
| Sleep | `vm.cloud.sleep` | [orbit-app/src/components/ComputerPanel.tsx:1672](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1672) |
| Works on | `computer.worksOn` | [orbit-app/src/components/ComputerPanel.tsx:1686](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1686) |
| Choose where this bot can use a computer. | `computer.worksOnHint` | [orbit-app/src/components/ComputerPanel.tsx:1688](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1688) |
| Computer destination | `computer.destinationAria` | [orbit-app/src/components/ComputerPanel.tsx:1690](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1690) |
| Managed by {organization} | `policy.managedBy` | [orbit-app/src/components/ComputerPanel.tsx:1703](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1703) |
| This model engine cannot use the Local VM | `computer.unavailableVm` | [orbit-app/src/components/ComputerPanel.tsx:1711](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1711) |
| This model engine cannot use cloud computer tools | `computer.unavailableCloud` | [orbit-app/src/components/ComputerPanel.tsx:1713](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1713) |
| Local computer control isn't ready | `computer.unavailableLocal` | [orbit-app/src/components/ComputerPanel.tsx:1715](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1715) |
| The built-in browser tab only; no desktop | `computer.browserOnlyTitle` | [orbit-app/src/components/ComputerPanel.tsx:1717](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1717) |
| Unavailable here | `computer.unavailableHere` | [orbit-app/src/components/ComputerPanel.tsx:1751](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1751) |
| This conversation is pinned to {place}. Change it from the composer. | `place.pinnedNote` | [orbit-app/src/components/ComputerPanel.tsx:1759](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1759) |
| Uses your VPS and starts it when needed. | `computer.hint.vpsAuto` | [orbit-app/src/components/ComputerPanel.tsx:1778](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1778) |
| Prefers an existing cloud computer; otherwise uses this computer. Select Cloud to start a cloud computer. | `computer.hint.autoLocal` | [orbit-app/src/components/ComputerPanel.tsx:1780](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1780) |
| Uses an existing cloud computer. Select Cloud to create or wake one. | `computer.hint.autoCloud` | [orbit-app/src/components/ComputerPanel.tsx:1781](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1781) |
| A private Linux desktop on this device, separate from your own screen. | `computer.hint.vm` | [orbit-app/src/components/ComputerPanel.tsx:1784](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1784) |
| Local VM settings → | `computer.vmSettingsLink` | [orbit-app/src/components/ComputerPanel.tsx:1786](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1786) |
| Uses your screen, mouse, and keyboard. | `computer.hint.local` | [orbit-app/src/components/ComputerPanel.tsx:1790](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1790) |
| Uses the built-in browser without access to your desktop. | `computer.hint.browser` | [orbit-app/src/components/ComputerPanel.tsx:1792](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1792) |
| This bot can still chat and use its other tools. | `computer.hint.off` | [orbit-app/src/components/ComputerPanel.tsx:1794](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1794) |
| Open schedules | `computer.routines.openTitle` | [orbit-app/src/components/ComputerPanel.tsx:1805](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1805) |

## orbit-app/src/components/ComputerSharingSettings.tsx

Fonte: [orbit-app/src/components/ComputerSharingSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:1). 8 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not load computer access. Reopen this page to try again. | `sharing.ui.couldNotLoadComputerAccessReopen` | [orbit-app/src/components/ComputerSharingSettings.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:33) |
| Close computer access | `sharing.ui.closeComputerAccess` | [orbit-app/src/components/ComputerSharingSettings.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:56) |
| Choose what this workspace’s bots can use. Shared files and screen content may be sent to its AI provider. Access stays on when you switch workspaces, until you stop sharing or close the desktop app. | `sharing.ui.chooseWhatThisWorkspaceSBots` | [orbit-app/src/components/ComputerSharingSettings.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:58) |
| Shared folders | `sharing.ui.sharedFolders` | [orbit-app/src/components/ComputerSharingSettings.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:60) |
| No folders shared. New folders are read-only by default. | `sharing.ui.noFoldersSharedNewFoldersAre` | [orbit-app/src/components/ComputerSharingSettings.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:61) |
| Allow edits | `sharing.ui.allowEdits` | [orbit-app/src/components/ComputerSharingSettings.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:64) |
| Choose folder | `sharing.ui.chooseFolder` | [orbit-app/src/components/ComputerSharingSettings.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:70) |
| Broader access · optional | `sharing.ui.broaderAccessOptional` | [orbit-app/src/components/ComputerSharingSettings.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:74) |
| Unrestricted terminal | `sharing.ui.unrestrictedTerminal` | [orbit-app/src/components/ComputerSharingSettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:75) |
| Run commands as you. This can access or delete files anywhere you can, including credentials—not just the folders above. | `sharing.ui.runCommandsAsYouThisCan` | [orbit-app/src/components/ComputerSharingSettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:75) |
| Computer control | `sharing.ui.computerControl` | [orbit-app/src/components/ComputerSharingSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:76) |
| View your screen and operate your signed-in apps, outside the shared folders. Requires local computer control and OS permissions. | `sharing.ui.viewYourScreenAndOperateYour` | [orbit-app/src/components/ComputerSharingSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:76) |
| Stop sharing | `sharing.ui.stopSharing` | [orbit-app/src/components/ComputerSharingSettings.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:86) |
| Stopping blocks new requests and cancels running work where possible. An action already sent to an app may still finish. | `sharing.ui.stoppingBlocksNewRequestsAndCancels` | [orbit-app/src/components/ComputerSharingSettings.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:88) |

## orbit-app/src/components/ConfirmDialog.tsx

Fonte: [orbit-app/src/components/ConfirmDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConfirmDialog.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Cancel | `confirmDialog.ui.cancel` | [orbit-app/src/components/ConfirmDialog.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConfirmDialog.tsx:139) |

## orbit-app/src/components/ConnectedWorkspacesSettings.tsx

Fonte: [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not load saved workspaces. Please reopen this page. | `workspaces.ui.couldNotLoadSavedWorkspacesPlease` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:29) |
| Manage workspace connections in the desktop app. | `workspaces.ui.manageWorkspaceConnectionsInTheDesktop` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:60) |
| One desktop app, wherever your bots live. Switching workspaces does not move or replace your bots, conversations, or provider accounts. | `workspaces.ui.oneDesktopAppWhereverYourBots` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:63) |
| Your workspaces | `workspaces.ui.yourWorkspaces` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:64) |
| Saved on this computer. Your hosted bots keep running when you switch away. | `workspaces.ui.savedOnThisComputerYourHosted` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:64) |
| Current | `workspaces.ui.current` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:74) |
| Switch | `workspaces.ui.switch` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:76) |
| Computer access | `workspaces.ui.computerAccess` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:77) |
| Connect hosted workspace | `workspaces.ui.connectHostedWorkspace` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:85) |
| Already running Orbit on a VPS, server, or another computer? Connect it here. | `workspaces.ui.alreadyRunningOrbitOnAVps` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:85) |
| https://bots.yourcompany.com | `workspaces.ui.httpsBotsYourcompanyCom` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:92](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:92) |
| My cloud workspace | `workspaces.ui.myCloudWorkspace` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:96) |
| Paste a pairing link from your server’s Settings → Remote access, or enter its address and sign in there. Your desktop stays connected afterward. | `workspaces.ui.pasteAPairingLinkFromYour` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:99) |
| Need a pairing code? | `workspaces.ui.needAPairingCode` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:100) |
| Run this on the server and copy the link it prints: | `workspaces.ui.runThisOnTheServerAnd` | [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:101) |

## orbit-app/src/components/ConnectionDetail.tsx

Fonte: [orbit-app/src/components/ConnectionDetail.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectionDetail.tsx:1). 2 linhas com controlos reconhecidos.

## orbit-app/src/components/CustomDomainSettings.tsx

Fonte: [orbit-app/src/components/CustomDomainSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Enter an address like bots.yourcompany.com to see the DNS values. | `settings.domain.enterDomain` | [orbit-app/src/components/CustomDomainSettings.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:35) |
| Type | `settings.domain.recordType` | [orbit-app/src/components/CustomDomainSettings.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:37) |
| Name / Host | `settings.domain.recordName` | [orbit-app/src/components/CustomDomainSettings.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:38) |
| Value / IP | `settings.domain.recordValue` | [orbit-app/src/components/CustomDomainSettings.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:39) |
| Add this record in your domain provider’s DNS settings | `settings.domain.dnsRecord` | [orbit-app/src/components/CustomDomainSettings.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:43) |
| Copy {field} | `settings.domain.copyField` | [orbit-app/src/components/CustomDomainSettings.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:49) |
| Ask your server administrator for its public IPv4 address. | `settings.domain.missingIp` | [orbit-app/src/components/CustomDomainSettings.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:50) |
| Leave TTL at its default. If your provider already adds your domain, enter only the subdomain in Name (or @ for the root domain). | `settings.domain.recordHint` | [orbit-app/src/components/CustomDomainSettings.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:55) |
| Advanced server setup | `settings.domain.guide` | [orbit-app/src/components/CustomDomainSettings.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:78) |
| In your domain's DNS settings, create an A record for your chosen name pointing to this server's public IPv4 address. Add an AAAA record only if IPv6 reaches this same server. Allow time for DNS to update. | `settings.domain.dns` | [orbit-app/src/components/CustomDomainSettings.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:80) |
| Your server administrator must configure HTTPS in front of Orbit. For Caddy running on the same host or network namespace, use this example and replace bots.example.com with your domain: | `settings.domain.proxy` | [orbit-app/src/components/CustomDomainSettings.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:82) |
| Allow incoming ports 80 and 443 for Caddy's certificate setup. Keep its certificate storage persistent, preserve the Host header and forwarded headers, and reload Caddy after changing its configuration. For Docker, use the supplied deployment recipe. | `settings.domain.proxyHint` | [orbit-app/src/components/CustomDomainSettings.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:84) |
| Once HTTPS works, enter your domain below. Orbit checks its certificate and confirms that it reaches this exact workspace before saving anything. | `settings.domain.verifyHint` | [orbit-app/src/components/CustomDomainSettings.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:86) |
| Keep Orbit's app and webhook listeners on loopback. Never publish the app's internal port directly to the internet. | `settings.domain.loopbackWarning` | [orbit-app/src/components/CustomDomainSettings.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:88) |
| For Docker, NAT or multiple public addresses, set ORBIT_PUBLIC_IPV4 to the IPv4 address where your HTTPS proxy is hosted and restart Orbit. Private addresses are never shown as DNS values. | `settings.domain.ipAdminHint` | [orbit-app/src/components/CustomDomainSettings.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:89) |
| This changes future server pairing links, not existing webhook URLs or the desktop companion connection. Your bots and conversations stay untouched. Each browser must pair separately on the new domain. | `settings.domain.scope` | [orbit-app/src/components/CustomDomainSettings.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:90) |
| Open self-hosting guide | `settings.domain.fullGuide` | [orbit-app/src/components/CustomDomainSettings.tsx:92](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:92) |
| The domain could not be updated. Check DNS and HTTPS, then try again. | `settings.domain.failed` | [orbit-app/src/components/CustomDomainSettings.tsx:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:133) |
| Custom address removed. Your bots, conversations, DNS and proxy are unchanged. | `settings.domain.removed` | [orbit-app/src/components/CustomDomainSettings.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:131) |
| Domain verified and connected. Keep this tab open until you have paired a browser at the new address. | `settings.domain.saved` | [orbit-app/src/components/CustomDomainSettings.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:131) |
| Connect your domain | `settings.domain.title` | [orbit-app/src/components/CustomDomainSettings.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:138) |
| Enter your address, then copy the DNS record to your domain provider. | `settings.domain.subtitle` | [orbit-app/src/components/CustomDomainSettings.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:138) |
| Loading server address… | `settings.domain.loading` | [orbit-app/src/components/CustomDomainSettings.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:140) |
| Custom domains are for a self-hosted Orbit server. This desktop app's phone connection is managed separately below. | `settings.domain.serverOnly` | [orbit-app/src/components/CustomDomainSettings.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:141) |
| Your domain | `settings.domain.label` | [orbit-app/src/components/CustomDomainSettings.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:145) |
| Your administrator must enable HTTPS on the server. Then check the connection below. | `settings.domain.httpsNeeded` | [orbit-app/src/components/CustomDomainSettings.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:148) |
| Checking connection… | `settings.domain.verifying` | [orbit-app/src/components/CustomDomainSettings.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:152) |
| Connect domain | `settings.domain.verify` | [orbit-app/src/components/CustomDomainSettings.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:152) |
| Removing… | `settings.domain.removing` | [orbit-app/src/components/CustomDomainSettings.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:154) |
| Remove custom address | `settings.domain.remove` | [orbit-app/src/components/CustomDomainSettings.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:154) |
| Current public address | `settings.domain.current` | [orbit-app/src/components/CustomDomainSettings.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:157) |
| Removing the custom address restores {url}. It does not change your DNS or proxy. | `settings.domain.fallback` | [orbit-app/src/components/CustomDomainSettings.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:158) |
| No fallback public address is configured. Removing this address stops Orbit using it for new pairing links; your DNS and proxy stay unchanged. | `settings.domain.noFallback` | [orbit-app/src/components/CustomDomainSettings.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:158) |

## orbit-app/src/components/DesktopWorkspaceSwitcher.tsx

Fonte: [orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not open workspaces. Try the Server menu. | `workspaceSwitcher.ui.couldNotOpenWorkspacesTryThe` | [orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:43) |

## orbit-app/src/components/DigestChip.tsx

Fonte: [orbit-app/src/components/DigestChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Did {tools} tool calls | `chat.digestChipNoFiles` | [orbit-app/src/components/DigestChip.tsx:16](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:16) |
| Did {tools} tool calls · {files} files changed | `chat.digestChip` | [orbit-app/src/components/DigestChip.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:17) |
| What this turn did | `chat.digestTitle` | [orbit-app/src/components/DigestChip.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:21) |
| Earlier context summarized | `chat.compactionTitle` | [orbit-app/src/components/DigestChip.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:36) |
| Your full conversation is still here. The agent uses this summary and recent messages when continuing. | `chat.compactionHint` | [orbit-app/src/components/DigestChip.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:37) |

## orbit-app/src/components/EngineLibrary.tsx

Fonte: [orbit-app/src/components/EngineLibrary.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Bring your own model | `engines.library.custom` | [orbit-app/src/components/EngineLibrary.tsx:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:26) |
| Ready | `onboarding.engines.ready` | [orbit-app/src/components/EngineLibrary.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:47) |
| Needs setup | `onboarding.engines.needsSetup` | [orbit-app/src/components/EngineLibrary.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:47) |
| Manage | `engines.library.manage` | [orbit-app/src/components/EngineLibrary.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:50) |
| Set up | `engines.library.setup` | [orbit-app/src/components/EngineLibrary.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:53) |
| No CLI engines detected yet. | `engines.none` | [orbit-app/src/components/EngineLibrary.tsx:83](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:83) |
| Checking… | `common.checking` | [orbit-app/src/components/EngineLibrary.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:95) |
| Check again | `engines.library.refresh` | [orbit-app/src/components/EngineLibrary.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:95) |

## orbit-app/src/components/EngineSetup.tsx

Fonte: [orbit-app/src/components/EngineSetup.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:1). 12 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Copy command | `engineSetup.copyCommand` | [orbit-app/src/components/EngineSetup.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:147) |
| Copied | `engineSetup.copied` | [orbit-app/src/components/EngineSetup.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:121) |
| Copy | `engineSetup.copy` | [orbit-app/src/components/EngineSetup.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:121) |
| Opened | `engineSetup.opened` | [orbit-app/src/components/EngineSetup.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:96) |
| Terminal | `engineSetup.terminal` | [orbit-app/src/components/EngineSetup.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:96) |
| Terminal opened. Paste the command and press Enter. | `engineSetup.openedHint` | [orbit-app/src/components/EngineSetup.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:100) |
| Terminal opened | `engineSetup.terminalOpened` | [orbit-app/src/components/EngineSetup.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:134) |
| Paste the command and press Enter. | `engineSetup.pasteHint` | [orbit-app/src/components/EngineSetup.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:137) |
| The command is copied when Terminal opens. | `engineSetup.copyOnOpenHint` | [orbit-app/src/components/EngineSetup.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:137) |
| Command copied | `engineSetup.commandCopied` | [orbit-app/src/components/EngineSetup.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:147) |
| Installing on the server. This can take a minute. | `engineSetup.serverInstalling` | [orbit-app/src/components/EngineSetup.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:191) |
| Installed. Checking the engine. | `engineSetup.serverInstalled` | [orbit-app/src/components/EngineSetup.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:194) |
| Prefer a terminal? | `engineSetup.preferTerminal` | [orbit-app/src/components/EngineSetup.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:198) |
| Open update in Terminal | `engineSetup.openUpdate` | [orbit-app/src/components/EngineSetup.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:231) |
| Google sign-in did not return a link. | `engineSetup.googleNoLink` | [orbit-app/src/components/EngineSetup.tsx:300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:300) |
| Downloading and verifying… | `engineSetup.installing` | [orbit-app/src/components/EngineSetup.tsx:332](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:332) |
| {mb} MB download from Google. Orbit verifies it before use. | `engineSetup.downloadNote` | [orbit-app/src/components/EngineSetup.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:335) |
| Starting Google sign-in… | `engineSetup.startingGoogle` | [orbit-app/src/components/EngineSetup.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:352) |
| Open Google sign-in again | `engineSetup.openGoogleAgain` | [orbit-app/src/components/EngineSetup.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:354) |
| Sign in with Google | `engineSetup.signInGoogle` | [orbit-app/src/components/EngineSetup.tsx:355](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:355) |
| Starting Antigravity can take up to 90 seconds. Your browser will open when it’s ready. | `engineSetup.antigravitySlow` | [orbit-app/src/components/EngineSetup.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:357) |
| Checking… | `common.checking` | [orbit-app/src/components/EngineSetup.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:361) |
| I finished signing in | `engineSetup.finishedSignIn` | [orbit-app/src/components/EngineSetup.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:361) |
| Signing in from another computer? | `engineSetup.otherComputer` | [orbit-app/src/components/EngineSetup.tsx:364](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:364) |
| After Google redirects to a page that cannot load, paste that page’s complete URL here. | `engineSetup.otherComputerHint` | [orbit-app/src/components/EngineSetup.tsx:365](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:365) |
| Sending… | `engineSetup.sending` | [orbit-app/src/components/EngineSetup.tsx:378](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:378) |
| Send redirect to server | `engineSetup.sendRedirect` | [orbit-app/src/components/EngineSetup.tsx:378](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:378) |
| Sign in to {name} | `engineSetup.signInTitle` | [orbit-app/src/components/EngineSetup.tsx:413](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:413) |
| Install {name} | `engineSetup.installTitle` | [orbit-app/src/components/EngineSetup.tsx:414](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:414) |
| Connect your ChatGPT account to Codex on this server. Complete sign-in in your own browser; no terminal or password sharing needed. | `engineSetup.device.description` | [orbit-app/src/components/EngineSetup.tsx:417](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:417) |
| Sign in to Claude Code on this server with your own Claude subscription. Open Anthropic's sign-in page in your browser, sign in, then paste the code it shows you here. No terminal and no password sharing. | `engineSetup.claude.description` | [orbit-app/src/components/EngineSetup.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:419) |
| Each Antigravity engine has its own Google account. Your browser completes the secure sign-in. | `engineSetup.managedSignIn` | [orbit-app/src/components/EngineSetup.tsx:421](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:421) |
| Finish the account sign-in in Terminal. Reopen this menu afterward and we’ll check again. | `engineSetup.terminalSignIn` | [orbit-app/src/components/EngineSetup.tsx:422](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:422) |
| Install the agent once, then you can run it with local models—no cloud sign-in required. | `engineSetup.injectDesc` | [orbit-app/src/components/EngineSetup.tsx:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:424) |
| Orbit installs the command-line app on the machine it runs on, as its own user, in its own folder. No terminal needed; sign-in may follow. | `engineSetup.serverInstallDesc` | [orbit-app/src/components/EngineSetup.tsx:426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:426) |
| Orbit installs its own verified Antigravity runtime. It is separate from the Antigravity app and agy CLI; install it here, sign in with Google, and this model list will refresh from your account. | `engineSetup.managedDesc` | [orbit-app/src/components/EngineSetup.tsx:428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:428) |
| Install the command-line app once. Models will appear here as soon as it’s ready; sign-in may follow. | `engineSetup.installDescSignIn` | [orbit-app/src/components/EngineSetup.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:430) |
| Install the command-line app once. Models will appear here as soon as it’s ready. | `engineSetup.installDesc` | [orbit-app/src/components/EngineSetup.tsx:431](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:431) |
| {name} isn’t ready | `engineSetup.notReady` | [orbit-app/src/components/EngineSetup.tsx:438](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:438) |
| This engine is not available on this machine. | `engineSetup.noReason` | [orbit-app/src/components/EngineSetup.tsx:440](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:440) |
| Open sign-in in Terminal | `engineSetup.openSignIn` | [orbit-app/src/components/EngineSetup.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:475) |
| Open install in Terminal | `engineSetup.openInstall` | [orbit-app/src/components/EngineSetup.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:475) |
| There isn’t a one-line installer for this platform. Use the setup guide below. | `engineSetup.noInstaller` | [orbit-app/src/components/EngineSetup.tsx:479](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:479) |
| Requires Node.js and {npm}. | `engineSetup.needsNode` | [orbit-app/src/components/EngineSetup.tsx:487](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:487) |
| View setup guide | `engineSetup.viewGuide` | [orbit-app/src/components/EngineSetup.tsx:502](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:502) |

## orbit-app/src/components/EnginesSettings.tsx

Fonte: [orbit-app/src/components/EnginesSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {name} detected CLI | `engines.detectedAria` | [orbit-app/src/components/EnginesSettings.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:120) |
| Select a detected binary… | `engines.selectBinary` | [orbit-app/src/components/EnginesSettings.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:124) |
| Enter path manually… | `engines.manualPath` | [orbit-app/src/components/EnginesSettings.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:142) |
| {name} custom CLI path | `engines.customAria` | [orbit-app/src/components/EnginesSettings.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:143) |
| Test failed — {message} Register this path anyway? | `engines.testFailed` | [orbit-app/src/components/EnginesSettings.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:151) |
| Test passed — {version} | `engines.testPassed` | [orbit-app/src/components/EnginesSettings.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:155) |
| Cancel | `common.cancel` | [orbit-app/src/components/EnginesSettings.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:164) |
| Edit path | `engines.editPath` | [orbit-app/src/components/EnginesSettings.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:173) |
| Save anyway | `engines.saveAnyway` | [orbit-app/src/components/EnginesSettings.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:180) |
| Save | `common.save` | [orbit-app/src/components/EnginesSettings.tsx:193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:193) |
| Managed by {organization} | `policy.managedBy` | [orbit-app/src/components/EnginesSettings.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:254) |
| This Company connection is managed by your organisation. To refresh or disconnect it, open Settings → Organisation. Your personal provider accounts are separate. | `organization.managedEngine` | [orbit-app/src/components/EnginesSettings.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:258) |
| Company access is unavailable. Check your organisation connection and the matching personal engine’s installation; do not sign in to a personal account here. | `organization.engineUnavailable` | [orbit-app/src/components/EnginesSettings.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:259) |
| Claude connected on this server | `engineSetup.claude.connectedAccount` | [orbit-app/src/components/EnginesSettings.tsx:274](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:274) |
| CLI path and updates | `engines.library.advanced` | [orbit-app/src/components/EnginesSettings.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:278) |
| Set CLI points an engine at a specific binary — a versioned build, a wrapper script, or an absolute path. Changes are saved only when the selected engine is idle. Other engines keep running. | `engines.footer` | [orbit-app/src/components/EnginesSettings.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:279) |
| Updating… | `engines.updating` | [orbit-app/src/components/EnginesSettings.tsx:303](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:303) |
| Update Claude | `engines.updateClaude` | [orbit-app/src/components/EnginesSettings.tsx:303](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:303) |
| Resetting… | `engines.resetting` | [orbit-app/src/components/EnginesSettings.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:312) |
| Reset | `engines.reset` | [orbit-app/src/components/EnginesSettings.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:312) |
| Set CLI… | `engines.setCli` | [orbit-app/src/components/EnginesSettings.tsx:325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:325) |
| Claude updated — {version} | `engines.claudeUpdated` | [orbit-app/src/components/EnginesSettings.tsx:329](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:329) |
| Engines and accounts | `settings.engines.title` | [orbit-app/src/components/EnginesSettings.tsx:356](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:356) |
| Connect the AI tools that power your bots. Accounts, setup, and updates—all in one place. | `engines.library.intro` | [orbit-app/src/components/EnginesSettings.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:357) |

## orbit-app/src/components/ExpandableText.tsx

Fonte: [orbit-app/src/components/ExpandableText.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ExpandableText.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Show less | `question.showLess` | [orbit-app/src/components/ExpandableText.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ExpandableText.tsx:34) |
| Show full question | `question.showFull` | [orbit-app/src/components/ExpandableText.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ExpandableText.tsx:34) |

## orbit-app/src/components/FullAccessWarning.tsx

Fonte: [orbit-app/src/components/FullAccessWarning.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Enable Full access? | `fullAccessWarning.ui.enableFullAccess` | [orbit-app/src/components/FullAccessWarning.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:73) |
| Includes archived threads. Other bots keep their settings. | `fullAccess.ui.includesArchivedThreadsOtherBotsKeep` | [orbit-app/src/components/FullAccessWarning.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:86) |
| Cancel | `fullAccessWarning.ui.cancel` | [orbit-app/src/components/FullAccessWarning.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:96) |
| Enable full access | `fullAccessWarning.ui.enableFullAccess2` | [orbit-app/src/components/FullAccessWarning.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:103) |

## orbit-app/src/components/GroupCallView.tsx

Fonte: [orbit-app/src/components/GroupCallView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Start group call | `orbit.call.group` | [orbit-app/src/components/GroupCallView.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:37) |
| Push to talk | `call.ui.pushToTalk` | [orbit-app/src/components/GroupCallView.tsx:459](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:459) |
| Listening | `call.ui.listening` | [orbit-app/src/components/GroupCallView.tsx:460](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:460) |
| Bringing the group in | `groupCall.ui.bringingTheGroupIn` | [orbit-app/src/components/GroupCallView.tsx:462](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:462) |
| {name} is speaking | `groupCall.ui.isSpeaking` | [orbit-app/src/components/GroupCallView.tsx:464](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:464) |
| Group member | `groupCall.ui.groupMember` | [orbit-app/src/components/GroupCallView.tsx:464](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:464) |
| {name} is working | `groupCall.ui.isWorking` | [orbit-app/src/components/GroupCallView.tsx:466](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:466) |
| Working | `call.ui.working` | [orbit-app/src/components/GroupCallView.tsx:467](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:467) |
| Release Control + Option to send… | `call.ui.releaseToSend` | [orbit-app/src/components/GroupCallView.tsx:470](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:470) |
| Say a name, say “everyone,” or just talk to the group… | `groupCall.ui.sayAName` | [orbit-app/src/components/GroupCallView.tsx:470](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:470) |
| You’ll hear each response in turn. | `groupCall.ui.eachInTurn` | [orbit-app/src/components/GroupCallView.tsx:471](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:471) |
| Interrupt | `call.ui.interrupt` | [orbit-app/src/components/GroupCallView.tsx:484](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:484) |
| Try microphone again | `call.ui.tryMicrophoneAgain` | [orbit-app/src/components/GroupCallView.tsx:495](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:495) |
| Hold Control + Option to talk · Say a member’s name to direct the turn · Space interrupts · Esc hangs up | `groupCall.ui.keys` | [orbit-app/src/components/GroupCallView.tsx:500](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:500) |

## orbit-app/src/components/GroupUsageChip.tsx

Fonte: [orbit-app/src/components/GroupUsageChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {tokens} output | `room.usage.output` | [orbit-app/src/components/GroupUsageChip.tsx:6](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:6) |
| {tokens} input (cache split unknown) | `room.usage.inputUnknown` | [orbit-app/src/components/GroupUsageChip.tsx:7](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:7) |
| {tokens} uncached input | `room.usage.uncached` | [orbit-app/src/components/GroupUsageChip.tsx:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:20) |
| {tokens} cached input | `room.usage.cached` | [orbit-app/src/components/GroupUsageChip.tsx:9](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:9) |
| This thread: {details} | `room.usage.total` | [orbit-app/src/components/GroupUsageChip.tsx:15](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:15) |
| Last turn · {name}: {details} | `room.usage.last` | [orbit-app/src/components/GroupUsageChip.tsx:16](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:16) |
| Reported costs: {cost} | `room.usage.cost` | [orbit-app/src/components/GroupUsageChip.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:17) |
| {tokens} input | `room.usage.input` | [orbit-app/src/components/GroupUsageChip.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:21) |

## orbit-app/src/components/GroupView.tsx

Fonte: [orbit-app/src/components/GroupView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1). 42 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Today | `chat.day.today` | [orbit-app/src/components/GroupView.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:79) |
| Yesterday | `chat.day.yesterday` | [orbit-app/src/components/GroupView.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:80) |
| Open {name} | `room.openBot` | [orbit-app/src/components/GroupView.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:110) |
| Unpin message | `chat.unpinMessage` | [orbit-app/src/components/GroupView.tsx:1301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1301) |
| Pin message | `chat.pinMessage` | [orbit-app/src/components/GroupView.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:160) |
| Unpin this message | `chat.unpinHint` | [orbit-app/src/components/GroupView.tsx:162](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:162) |
| Pin this message to the top of the group thread | `room.pinHint` | [orbit-app/src/components/GroupView.tsx:162](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:162) |
| Reply to message | `chat.replyToMessage` | [orbit-app/src/components/GroupView.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:352) |
| Reply | `chat.reply` | [orbit-app/src/components/GroupView.tsx:353](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:353) |
| Bot | `room.fallbackBot` | [orbit-app/src/components/GroupView.tsx:316](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:316) |
| Sent through the API, not typed here | `group.ui.sentThroughTheApiNotTyped` | [orbit-app/src/components/GroupView.tsx:330](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:330) |
| More | `orbit.menu.more` | [orbit-app/src/components/GroupView.tsx:409](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:409) |
| Members | `orbit.channel.members` | [orbit-app/src/components/GroupView.tsx:418](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:418) |
| Channel instructions | `orbit.channel.instructions` | [orbit-app/src/components/GroupView.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:419) |
| Working folder | `orbit.channel.folder` | [orbit-app/src/components/GroupView.tsx:420](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:420) |
| Rename {name} | `sidebar.room.renameAria` | [orbit-app/src/components/GroupView.tsx:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:424) |
| Save thread name | `sidebar.room.saveChatName` | [orbit-app/src/components/GroupView.tsx:431](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:431) |
| Save group chat name | `sidebar.room.saveChannelName` | [orbit-app/src/components/GroupView.tsx:431](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:431) |
| Rename thread | `sidebar.room.renameChat` | [orbit-app/src/components/GroupView.tsx:435](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:435) |
| Rename group chat | `sidebar.room.renameChannel` | [orbit-app/src/components/GroupView.tsx:435](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:435) |
| Move to team | `sidebar.section.moveToContext` | [orbit-app/src/components/GroupView.tsx:437](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:437) |
| Find in conversation | `chat.find` | [orbit-app/src/components/GroupView.tsx:439](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:439) |
| Download transcript | `orbit.menu.download` | [orbit-app/src/components/GroupView.tsx:441](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:441) |
| Copy transcript | `orbit.menu.copy` | [orbit-app/src/components/GroupView.tsx:442](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:442) |
| Copy conversation ID | `sidebar.copyConversationId` | [orbit-app/src/components/GroupView.tsx:444](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:444) |
| Delete thread | `sidebar.room.deleteChat` | [orbit-app/src/components/GroupView.tsx:447](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:447) |
| Delete group chat | `sidebar.room.deleteChannel` | [orbit-app/src/components/GroupView.tsx:447](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:447) |
| Delete {name}? | `orbit.channel.deleteTitle` | [orbit-app/src/components/GroupView.tsx:453](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:453) |
| Its transcript is deleted for everyone. The bots in it are not affected. | `orbit.channel.deleteBody` | [orbit-app/src/components/GroupView.tsx:454](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:454) |
| Delete | `common.delete` | [orbit-app/src/components/GroupView.tsx:455](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:455) |
| Plain messages go to every group member; @mentions override this | `room.responder.everyone` | [orbit-app/src/components/GroupView.tsx:471](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:471) |
| Only explicitly @mentioned bots respond | `room.responder.mentions` | [orbit-app/src/components/GroupView.tsx:473](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:473) |
| Plain messages go to {name}; @mentions override this | `room.responder.lead` | [orbit-app/src/components/GroupView.tsx:474](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:474) |
| the lead bot | `room.responder.leadFallback` | [orbit-app/src/components/GroupView.tsx:513](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:513) |
| Default responder | `room.responder.aria` | [orbit-app/src/components/GroupView.tsx:775](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:775) |
| Group lead | `room.responder.groupLead` | [orbit-app/src/components/GroupView.tsx:496](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:496) |
| Lead: {name} | `room.responder.leadOption` | [orbit-app/src/components/GroupView.tsx:503](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:503) |
| Lead · {name} | `orbit.channel.lead` | [orbit-app/src/components/GroupView.tsx:513](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:513) |
| Everyone | `orbit.channel.everyone` | [orbit-app/src/components/GroupView.tsx:884](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:884) |
| @mentions only | `orbit.channel.mentions` | [orbit-app/src/components/GroupView.tsx:914](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:914) |
| Working folder | `room.folder.title` | [orbit-app/src/components/GroupView.tsx:750](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:750) |
| Where every bot in this group runs its shell and file tools. | `room.folder.detail` | [orbit-app/src/components/GroupView.tsx:564](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:564) |
| Each bot’s own folder | `room.folder.own` | [orbit-app/src/components/GroupView.tsx:756](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:756) |
| Fixed for this thread after its first turn. Start a new thread to work somewhere else. | `room.folder.locked` | [orbit-app/src/components/GroupView.tsx:571](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:571) |
| Choose… | `room.folder.choose` | [orbit-app/src/components/GroupView.tsx:580](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:580) |
| Clear | `keys.clear` | [orbit-app/src/components/GroupView.tsx:584](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:584) |
| Each bot’s own folder — or an absolute path | `room.folder.placeholder` | [orbit-app/src/components/GroupView.tsx:599](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:599) |
| Save | `common.save` | [orbit-app/src/components/GroupView.tsx:604](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:604) |
| Set up {name} | `room.setup.title` | [orbit-app/src/components/GroupView.tsx:735](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:735) |
| Give this group a shared workspace, response style, and a little context before the first thread starts. | `room.setup.detail` | [orbit-app/src/components/GroupView.tsx:737](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:737) |
| Where group members run file and shell tools. | `room.setup.folderDetail` | [orbit-app/src/components/GroupView.tsx:751](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:751) |
| Choose who answers when nobody is mentioned. | `room.setup.responderDetail` | [orbit-app/src/components/GroupView.tsx:774](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:774) |
| Specific lead | `room.behavior.lead` | [orbit-app/src/components/GroupView.tsx:805](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:805) |
| Choose a teammate | `room.behavior.chooseTeammate` | [orbit-app/src/components/GroupView.tsx:814](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:814) |
| Choose a lead | `room.behavior.chooseLead` | [orbit-app/src/components/GroupView.tsx:824](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:824) |
| Plain messages go to this teammate. | `room.behavior.chooseLeadDetail` | [orbit-app/src/components/GroupView.tsx:825](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:825) |
| All group members | `room.setup.allMembers` | [orbit-app/src/components/GroupView.tsx:886](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:886) |
| Only @mentioned members | `room.setup.onlyMentioned` | [orbit-app/src/components/GroupView.tsx:916](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:916) |
| Group instructions | `room.setup.instructions` | [orbit-app/src/components/GroupView.tsx:922](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:922) |
| A shared brief every member sees on each turn. You can edit it later. | `room.setup.instructionsDetail` | [orbit-app/src/components/GroupView.tsx:923](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:923) |
| Goals, tone, ownership, constraints… | `room.setup.instructionsPlaceholder` | [orbit-app/src/components/GroupView.tsx:928](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:928) |
| Skip for now | `room.setup.skip` | [orbit-app/src/components/GroupView.tsx:941](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:941) |
| Save & continue | `room.setup.save` | [orbit-app/src/components/GroupView.tsx:949](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:949) |
| {name} — working… | `room.members.working` | [orbit-app/src/components/GroupView.tsx:1217](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1217) |
| a channel across {count} teams | `orbit.channel.acrossTeams` | [orbit-app/src/components/GroupView.tsx:1226](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1226) |
| Group instructions — every bot in this group follows them (who does what, tone, goals, a task checklist…) | `room.bulletin.placeholder` | [orbit-app/src/components/GroupView.tsx:1252](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1252) |
| Group instructions — shared instructions for every bot here | `room.bulletin.title` | [orbit-app/src/components/GroupView.tsx:1262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1262) |
| No group instructions | `room.bulletin.none` | [orbit-app/src/components/GroupView.tsx:1266](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1266) |
| Add group instructions… | `room.bulletin.add` | [orbit-app/src/components/GroupView.tsx:1266](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1266) |
| You | `chat.you` | [orbit-app/src/components/GroupView.tsx:1286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1286) |
| A bot | `room.aBot` | [orbit-app/src/components/GroupView.tsx:1286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1286) |
| Jump to the pinned message | `chat.pinnedJump` | [orbit-app/src/components/GroupView.tsx:1294](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1294) |
| Unpin | `chat.unpin` | [orbit-app/src/components/GroupView.tsx:1302](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1302) |
| Group chat {name} | `room.aria` | [orbit-app/src/components/GroupView.tsx:1352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1352) |
| Show earlier messages ({count} more) | `chat.showEarlier` | [orbit-app/src/components/GroupView.tsx:1373](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1373) |
| Loading earlier messages… | `chat.loadingEarlier` | [orbit-app/src/components/GroupView.tsx:1383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1383) |
| Load earlier messages | `chat.loadEarlier` | [orbit-app/src/components/GroupView.tsx:1383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1383) |
| Show later messages ({count} more) | `chat.showLater` | [orbit-app/src/components/GroupView.tsx:1402](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1402) |
| Jump to latest messages | `chat.jumpToLatestAria` | [orbit-app/src/components/GroupView.tsx:1433](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1433) |
| Jump to latest | `chat.jumpToLatest` | [orbit-app/src/components/GroupView.tsx:1437](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1437) |

## orbit-app/src/components/InspectorPanel.tsx

Fonte: [orbit-app/src/components/InspectorPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Inspector | `inspector.ui.inspector` | [orbit-app/src/components/InspectorPanel.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:192) |
| Close the Inspector | `inspector.ui.closeTheInspector` | [orbit-app/src/components/InspectorPanel.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:200) |
| Inspector views | `inspector.views` | [orbit-app/src/components/InspectorPanel.tsx:208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:208) |
| Run log | `inspector.run.title` | [orbit-app/src/components/InspectorPanel.tsx:234](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:234) |
| Reload from disk | `inspector.ui.reloadFromDisk` | [orbit-app/src/components/InspectorPanel.tsx:241](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:241) |

## orbit-app/src/components/KeyboardShortcutsModal.tsx

Fonte: [orbit-app/src/components/KeyboardShortcutsModal.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Keyboard shortcuts | `shortcuts.title` | [orbit-app/src/components/KeyboardShortcutsModal.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:77) |
| Close keyboard shortcuts | `shortcuts.close` | [orbit-app/src/components/KeyboardShortcutsModal.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:78) |
| Search shortcuts | `shortcuts.search` | [orbit-app/src/components/KeyboardShortcutsModal.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:85) |
| No shortcuts match “{query}” | `shortcuts.none` | [orbit-app/src/components/KeyboardShortcutsModal.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:90) |

## orbit-app/src/components/LendingActivity.tsx

Fonte: [orbit-app/src/components/LendingActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LendingActivity.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Activity on this computer | `lending.activity.title` | [orbit-app/src/components/LendingActivity.tsx:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LendingActivity.tsx:20) |
| Nothing yet. Every request from the workspace's bots will be listed here, including refused ones. | `lending.activity.empty` | [orbit-app/src/components/LendingActivity.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LendingActivity.tsx:19) |
| refused | `lending.activity.refused` | [orbit-app/src/components/LendingActivity.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LendingActivity.tsx:23) |

## orbit-app/src/components/LicenseExpiryBanner.tsx

Fonte: [orbit-app/src/components/LicenseExpiryBanner.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LicenseExpiryBanner.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This workspace's enterprise license expired on {date}. Enterprise features keep working until {graceEnd}; renew the key before then. | `settings.license.grace` | [orbit-app/src/components/LicenseExpiryBanner.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LicenseExpiryBanner.tsx:17) |
| This workspace's enterprise license expires on {date} ({days} day(s) left). Renew the key to keep enterprise features. | `settings.license.expiring` | [orbit-app/src/components/LicenseExpiryBanner.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LicenseExpiryBanner.tsx:19) |

## orbit-app/src/components/LinuxLocalControl.tsx

Fonte: [orbit-app/src/components/LinuxLocalControl.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Local control | `computer.linux.title` | [orbit-app/src/components/LinuxLocalControl.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:58) |
| Beta · Ubuntu 24.04 GNOME/{session} · Cua Driver 0.19.3 | `computer.linux.meta` | [orbit-app/src/components/LinuxLocalControl.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:61) |
| Ready | `computer.linux.ready` | [orbit-app/src/components/LinuxLocalControl.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:77) |
| Unavailable on Wayland | `computer.linux.waylandBadge` | [orbit-app/src/components/LinuxLocalControl.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:79) |
| Needs attention | `vm.state.attention` | [orbit-app/src/components/LinuxLocalControl.tsx:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:81) |
| Off | `vm.dest.off` | [orbit-app/src/components/LinuxLocalControl.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:82) |
| Local control is available on Ubuntu Xorg. It remains disabled on Wayland until its input-safety boundary is validated. Sign out and choose | `computer.linux.waylandBefore` | [orbit-app/src/components/LinuxLocalControl.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:91) |
| Ubuntu on Xorg | `computer.linux.waylandXorg` | [orbit-app/src/components/LinuxLocalControl.tsx:92](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:92) |
| to use This computer; Chat, Cloud, Local VM, and screen preview still work here. | `computer.linux.waylandAfter` | [orbit-app/src/components/LinuxLocalControl.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:93) |
| Enabling lets bots you explicitly assign to | `computer.linux.enableBefore` | [orbit-app/src/components/LinuxLocalControl.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:102) |
| This computer | `vm.dest.local` | [orbit-app/src/components/LinuxLocalControl.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:103) |
| inspect the active desktop and request mouse or keyboard actions. Every local action asks you first. | `computer.linux.enableAfter` | [orbit-app/src/components/LinuxLocalControl.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:104) |
| GNOME may also ask you to allow foreground input for this desktop session. | `computer.linux.waylandInput` | [orbit-app/src/components/LinuxLocalControl.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:105) |
| Ready for bots explicitly assigned to this computer. Bot actions use a private cursor, so your pointer stays under your control. | `computer.linux.readyMsg` | [orbit-app/src/components/LinuxLocalControl.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:121) |
| Checking the driver and desktop session… | `computer.linux.checking` | [orbit-app/src/components/LinuxLocalControl.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:122) |
| Bundled Cua Driver | `computer.linux.bundledDriver` | [orbit-app/src/components/LinuxLocalControl.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:127) |
| Enable local control (Beta) | `computer.linux.enable` | [orbit-app/src/components/LinuxLocalControl.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:145) |
| Try again | `computer.linux.tryAgain` | [orbit-app/src/components/LinuxLocalControl.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:157) |
| Disable local control | `computer.linux.disable` | [orbit-app/src/components/LinuxLocalControl.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:167) |
| Local control guide | `computer.linux.guide` | [orbit-app/src/components/LinuxLocalControl.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:178) |
| Driver setup and troubleshooting | `computer.linux.driverSetup` | [orbit-app/src/components/LinuxLocalControl.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:178) |

## orbit-app/src/components/LocalComputerAutoWarning.tsx

Fonte: [orbit-app/src/components/LocalComputerAutoWarning.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerAutoWarning.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Allow Auto mode on this computer? | `localComputerAutoWarning.ui.allowAutoModeOnThisComputer` | [orbit-app/src/components/LocalComputerAutoWarning.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerAutoWarning.tsx:49) |
| Cancel | `localComputerAutoWarning.ui.cancel` | [orbit-app/src/components/LocalComputerAutoWarning.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerAutoWarning.tsx:62) |
| OK | `localComputerAutoWarning.ui.ok` | [orbit-app/src/components/LocalComputerAutoWarning.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerAutoWarning.tsx:70) |

## orbit-app/src/components/LocalComputerSection.tsx

Fonte: [orbit-app/src/components/LocalComputerSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1). 13 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Delete {name}'s Local VM? Its durable workspace files will remain. | `vm.confirm.deleteBotVm` | [orbit-app/src/components/LocalComputerSection.tsx:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:308) |
| Permanently delete {subject}? Its files and browser sign-ins will be erased. This cannot be undone. | `vm.confirm.deleteCloud` | [orbit-app/src/components/LocalComputerSection.tsx:319](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:319) |
| this orphaned cloud computer | `vm.confirm.orphanCloud` | [orbit-app/src/components/LocalComputerSection.tsx:321](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:321) |
| {name}'s cloud computer | `vm.confirm.ownedCloud` | [orbit-app/src/components/LocalComputerSection.tsx:1123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1123) |
| Permanently remove {subject}? Its files and browser sign-ins will be erased. This cannot be undone. | `vm.confirm.removeVps` | [orbit-app/src/components/LocalComputerSection.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:335) |
| orphaned VPS computer ID {id} | `vm.confirm.orphanVps` | [orbit-app/src/components/LocalComputerSection.tsx:337](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:337) |
| {name}'s VPS computer | `vm.confirm.ownedVps` | [orbit-app/src/components/LocalComputerSection.tsx:1199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1199) |
| Self-hosted VPS computers | `vm.vps.title` | [orbit-app/src/components/LocalComputerSection.tsx:377](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:377) |
| Persistent Orbit-managed Docker desktops on your VPS. Removing one permanently erases its files and browser sign-ins. | `vm.vps.subtitle` | [orbit-app/src/components/LocalComputerSection.tsx:378](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:378) |
| SSH host: {alias}. Old and orphaned computers stay visible here. | `vm.vps.sshHost` | [orbit-app/src/components/LocalComputerSection.tsx:383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:383) |
| configured VPS | `vm.vps.configuredFallback` | [orbit-app/src/components/LocalComputerSection.tsx:383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:383) |
| Add a VPS SSH alias in Connections to use self-hosted computers. | `vm.vps.needsAlias` | [orbit-app/src/components/LocalComputerSection.tsx:385](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:385) |
| Refresh to check Orbit-managed computers on your VPS. | `vm.vps.refreshHint` | [orbit-app/src/components/LocalComputerSection.tsx:386](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:386) |
| Refresh VPS computers | `vm.vps.refreshAria` | [orbit-app/src/components/LocalComputerSection.tsx:392](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:392) |
| Refresh | `vm.refresh` | [orbit-app/src/components/LocalComputerSection.tsx:675](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:675) |
| Checking VPS computers. | `vm.vps.checking` | [orbit-app/src/components/LocalComputerSection.tsx:403](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:403) |
| VPS computer inventory unavailable: {reason} | `vm.vps.unavailable` | [orbit-app/src/components/LocalComputerSection.tsx:405](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:405) |
| VPS is not configured. | `vm.vps.notConfigured` | [orbit-app/src/components/LocalComputerSection.tsx:427](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:427) |
| 1 VPS computer found. | `vm.vps.foundOne` | [orbit-app/src/components/LocalComputerSection.tsx:409](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:409) |
| {count} VPS computers found. | `vm.vps.foundMany` | [orbit-app/src/components/LocalComputerSection.tsx:410](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:410) |
| Checking VPS computers… | `vm.vps.checkingList` | [orbit-app/src/components/LocalComputerSection.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:419) |
| No Orbit-managed VPS computers found. | `vm.vps.noneFound` | [orbit-app/src/components/LocalComputerSection.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:430) |
| Orphaned VPS computer · ID {id} | `vm.vps.orphan` | [orbit-app/src/components/LocalComputerSection.tsx:447](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:447) |
| Its bot no longer exists | `vm.owner.gone` | [orbit-app/src/components/LocalComputerSection.tsx:598](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:598) |
| Owned by this bot | `vm.owner.owned` | [orbit-app/src/components/LocalComputerSection.tsx:598](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:598) |
| Stop this bot's work before removing its VPS computer. | `vm.vps.stopFirst` | [orbit-app/src/components/LocalComputerSection.tsx:466](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:466) |
| Permanently remove this VPS computer | `vm.vps.removeTitle` | [orbit-app/src/components/LocalComputerSection.tsx:474](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:474) |
| Remove | `vm.vps.remove` | [orbit-app/src/components/LocalComputerSection.tsx:478](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:478) |
| Cloud computers | `vm.cloud.title` | [orbit-app/src/components/LocalComputerSection.tsx:511](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:511) |
| Persistent Orbit-managed Boat desktops. Sleeping pauses compute use; deleting permanently erases that desktop and its files. | `vm.cloud.subtitle` | [orbit-app/src/components/LocalComputerSection.tsx:512](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:512) |
| Includes computers left behind by deleted bots so they can still be cleaned up. | `vm.cloud.includesOrphans` | [orbit-app/src/components/LocalComputerSection.tsx:517](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:517) |
| Add a Boat API key in Connections to create and manage cloud computers. | `vm.cloud.needsKey` | [orbit-app/src/components/LocalComputerSection.tsx:519](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:519) |
| Refresh to check the Orbit-managed computers in your Boat account. | `vm.cloud.refreshHint` | [orbit-app/src/components/LocalComputerSection.tsx:520](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:520) |
| Refresh cloud computers | `vm.cloud.refreshAria` | [orbit-app/src/components/LocalComputerSection.tsx:526](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:526) |
| Checking cloud computers. | `vm.cloud.checking` | [orbit-app/src/components/LocalComputerSection.tsx:537](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:537) |
| Cloud computer inventory unavailable: {reason} | `vm.cloud.unavailable` | [orbit-app/src/components/LocalComputerSection.tsx:539](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:539) |
| Boat is not connected. | `vm.cloud.notConnected` | [orbit-app/src/components/LocalComputerSection.tsx:561](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:561) |
| 1 cloud computer found. | `vm.cloud.foundOne` | [orbit-app/src/components/LocalComputerSection.tsx:543](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:543) |
| {count} cloud computers found. | `vm.cloud.foundMany` | [orbit-app/src/components/LocalComputerSection.tsx:544](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:544) |
| Checking cloud computers… | `vm.cloud.checkingList` | [orbit-app/src/components/LocalComputerSection.tsx:553](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:553) |
| No Orbit-managed cloud computers found. | `vm.cloud.noneFound` | [orbit-app/src/components/LocalComputerSection.tsx:564](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:564) |
| Orphaned computer | `vm.cloud.orphan` | [orbit-app/src/components/LocalComputerSection.tsx:582](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:582) |
| Stop this bot's work before changing its computer. | `vm.cloud.stopFirst` | [orbit-app/src/components/LocalComputerSection.tsx:601](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:601) |
| Put this cloud computer to sleep | `vm.cloud.sleepTitle` | [orbit-app/src/components/LocalComputerSection.tsx:610](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:610) |
| This cloud computer is {state} | `vm.cloud.sleepBlocked` | [orbit-app/src/components/LocalComputerSection.tsx:610](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:610) |
| Sleep | `vm.cloud.sleep` | [orbit-app/src/components/LocalComputerSection.tsx:614](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:614) |
| Permanently delete this cloud computer | `vm.cloud.deleteTitle` | [orbit-app/src/components/LocalComputerSection.tsx:621](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:621) |
| Delete | `common.delete` | [orbit-app/src/components/LocalComputerSection.tsx:763](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:763) |
| Per-bot desktops | `vm.perBot.title` | [orbit-app/src/components/LocalComputerSection.tsx:657](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:657) |
| {count} This list includes old desktops even when their bot now uses another destination. | `vm.perBot.subtitle` | [orbit-app/src/components/LocalComputerSection.tsx:658](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:658) |
| Inventory unavailable. | `vm.perBot.inventoryUnavailable` | [orbit-app/src/components/LocalComputerSection.tsx:660](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:660) |
| {count}/{max} created. | `vm.perBot.created` | [orbit-app/src/components/LocalComputerSection.tsx:661](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:661) |
| Delete Orbit-managed desktops you no longer need to free a slot. Durable workspace files remain. | `vm.perBot.deleteHint` | [orbit-app/src/components/LocalComputerSection.tsx:666](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:666) |
| Refresh per-bot desktops | `vm.perBot.refreshAria` | [orbit-app/src/components/LocalComputerSection.tsx:672](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:672) |
| Checking existing Local VM desktops. | `vm.perBot.checking` | [orbit-app/src/components/LocalComputerSection.tsx:683](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:683) |
| Local VM inventory unavailable: {reason} | `vm.perBot.unavailable` | [orbit-app/src/components/LocalComputerSection.tsx:685](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:685) |
| 1 per-bot desktop found. | `vm.perBot.foundOne` | [orbit-app/src/components/LocalComputerSection.tsx:687](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:687) |
| {count} per-bot desktops found. | `vm.perBot.foundMany` | [orbit-app/src/components/LocalComputerSection.tsx:688](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:688) |
| Checking existing desktops… | `vm.perBot.checkingList` | [orbit-app/src/components/LocalComputerSection.tsx:697](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:697) |
| No per-bot desktops have been created. | `vm.perBot.none` | [orbit-app/src/components/LocalComputerSection.tsx:704](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:704) |
| Current destination: {destination} | `vm.perBot.destination` | [orbit-app/src/components/LocalComputerSection.tsx:736](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:736) |
| This container is not managed by Orbit. Review and remove it directly in Docker or Podman. | `vm.perBot.unmanaged` | [orbit-app/src/components/LocalComputerSection.tsx:740](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:740) |
| Stop this bot's turn before deleting its desktop. | `vm.perBot.stopFirst` | [orbit-app/src/components/LocalComputerSection.tsx:747](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:747) |
| Stop this bot's turn before deleting its Local VM | `vm.perBot.deleteBlocked` | [orbit-app/src/components/LocalComputerSection.tsx:757](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:757) |
| Delete {name}'s Local VM | `vm.perBot.deleteTitle` | [orbit-app/src/components/LocalComputerSection.tsx:758](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:758) |
| Status request failed ({code}) | `vm.err.status` | [orbit-app/src/components/LocalComputerSection.tsx:859](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:859) |
| Inventory request failed ({code}) | `vm.err.inventory` | [orbit-app/src/components/LocalComputerSection.tsx:867](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:867) |
| Container runtime unavailable | `vm.err.runtimeUnavailable` | [orbit-app/src/components/LocalComputerSection.tsx:871](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:871) |
| Cloud inventory request failed ({code}) | `vm.err.cloudInventory` | [orbit-app/src/components/LocalComputerSection.tsx:878](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:878) |
| Cloud computer inventory is unavailable | `vm.err.cloudUnavailable` | [orbit-app/src/components/LocalComputerSection.tsx:892](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:892) |
| VPS inventory request failed ({code}) | `vm.err.vpsInventory` | [orbit-app/src/components/LocalComputerSection.tsx:900](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:900) |
| VPS computer inventory is unavailable | `vm.err.vpsUnavailable` | [orbit-app/src/components/LocalComputerSection.tsx:908](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:908) |
| Delete the Local VM? Files and browser sign-ins in its durable workspace will remain. | `vm.confirm.deleteShared` | [orbit-app/src/components/LocalComputerSection.tsx:1023](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1023) |
| Replace the existing Local VM with the pinned image and safety limits? Files and browser sign-ins in its durable workspace will remain. | `vm.confirm.recreate` | [orbit-app/src/components/LocalComputerSection.tsx:1024](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1024) |
| Local VM deleted. | `vm.announce.deleted` | [orbit-app/src/components/LocalComputerSection.tsx:1036](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1036) |
| Local VM stopped. | `vm.announce.stopped` | [orbit-app/src/components/LocalComputerSection.tsx:1038](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1038) |
| Local VM updated. | `vm.announce.updated` | [orbit-app/src/components/LocalComputerSection.tsx:1039](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1039) |
| Could not save the Local VM isolation policy | `vm.policyError` | [orbit-app/src/components/LocalComputerSection.tsx:1058](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1058) |
| This container is not managed by Orbit and cannot be removed here. | `vm.unmanagedError` | [orbit-app/src/components/LocalComputerSection.tsx:1070](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1070) |
| Could not delete this Local VM | `vm.deleteError` | [orbit-app/src/components/LocalComputerSection.tsx:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1083) |
| Deleted {name}'s Local VM. | `vm.announce.deletedBot` | [orbit-app/src/components/LocalComputerSection.tsx:1085](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1085) |
| Orphaned cloud computer | `vm.announce.orphanCloud` | [orbit-app/src/components/LocalComputerSection.tsx:1122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1122) |
| Removing | `vm.state.removing` | [orbit-app/src/components/LocalComputerSection.tsx:1163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1163) |
| {subject} deleted. | `vm.announce.cloudDeleted` | [orbit-app/src/components/LocalComputerSection.tsx:1159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1159) |
| Could not remove this VPS computer | `vm.vpsRemoveError` | [orbit-app/src/components/LocalComputerSection.tsx:1193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1193) |
| {subject} removed. | `vm.announce.vpsRemoved` | [orbit-app/src/components/LocalComputerSection.tsx:1196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1196) |
| Orphaned VPS computer {id} | `vm.announce.orphanVps` | [orbit-app/src/components/LocalComputerSection.tsx:1198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1198) |
| Mac | `vm.host.mac` | [orbit-app/src/components/LocalComputerSection.tsx:1222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1222) |
| computer | `vm.host.computer` | [orbit-app/src/components/LocalComputerSection.tsx:1222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1222) |
| Local VM | `vm.main.title` | [orbit-app/src/components/LocalComputerSection.tsx:1257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1257) |
| Private Cua Linux desktops on this {host}, with one container and durable workspace per bot. Distinct bots can work concurrently and idle desktops stop after 8 hours. | `vm.main.perBotSubtitle` | [orbit-app/src/components/LocalComputerSection.tsx:1259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1259) |
| A shared Cua Linux sandbox on this {host} for bots to browse and work in — isolated, backed by one durable workspace, and automatically recycled after 8 hours without activity. | `vm.main.sharedSubtitle` | [orbit-app/src/components/LocalComputerSection.tsx:1260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1260) |
| Checking… | `common.checking` | [orbit-app/src/components/LocalComputerSection.tsx:1272](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1272) |
| Status unavailable | `vm.main.statusUnavailable` | [orbit-app/src/components/LocalComputerSection.tsx:1274](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1274) |
| Ready for per-bot desktops | `vm.main.readyPerBot` | [orbit-app/src/components/LocalComputerSection.tsx:1276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1276) |
| Per-bot mode requires Docker or Podman | `vm.main.perBotUnsupported` | [orbit-app/src/components/LocalComputerSection.tsx:1278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1278) |
| Ready | `vm.main.ready` | [orbit-app/src/components/LocalComputerSection.tsx:1280](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1280) |
| Not ready | `vm.main.notReady` | [orbit-app/src/components/LocalComputerSection.tsx:1281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1281) |
| Re-check | `vm.main.recheck` | [orbit-app/src/components/LocalComputerSection.tsx:1292](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1292) |
| Watch screen | `vm.main.watch` | [orbit-app/src/components/LocalComputerSection.tsx:1301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1301) |
| Isolation | `vm.isolation.title` | [orbit-app/src/components/LocalComputerSection.tsx:1309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1309) |
| Shared keeps the original single-desktop behavior. Per bot gives each bot its own container, workspace, viewer port, lease, and idle timer. | `vm.isolation.subtitle` | [orbit-app/src/components/LocalComputerSection.tsx:1310](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1310) |
| Shared | `vm.isolation.shared` | [orbit-app/src/components/LocalComputerSection.tsx:1325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1325) |
| Per bot | `vm.isolation.perBot` | [orbit-app/src/components/LocalComputerSection.tsx:1325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1325) |
| Maximum per-bot desktops | `vm.isolation.max` | [orbit-app/src/components/LocalComputerSection.tsx:1333](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1333) |
| Limits storage and host resource use; each running desktop may use up to 4 GB and 2 CPUs. | `vm.isolation.maxDetail` | [orbit-app/src/components/LocalComputerSection.tsx:1334](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1334) |
| Maximum per-bot desktops | `vm.isolation.maxAria` | [orbit-app/src/components/LocalComputerSection.tsx:1337](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1337) |
| Saving… | `vm.saving` | [orbit-app/src/components/LocalComputerSection.tsx:1347](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1347) |
| Setup | `vm.setup.title` | [orbit-app/src/components/LocalComputerSection.tsx:1350](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1350) |
| Once a container runtime is open, Orbit prepares Cua and the VM for you. | `vm.setup.subtitle` | [orbit-app/src/components/LocalComputerSection.tsx:1350](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1350) |
| Install a container runtime | `vm.setup.step1` | [orbit-app/src/components/LocalComputerSection.tsx:1352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1352) |
| Podman and Colima are free. Docker Desktop may require a paid licence for larger companies and government use. | `vm.setup.step1Detail` | [orbit-app/src/components/LocalComputerSection.tsx:1354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1354) |
| Open the Podman installation guide | `vm.setup.podmanGuide` | [orbit-app/src/components/LocalComputerSection.tsx:1360](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1360) |
| Open and start {runtime} | `vm.setup.step2Open` | [orbit-app/src/components/LocalComputerSection.tsx:1369](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1369) |
| Start the container runtime | `vm.setup.step2` | [orbit-app/src/components/LocalComputerSection.tsx:1370](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1370) |
| Open the installed runtime and start its engine, then re-check. | `vm.setup.step2Detail` | [orbit-app/src/components/LocalComputerSection.tsx:1377](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1377) |
| Prepare the Cua desktop (one-time download and build) | `vm.setup.step3` | [orbit-app/src/components/LocalComputerSection.tsx:1381](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1381) |
| Prepare Cua desktop | `vm.setup.prepare` | [orbit-app/src/components/LocalComputerSection.tsx:1383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1383) |
| Show base-image download | `vm.setup.showPull` | [orbit-app/src/components/LocalComputerSection.tsx:1385](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1385) |
| Create a private desktop from each bot's Computer panel | `vm.setup.step4PerBot` | [orbit-app/src/components/LocalComputerSection.tsx:1392](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1392) |
| Replace the older or unsafe VM | `vm.setup.step4Recreate` | [orbit-app/src/components/LocalComputerSection.tsx:1394](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1394) |
| Create and start the Local VM | `vm.setup.step4` | [orbit-app/src/components/LocalComputerSection.tsx:1395](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1395) |
| Apple container requires an explicit host port, so Orbit will not guess or expose one. Install or start Docker or Podman for safe per-bot dynamic loopback ports. | `vm.setup.applePort` | [orbit-app/src/components/LocalComputerSection.tsx:1402](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1402) |
| Choose Local VM for a bot, open Bot's computer, then create its desktop there. Orbit assigns a private workspace and an available loopback viewer port automatically. | `vm.setup.perBotHint` | [orbit-app/src/components/LocalComputerSection.tsx:1403](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1403) |
| Delete and recreate | `vm.setup.recreate` | [orbit-app/src/components/LocalComputerSection.tsx:1413](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1413) |
| Prepare the pinned Cua desktop above before replacing this VM. | `vm.setup.prepareFirst` | [orbit-app/src/components/LocalComputerSection.tsx:1416](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1416) |
| Start Local VM | `vm.setup.start` | [orbit-app/src/components/LocalComputerSection.tsx:1425](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1425) |
| Waiting for the desktop… | `vm.setup.waiting` | [orbit-app/src/components/LocalComputerSection.tsx:1422](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1422) |
| Choose Local VM for a bot to start it automatically. Idle desktops are recycled after 8 hours; files in the durable folder are kept. | `vm.setup.idleHint` | [orbit-app/src/components/LocalComputerSection.tsx:1426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1426) |
| Show command | `vm.setup.showCommand` | [orbit-app/src/components/LocalComputerSection.tsx:1429](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1429) |
| Orbit could not inspect the container runtime. Re-check, or review the app logs. | `vm.inspectFailed` | [orbit-app/src/components/LocalComputerSection.tsx:1451](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1451) |
| Safety and storage | `vm.safety.title` | [orbit-app/src/components/LocalComputerSection.tsx:1457](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1457) |
| Cua Driver operates only each VM's desktop. Every bot gets a private host folder mounted at {path}; its files and browser profile survive VM replacement. Viewers bind only to loopback, and exact bot-derived targets prevent one bot from attaching to another bot's container. Each VM keeps the existing 4 GB, 2 CPU, 512-process and dropped-capability limits. VMs can still reach the internet. | `vm.safety.perBot` | [orbit-app/src/components/LocalComputerSection.tsx:1460](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1460) |
| Cua Driver operates only the VM's desktop. Exactly one private host folder is mounted at {path}; files and browser sign-ins there survive VM replacement, while everything elsewhere in the VM remains disposable. The password-protected viewer is available only on this machine. Docker and Podman runs are limited to 4 GB memory, 2 CPUs and 512 processes; all Linux capabilities are dropped except the two the desktop supervisor needs to switch to its unprivileged user. The VM can still reach the internet, and bots share it one at a time. | `vm.safety.shared` | [orbit-app/src/components/LocalComputerSection.tsx:1461](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1461) |
| Stop | `vm.safety.stop` | [orbit-app/src/components/LocalComputerSection.tsx:1468](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1468) |
| Delete legacy shared VM | `vm.safety.deleteLegacy` | [orbit-app/src/components/LocalComputerSection.tsx:1472](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1472) |
| Delete VM | `vm.safety.deleteVm` | [orbit-app/src/components/LocalComputerSection.tsx:1472](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1472) |
| Durable workspace: {path} · Cua Driver: {driver} · Local image: {image} | `vm.safety.workspace` | [orbit-app/src/components/LocalComputerSection.tsx:1477](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1477) |
| not created | `vm.safety.notCreated` | [orbit-app/src/components/LocalComputerSection.tsx:1478](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1478) |
| not prepared | `vm.safety.notPrepared` | [orbit-app/src/components/LocalComputerSection.tsx:1480](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1480) |
| Base: {image} | `vm.safety.baseImage` | [orbit-app/src/components/LocalComputerSection.tsx:1482](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1482) |

## orbit-app/src/components/LocalScreenPreview.tsx

Fonte: [orbit-app/src/components/LocalScreenPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Selected screen | `computer.screen.selected` | [orbit-app/src/components/LocalScreenPreview.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:119) |
| Preview this computer | `computer.screen.title` | [orbit-app/src/components/LocalScreenPreview.tsx:128](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:128) |
| Preview only — starting a preview does not grant local control. | `computer.screen.subtitle` | [orbit-app/src/components/LocalScreenPreview.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:131) |
| Preview only | `computer.screen.badge` | [orbit-app/src/components/LocalScreenPreview.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:135) |
| Live preview of the selected screen | `computer.screen.videoAria` | [orbit-app/src/components/LocalScreenPreview.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:145) |
| Checking screen preview… | `computer.screen.checking` | [orbit-app/src/components/LocalScreenPreview.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:157) |
| This computer | `vm.dest.local` | [orbit-app/src/components/LocalScreenPreview.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:167) |
| Sharing | `computer.screen.sharing` | [orbit-app/src/components/LocalScreenPreview.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:170) |
| Choose a screen… | `computer.screen.choosing` | [orbit-app/src/components/LocalScreenPreview.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:195) |
| Stop preview | `computer.screen.stop` | [orbit-app/src/components/LocalScreenPreview.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:197) |
| Try again | `computer.linux.tryAgain` | [orbit-app/src/components/LocalScreenPreview.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:199) |
| Choose a screen | `computer.screen.choose` | [orbit-app/src/components/LocalScreenPreview.tsx:201](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:201) |
| Start preview | `computer.screen.start` | [orbit-app/src/components/LocalScreenPreview.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:202) |

## orbit-app/src/components/LocalVmWorkspace.tsx

Fonte: [orbit-app/src/components/LocalVmWorkspace.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The two-desktop workspace requires the Orbit desktop app. | `vm.ui.theTwoDesktopWorkspaceRequiresThe` | [orbit-app/src/components/LocalVmWorkspace.tsx:321](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:321) |
| Orbit could not position this Local VM viewer. | `vm.ui.orbitCouldNotPositionThisLocal` | [orbit-app/src/components/LocalVmWorkspace.tsx:405](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:405) |
| Choose a Local VM bot | `vm.ui.chooseALocalVmBot` | [orbit-app/src/components/LocalVmWorkspace.tsx:444](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:444) |
| Hand back | `localVmWorkspace.ui.handBack` | [orbit-app/src/components/LocalVmWorkspace.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:475) |
| Pause only this bot and enable keyboard and pointer input in this pane | `vm.ui.pauseOnlyThisBotAndEnable` | [orbit-app/src/components/LocalVmWorkspace.tsx:483](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:483) |
| Choose another bot configured for a Local VM. | `vm.ui.chooseAnotherBotConfiguredForA` | [orbit-app/src/components/LocalVmWorkspace.tsx:500](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:500) |
| Open Computer | `localVmWorkspace.ui.openComputer` | [orbit-app/src/components/LocalVmWorkspace.tsx:534](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:534) |
| Local VM workspace | `vm.workspace.title` | [orbit-app/src/components/LocalVmWorkspace.tsx:785](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:785) |
| Two live desktops · one active controller · watch-only by default | `vm.workspace.sub` | [orbit-app/src/components/LocalVmWorkspace.tsx:787](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:787) |
| Close Local VM workspace | `vm.ui.closeLocalVmWorkspace` | [orbit-app/src/components/LocalVmWorkspace.tsx:795](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:795) |

## orbit-app/src/components/MacCuaRecoveryActions.tsx

Fonte: [orbit-app/src/components/MacCuaRecoveryActions.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacCuaRecoveryActions.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Relaunch Orbit | `computer.mac.permission.relaunch` | [orbit-app/src/components/MacCuaRecoveryActions.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacCuaRecoveryActions.tsx:50) |

## orbit-app/src/components/MacLocalControl.tsx

Fonte: [orbit-app/src/components/MacLocalControl.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Allow control of this computer | `macControl.ui.allowControlOfThisComputer` | [orbit-app/src/components/MacLocalControl.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:66) |
| Local computer control is not ready. Orbit needs Accessibility and Screen Recording to use this Mac. Check Driver detail or System Settings, then click Retry. | `computer.mac.permission.generic` | [orbit-app/src/components/MacLocalControl.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:68) |
| Driver detail | `computer.mac.permission.driverDetail` | [orbit-app/src/components/MacLocalControl.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:70) |
| Open System Settings | `macLocalControl.ui.openSystemSettings` | [orbit-app/src/components/MacLocalControl.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:86) |
| Retry | `macLocalControl.ui.retry` | [orbit-app/src/components/MacLocalControl.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:96) |

## orbit-app/src/components/ManageMembersPanel.tsx

Fonte: [orbit-app/src/components/ManageMembersPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Manage Members | `members.ui.manageMembers` | [orbit-app/src/components/ManageMembersPanel.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:107) |
| A group needs at least one bot. | `members.ui.aGroupNeedsAtLeastOne` | [orbit-app/src/components/ManageMembersPanel.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:110) |
| Cancel | `manageMembersPanel.ui.cancel` | [orbit-app/src/components/ManageMembersPanel.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:121) |

## orbit-app/src/components/McpExplore.tsx

Fonte: [orbit-app/src/components/McpExplore.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:1). 10 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Search MCP servers | `mcp.explore.search` | [orbit-app/src/components/McpExplore.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:179) |
| Categories | `mcp.explore.categories` | [orbit-app/src/components/McpExplore.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:184) |
| The MCP registry could not be reached: {error} | `mcp.explore.error` | [orbit-app/src/components/McpExplore.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:194) |
| Showing the last list saved; the registry is not answering right now. | `mcp.explore.stale` | [orbit-app/src/components/McpExplore.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:195) |
| Loading the registry… | `mcp.explore.loading` | [orbit-app/src/components/McpExplore.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:198) |
| from GitHub's MCP registry | `mcp.explore.popularHint` | [orbit-app/src/components/McpExplore.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:202) |
| Community | `mcp.explore.community` | [orbit-app/src/components/McpExplore.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:207) |
| from the official MCP registry, not reviewed | `mcp.explore.communityHint` | [orbit-app/src/components/McpExplore.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:207) |
| No MCP servers match “{query}”. | `mcp.explore.none` | [orbit-app/src/components/McpExplore.tsx:212](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:212) |
| Browse the whole registry | `mcp.explore.browseAll` | [orbit-app/src/components/McpExplore.tsx:217](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:217) |
| Load more | `mcp.explore.more` | [orbit-app/src/components/McpExplore.tsx:222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:222) |
| Open {name} | `mcp.explore.open` | [orbit-app/src/components/McpExplore.tsx:246](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:246) |
| Added | `mcp.explore.added` | [orbit-app/src/components/McpExplore.tsx:252](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:252) |
| Explore | `mcp.explore.back` | [orbit-app/src/components/McpExplore.tsx:297](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:297) |
| by {publisher} | `mcp.explore.by` | [orbit-app/src/components/McpExplore.tsx:304](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:304) |
| Website | `mcp.explore.website` | [orbit-app/src/components/McpExplore.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:306) |
| Source | `mcp.explore.source` | [orbit-app/src/components/McpExplore.tsx:307](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:307) |
| How to run it | `mcp.explore.how` | [orbit-app/src/components/McpExplore.tsx:314](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:314) |
| optional | `mcp.explore.optional` | [orbit-app/src/components/McpExplore.tsx:339](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:339) |
| Anyone can publish to the official registry. Only add servers from publishers you trust; they run with the access you give them. | `mcp.explore.communityWarning` | [orbit-app/src/components/McpExplore.tsx:351](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:351) |
| Needs {fields} | `mcp.explore.needs` | [orbit-app/src/components/McpExplore.tsx:360](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:360) |
| Already added once; this one is added as {name}. | `mcp.explore.addsAs` | [orbit-app/src/components/McpExplore.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:361) |

## orbit-app/src/components/McpServersPanel.tsx

Fonte: [orbit-app/src/components/McpServersPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:1). 26 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| · no tools advertised | `mcp.probe.noTools` | [orbit-app/src/components/McpServersPanel.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:136) |
| · 1 tool: {names} | `mcp.probe.toolsOne` | [orbit-app/src/components/McpServersPanel.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:139) |
| · {count} tools: {names} | `mcp.probe.toolsMany` | [orbit-app/src/components/McpServersPanel.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:140) |
| Remove the “{name}” MCP server? | `mcp.removeConfirm` | [orbit-app/src/components/McpServersPanel.tsx:391](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:391) |
| Your MCP servers | `mcp.title` | [orbit-app/src/components/McpServersPanel.tsx:417](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:417) |
| Add an MCP server once — a command that runs on this computer, or a server at a URL — and every compatible bot can use its tools. Tool calls still follow your normal approval settings. | `mcp.subtitle` | [orbit-app/src/components/McpServersPanel.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:419) |
| Refresh MCP servers | `mcp.refreshAria` | [orbit-app/src/components/McpServersPanel.tsx:428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:428) |
| Managed by {organization} | `policy.managedBy` | [orbit-app/src/components/McpServersPanel.tsx:678](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:678) |
| Paste config | `mcp.import` | [orbit-app/src/components/McpServersPanel.tsx:471](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:471) |
| Add server | `mcp.addServer` | [orbit-app/src/components/McpServersPanel.tsx:457](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:457) |
| Managed by {organization}: only MCP servers your organisation has approved reach bots. | `policy.mcpRestricted` | [orbit-app/src/components/McpServersPanel.tsx:462](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:462) |
| Paste the {"mcpServers": {…}} block from Claude Code, Cursor, or Claude Desktop. Servers are added switched off; test each one, then turn it on. | `mcp.importHint` | [orbit-app/src/components/McpServersPanel.tsx:468](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:468) |
| Cancel | `common.cancel` | [orbit-app/src/components/McpServersPanel.tsx:489](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:489) |
| Add servers | `mcp.importAction` | [orbit-app/src/components/McpServersPanel.tsx:497](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:497) |
| Commands run on this computer with the environment variables you provide; URL servers receive the headers you provide. Only add software and addresses you trust. New servers stay off until you enable them. | `mcp.trustNotice` | [orbit-app/src/components/McpServersPanel.tsx:504](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:504) |
| Add MCP server | `mcp.editorNew` | [orbit-app/src/components/McpServersPanel.tsx:515](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:515) |
| Edit {name} | `mcp.editorEdit` | [orbit-app/src/components/McpServersPanel.tsx:515](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:515) |
| Connection | `mcp.field.type` | [orbit-app/src/components/McpServersPanel.tsx:561](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:561) |
| Server name | `mcp.field.name` | [orbit-app/src/components/McpServersPanel.tsx:537](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:537) |
| Server URL | `mcp.field.url` | [orbit-app/src/components/McpServersPanel.tsx:551](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:551) |
| Streamable HTTP (most servers) | `mcp.type.http` | [orbit-app/src/components/McpServersPanel.tsx:567](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:567) |
| SSE (older servers) | `mcp.type.sse` | [orbit-app/src/components/McpServersPanel.tsx:568](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:568) |
| Headers · Name: value per line | `mcp.field.headers` | [orbit-app/src/components/McpServersPanel.tsx:572](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:572) |
| Put tokens here, for example Authorization: Bearer …. Leave an existing value blank to keep it saved. Remove the line to delete it. | `mcp.headersHint` | [orbit-app/src/components/McpServersPanel.tsx:580](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:580) |
| Sign in with OAuth | `mcp.oauth.field` | [orbit-app/src/components/McpServersPanel.tsx:584](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:584) |
| in your browser, instead of a saved token | `mcp.oauth.fieldHint` | [orbit-app/src/components/McpServersPanel.tsx:585](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:585) |
| Client ID | `mcp.oauth.clientId` | [orbit-app/src/components/McpServersPanel.tsx:590](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:590) |
| Only if the service needs its own app | `mcp.oauth.optional` | [orbit-app/src/components/McpServersPanel.tsx:598](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:598) |
| Client secret | `mcp.oauth.clientSecret` | [orbit-app/src/components/McpServersPanel.tsx:596](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:596) |
| Saved — leave blank to keep | `mcp.oauth.secretSaved` | [orbit-app/src/components/McpServersPanel.tsx:598](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:598) |
| Most servers register Orbit by themselves. Services like Slack and Asana need an app you create there first: set its redirect URL to {redirect}, then paste its client ID (and secret) here. | `mcp.oauth.clientHint` | [orbit-app/src/components/McpServersPanel.tsx:601](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:601) |
| Executable command | `mcp.field.command` | [orbit-app/src/components/McpServersPanel.tsx:608](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:608) |
| Arguments · one per line | `mcp.field.args` | [orbit-app/src/components/McpServersPanel.tsx:618](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:618) |
| Environment · KEY=value per line | `mcp.field.env` | [orbit-app/src/components/McpServersPanel.tsx:628](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:628) |
| Leave an existing value blank to keep it saved. Remove the line to delete it. | `mcp.envHint` | [orbit-app/src/components/McpServersPanel.tsx:636](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:636) |
| Cancel | `mcp.cancel` | [orbit-app/src/components/McpServersPanel.tsx:642](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:642) |
| Save | `mcp.save` | [orbit-app/src/components/McpServersPanel.tsx:649](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:649) |
| Loading MCP servers… | `mcp.loading` | [orbit-app/src/components/McpServersPanel.tsx:657](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:657) |
| No custom MCP servers yet | `mcp.empty.title` | [orbit-app/src/components/McpServersPanel.tsx:661](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:661) |
| Find one in Explore, or add a trusted server by hand: a local command or a URL. | `mcp.empty.desc` | [orbit-app/src/components/McpServersPanel.tsx:662](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:662) |
| Not approved by {organization}; bots do not get this server. | `policy.mcpBlocked` | [orbit-app/src/components/McpServersPanel.tsx:683](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:683) |
| Headers saved: {keys} | `mcp.headersSaved` | [orbit-app/src/components/McpServersPanel.tsx:686](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:686) |
| Secrets saved: {keys} | `mcp.secretsSaved` | [orbit-app/src/components/McpServersPanel.tsx:687](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:687) |
| Sign out | `mcp.oauth.signOut` | [orbit-app/src/components/McpServersPanel.tsx:692](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:692) |
| Sign in | `mcp.oauth.signIn` | [orbit-app/src/components/McpServersPanel.tsx:696](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:696) |
| Test | `mcp.test` | [orbit-app/src/components/McpServersPanel.tsx:700](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:700) |
| Turn {name} {state} | `mcp.toggleAria` | [orbit-app/src/components/McpServersPanel.tsx:702](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:702) |
| Edit {name} | `mcp.editAria` | [orbit-app/src/components/McpServersPanel.tsx:708](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:708) |
| Remove {name} | `mcp.removeAria` | [orbit-app/src/components/McpServersPanel.tsx:709](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:709) |
| Connected | `mcp.probe.connected` | [orbit-app/src/components/McpServersPanel.tsx:715](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:715) |
| Also use my Claude Code MCP servers | `mcp.claude.title` | [orbit-app/src/components/McpServersPanel.tsx:760](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:760) |
| Off: Claude bots only get the servers on this page, plus a bot project's .mcp.json. On: they also get every MCP server and connector from your own Claude Code setup, on every message. Codex bots never get your own Codex servers; they use the ones on this page. More tools means more tokens per message, so keep this off unless you need them. | `mcp.claude.desc` | [orbit-app/src/components/McpServersPanel.tsx:761](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:761) |
| Could not save this setting. Try again. | `mcp.claude.error` | [orbit-app/src/components/McpServersPanel.tsx:762](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:762) |
| Use my Claude Code MCP servers | `mcp.claude.aria` | [orbit-app/src/components/McpServersPanel.tsx:766](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:766) |

## orbit-app/src/components/MentionTextarea.tsx

Fonte: [orbit-app/src/components/MentionTextarea.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MentionTextarea.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/MessageActions.tsx

Fonte: [orbit-app/src/components/MessageActions.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MessageActions.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Message actions | `chat.messageActions` | [orbit-app/src/components/MessageActions.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MessageActions.tsx:45) |

## orbit-app/src/components/MicrophoneRow.tsx

Fonte: [orbit-app/src/components/MicrophoneRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| That microphone couldn't be saved. | `settings.microphone.saveFailed` | [orbit-app/src/components/MicrophoneRow.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:74) |
| It isn't connected, so Orbit uses the macOS microphone until it is. | `settings.microphone.missingHint` | [orbit-app/src/components/MicrophoneRow.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:80) |
| Orbit can't use the microphone yet, so there's no level to show. | `settings.microphone.noAccess` | [orbit-app/src/components/MicrophoneRow.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:82) |
| Microphone | `settings.microphone.title` | [orbit-app/src/components/MicrophoneRow.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:86) |
| What Orbit listens to when you dictate, call a bot or talk to Orbit. | `settings.microphone.subtitle` | [orbit-app/src/components/MicrophoneRow.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:86) |
| Microphone for voice input | `settings.microphone.aria` | [orbit-app/src/components/MicrophoneRow.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:89) |
| Same as macOS ({name}) | `settings.microphone.system` | [orbit-app/src/components/MicrophoneRow.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:94) |
| Same as macOS | `settings.microphone.systemUnknown` | [orbit-app/src/components/MicrophoneRow.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:94) |
| Chosen microphone (not connected) | `settings.microphone.missing` | [orbit-app/src/components/MicrophoneRow.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:99) |
| Microphone level | `settings.microphone.level` | [orbit-app/src/components/MicrophoneRow.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:104) |

## orbit-app/src/components/ModelPicker.tsx

Fonte: [orbit-app/src/components/ModelPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:1). 18 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Setup required | `model.setupRequired` | [orbit-app/src/components/ModelPicker.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:50) |
| Sign-in required | `model.signInRequired` | [orbit-app/src/components/ModelPicker.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:51) |
| Ready | `model.ready` | [orbit-app/src/components/ModelPicker.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:52) |
| Reasoning effort | `model.compact.effort` | [orbit-app/src/components/ModelPicker.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:131) |
| Default | `model.compact.default` | [orbit-app/src/components/ModelPicker.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:135) |
| Reasoning effort | `model.ui.reasoningEffort` | [orbit-app/src/components/ModelPicker.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:146) |
| Reasoning variant | `model.compact.variant` | [orbit-app/src/components/ModelPicker.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:206) |
| Use session setting | `model.compact.sessionSetting` | [orbit-app/src/components/ModelPicker.tsx:210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:210) |
| Clear variant selection | `modelPicker.ui.clearVariantSelection` | [orbit-app/src/components/ModelPicker.tsx:232](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:232) |
| Reasoning variant | `model.ui.reasoningVariant` | [orbit-app/src/components/ModelPicker.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:236) |
| Provider: {name} | `model.provider` | [orbit-app/src/components/ModelPicker.tsx:295](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:295) |
| Default | `model.ui.default` | [orbit-app/src/components/ModelPicker.tsx:301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:301) |
| Loaded | `model.ui.loaded` | [orbit-app/src/components/ModelPicker.tsx:304](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:304) |
| Search models | `model.search` | [orbit-app/src/components/ModelPicker.tsx:336](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:336) |
| Search local models | `model.searchLocal` | [orbit-app/src/components/ModelPicker.tsx:336](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:336) |
| Managed by {organization} | `policy.managedBy` | [orbit-app/src/components/ModelPicker.tsx:813](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:813) |
| Cloud | `model.ui.cloud` | [orbit-app/src/components/ModelPicker.tsx:378](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:378) |
| Local | `model.ui.local` | [orbit-app/src/components/ModelPicker.tsx:380](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:380) |
| Account | `model.account` | [orbit-app/src/components/ModelPicker.tsx:395](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:395) |
| Looking for local models… | `model.lookingLocal` | [orbit-app/src/components/ModelPicker.tsx:617](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:617) |
| Choose model | `model.choose` | [orbit-app/src/components/ModelPicker.tsx:724](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:724) |
| Apply model changes to | `model.ui.applyModelChangesTo` | [orbit-app/src/components/ModelPicker.tsx:738](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:738) |
| Refreshing {name} models | `model.refreshing` | [orbit-app/src/components/ModelPicker.tsx:764](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:764) |
| Refresh {name} models | `model.refresh` | [orbit-app/src/components/ModelPicker.tsx:765](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:765) |
| Refresh models | `model.refreshTitle` | [orbit-app/src/components/ModelPicker.tsx:767](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:767) |
| Local models | `model.localModels` | [orbit-app/src/components/ModelPicker.tsx:782](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:782) |
| Run this agent with a model already on your machine. | `model.localHint` | [orbit-app/src/components/ModelPicker.tsx:794](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:794) |
| Back to {name} models | `model.backTo` | [orbit-app/src/components/ModelPicker.tsx:806](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:806) |
| Bots cannot use this engine while this computer is connected to {organization}. | `policy.modelBlocked` | [orbit-app/src/components/ModelPicker.tsx:814](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:814) |
| Use PowerShell for this command. | `engines.account.powershell` | [orbit-app/src/components/ModelPicker.tsx:821](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:821) |
| Run this exact command in a terminal on the computer running Orbit, finish Claude CLI sign-in, then click Check account. If you are viewing Orbit remotely, run it on the server, not this device. | `engines.account.signInHint` | [orbit-app/src/components/ModelPicker.tsx:822](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:822) |
| 1 model will appear after setup. | `model.afterSetupOne` | [orbit-app/src/components/ModelPicker.tsx:828](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:828) |
| {count} models will appear after setup. | `model.afterSetupMany` | [orbit-app/src/components/ModelPicker.tsx:829](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:829) |
| Local models will appear as soon as the agent is installed. | `model.localSoon` | [orbit-app/src/components/ModelPicker.tsx:830](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:830) |
| {count} results | `model.results` | [orbit-app/src/components/ModelPicker.tsx:859](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:859) |
| All models · {count} | `model.allModels` | [orbit-app/src/components/ModelPicker.tsx:861](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:861) |
| Suggested | `model.suggested` | [orbit-app/src/components/ModelPicker.tsx:862](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:862) |
| Nothing matches “{query}” | `model.noMatch` | [orbit-app/src/components/ModelPicker.tsx:918](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:918) |
| Show all {count} models | `model.showAll` | [orbit-app/src/components/ModelPicker.tsx:876](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:876) |
| Show suggested only | `model.showSuggested` | [orbit-app/src/components/ModelPicker.tsx:885](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:885) |
| Loaded now | `model.loadedNow` | [orbit-app/src/components/ModelPicker.tsx:895](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:895) |
| No local models found | `model.noLocal` | [orbit-app/src/components/ModelPicker.tsx:908](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:908) |
| Start oMLX, Ollama, Unsloth, LM Studio, or EXO, then reopen this picker. | `model.noLocalHint` | [orbit-app/src/components/ModelPicker.tsx:910](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:910) |
| Use a local model ({count} available) | `model.useLocalCount` | [orbit-app/src/components/ModelPicker.tsx:951](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:951) |
| Use a local model | `model.useLocal` | [orbit-app/src/components/ModelPicker.tsx:958](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:958) |
| {count} available | `model.available` | [orbit-app/src/components/ModelPicker.tsx:962](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:962) |
| No model providers are available. | `model.noProviders` | [orbit-app/src/components/ModelPicker.tsx:971](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:971) |
| Engines and accounts | `settings.engines.title` | [orbit-app/src/components/ModelPicker.tsx:977](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:977) |
| Switch model with Ask permissions? | `model.providerSwitch.title` | [orbit-app/src/components/ModelPicker.tsx:984](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:984) |
| Switch with Ask | `model.providerSwitch.confirm` | [orbit-app/src/components/ModelPicker.tsx:989](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:989) |
| Details | `model.updateDetails` | [orbit-app/src/components/ModelPicker.tsx:1015](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:1015) |

## orbit-app/src/components/NewChannelDialog.tsx

Fonte: [orbit-app/src/components/NewChannelDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| New group chat | `sidebar.newChannel.title` | [orbit-app/src/components/NewChannelDialog.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:35) |
| Group chat name (for example, Website launch) | `sidebar.newChannel.name` | [orbit-app/src/components/NewChannelDialog.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:45) |
| Team (optional): Work, Personal, Client… | `sidebar.newChannel.context` | [orbit-app/src/components/NewChannelDialog.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:56) |
| Group chat team | `sidebar.newChannel.contextAria` | [orbit-app/src/components/NewChannelDialog.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:57) |
| Create a bot first — group chats are made of bots. | `sidebar.newChannel.emptyHint` | [orbit-app/src/components/NewChannelDialog.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:64) |
| Create group chat | `sidebar.newChannel.create` | [orbit-app/src/components/NewChannelDialog.tsx:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:72) |
| Create group chat · 1 bot | `sidebar.newChannel.createOne` | [orbit-app/src/components/NewChannelDialog.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:74) |
| Create group chat · {count} bots | `sidebar.newChannel.createMany` | [orbit-app/src/components/NewChannelDialog.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:75) |

## orbit-app/src/components/NoEngines.tsx

Fonte: [orbit-app/src/components/NoEngines.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The host needs an agent engine | `noEngines.remoteTitle` | [orbit-app/src/components/NoEngines.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:34) |
| Configure Claude, ACP, or another supported engine in {app} on the host computer, then check again. | `noEngines.remoteBody` | [orbit-app/src/components/NoEngines.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:35) |
| Checking… | `common.checking` | [orbit-app/src/components/NoEngines.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:77) |
| Check again | `common.checkAgain` | [orbit-app/src/components/NoEngines.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:77) |
| Install an AI engine to get started | `noEngines.title` | [orbit-app/src/components/NoEngines.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:66) |
| {app} doesn't ship a model of its own — your bots run on an AI CLI installed on this computer, using your existing login. Set up any one of these and your bots come alive. | `noEngines.intro` | [orbit-app/src/components/NoEngines.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:67) |

## orbit-app/src/components/onboarding/beats/EnginesBeat.tsx

Fonte: [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Ready | `onboarding.engines.ready` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:33) |
| Needs setup | `onboarding.engines.needsSetup` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:33) |
| Bots run on AI tools installed on this computer — here’s what we found. | `onboarding.engines.intro` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:118) |
| Couldn't check your AI connections. Try again. | `onboarding.engines.error` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:168) |
| Your company models are ready. The engines below are your own, and optional. | `onboarding.org.personalOptional` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:130) |
| Hide | `onboarding.engines.hideSetup` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:149) |
| Set up | `onboarding.engines.setUp` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:149) |
| Checking… | `common.checking` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:189) |
| Everything is ready. Your bots can start right away. | `onboarding.engines.allReady` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:172) |
| {count} ready | `onboarding.engines.readyCount` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:176) |
| {count} to set up | `onboarding.engines.setupCount` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:178) |
| Check again | `common.checkAgain` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:189) |
| Continue | `onboarding.continue` | [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:194) |

## orbit-app/src/components/onboarding/beats/HelloBeat.tsx

Fonte: [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This is your team's shared workspace. Everyone who joins sees the same bots, chats and files. Your organisation provides the AI models, so there is nothing to install. | `onboarding.hosted.intro` | [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:49) |
| Continue | `onboarding.continue` | [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:76) |
| Your name | `onboarding.name` | [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:64) |
| Couldn't save your details. Try again, or choose Maybe later. | `onboarding.profile.error` | [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:74) |
| Skip for now | `onboarding.skip` | [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:85) |

## orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx

Fonte: [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Give it a name, a color, and one thing it should always keep in mind. All of this can change later in its settings. | `onboarding.bot.intro` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:58) |
| Bot name | `onboarding.bot.name` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:64) |
| Color | `onboarding.bot.color` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:82) |
| Color: {color} | `onboarding.bot.colorAria` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:89) |
| One standing instruction | `onboarding.bot.soul` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:106) |
| Keep answers short and show your work. | `onboarding.bot.soulPlaceholder` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:115) |
| The bot could not be saved. Finish anyway and edit it later from its settings. | `onboarding.bot.error` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:122) |
| Finish anyway | `onboarding.bot.finishAnyway` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:125) |
| Saving… | `onboarding.bot.saving` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:131) |
| Start chatting | `onboarding.bot.finish` | [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:131) |

## orbit-app/src/components/onboarding/beats/OrganisationRow.tsx

Fonte: [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Using {app} at work? | `onboarding.org.title` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:101) |
| Sign in with your organisation. | `onboarding.org.body` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:102) |
| Opening browser… | `organization.working` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:115) |
| Sign in | `onboarding.org.signIn` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:115) |
| Finish in your browser | `onboarding.org.finish` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:121) |
| Sign in on the page that opened. It shows this code: | `onboarding.org.finishHelp` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:124) |
| Cancel sign-in | `organization.cancel` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:139) |
| Signed in to {organization} | `onboarding.org.connected` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:145) |
| Company models: {count} | `onboarding.org.models` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:147) |
| No company models are available yet. Ask your organization administrator to configure access. | `organization.noModels` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:147) |
| Organisation settings | `onboarding.org.manage` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:159) |
| Could not complete this action. Refresh the connection and try again. | `organization.actionFailed` | [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:176) |

## orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx

Fonte: [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Optional, and only ever used when you ask for the feature. | `onboarding.perms.intro` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:39) |
| Microphone & speech | `onboarding.perms.mic` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:43) |
| Ready | `onboarding.engines.ready` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:47) |
| Open Settings | `onboarding.perms.openSettings` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:50) |
| Enable | `onboarding.perms.enable` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:54) |
| Microphone access was denied. Allow access in your browser settings, then try again. | `jarvis.solar.voice.permission` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:58) |
| Continue | `onboarding.continue` | [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:60) |

## orbit-app/src/components/onboarding/beats/shared.tsx

Fonte: [orbit-app/src/components/onboarding/beats/shared.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/shared.tsx:1). 2 linhas com controlos reconhecidos.

## orbit-app/src/components/onboarding/FirstConversationTour.tsx

Fonte: [orbit-app/src/components/onboarding/FirstConversationTour.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/FirstConversationTour.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Got it | `onboarding.spot.gotIt` | [orbit-app/src/components/onboarding/FirstConversationTour.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/FirstConversationTour.tsx:90) |

## orbit-app/src/components/onboarding/GuidedTour.tsx

Fonte: [orbit-app/src/components/onboarding/GuidedTour.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Step {current} of {total} | `onboarding.tour.progress` | [orbit-app/src/components/onboarding/GuidedTour.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:239) |
| Finish | `onboarding.tour.finish` | [orbit-app/src/components/onboarding/GuidedTour.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:240) |
| Next | `onboarding.tour.next` | [orbit-app/src/components/onboarding/GuidedTour.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:240) |
| Skip tour | `onboarding.tour.skip` | [orbit-app/src/components/onboarding/GuidedTour.tsx:241](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:241) |
| Couldn't save your progress. Try again, or skip the tour. | `onboarding.tour.error` | [orbit-app/src/components/onboarding/GuidedTour.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:245) |

## orbit-app/src/components/onboarding/ProgressDots.tsx

Fonte: [orbit-app/src/components/onboarding/ProgressDots.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/ProgressDots.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/onboarding/reel/FeatureReel.tsx

Fonte: [orbit-app/src/components/onboarding/reel/FeatureReel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/FeatureReel.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Scenes | `onboarding.reel.scenes` | [orbit-app/src/components/onboarding/reel/FeatureReel.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/FeatureReel.tsx:38) |
| Continue | `onboarding.continue` | [orbit-app/src/components/onboarding/reel/FeatureReel.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/FeatureReel.tsx:57) |
| Next | `onboarding.reel.next` | [orbit-app/src/components/onboarding/reel/FeatureReel.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/FeatureReel.tsx:57) |

## orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx

Fonte: [orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Scenes | `onboarding.reel.scenes` | [orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:14](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:14) |

## orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx

Fonte: [orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Your team's shared workspace | `onboarding.shared.title` | [orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:55) |
| Bots, chats and files here are shared with your team. Your administrator sets up the AI models and settings, so you can start chatting right away. | `onboarding.shared.body` | [orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:57) |
| Got it | `onboarding.spot.gotIt` | [orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:63) |

## orbit-app/src/components/onboarding/Spotlight.tsx

Fonte: [orbit-app/src/components/onboarding/Spotlight.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/Spotlight.tsx:1). 2 linhas com controlos reconhecidos.

## orbit-app/src/components/onboarding/WelcomeFlow.tsx

Fonte: [orbit-app/src/components/onboarding/WelcomeFlow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Welcome to {app} | `onboarding.welcome` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:57) |
| Your engines | `onboarding.engines.title` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:59) |
| Permissions | `onboarding.perms.title` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:61) |
| Meet your first bot | `onboarding.bot.title` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:63) |
| What your bots can do | `onboarding.reel.title` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:65) |
| Your phone | `onboarding.phone.title` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:67) |
| Welcome tour | `onboarding.dialog` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:242](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:242) |
| Skip tour | `onboarding.skipTour` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:254) |
| Back | `onboarding.back` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:299](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:299) |
| Step {current} of {total} | `onboarding.progress` | [orbit-app/src/components/onboarding/WelcomeFlow.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:305) |

## orbit-app/src/components/OptionCard.tsx

Fonte: [orbit-app/src/components/OptionCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OptionCard.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Type your own answer | `onboarding.card.custom` | [orbit-app/src/components/OptionCard.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OptionCard.tsx:112) |

## orbit-app/src/components/OrbitAssistantSettings.tsx

Fonte: [orbit-app/src/components/OrbitAssistantSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The other Orbit shortcut already uses that. | `orbitShell.settings.duplicate` | [orbit-app/src/components/OrbitAssistantSettings.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:37) |
| That shortcut couldn't be saved. | `orbitShell.settings.saveFailed` | [orbit-app/src/components/OrbitAssistantSettings.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:39) |
| Another app already uses {shortcut}. Choose a different shortcut. | `orbitShell.settings.conflict` | [orbit-app/src/components/OrbitAssistantSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:76) |
| Change the {name} | `orbitShell.settings.recordAria` | [orbit-app/src/components/OrbitAssistantSettings.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:91) |
| Press keys… | `orbitShell.settings.recording` | [orbit-app/src/components/OrbitAssistantSettings.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:98) |
| Off | `orbitShell.settings.none` | [orbit-app/src/components/OrbitAssistantSettings.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:112) |
| Turn off | `orbitShell.settings.clear` | [orbit-app/src/components/OrbitAssistantSettings.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:101) |
| Talk shortcut | `orbitShell.settings.talk.title` | [orbit-app/src/components/OrbitAssistantSettings.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:111) |
| Voice isn't available on Windows yet. | `orbitShell.settings.talk.noVoice` | [orbit-app/src/components/OrbitAssistantSettings.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:111) |
| Allowed | `orbitShell.settings.status.granted` | [orbit-app/src/components/OrbitAssistantSettings.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:120) |
| Not allowed | `orbitShell.settings.status.denied` | [orbit-app/src/components/OrbitAssistantSettings.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:121) |
| Not asked yet | `orbitShell.settings.status.notAsked` | [orbit-app/src/components/OrbitAssistantSettings.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:122) |
| Not checked yet | `orbitShell.settings.status.unknown` | [orbit-app/src/components/OrbitAssistantSettings.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:123) |
| Open System Settings | `orbitShell.openSystemSettings` | [orbit-app/src/components/OrbitAssistantSettings.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:135) |
| Orbit assistant | `orbitShell.settings.title` | [orbit-app/src/components/OrbitAssistantSettings.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:160) |
| Pause screen access | `orbitShell.settings.pause.title` | [orbit-app/src/components/OrbitAssistantSettings.tsx:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:166) |
| Orbit won't capture your screen, even when you call it. | `orbitShell.settings.pause.subtitle` | [orbit-app/src/components/OrbitAssistantSettings.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:163) |

## orbit-app/src/components/OrganizationSettings.tsx

Fonte: [orbit-app/src/components/OrganizationSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not load the organization connection. Try Refresh. | `organization.loadFailed` | [orbit-app/src/components/OrganizationSettings.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:49) |
| Could not complete this action. Refresh the connection and try again. | `organization.actionFailed` | [orbit-app/src/components/OrganizationSettings.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:67) |
| Connect an organization in the desktop app on this computer. | `organization.desktopOnly` | [orbit-app/src/components/OrganizationSettings.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:74) |
| Company models are added alongside your existing personal and local models. Those models and accounts stay available. | `organization.additive` | [orbit-app/src/components/OrganizationSettings.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:86) |
| Organisation | `settings.section.organization` | [orbit-app/src/components/OrganizationSettings.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:87) |
| Connecting does not upload your chat history. Requests sent to Company models go through your organization’s gateway. | `organization.privacy` | [orbit-app/src/components/OrganizationSettings.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:87) |
| Loading organization connection… | `organization.loading` | [orbit-app/src/components/OrganizationSettings.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:88) |
| Your organisation's Orbit Admin licence has expired. Contact your admin. | `organization.licenseExpired` | [orbit-app/src/components/OrganizationSettings.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:90) |
| Use your work email to sign in securely in your browser. | `organization.signInHelp` | [orbit-app/src/components/OrganizationSettings.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:97) |
| Custom Admin portal URL | `organization.address` | [orbit-app/src/components/OrganizationSettings.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:98) |
| Opening browser… | `organization.working` | [orbit-app/src/components/OrganizationSettings.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:104) |
| Sign in with your organisation | `organization.signIn` | [orbit-app/src/components/OrganizationSettings.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:104) |
| Finish signing in through your browser. Orbit will connect automatically when you’re done. | `organization.browserConsent` | [orbit-app/src/components/OrganizationSettings.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:108) |
| Security details | `organization.securityDetails` | [orbit-app/src/components/OrganizationSettings.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:110) |
| You can compare this code with the one shown in your browser. | `organization.securityDetailsHelp` | [orbit-app/src/components/OrganizationSettings.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:111) |
| Verification code | `organization.code` | [orbit-app/src/components/OrganizationSettings.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:112) |
| Open the sign-in page again | `organization.reopen` | [orbit-app/src/components/OrganizationSettings.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:117) |
| Cancel sign-in | `organization.cancel` | [orbit-app/src/components/OrganizationSettings.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:118) |
| Company access needs a new sign-in. Disconnect below, then sign in again. Personal and local models are still available. | `organization.reauth` | [orbit-app/src/components/OrganizationSettings.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:124) |
| Unavailable until the licence is renewed | `organization.companyModelsUnavailable` | [orbit-app/src/components/OrganizationSettings.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:127) |
| Choose a Company entry in the model picker to use organization access. Company model access is managed by your organization. | `organization.modelHelp` | [orbit-app/src/components/OrganizationSettings.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:130) |
| No company models are available yet. Ask your organization administrator to configure access. | `organization.noModels` | [orbit-app/src/components/OrganizationSettings.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:132) |
| Disconnect organization? | `organization.disconnectTitle` | [orbit-app/src/components/OrganizationSettings.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:134) |
| This removes Company access from this computer and stops running Company turns. Your chats, personal accounts, and local models remain. Company turns will not switch to personal billing. Daily backups pause, and resume only if you reconnect the same organisation with the same account. | `organization.disconnectWarning` | [orbit-app/src/components/OrganizationSettings.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:135) |
| Keep connection | `organization.keepConnection` | [orbit-app/src/components/OrganizationSettings.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:137) |
| Disconnect from organization | `organization.disconnectConfirm` | [orbit-app/src/components/OrganizationSettings.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:138) |
| Refresh | `organization.refresh` | [orbit-app/src/components/OrganizationSettings.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:148) |
| Disconnect… | `organization.disconnect` | [orbit-app/src/components/OrganizationSettings.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:142) |
| Organization access is currently unavailable. Your personal and local models are unchanged. | `organization.unavailable` | [orbit-app/src/components/OrganizationSettings.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:145) |
| Expires {date} | `organization.expires` | [orbit-app/src/components/OrganizationSettings.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:146) |

## orbit-app/src/components/PendingApproval.tsx

Fonte: [orbit-app/src/components/PendingApproval.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:1). 8 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {requester} wants to control your logged-in {browser}, signed in as you. Review it on screen. | `approval.browserProfile.voice` | [orbit-app/src/components/PendingApproval.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:78) |
| browser | `approval.browserProfile.anyBrowser` | [orbit-app/src/components/PendingApproval.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:80) |
| {requester} asks: {title} Review the skill on screen. Should I {action} it? | `approval.voice.skill` | [orbit-app/src/components/PendingApproval.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:91) |
| Update this profile? | `approval.voice.defaultUpdateProfile` | [orbit-app/src/components/PendingApproval.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:101) |
| {requester} wants to update its profile: {title}. Review the change on screen. Should I confirm it? | `approval.voice.profile` | [orbit-app/src/components/PendingApproval.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:102) |
| {requester} wants to {tool}. {detail}. Should I allow it? | `approval.voice.command` | [orbit-app/src/components/PendingApproval.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:108) |
| Confirm this routine? | `approval.voice.defaultConfirmRoutine` | [orbit-app/src/components/PendingApproval.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:110) |
| {requester} asks: {title} Review the schedule and instructions on screen. Should I confirm it? | `approval.voice.routine` | [orbit-app/src/components/PendingApproval.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:111) |
| Update this learned skill | `approval.label.updateSkill` | [orbit-app/src/components/PendingApproval.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:122) |
| Enable this learned skill | `approval.label.enableSkill` | [orbit-app/src/components/PendingApproval.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:123) |
| Confirm this profile change | `approval.label.confirmProfileChange` | [orbit-app/src/components/PendingApproval.tsx:126](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:126) |
| Confirm this routine | `approval.label.confirmRoutine` | [orbit-app/src/components/PendingApproval.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:130) |
| Confirm this routine change | `approval.label.confirmRoutineChange` | [orbit-app/src/components/PendingApproval.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:131) |
| Approval requested | `approval.label.requested` | [orbit-app/src/components/PendingApproval.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:142) |
| Pending skill confirmation | `approval.aria.pendingSkill` | [orbit-app/src/components/PendingApproval.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:164) |
| Pending routine confirmation | `approval.aria.pendingRoutine` | [orbit-app/src/components/PendingApproval.tsx:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:166) |
| Pending profile confirmation | `approval.aria.pendingProfile` | [orbit-app/src/components/PendingApproval.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:168) |
| Pending approval | `approval.aria.pending` | [orbit-app/src/components/PendingApproval.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:169) |
| Pending approval | `approval.pending` | [orbit-app/src/components/PendingApproval.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:175) |
| {index} of {count} | `approval.position` | [orbit-app/src/components/PendingApproval.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:179) |
| Skill details to review | `approval.aria.reviewSkill` | [orbit-app/src/components/PendingApproval.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:200) |
| Routine details to review | `approval.aria.reviewRoutine` | [orbit-app/src/components/PendingApproval.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:202) |
| Profile change to review | `approval.aria.reviewProfile` | [orbit-app/src/components/PendingApproval.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:204) |
| Approval details to review | `approval.aria.reviewDetails` | [orbit-app/src/components/PendingApproval.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:205) |
| Cancel turn | `approval.action.cancelTurn` | [orbit-app/src/components/PendingApproval.tsx:266](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:266) |
| Cancel | `approval.action.cancel` | [orbit-app/src/components/PendingApproval.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:357) |
| Deny | `approval.action.deny` | [orbit-app/src/components/PendingApproval.tsx:274](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:274) |
| Stop asking {name} about {key} | `approval.action.stopAsking` | [orbit-app/src/components/PendingApproval.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:279) |
| Always allow | `approval.action.alwaysAllow` | [orbit-app/src/components/PendingApproval.tsx:282](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:282) |
| The provider stops asking about this action until the session ends | `approval.action.alwaysAllowSessionHint` | [orbit-app/src/components/PendingApproval.tsx:288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:288) |
| Always allow this session | `approval.action.alwaysAllowSession` | [orbit-app/src/components/PendingApproval.tsx:291](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:291) |
| Remember this exact command for this bot and provider in {cwd}, including other threads using that folder | `approval.action.alwaysAllowCommandHint` | [orbit-app/src/components/PendingApproval.tsx:297](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:297) |
| Always allow this command | `approval.action.alwaysAllowCommand` | [orbit-app/src/components/PendingApproval.tsx:300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:300) |
| Update | `approval.action.update` | [orbit-app/src/components/PendingApproval.tsx:313](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:313) |
| Enable | `approval.action.enable` | [orbit-app/src/components/PendingApproval.tsx:314](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:314) |
| Confirm | `approval.action.confirm` | [orbit-app/src/components/PendingApproval.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:361) |
| Allow for this conversation | `approval.action.allowConversation` | [orbit-app/src/components/PendingApproval.tsx:318](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:318) |
| Allow once | `approval.action.allowOnce` | [orbit-app/src/components/PendingApproval.tsx:319](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:319) |

## orbit-app/src/components/PeopleSection.tsx

Fonte: [orbit-app/src/components/PeopleSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Never | `people.never` | [orbit-app/src/components/PeopleSection.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:101) |
| Today | `people.today` | [orbit-app/src/components/PeopleSection.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:102) |
| Person | `people.colPerson` | [orbit-app/src/components/PeopleSection.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:121) |
| Role | `people.colRole` | [orbit-app/src/components/PeopleSection.tsx:299](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:299) |
| Last seen | `people.colLastSeen` | [orbit-app/src/components/PeopleSection.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:123) |
| This month | `people.colMonth` | [orbit-app/src/components/PeopleSection.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:124) |
| everyone at {domain} | `people.everyoneAt` | [orbit-app/src/components/PeopleSection.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:130) |
| {count} device(s) | `people.devices` | [orbit-app/src/components/PeopleSection.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:131) |
| Admin | `people.roleAdmin` | [orbit-app/src/components/PeopleSection.tsx:301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:301) |
| Member | `people.roleMember` | [orbit-app/src/components/PeopleSection.tsx:300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:300) |
| {turns} turns this month | `people.turns` | [orbit-app/src/components/PeopleSection.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:137) |
| Invite link | `people.link` | [orbit-app/src/components/PeopleSection.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:170) |
| Make member | `people.makeMember` | [orbit-app/src/components/PeopleSection.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:143) |
| Make admin | `people.makeAdmin` | [orbit-app/src/components/PeopleSection.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:143) |
| Remove | `people.remove` | [orbit-app/src/components/PeopleSection.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:145) |
| Copied | `people.copied` | [orbit-app/src/components/PeopleSection.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:174) |
| Copy | `people.copy` | [orbit-app/src/components/PeopleSection.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:174) |
| The link opens the sign-in page with the address filled in. They still receive a one-time code by email, so only the owner of that address gets in. | `people.linkHint` | [orbit-app/src/components/PeopleSection.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:177) |
| People | `people.title` | [orbit-app/src/components/PeopleSection.tsx:288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:288) |
| Who has signed in to this workspace, and what each person spent this month. | `people.portal.subtitle` | [orbit-app/src/components/PeopleSection.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:187) |
| People are managed in your organisation's Admin. Invite someone, change their role or remove them there; this workspace follows within a few seconds. | `people.portal.managed` | [orbit-app/src/components/PeopleSection.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:189) |
| Manage people in Admin | `people.portal.open` | [orbit-app/src/components/PeopleSection.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:197) |
| This list only shows who has signed in here. It cannot give or take away access. | `people.portal.note` | [orbit-app/src/components/PeopleSection.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:204) |
| Enter an email address, or @domain for everyone at that domain. | `remote.signInAccess.invalid` | [orbit-app/src/components/PeopleSection.tsx:277](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:277) |
| Who can sign in to this workspace with an emailed code, what each person spent this month, and a link to invite someone. | `people.subtitle` | [orbit-app/src/components/PeopleSection.tsx:288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:288) |
| name@company.com or @company.com | `remote.signInAccess.placeholder` | [orbit-app/src/components/PeopleSection.tsx:294](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:294) |
| Email or @domain | `people.inviteEmail` | [orbit-app/src/components/PeopleSection.tsx:295](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:295) |
| Invite | `people.invite` | [orbit-app/src/components/PeopleSection.tsx:304](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:304) |
| Refresh | `people.refresh` | [orbit-app/src/components/PeopleSection.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:306) |
| Admins change settings, engines and keys; members chat and answer approvals. An invite adds the address here and gives you a link to send. | `people.inviteHint` | [orbit-app/src/components/PeopleSection.tsx:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:308) |
| Changes apply at once. Removing someone ends their account sessions and prevents new sign-ins. Devices connected separately by pairing code can be revoked under Remote access. | `people.note` | [orbit-app/src/components/PeopleSection.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:320) |

## orbit-app/src/components/PhoneSetupFlow.tsx

Fonte: [orbit-app/src/components/PhoneSetupFlow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1). 16 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Direct Wi-Fi pairing isn’t available on this computer right now. Connect this computer to Wi-Fi, then try again. | `phone.error.directUnavailable` | [orbit-app/src/components/PhoneSetupFlow.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:104) |
| The HTTPS pairing route became unavailable. Check secure access, then create a new code. | `phone.error.protectedUnavailable` | [orbit-app/src/components/PhoneSetupFlow.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:105) |
| Remote access could not be updated. Open Advanced & troubleshooting and try again. | `phone.error.remoteUpdate` | [orbit-app/src/components/PhoneSetupFlow.tsx:317](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:317) |
| Secure remote access could not be updated. Try again. | `phone.error.secureUpdate` | [orbit-app/src/components/PhoneSetupFlow.tsx:342](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:342) |
| Remote access setup is only available in the desktop app. | `phone.error.desktopOnly` | [orbit-app/src/components/PhoneSetupFlow.tsx:368](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:368) |
| Tailscale pairing isn’t available right now. Make sure Tailscale is connected and MagicDNS is on. | `phone.error.tailscaleUnavailable` | [orbit-app/src/components/PhoneSetupFlow.tsx:466](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:466) |
| Device pairing could not be prepared. Open Advanced & troubleshooting and try again. | `phone.error.pairingPrepare` | [orbit-app/src/components/PhoneSetupFlow.tsx:489](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:489) |
| We could not send the code. Try again. | `phone.error.sendCode` | [orbit-app/src/components/PhoneSetupFlow.tsx:582](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:582) |
| That code could not be verified. Try again. | `phone.error.verifyCode` | [orbit-app/src/components/PhoneSetupFlow.tsx:614](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:614) |
| Secure access could not be restored. Try again. | `phone.error.restore` | [orbit-app/src/components/PhoneSetupFlow.tsx:649](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:649) |
| The pairing code changed before setup finished. Create a new code and try again. | `phone.error.codeChanged` | [orbit-app/src/components/PhoneSetupFlow.tsx:722](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:722) |
| Your conversations | `phone.value.chats` | [orbit-app/src/components/PhoneSetupFlow.tsx:902](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:902) |
| Read and reply from another device. | `phone.value.chatsDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:902](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:902) |
| Quick approvals | `phone.value.approvals` | [orbit-app/src/components/PhoneSetupFlow.tsx:903](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:903) |
| Keep work moving when you step away. | `phone.value.approvalsDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:903](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:903) |
| Private by default | `phone.value.private` | [orbit-app/src/components/PhoneSetupFlow.tsx:904](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:904) |
| Only devices you approve can connect. | `phone.value.privateDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:904](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:904) |
| Pair the iPhone or Android app to chat with your bots, answer approvals and take calls from anywhere. | `onboarding.phone.intro` | [orbit-app/src/components/PhoneSetupFlow.tsx:945](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:945) |
| Pair a phone | `phone.intro.pairPhone` | [orbit-app/src/components/PhoneSetupFlow.tsx:949](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:949) |
| Pair later | `phone.intro.later` | [orbit-app/src/components/PhoneSetupFlow.tsx:952](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:952) |
| Continue | `onboarding.continue` | [orbit-app/src/components/PhoneSetupFlow.tsx:953](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:953) |
| Use {app} from another device | `phone.intro.title` | [orbit-app/src/components/PhoneSetupFlow.tsx:966](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:966) |
| Check chats, answer approvals, and send new work from a phone or another computer. | `phone.intro.detail` | [orbit-app/src/components/PhoneSetupFlow.tsx:970](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:970) |
| Pair another device | `phone.intro.pairAnother` | [orbit-app/src/components/PhoneSetupFlow.tsx:982](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:982) |
| Pair a device | `phone.intro.pair` | [orbit-app/src/components/PhoneSetupFlow.tsx:983](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:983) |
| Set up another device | `phone.intro.setUp` | [orbit-app/src/components/PhoneSetupFlow.tsx:984](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:984) |
| Not now | `phone.intro.notNow` | [orbit-app/src/components/PhoneSetupFlow.tsx:996](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:996) |
| You can resume anytime from Settings → Remote access. | `phone.intro.resume` | [orbit-app/src/components/PhoneSetupFlow.tsx:999](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:999) |
| Back | `phone.back` | [orbit-app/src/components/PhoneSetupFlow.tsx:1013](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1013) |
| Secure access needs attention | `phone.signIn.attention` | [orbit-app/src/components/PhoneSetupFlow.tsx:1019](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1019) |
| Sign in to pair securely | `phone.signIn.title` | [orbit-app/src/components/PhoneSetupFlow.tsx:1019](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1019) |
| Online remote access is not available right now. You can still pair directly on the same Wi-Fi. | `phone.signIn.unavailable` | [orbit-app/src/components/PhoneSetupFlow.tsx:1026](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1026) |
| Secure access is taking longer than expected. You can try again or pair directly on this Wi-Fi. | `phone.signIn.timedOut` | [orbit-app/src/components/PhoneSetupFlow.tsx:1028](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1028) |
| We could not finish creating your private connection. | `phone.signIn.failed` | [orbit-app/src/components/PhoneSetupFlow.tsx:1030](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1030) |
| We’ll email you a one-time code. No password needed. | `phone.signIn.emailPrompt` | [orbit-app/src/components/PhoneSetupFlow.tsx:1031](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1031) |
| Email | `phone.signIn.email` | [orbit-app/src/components/PhoneSetupFlow.tsx:1037](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1037) |
| 8-digit code | `phone.signIn.code` | [orbit-app/src/components/PhoneSetupFlow.tsx:1054](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1054) |
| Working… | `phone.signIn.working` | [orbit-app/src/components/PhoneSetupFlow.tsx:1075](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1075) |
| Verify and continue | `phone.signIn.verify` | [orbit-app/src/components/PhoneSetupFlow.tsx:1075](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1075) |
| Email me a code | `phone.signIn.sendCode` | [orbit-app/src/components/PhoneSetupFlow.tsx:1075](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1075) |
| Use another email | `phone.signIn.otherEmail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1083) |
| The code expires in 10 minutes. | `phone.signIn.expires` | [orbit-app/src/components/PhoneSetupFlow.tsx:1087](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1087) |
| Trying again… | `remote.account.retrying` | [orbit-app/src/components/PhoneSetupFlow.tsx:1098](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1098) |
| Try secure access again | `phone.signIn.retry` | [orbit-app/src/components/PhoneSetupFlow.tsx:1098](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1098) |
| or | `phone.signIn.or` | [orbit-app/src/components/PhoneSetupFlow.tsx:1103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1103) |
| Pair over Tailscale | `remote.pairOverTailscale` | [orbit-app/src/components/PhoneSetupFlow.tsx:1112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1112) |
| The other device must be signed in to the same tailnet. | `phone.signIn.tailnetNote` | [orbit-app/src/components/PhoneSetupFlow.tsx:1115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1115) |
| Pair on this Wi-Fi instead | `phone.signIn.wifiInstead` | [orbit-app/src/components/PhoneSetupFlow.tsx:1124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1124) |
| Both devices must be on a network that lets them see each other. | `phone.signIn.wifiNote` | [orbit-app/src/components/PhoneSetupFlow.tsx:1127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1127) |
| Preparing your pairing code | `phone.verifying.local` | [orbit-app/src/components/PhoneSetupFlow.tsx:1141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1141) |
| Preparing Tailscale pairing | `phone.verifying.tailscale` | [orbit-app/src/components/PhoneSetupFlow.tsx:1143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1143) |
| Creating secure remote access | `phone.verifying.secure` | [orbit-app/src/components/PhoneSetupFlow.tsx:1144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1144) |
| This should only take a moment. | `phone.verifying.localDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1148) |
| Your pairing code will use your private tailnet connection. | `phone.verifying.tailscaleDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1150) |
| We’re giving this computer a private connection that works even when the paired device is away from this Wi-Fi. | `phone.verifying.secureDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1151) |
| Cancel | `common.cancel` | [orbit-app/src/components/PhoneSetupFlow.tsx:1230](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1230) |
| Your device is ready | `phone.success.title` | [orbit-app/src/components/PhoneSetupFlow.tsx:1167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1167) |
| It can now open chats, answer approvals, and send new work. | `phone.success.detail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1169) |
| Start using {app} | `phone.success.start` | [orbit-app/src/components/PhoneSetupFlow.tsx:1178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1178) |
| Done | `phone.success.done` | [orbit-app/src/components/PhoneSetupFlow.tsx:1178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1178) |
| That code expired | `phone.code.expired` | [orbit-app/src/components/PhoneSetupFlow.tsx:1190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1190) |
| Scan or enter the code | `phone.code.title` | [orbit-app/src/components/PhoneSetupFlow.tsx:1190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1190) |
| Create a fresh code when the other device is ready. | `phone.code.expiredDetail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1193) |
| Scan this code in Orbit on iPhone, or enter the address and code from pairing details in another desktop app. | `phone.code.detail` | [orbit-app/src/components/PhoneSetupFlow.tsx:1193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1193) |
| Device pairing QR code | `phone.code.qrAria` | [orbit-app/src/components/PhoneSetupFlow.tsx:1196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1196) |
| Open OrbitMobile and enter this manual code. | `phone.code.manualIntro` | [orbit-app/src/components/PhoneSetupFlow.tsx:1202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1202) |
| Code expires in {seconds}s | `phone.code.expiresIn` | [orbit-app/src/components/PhoneSetupFlow.tsx:1209](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1209) |
| Create a new code | `phone.code.createNew` | [orbit-app/src/components/PhoneSetupFlow.tsx:1213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1213) |
| Having trouble? | `phone.code.trouble` | [orbit-app/src/components/PhoneSetupFlow.tsx:1218](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1218) |
| Manual code | `phone.code.manual` | [orbit-app/src/components/PhoneSetupFlow.tsx:1220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1220) |
| Pairing address | `phone.code.address` | [orbit-app/src/components/PhoneSetupFlow.tsx:1224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1224) |

## orbit-app/src/components/PlaceChip.tsx

Fonte: [orbit-app/src/components/PlaceChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Works on is Off for this bot. Change it in the Computer panel. | `place.offHint` | [orbit-app/src/components/PlaceChip.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:59) |
| Wait for the current turn to finish | `place.busy` | [orbit-app/src/components/PlaceChip.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:59) |
| Pinned for this conversation | `place.pinnedHere` | [orbit-app/src/components/PlaceChip.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:59) |
| From this bot's Works on setting | `place.fromBot` | [orbit-app/src/components/PlaceChip.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:59) |
| Where this conversation works: {place} | `place.chipAria` | [orbit-app/src/components/PlaceChip.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:79) |
| In use now | `place.live` | [orbit-app/src/components/PlaceChip.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:93) |
| Where this conversation works | `place.chipTitle` | [orbit-app/src/components/PlaceChip.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:97) |
| Follow this bot's setting | `place.followBot` | [orbit-app/src/components/PlaceChip.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:108) |
| Currently {place} | `place.followBotDetail` | [orbit-app/src/components/PlaceChip.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:109) |
| Not available for this bot's engine or setup | `place.unavailable` | [orbit-app/src/components/PlaceChip.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:130) |

## orbit-app/src/components/PluginsPanel.tsx

Fonte: [orbit-app/src/components/PluginsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Plugins | `connectors.title` | [orbit-app/src/components/PluginsPanel.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:75) |
| Tools for your bots, from the MCP registries or your own servers. | `connectors.subtitle` | [orbit-app/src/components/PluginsPanel.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:76) |
| Close plugins | `connectors.closeAria` | [orbit-app/src/components/PluginsPanel.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:78) |
| Plugin type | `connectors.typeAria` | [orbit-app/src/components/PluginsPanel.tsx:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:81) |
| Explore | `mcp.explore.tab` | [orbit-app/src/components/PluginsPanel.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:94) |
| Installed | `mcp.explore.installedTab` | [orbit-app/src/components/PluginsPanel.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:94) |

## orbit-app/src/components/ProviderIconPicker.tsx

Fonte: [orbit-app/src/components/ProviderIconPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Orbit could not decode that image. | `engines.icon.decodeError` | [orbit-app/src/components/ProviderIconPicker.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:21) |
| Upload a PNG, JPEG, or WebP image. | `engines.icon.formatError` | [orbit-app/src/components/ProviderIconPicker.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:32) |
| Provider icons must be 128 KB or smaller. | `engines.icon.sizeError` | [orbit-app/src/components/ProviderIconPicker.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:34) |
| Upload a complete PNG, JPEG, or WebP image up to 128 KB and {dimension} × {dimension} pixels. | `engines.icon.invalidError` | [orbit-app/src/components/ProviderIconPicker.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:42) |
| Provider icons must be at most {dimension} × {dimension} pixels. | `engines.icon.dimensionError` | [orbit-app/src/components/ProviderIconPicker.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:45) |
| Provider icon | `engines.icon.label` | [orbit-app/src/components/ProviderIconPicker.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:94) |
| Provider icon for {name} | `engines.icon.selectAria` | [orbit-app/src/components/ProviderIconPicker.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:95) |
| Default icon | `engines.icon.default` | [orbit-app/src/components/ProviderIconPicker.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:101) |
| Custom image | `engines.icon.custom` | [orbit-app/src/components/ProviderIconPicker.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:102) |
| Saving provider icon | `engines.icon.saving` | [orbit-app/src/components/ProviderIconPicker.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:106) |
| Reset | `engines.icon.reset` | [orbit-app/src/components/ProviderIconPicker.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:109) |
| Choose a provider or upload a square PNG, JPEG, or WebP image up to 128 KB. This changes only this engine instance. | `engines.icon.help` | [orbit-app/src/components/ProviderIconPicker.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:112) |
| Upload a custom provider icon for {name} | `engines.icon.uploadAria` | [orbit-app/src/components/ProviderIconPicker.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:114) |

## orbit-app/src/components/QuestionCard.tsx

Fonte: [orbit-app/src/components/QuestionCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Question {index} | `question.tab.numbered` | [orbit-app/src/components/QuestionCard.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:44) |
| Question from your bot | `question.aria.card` | [orbit-app/src/components/QuestionCard.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:132) |
| {name} has a question | `question.card.named` | [orbit-app/src/components/QuestionCard.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:140) |
| Your bot has a question | `question.card.title` | [orbit-app/src/components/QuestionCard.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:140) |
| {answered} of {count} answered | `question.progress` | [orbit-app/src/components/QuestionCard.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:144) |
| Agent-composed question | `question.origin.badge` | [orbit-app/src/components/QuestionCard.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:150) |
| Questions | `question.aria.tabs` | [orbit-app/src/components/QuestionCard.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:154) |
| Choose all that apply | `question.multiHint` | [orbit-app/src/components/QuestionCard.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:177) |
| Other | `question.other` | [orbit-app/src/components/QuestionCard.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:224) |
| Type your own answer | `question.otherPlaceholder` | [orbit-app/src/components/QuestionCard.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:236) |
| Answered | `question.status.answered` | [orbit-app/src/components/QuestionCard.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:250) |
| Waiting for your answer | `question.status.waiting` | [orbit-app/src/components/QuestionCard.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:258) |
| Submit answers | `question.submitAll` | [orbit-app/src/components/QuestionCard.tsx:265](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:265) |
| Submit answer | `question.submit` | [orbit-app/src/components/QuestionCard.tsx:265](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:265) |

## orbit-app/src/components/RawMarkdownToggle.tsx

Fonte: [orbit-app/src/components/RawMarkdownToggle.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RawMarkdownToggle.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/remote-desktop-panel.tsx

Fonte: [orbit-app/src/components/remote-desktop-panel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:1). 7 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Close computer panel | `remoteDesktop.ui.closeComputerPanel` | [orbit-app/src/components/remote-desktop-panel.tsx:211](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:211) |
| Open live desktop | `remoteDesktopPanel.ui.openLiveDesktop` | [orbit-app/src/components/remote-desktop-panel.tsx:237](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:237) |
| Open the live desktop | `remoteDesktop.ui.openTheLiveDesktop` | [orbit-app/src/components/remote-desktop-panel.tsx:242](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:242) |
| The host creates a temporary, encrypted viewer relay. VPS SSH and VNC credentials stay on the host computer. | `remoteDesktopPanel.ui.theHostCreatesATemporaryEncrypted` | [orbit-app/src/components/remote-desktop-panel.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:244) |
| Scheduled tasks | `remoteDesktopPanel.ui.scheduledTasks` | [orbit-app/src/components/remote-desktop-panel.tsx:269](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:269) |
| Create schedule | `remoteDesktopPanel.ui.createSchedule` | [orbit-app/src/components/remote-desktop-panel.tsx:317](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:317) |
| Open schedules | `remoteDesktop.ui.openSchedules` | [orbit-app/src/components/remote-desktop-panel.tsx:323](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:323) |
| Schedules | `remoteDesktopPanel.ui.schedules` | [orbit-app/src/components/remote-desktop-panel.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:326) |

## orbit-app/src/components/RemoteAgentSettingsPanel.tsx

Fonte: [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Collapse remote agent settings | `remoteAgent.ui.collapseRemoteAgentSettings` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:60) |
| Remote agent settings | `remoteAgent.ui.remoteAgentSettings` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:65) |
| Close remote agent settings | `remoteAgent.ui.closeRemoteAgentSettings` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:68) |
| Notifications | `remoteAgent.ui.notifications` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:102) |
| Enable completion and attention notifications for this agent on the host and paired clients. | `remoteAgentSettingsPanel.ui.enableCompletionAndAttentionNotification` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:104) |
| Agent notifications | `remoteAgent.ui.agentNotifications` | [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:111) |

## orbit-app/src/components/RemoteComputerSection.tsx

Fonte: [orbit-app/src/components/RemoteComputerSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Paste a full HTTPS server pairing link, such as https://bots.example.com/pair#code=XXXX-XXXX-XXXX. The code belongs after #, not in the URL query. | `remote.client.server.invalidLink` | [orbit-app/src/components/RemoteComputerSection.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:68) |
| Remote connection | `remote.client.active` | [orbit-app/src/components/RemoteComputerSection.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:101) |
| Connect to another computer | `remote.client.idle` | [orbit-app/src/components/RemoteComputerSection.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:101) |
| Use this desktop app as a secure client for Orbit running on another computer. | `remote.client.subtitle` | [orbit-app/src/components/RemoteComputerSection.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:102) |
| Remote desktop pairing requires the installed app. | `remote.client.desktopOnly` | [orbit-app/src/components/RemoteComputerSection.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:105) |
| Connected to {name} | `remote.client.connected` | [orbit-app/src/components/RemoteComputerSection.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:112) |
| remote Orbit | `remote.client.fallbackName` | [orbit-app/src/components/RemoteComputerSection.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:112) |
| This app is in client mode. Bots and conversations run on the other computer; the paired-device token stays in this computer’s encrypted credential store. | `remote.client.mode` | [orbit-app/src/components/RemoteComputerSection.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:118) |
| Disconnect and use this computer | `remote.client.disconnect` | [orbit-app/src/components/RemoteComputerSection.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:127) |
| Connection type | `remote.client.connectionType` | [orbit-app/src/components/RemoteComputerSection.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:134) |
| Self-hosted server | `remote.client.server.option` | [orbit-app/src/components/RemoteComputerSection.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:144) |
| Desktop companion | `remote.client.companion.option` | [orbit-app/src/components/RemoteComputerSection.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:145) |
| On your server, run this command to create a fresh, single-use pairing link. Paste the full link below, including its 12-character code. | `remote.client.server.hint` | [orbit-app/src/components/RemoteComputerSection.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:152) |
| Server pairing link | `remote.client.server.pairingLink` | [orbit-app/src/components/RemoteComputerSection.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:158) |
| Supports your server’s HTTPS address, including custom domains and Cloudflare Tunnel. | `remote.client.server.domainHint` | [orbit-app/src/components/RemoteComputerSection.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:172) |
| On the other desktop app, open Settings → Remote access and create a six-digit companion code. Use its managed Orbit HTTPS address or full Tailscale name ending in .ts.net. For a self-hosted server or custom domain, choose Self-hosted server in this computer’s installed app. | `remote.client.companion.hint` | [orbit-app/src/components/RemoteComputerSection.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:178) |
| Companion address | `remote.client.companion.address` | [orbit-app/src/components/RemoteComputerSection.tsx:181](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:181) |
| Six-digit companion code | `remote.client.companion.code` | [orbit-app/src/components/RemoteComputerSection.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:194) |
| Connect to server | `remote.client.server.connect` | [orbit-app/src/components/RemoteComputerSection.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:214) |
| Pair and switch to client mode | `remote.client.pair` | [orbit-app/src/components/RemoteComputerSection.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:214) |
| Confirm the address, then finish pairing on the server page. Use the Server menu to return to this computer later. | `remote.client.server.switchNote` | [orbit-app/src/components/RemoteComputerSection.tsx:217](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:217) |
| Pairing restarts this app. Disconnecting later returns it to normal host mode. | `remote.client.restartNote` | [orbit-app/src/components/RemoteComputerSection.tsx:217](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:217) |

## orbit-app/src/components/ReplyQuote.tsx

Fonte: [orbit-app/src/components/ReplyQuote.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ReplyQuote.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Replying to {name} | `chat.reply.replyingTo` | [orbit-app/src/components/ReplyQuote.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ReplyQuote.tsx:25) |
| Jump to original message | `chat.reply.jump` | [orbit-app/src/components/ReplyQuote.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ReplyQuote.tsx:33) |
| Cancel reply | `chat.reply.cancel` | [orbit-app/src/components/ReplyQuote.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ReplyQuote.tsx:40) |

## orbit-app/src/components/RoomTurnTimeoutSettings.tsx

Fonte: [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Enter a whole number from 1 to 1,440. | `settings.roomTurns.range` | [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:31) |
| Could not save the group turn limit. | `settings.roomTurns.error` | [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:46) |
| Maximum turn length | `settings.roomTurns.label` | [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:56) |
| minutes | `settings.roomTurns.minutes` | [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:85) |
| Applies to every bot turn in groups. Direct threads use the inactivity watchdog instead. | `settings.roomTurns.help` | [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:88) |

## orbit-app/src/components/RoutineCalendarPage.tsx

Fonte: [orbit-app/src/components/RoutineCalendarPage.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1). 75 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Find a bot | `calendar.ui.findABot` | [orbit-app/src/components/RoutineCalendarPage.tsx:294](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:294) |
| Close | `calendar.ui.close` | [orbit-app/src/components/RoutineCalendarPage.tsx:1546](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1546) |
| Routine | `calendar.ui.routine` | [orbit-app/src/components/RoutineCalendarPage.tsx:1146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1146) |
| Call | `calendar.ui.call` | [orbit-app/src/components/RoutineCalendarPage.tsx:1147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1147) |
| Routine type | `calendar.ui.routineType` | [orbit-app/src/components/RoutineCalendarPage.tsx:654](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:654) |
| Bot task | `calendar.ui.botTask` | [orbit-app/src/components/RoutineCalendarPage.tsx:662](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:662) |
| One bot owns and completes each run. | `calendar.ui.oneBotOwnsAndCompletesEach` | [orbit-app/src/components/RoutineCalendarPage.tsx:662](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:662) |
| Team goal | `calendar.ui.teamGoal` | [orbit-app/src/components/RoutineCalendarPage.tsx:670](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:670) |
| A lead coordinates the group until the goal settles. | `calendar.ui.aLeadCoordinatesTheGroupUntil` | [orbit-app/src/components/RoutineCalendarPage.tsx:670](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:670) |
| Starts | `calendar.ui.starts` | [orbit-app/src/components/RoutineCalendarPage.tsx:686](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:686) |
| On | `calendar.ui.on` | [orbit-app/src/components/RoutineCalendarPage.tsx:755](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:755) |
| Call duration | `calendar.ui.callDuration` | [orbit-app/src/components/RoutineCalendarPage.tsx:693](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:693) |
| Repeat | `calendar.ui.repeat` | [orbit-app/src/components/RoutineCalendarPage.tsx:701](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:701) |
| Does not repeat | `calendar.ui.doesNotRepeat` | [orbit-app/src/components/RoutineCalendarPage.tsx:702](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:702) |
| Every X minutes | `calendar.ui.everyXMinutes` | [orbit-app/src/components/RoutineCalendarPage.tsx:703](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:703) |
| Daily | `calendar.ui.daily` | [orbit-app/src/components/RoutineCalendarPage.tsx:704](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:704) |
| Selected weekdays | `calendar.ui.selectedWeekdays` | [orbit-app/src/components/RoutineCalendarPage.tsx:707](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:707) |
| Monthly | `calendar.ui.monthly` | [orbit-app/src/components/RoutineCalendarPage.tsx:708](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:708) |
| Yearly | `calendar.ui.yearly` | [orbit-app/src/components/RoutineCalendarPage.tsx:708](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:708) |
| Runs every | `calendar.ui.runsEvery` | [orbit-app/src/components/RoutineCalendarPage.tsx:725](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:725) |
| How often this routine runs | `calendar.ui.howOftenThisRoutineRuns` | [orbit-app/src/components/RoutineCalendarPage.tsx:729](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:729) |
| Custom… | `calendar.ui.custom` | [orbit-app/src/components/RoutineCalendarPage.tsx:766](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:766) |
| Custom interval in minutes | `calendar.ui.customIntervalInMinutes` | [orbit-app/src/components/RoutineCalendarPage.tsx:743](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:743) |
| Days this interval runs | `calendar.ui.daysThisIntervalRuns` | [orbit-app/src/components/RoutineCalendarPage.tsx:759](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:759) |
| Every day | `calendar.ui.everyDay` | [orbit-app/src/components/RoutineCalendarPage.tsx:764](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:764) |
| Weekdays | `calendar.ui.weekdays` | [orbit-app/src/components/RoutineCalendarPage.tsx:765](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:765) |
| During | `calendar.ui.during` | [orbit-app/src/components/RoutineCalendarPage.tsx:771](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:771) |
| Hours this interval runs | `calendar.ui.hoursThisIntervalRuns` | [orbit-app/src/components/RoutineCalendarPage.tsx:775](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:775) |
| All day | `calendar.ui.allDay` | [orbit-app/src/components/RoutineCalendarPage.tsx:780](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:780) |
| Custom hours… | `calendar.ui.customHours` | [orbit-app/src/components/RoutineCalendarPage.tsx:781](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:781) |
| Ends | `calendar.ui.ends` | [orbit-app/src/components/RoutineCalendarPage.tsx:786](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:786) |
| When this interval ends | `calendar.ui.whenThisIntervalEnds` | [orbit-app/src/components/RoutineCalendarPage.tsx:790](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:790) |
| Never | `calendar.ui.never` | [orbit-app/src/components/RoutineCalendarPage.tsx:795](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:795) |
| On a date… | `calendar.ui.onADate` | [orbit-app/src/components/RoutineCalendarPage.tsx:796](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:796) |
| Choose the days | `calendar.ui.chooseTheDays` | [orbit-app/src/components/RoutineCalendarPage.tsx:803](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:803) |
| Custom interval days | `calendar.ui.customIntervalDays` | [orbit-app/src/components/RoutineCalendarPage.tsx:806](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:806) |
| Run between | `calendar.ui.runBetween` | [orbit-app/src/components/RoutineCalendarPage.tsx:831](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:831) |
| Interval window start | `calendar.ui.intervalWindowStart` | [orbit-app/src/components/RoutineCalendarPage.tsx:832](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:832) |
| Interval window end | `calendar.ui.intervalWindowEnd` | [orbit-app/src/components/RoutineCalendarPage.tsx:834](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:834) |
| Stop scheduling after | `calendar.ui.stopSchedulingAfter` | [orbit-app/src/components/RoutineCalendarPage.tsx:840](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:840) |
| Interval end date | `calendar.ui.intervalEndDate` | [orbit-app/src/components/RoutineCalendarPage.tsx:841](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:841) |
| Choose a whole number from 5 to 1,440 minutes. | `calendar.ui.chooseAWholeNumberFrom5` | [orbit-app/src/components/RoutineCalendarPage.tsx:846](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:846) |
| Choose at least one day. | `calendar.ui.chooseAtLeastOneDay` | [orbit-app/src/components/RoutineCalendarPage.tsx:849](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:849) |
| Choose an end date after the first run. | `calendar.ui.chooseAnEndDateAfterThe` | [orbit-app/src/components/RoutineCalendarPage.tsx:855](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:855) |
| Runs with | `routines.runsWith` | [orbit-app/src/components/RoutineCalendarPage.tsx:872](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:872) |
| Same as {name} ({mode}) | `routines.runsWithBot` | [orbit-app/src/components/RoutineCalendarPage.tsx:879](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:879) |
| the bot | `routines.theBot` | [orbit-app/src/components/RoutineCalendarPage.tsx:879](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:879) |
| Each run starts a fresh thread at this approval level, so a scheduled routine can work while you're away. Your own chats with the bot keep its level. | `routines.runsWithHelp` | [orbit-app/src/components/RoutineCalendarPage.tsx:883](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:883) |
| Stop if still running after | `calendar.ui.stopIfStillRunningAfter` | [orbit-app/src/components/RoutineCalendarPage.tsx:899](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:899) |
| Routine safety limit | `calendar.ui.routineSafetyLimit` | [orbit-app/src/components/RoutineCalendarPage.tsx:900](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:900) |
| No limit | `calendar.ui.noLimit` | [orbit-app/src/components/RoutineCalendarPage.tsx:901](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:901) |
| Optional. The clock starts when work actually begins and does not control how often the routine starts. | `calendar.ui.optionalTheClockStartsWhenWork` | [orbit-app/src/components/RoutineCalendarPage.tsx:905](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:905) |
| If the previous run is still working | `routines.overlapLabel` | [orbit-app/src/components/RoutineCalendarPage.tsx:909](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:909) |
| Skip this occurrence | `routines.overlapSkip` | [orbit-app/src/components/RoutineCalendarPage.tsx:910](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:910) |
| Queue one run | `routines.overlapQueue` | [orbit-app/src/components/RoutineCalendarPage.tsx:911](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:911) |
| Choose a group | `calendar.ui.chooseAGroup` | [orbit-app/src/components/RoutineCalendarPage.tsx:928](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:928) |
| Select a group | `calendar.ui.selectAGroup` | [orbit-app/src/components/RoutineCalendarPage.tsx:931](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:931) |
| Create a group from the sidebar first, then come back to schedule its goal. | `calendar.ui.createAGroupFromTheSidebar` | [orbit-app/src/components/RoutineCalendarPage.tsx:935](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:935) |
| Choose the lead | `calendar.ui.chooseTheLead` | [orbit-app/src/components/RoutineCalendarPage.tsx:940](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:940) |
| This group has no active members. Add or restore a bot before scheduling the goal. | `calendar.ui.thisGroupHasNoActiveMembers` | [orbit-app/src/components/RoutineCalendarPage.tsx:947](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:947) |
| Create your first bot | `calendar.ui.createYourFirstBot` | [orbit-app/src/components/RoutineCalendarPage.tsx:1158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1158) |
| A calendar event needs at least one bot. | `calendar.ui.aCalendarEventNeedsAtLeast` | [orbit-app/src/components/RoutineCalendarPage.tsx:963](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:963) |
| Use the group’s shared context | `calendar.ui.useTheGroupSSharedContext` | [orbit-app/src/components/RoutineCalendarPage.tsx:983](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:983) |
| Team goals cannot carry routine attachments. Put shared context in the goal instructions or the group instructions. | `calendar.ui.teamGoalsCannotCarryRoutineAttachments` | [orbit-app/src/components/RoutineCalendarPage.tsx:984](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:984) |
| Add attachment | `calendar.ui.addAttachment` | [orbit-app/src/components/RoutineCalendarPage.tsx:988](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:988) |
| Runs on this computer | `calendar.ui.runsOnThisComputer` | [orbit-app/src/components/RoutineCalendarPage.tsx:1007](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1007) |
| Orbit keeps the group and its member hand-offs together for the full goal. | `calendar.ui.orbitKeepsTheGroupAndIts` | [orbit-app/src/components/RoutineCalendarPage.tsx:1008](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1008) |
| Bot’s current setup | `calendar.ui.botSCurrentSetup` | [orbit-app/src/components/RoutineCalendarPage.tsx:1011](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1011) |
| Keeps its model and configured computer, including a self-hosted VPS. | `calendar.ui.keepsItsModelAndConfiguredComputer` | [orbit-app/src/components/RoutineCalendarPage.tsx:1011](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1011) |
| Boat-hosted agent | `calendar.ui.boatHostedAgent` | [orbit-app/src/components/RoutineCalendarPage.tsx:1012](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1012) |
| Switches to the Boat runner, not your VPS. Orbit must stay running to launch it. | `calendar.ui.switchesToTheBoatRunnerNot` | [orbit-app/src/components/RoutineCalendarPage.tsx:1012](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1012) |
| Cancel | `calendar.ui.cancel` | [orbit-app/src/components/RoutineCalendarPage.tsx:1022](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1022) |
| Quick create | `calendar.ui.quickCreate` | [orbit-app/src/components/RoutineCalendarPage.tsx:1137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1137) |
| New calendar event | `calendar.ui.newCalendarEvent` | [orbit-app/src/components/RoutineCalendarPage.tsx:1139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1139) |
| Add title | `calendar.ui.addTitle` | [orbit-app/src/components/RoutineCalendarPage.tsx:1143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1143) |
| Then come back to schedule it. | `calendar.ui.thenComeBackToScheduleIt` | [orbit-app/src/components/RoutineCalendarPage.tsx:1159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1159) |
| Assign a bot | `calendar.ui.assignABot` | [orbit-app/src/components/RoutineCalendarPage.tsx:1163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1163) |
| Choose repeating schedules and other options | `calendar.ui.chooseRepeatingSchedulesAndOtherOptions` | [orbit-app/src/components/RoutineCalendarPage.tsx:1178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1178) |
| More options | `calendar.ui.moreOptions` | [orbit-app/src/components/RoutineCalendarPage.tsx:1178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1178) |
| Resize event | `calendar.ui.resizeEvent` | [orbit-app/src/components/RoutineCalendarPage.tsx:1281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1281) |
| Routine and call calendar | `calendar.ui.routineAndCallCalendar` | [orbit-app/src/components/RoutineCalendarPage.tsx:1383](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1383) |
| Calendar event details | `calendar.ui.calendarEventDetails` | [orbit-app/src/components/RoutineCalendarPage.tsx:1534](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1534) |
| Team goal group | `calendar.ui.teamGoalGroup` | [orbit-app/src/components/RoutineCalendarPage.tsx:1563](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1563) |
| Run limit | `calendar.ui.runLimit` | [orbit-app/src/components/RoutineCalendarPage.tsx:1570](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1570) |
| This run is waiting. Open its execution thread for more context. | `calendar.ui.thisRunIsWaitingOpenIts` | [orbit-app/src/components/RoutineCalendarPage.tsx:1573](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1573) |
| Join group | `calendar.ui.joinGroup` | [orbit-app/src/components/RoutineCalendarPage.tsx:1579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1579) |
| Open group | `calendar.ui.openGroup` | [orbit-app/src/components/RoutineCalendarPage.tsx:1580](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1580) |
| Open results thread | `routines.results.open` | [orbit-app/src/components/RoutineCalendarPage.tsx:1583](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1583) |
| Run logs | `routines.logs` | [orbit-app/src/components/RoutineCalendarPage.tsx:1873](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1873) |
| Cancel run | `calendar.ui.cancelRun` | [orbit-app/src/components/RoutineCalendarPage.tsx:1585](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1585) |
| Edit | `calendar.ui.edit` | [orbit-app/src/components/RoutineCalendarPage.tsx:1632](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1632) |
| Delete | `calendar.ui.delete` | [orbit-app/src/components/RoutineCalendarPage.tsx:1589](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1589) |
| Paused routines | `calendar.ui.pausedRoutines` | [orbit-app/src/components/RoutineCalendarPage.tsx:1616](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1616) |
| Group | `calendar.ui.group` | [orbit-app/src/components/RoutineCalendarPage.tsx:1630](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1630) |
| Resume | `calendar.ui.resume` | [orbit-app/src/components/RoutineCalendarPage.tsx:1631](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1631) |
| Schedule view | `calendar.ui.scheduleView` | [orbit-app/src/components/RoutineCalendarPage.tsx:1831](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1831) |
| List | `calendar.view.list` | [orbit-app/src/components/RoutineCalendarPage.tsx:1832](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1832) |
| Calendar | `calendar.view.calendar` | [orbit-app/src/components/RoutineCalendarPage.tsx:1832](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1832) |
| Previous dates | `calendar.ui.previousDates` | [orbit-app/src/components/RoutineCalendarPage.tsx:1839](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1839) |
| Today | `calendar.today` | [orbit-app/src/components/RoutineCalendarPage.tsx:1840](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1840) |
| Next dates | `calendar.ui.nextDates` | [orbit-app/src/components/RoutineCalendarPage.tsx:1841](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1841) |
| {count} running | `calendar.running` | [orbit-app/src/components/RoutineCalendarPage.tsx:1972](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1972) |
| Open problem run logs | `calendar.ui.openProblemRunLogs` | [orbit-app/src/components/RoutineCalendarPage.tsx:1846](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1846) |
| View paused routines | `calendar.ui.viewPausedRoutines` | [orbit-app/src/components/RoutineCalendarPage.tsx:1847](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1847) |
| {count} paused | `calendar.paused` | [orbit-app/src/components/RoutineCalendarPage.tsx:1847](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1847) |
| All bots | `calendar.allBots` | [orbit-app/src/components/RoutineCalendarPage.tsx:1849](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1849) |
| Day | `calendar.range.day` | [orbit-app/src/components/RoutineCalendarPage.tsx:1851](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1851) |
| 3 days | `calendar.range.three` | [orbit-app/src/components/RoutineCalendarPage.tsx:1851](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1851) |
| Week | `calendar.range.week` | [orbit-app/src/components/RoutineCalendarPage.tsx:1851](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1851) |
| Couldn't refresh routines. Retrying… Saved information may be out of date. | `routines.loadError` | [orbit-app/src/components/RoutineCalendarPage.tsx:1853](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1853) |
| Loading routines… | `routines.loading` | [orbit-app/src/components/RoutineCalendarPage.tsx:1854](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1854) |
| Back | `calendar.ui.back` | [orbit-app/src/components/RoutineCalendarPage.tsx:1864](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1864) |
| Calendar | `calendar.title` | [orbit-app/src/components/RoutineCalendarPage.tsx:1867](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1867) |
| Automation type | `calendar.ui.automationType` | [orbit-app/src/components/RoutineCalendarPage.tsx:1870](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1870) |
| Scheduled routines | `calendar.tab.routines` | [orbit-app/src/components/RoutineCalendarPage.tsx:1872](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1872) |
| Schedule | `calendar.tab.schedule` | [orbit-app/src/components/RoutineCalendarPage.tsx:1872](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1872) |
| Webhooks | `calendar.tab.webhooks` | [orbit-app/src/components/RoutineCalendarPage.tsx:1874](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1874) |
| Mark all as read | `routines.markAllSeen` | [orbit-app/src/components/RoutineCalendarPage.tsx:1886](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1886) |
| Create an automation | `calendar.ui.createAnAutomation` | [orbit-app/src/components/RoutineCalendarPage.tsx:1888](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1888) |
| New | `calendar.new` | [orbit-app/src/components/RoutineCalendarPage.tsx:1890](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1890) |
| New automation | `calendar.ui.newAutomation` | [orbit-app/src/components/RoutineCalendarPage.tsx:1892](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1892) |
| Scheduled task | `calendar.new.task` | [orbit-app/src/components/RoutineCalendarPage.tsx:1894](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1894) |
| Ask a bot to do something later. | `calendar.new.taskSub` | [orbit-app/src/components/RoutineCalendarPage.tsx:1894](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1894) |
| Scheduled call | `calendar.new.call` | [orbit-app/src/components/RoutineCalendarPage.tsx:1895](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1895) |
| Bring bots together at a set time. | `calendar.new.callSub` | [orbit-app/src/components/RoutineCalendarPage.tsx:1895](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1895) |
| Webhook | `calendar.new.webhook` | [orbit-app/src/components/RoutineCalendarPage.tsx:1896](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1896) |
| Start a task when another app sends an event. | `calendar.new.webhookSub` | [orbit-app/src/components/RoutineCalendarPage.tsx:1896](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1896) |
| Routines | `calendar.routinesLabel` | [orbit-app/src/components/RoutineCalendarPage.tsx:1920](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1920) |
| Scheduled calls | `calendar.ui.scheduledCalls` | [orbit-app/src/components/RoutineCalendarPage.tsx:1923](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1923) |
| Scheduled calls | `calendar.callsLabel` | [orbit-app/src/components/RoutineCalendarPage.tsx:1924](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1924) |
| next {when} | `calendar.next` | [orbit-app/src/components/RoutineCalendarPage.tsx:1973](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1973) |
| Keep this computer awake for routines. | `calendar.ui.keepThisComputerAwakeForRoutines` | [orbit-app/src/components/RoutineCalendarPage.tsx:2017](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:2017) |
| Keep this computer awake for scheduled routines | `calendar.ui.keepThisComputerAwakeForScheduled` | [orbit-app/src/components/RoutineCalendarPage.tsx:2022](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:2022) |

## orbit-app/src/components/RoutineRunCard.tsx

Fonte: [orbit-app/src/components/RoutineRunCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineRunCard.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Show report | `routines.results.showReport` | [orbit-app/src/components/RoutineRunCard.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineRunCard.tsx:105) |

## orbit-app/src/components/routines/CalendarSidebar.tsx

Fonte: [orbit-app/src/components/routines/CalendarSidebar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Schedule sidebar | `calendarSidebar.ui.scheduleSidebar` | [orbit-app/src/components/routines/CalendarSidebar.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:34) |
| Bots | `calendar.bots` | [orbit-app/src/components/routines/CalendarSidebar.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:44) |
| Search bots | `calendar.searchBots` | [orbit-app/src/components/routines/CalendarSidebar.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:60) |
| Bots available to schedule | `calendarSidebar.ui.botsAvailableToSchedule` | [orbit-app/src/components/routines/CalendarSidebar.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:65) |
| Drag {name} onto the schedule | `calendar.dragBot` | [orbit-app/src/components/routines/CalendarSidebar.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:74) |
| Create a bot to schedule work. | `calendar.noBots` | [orbit-app/src/components/routines/CalendarSidebar.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:91) |
| No bots match your search. | `calendar.noBotsMatch` | [orbit-app/src/components/routines/CalendarSidebar.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:91) |
| Drag a bot onto any time to schedule it. | `calendar.dragHint` | [orbit-app/src/components/routines/CalendarSidebar.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:97) |

## orbit-app/src/components/routines/CronScheduleFields.tsx

Fonte: [orbit-app/src/components/routines/CronScheduleFields.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Cron expression | `cron.ui.cronExpression` | [orbit-app/src/components/routines/CronScheduleFields.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:34) |
| Minute · hour · day of month · month · day of week. For example, 0 9 1 * * runs at 9 am on the first of each month. | `cron.ui.minuteHourDayOfMonthMonth` | [orbit-app/src/components/routines/CronScheduleFields.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:36) |
| Month | `cron.ui.month` | [orbit-app/src/components/routines/CronScheduleFields.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:38) |
| Day of month | `cron.ui.dayOfMonth` | [orbit-app/src/components/routines/CronScheduleFields.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:39) |
| Last day | `cron.ui.lastDay` | [orbit-app/src/components/routines/CronScheduleFields.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:39) |
| Time | `cron.ui.time` | [orbit-app/src/components/routines/CronScheduleFields.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:40) |
| Months without this date are skipped. Choose Last day to always use the end of the month. | `cron.ui.monthsWithoutThisDateAreSkipped` | [orbit-app/src/components/routines/CronScheduleFields.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:42) |
| Time zone | `cron.ui.timeZone` | [orbit-app/src/components/routines/CronScheduleFields.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:43) |
| America/New_York | `cron.ui.americaNewYork` | [orbit-app/src/components/routines/CronScheduleFields.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:43) |

## orbit-app/src/components/routines/MiniMonth.tsx

Fonte: [orbit-app/src/components/routines/MiniMonth.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/MiniMonth.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Mini calendar | `miniMonth.ui.miniCalendar` | [orbit-app/src/components/routines/MiniMonth.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/MiniMonth.tsx:57) |
| Previous month | `miniMonth.ui.previousMonth` | [orbit-app/src/components/routines/MiniMonth.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/MiniMonth.tsx:65) |
| Next month | `miniMonth.ui.nextMonth` | [orbit-app/src/components/routines/MiniMonth.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/MiniMonth.tsx:73) |

## orbit-app/src/components/routines/ResultsDestination.tsx

Fonte: [orbit-app/src/components/routines/ResultsDestination.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| No folder | `folder.none` | [orbit-app/src/components/routines/ResultsDestination.tsx:15](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:15) |
| Post results to | `routines.results.label` | [orbit-app/src/components/routines/ResultsDestination.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:17) |
| Keep current destination | `routines.results.keep` | [orbit-app/src/components/routines/ResultsDestination.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:21) |
| Create a dedicated results thread | `routines.results.new` | [orbit-app/src/components/routines/ResultsDestination.tsx:22](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:22) |
| Thread unavailable — choose another | `routines.results.unavailable` | [orbit-app/src/components/routines/ResultsDestination.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:23) |
| Each run starts with fresh context. Dated results collect here; full execution details stay in Run logs. A dedicated results thread is reused for every run and can be moved into a folder. | `routines.results.help` | [orbit-app/src/components/routines/ResultsDestination.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:31) |

## orbit-app/src/components/routines/RoutineList.tsx

Fonte: [orbit-app/src/components/routines/RoutineList.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Routine list | `routines.list` | [orbit-app/src/components/routines/RoutineList.tsx:22](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:22) |
| Couldn't refresh routines. Retrying… Saved information may be out of date. | `routines.loadError` | [orbit-app/src/components/routines/RoutineList.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:23) |
| Loading routines… | `routines.loading` | [orbit-app/src/components/routines/RoutineList.tsx:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:24) |
| No schedules yet. | `routines.empty` | [orbit-app/src/components/routines/RoutineList.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:25) |
| Recent consecutive failures: {count} | `routines.failureStreak` | [orbit-app/src/components/routines/RoutineList.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:40) |
| Scheduled occurrences skipped while busy: {count} | `routines.skippedRuns` | [orbit-app/src/components/routines/RoutineList.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:42) |
| Last: {date} | `routines.lastSkipped` | [orbit-app/src/components/routines/RoutineList.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:43) |
| Latest: {status} | `routines.latestRun` | [orbit-app/src/components/routines/RoutineList.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:53) |
| Not run yet | `routines.neverRun` | [orbit-app/src/components/routines/RoutineList.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:54) |
| Run logs for {name} | `routines.logsFor` | [orbit-app/src/components/routines/RoutineList.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:56) |
| Run logs | `routines.logs` | [orbit-app/src/components/routines/RoutineList.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:56) |

## orbit-app/src/components/routines/RoutineLogs.tsx

Fonte: [orbit-app/src/components/routines/RoutineLogs.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Run logs | `routines.logs` | [orbit-app/src/components/routines/RoutineLogs.tsx:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:26) |
| Recent saved runs across your bots. Open a run for its result, error, and execution thread. | `routines.logsHint` | [orbit-app/src/components/routines/RoutineLogs.tsx:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:26) |
| Search run logs | `routines.searchLogs` | [orbit-app/src/components/routines/RoutineLogs.tsx:28](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:28) |
| Filter runs by status | `routines.filterStatus` | [orbit-app/src/components/routines/RoutineLogs.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:29) |
| All statuses | `routines.allStatuses` | [orbit-app/src/components/routines/RoutineLogs.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:29) |
| Problems | `routines.status.problems` | [orbit-app/src/components/routines/RoutineLogs.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:29) |
| Showing one routine's runs. | `routines.filteredRoutine` | [orbit-app/src/components/routines/RoutineLogs.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:31) |
| Show all routines | `routines.showAll` | [orbit-app/src/components/routines/RoutineLogs.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:31) |
| Couldn't refresh routines. Retrying… Saved information may be out of date. | `routines.loadError` | [orbit-app/src/components/routines/RoutineLogs.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:32) |
| Loading routines… | `routines.loading` | [orbit-app/src/components/routines/RoutineLogs.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:33) |
| No runs match these filters. | `routines.noMatchingRuns` | [orbit-app/src/components/routines/RoutineLogs.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:34) |
| No runs recorded yet. Results will appear here after a routine starts. | `routines.noRuns` | [orbit-app/src/components/routines/RoutineLogs.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:34) |
| Open {name} run: {status} | `routines.openRun` | [orbit-app/src/components/routines/RoutineLogs.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:37) |
| Unseen failure | `routines.unread` | [orbit-app/src/components/routines/RoutineLogs.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:38) |
| Bot unavailable | `routines.unavailableBot` | [orbit-app/src/components/routines/RoutineLogs.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:38) |
| No output recorded yet. | `routines.noOutput` | [orbit-app/src/components/routines/RoutineLogs.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:39) |
| Show more runs | `routines.loadMore` | [orbit-app/src/components/routines/RoutineLogs.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:42) |

## orbit-app/src/components/RunLog.tsx

Fonte: [orbit-app/src/components/RunLog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Recorded activity for this conversation. Commands may be shortened; Events and Raw contain the recorded technical details. | `inspector.run.hint` | [orbit-app/src/components/RunLog.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:30) |
| Copy redacted run log | `inspector.run.copy` | [orbit-app/src/components/RunLog.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:35) |
| Showing the latest {count} entries. | `inspector.run.recent` | [orbit-app/src/components/RunLog.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:44) |
| No recorded activity in this conversation yet. | `inspector.run.empty` | [orbit-app/src/components/RunLog.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:45) |
| Run log | `inspector.run.title` | [orbit-app/src/components/RunLog.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:46) |
| User input | `inspector.run.userInput` | [orbit-app/src/components/RunLog.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:49) |
| Screen observed | `inspector.run.screen` | [orbit-app/src/components/RunLog.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:50) |
| Response recorded | `inspector.run.response` | [orbit-app/src/components/RunLog.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:51) |

## orbit-app/src/components/ScreenFrame.tsx

Fonte: [orbit-app/src/components/ScreenFrame.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ScreenFrame.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Bot's screen | `chat.botScreen` | [orbit-app/src/components/ScreenFrame.tsx:15](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ScreenFrame.tsx:15) |
| Preview {name} | `attach.previewAria` | [orbit-app/src/components/ScreenFrame.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ScreenFrame.tsx:29) |

## orbit-app/src/components/SecretRequestCard.tsx

Fonte: [orbit-app/src/components/SecretRequestCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This request was replaced by a newer one for the same key. Use the newest card to provide it. | `secretRequestCard.ui.supersededDescription` | [orbit-app/src/components/SecretRequestCard.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:33) |
| Superseded | `secretRequestCard.ui.supersededBadge` | [orbit-app/src/components/SecretRequestCard.tsx:126](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:126) |
| Not now | `secretRequest.ui.notNow` | [orbit-app/src/components/SecretRequestCard.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:144) |
| This key must be saved on the host computer. Open this conversation on the host to continue securely. | `secretRequestCard.ui.thisKeyMustBeSavedOn` | [orbit-app/src/components/SecretRequestCard.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:153) |
| Superseded by a newer request | `secretRequestCard.ui.supersededFooter` | [orbit-app/src/components/SecretRequestCard.tsx:212](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:212) |

## orbit-app/src/components/ServerPairingCard.tsx

Fonte: [orbit-app/src/components/ServerPairingCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| just now | `remote.serverPairing.justNow` | [orbit-app/src/components/ServerPairingCard.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:47) |
| {minutes} min ago | `remote.serverPairing.minutesAgo` | [orbit-app/src/components/ServerPairingCard.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:48) |
| {hours} h ago | `remote.serverPairing.hoursAgo` | [orbit-app/src/components/ServerPairingCard.tsx:49](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:49) |
| {days} d ago | `remote.serverPairing.daysAgo` | [orbit-app/src/components/ServerPairingCard.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:50) |
| Could not talk to the server: {error} | `remote.serverPairing.error` | [orbit-app/src/components/ServerPairingCard.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:135) |
| Pair a phone or another computer | `remote.serverPairing.title` | [orbit-app/src/components/ServerPairingCard.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:150) |
| Full access | `remote.serverPairing.scope.admin` | [orbit-app/src/components/ServerPairingCard.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:205) |
| Chat and approvals only | `remote.serverPairing.scope.client` | [orbit-app/src/components/ServerPairingCard.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:205) |
| Creating… | `remote.serverPairing.creating` | [orbit-app/src/components/ServerPairingCard.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:161) |
| Create pairing code | `remote.serverPairing.create` | [orbit-app/src/components/ServerPairingCard.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:161) |
| People sign in to this hosted workspace through your organisation's portal, so pairing codes are turned off. To add someone, invite them in your organisation's Admin. | `remote.serverPairing.portal` | [orbit-app/src/components/ServerPairingCard.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:163) |
| That code expired. Create a new one. | `remote.serverPairing.expired` | [orbit-app/src/components/ServerPairingCard.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:167) |
| Expires in {minutes} min | `remote.serverPairing.expires` | [orbit-app/src/components/ServerPairingCard.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:177) |
| Copied | `remote.serverPairing.copied` | [orbit-app/src/components/ServerPairingCard.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:182) |
| Copy link | `remote.serverPairing.copyLink` | [orbit-app/src/components/ServerPairingCard.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:182) |
| This server has no public address for a link yet: open /pair on the address you use and type the code. | `remote.serverPairing.noLink` | [orbit-app/src/components/ServerPairingCard.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:186) |
| No devices paired yet. | `remote.serverPairing.noDevices` | [orbit-app/src/components/ServerPairingCard.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:195) |
| seen {when} | `remote.serverPairing.seen` | [orbit-app/src/components/ServerPairingCard.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:207) |
| this browser | `remote.serverPairing.thisBrowser` | [orbit-app/src/components/ServerPairingCard.tsx:208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:208) |
| Sign out | `remote.serverPairing.signOut` | [orbit-app/src/components/ServerPairingCard.tsx:213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:213) |

## orbit-app/src/components/SettingsModal.tsx

Fonte: [orbit-app/src/components/SettingsModal.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:1). 19 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Your name | `settings.profile.name` | [orbit-app/src/components/SettingsModal.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:108) |
| Email | `phone.signIn.email` | [orbit-app/src/components/SettingsModal.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:111) |
| Checking… | `settings.updates.checking` | [orbit-app/src/components/SettingsModal.tsx:129](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:129) |
| {version} available | `settings.updates.available` | [orbit-app/src/components/SettingsModal.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:131) |
| Starting download… | `settings.updates.startingDownload` | [orbit-app/src/components/SettingsModal.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:134) |
| Downloading {percent}% | `settings.updates.downloading` | [orbit-app/src/components/SettingsModal.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:135) |
| Download complete. macOS is preparing the update. | `settings.updates.preparing` | [orbit-app/src/components/SettingsModal.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:137) |
| {version} ready — install in a terminal | `settings.updates.readyInstall` | [orbit-app/src/components/SettingsModal.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:140) |
| {version} ready — restart to apply | `settings.updates.ready` | [orbit-app/src/components/SettingsModal.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:141) |
| Opening a terminal… | `settings.updates.openingTerminal` | [orbit-app/src/components/SettingsModal.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:145) |
| Restarting to update… | `settings.updates.restarting` | [orbit-app/src/components/SettingsModal.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:146) |
| Command copied — finish the update in your terminal. | `settings.updates.handedOff` | [orbit-app/src/components/SettingsModal.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:148) |
| Update failed: {message} | `settings.updates.failed` | [orbit-app/src/components/SettingsModal.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:150) |
| unknown error | `settings.updates.unknownError` | [orbit-app/src/components/SettingsModal.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:150) |
| You're on the latest version we know of. | `settings.updates.latest` | [orbit-app/src/components/SettingsModal.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:151) |
| Updates | `settings.updates.title` | [orbit-app/src/components/SettingsModal.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:153) |
| Quit and reopen the app | `settings.updates.quitReopen` | [orbit-app/src/components/SettingsModal.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:167) |
| Download | `settings.updates.download` | [orbit-app/src/components/SettingsModal.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:169) |
| Install | `settings.updates.install` | [orbit-app/src/components/SettingsModal.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:172) |
| Restart and install | `settings.updates.restart` | [orbit-app/src/components/SettingsModal.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:173) |
| Preparing… | `settings.updates.preparingShort` | [orbit-app/src/components/SettingsModal.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:175) |
| Opening… | `settings.updates.opening` | [orbit-app/src/components/SettingsModal.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:178) |
| Restarting… | `settings.updates.restartingShort` | [orbit-app/src/components/SettingsModal.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:179) |
| Check for updates | `settings.updates.check` | [orbit-app/src/components/SettingsModal.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:180) |
| Could not save the effort for new bots. | `settings.newBotEffort.error` | [orbit-app/src/components/SettingsModal.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:205) |
| Effort for new bots | `settings.newBotEffort.title` | [orbit-app/src/components/SettingsModal.tsx:213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:213) |
| How hard every new bot thinks from its first message. A bot can change its own level; engines without this level keep their default. | `settings.newBotEffort.subtitle` | [orbit-app/src/components/SettingsModal.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:214) |
| Effort for new bots | `settings.newBotEffort.aria` | [orbit-app/src/components/SettingsModal.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:220) |
| Engine default | `settings.newBotEffort.default` | [orbit-app/src/components/SettingsModal.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:224) |
| Replay app tour | `settings.welcome.appTour` | [orbit-app/src/components/SettingsModal.tsx:253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:253) |
| Couldn't save your progress. Try again, or skip the tour. | `onboarding.tour.error` | [orbit-app/src/components/SettingsModal.tsx:255](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:255) |
| Welcome tour | `settings.welcome.title` | [orbit-app/src/components/SettingsModal.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:263) |
| The first-run walkthrough: engines, permissions, phone, and your first bot. | `settings.welcome.subtitle` | [orbit-app/src/components/SettingsModal.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:263) |
| Replay welcome tour | `settings.welcome.replay` | [orbit-app/src/components/SettingsModal.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:270) |
| Language | `settings.language.title` | [orbit-app/src/components/SettingsModal.tsx:286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:286) |
| The app follows your system language unless you pick one here. Only part of the interface is translated so far — untranslated text stays in English. | `settings.language.subtitle` | [orbit-app/src/components/SettingsModal.tsx:287](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:287) |
| App language | `settings.language.aria` | [orbit-app/src/components/SettingsModal.tsx:291](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:291) |
| System | `settings.language.system` | [orbit-app/src/components/SettingsModal.tsx:295](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:295) |
| Notification sounds | `settings.notificationSounds.title` | [orbit-app/src/components/SettingsModal.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:309) |
| Play this computer's alert sound when an agent finishes or needs you. Turn it off to keep the banners but lose the chime — handy on a call, where the agent is already talking to you. | `settings.notificationSounds.subtitle` | [orbit-app/src/components/SettingsModal.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:309) |
| Notification sounds | `settings.notificationSounds.play` | [orbit-app/src/components/SettingsModal.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:312) |
| Interface font | `settings.font.title` | [orbit-app/src/components/SettingsModal.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:322) |
| Overrides the skin's font on this machine. Poppins is used when it is installed. | `settings.font.subtitle` | [orbit-app/src/components/SettingsModal.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:322) |
| Interface font | `settings.font.aria` | [orbit-app/src/components/SettingsModal.tsx:325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:325) |
| Threads | `settings.threadDisplay.title` | [orbit-app/src/components/SettingsModal.tsx:345](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:345) |
| Show thread lists and controls on this device only. Hiding them keeps all conversation history and running work; channels are unchanged. Turn this back on to access your threads again. | `settings.threadDisplay.subtitle` | [orbit-app/src/components/SettingsModal.tsx:345](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:345) |
| Show threads | `settings.threadDisplay.show` | [orbit-app/src/components/SettingsModal.tsx:348](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:348) |
| Could not save the routine setting. | `settings.routinesInConversation.error` | [orbit-app/src/components/SettingsModal.tsx:372](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:372) |
| Routines in the conversation | `settings.routinesInConversation.title` | [orbit-app/src/components/SettingsModal.tsx:380](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:380) |
| Run a routine in the chat it reports to, as ordinary messages. Off by default — the work stays in a hidden thread, and the chat only gets the status card. | `settings.routinesInConversation.subtitle` | [orbit-app/src/components/SettingsModal.tsx:381](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:381) |
| Run routines in the conversation | `settings.routinesInConversation.aria` | [orbit-app/src/components/SettingsModal.tsx:386](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:386) |
| Could not save the tool-call setting. | `settings.toolCalls.error` | [orbit-app/src/components/SettingsModal.tsx:412](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:412) |
| Tool calls | `settings.toolCalls.title` | [orbit-app/src/components/SettingsModal.tsx:420](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:420) |
| Show each tool a bot runs in the transcript. Off by default — the mascot already shows that work is happening. | `settings.toolCalls.subtitle` | [orbit-app/src/components/SettingsModal.tsx:421](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:421) |
| Named chips for Bash, search, and other tools. Errors and bot-to-bot messages still appear. | `settings.toolCalls.detail` | [orbit-app/src/components/SettingsModal.tsx:421](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:421) |
| Show tool calls in chat | `settings.toolCalls.aria` | [orbit-app/src/components/SettingsModal.tsx:426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:426) |
| Could not save the experimental feature setting. | `settings.experimental.error` | [orbit-app/src/components/SettingsModal.tsx:456](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:456) |
| Experimental features | `settings.experimental.title` | [orbit-app/src/components/SettingsModal.tsx:463](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:463) |
| Early features may change while we test them. Each one says whether it starts on or off. | `settings.experimental.subtitle` | [orbit-app/src/components/SettingsModal.tsx:463](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:463) |
| Bots may draft skills for your review | `settings.experimental.skillAuthoring` | [orbit-app/src/components/SettingsModal.tsx:466](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:466) |
| On by default. Save a bot's verification run as a skill from the Verify card, or ask a supported bot to run /create-verification-skill. Every change waits for your review. | `settings.experimental.skillAuthoringDetail` | [orbit-app/src/components/SettingsModal.tsx:468](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:468) |
| Allow bots to draft skills | `settings.experimental.skillAuthoringAria` | [orbit-app/src/components/SettingsModal.tsx:473](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:473) |
| Built-in browser | `settings.experimental.browser` | [orbit-app/src/components/SettingsModal.tsx:481](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:481) |
| Enabled for this workspace. Each bot also has its own browser switch. | `settings.experimental.browserOn` | [orbit-app/src/components/SettingsModal.tsx:485](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:485) |
| Off by default. Enable it to let supported bots use a browser tab you can watch and take over. | `settings.experimental.browserOff` | [orbit-app/src/components/SettingsModal.tsx:486](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:486) |
| Not available on this Windows machine yet: install the browser engine with `orbit browser install`. | `settings.experimental.browserWindows` | [orbit-app/src/components/SettingsModal.tsx:488](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:488) |
| Enable the built-in browser | `settings.experimental.browserAria` | [orbit-app/src/components/SettingsModal.tsx:494](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:494) |
| Browser profiles | `settings.profiles.title` | [orbit-app/src/components/SettingsModal.tsx:510](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:510) |
| Shared browser logins for your bots. Create a profile here, then choose it in a bot's Browser tab. | `settings.profiles.sharedSubtitle` | [orbit-app/src/components/SettingsModal.tsx:510](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:510) |
| Saved to {path} | `settings.diagnostics.saved` | [orbit-app/src/components/SettingsModal.tsx:529](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:529) |
| Diagnostics | `settings.diagnostics.title` | [orbit-app/src/components/SettingsModal.tsx:539](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:539) |
| Versions, configuration on/off state and redacted server, desktop and updater log tails. Review the file before sharing it. | `settings.diagnostics.subtitle` | [orbit-app/src/components/SettingsModal.tsx:540](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:540) |
| Export diagnostics to a text file | `settings.diagnostics.aria` | [orbit-app/src/components/SettingsModal.tsx:550](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:550) |
| Exporting… | `settings.diagnostics.exporting` | [orbit-app/src/components/SettingsModal.tsx:553](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:553) |
| Export Diagnostics… | `settings.diagnostics.export` | [orbit-app/src/components/SettingsModal.tsx:553](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:553) |
| Profile | `settings.profile.title` | [orbit-app/src/components/SettingsModal.tsx:571](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:571) |
| Your details and shared context. Saved as you go. | `settings.profile.sharedSubtitle` | [orbit-app/src/components/SettingsModal.tsx:571](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:571) |
| Group turns | `settings.roomTurns.title` | [orbit-app/src/components/SettingsModal.tsx:580](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:580) |
| Set one maximum duration for every bot turn in a group. | `settings.roomTurns.subtitle` | [orbit-app/src/components/SettingsModal.tsx:580](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:580) |
| Skin | `settings.skin.title` | [orbit-app/src/components/SettingsModal.tsx:597](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:597) |
| Applies instantly and is remembered on this machine. | `settings.skin.subtitle` | [orbit-app/src/components/SettingsModal.tsx:597](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:597) |
| Connections | `settings.connections.title` | [orbit-app/src/components/SettingsModal.tsx:618](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:618) |
| Connected apps use your own Composio API key. Every key stays on this computer. | `settings.connections.subtitle` | [orbit-app/src/components/SettingsModal.tsx:619](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:619) |
| Model providers | `keys.providers.title` | [orbit-app/src/components/SettingsModal.tsx:622](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:622) |
| Keys every bot in this workspace runs on, billed per token to your provider account. While an Anthropic key is saved, Claude bots use it instead of a personal login. Codex always uses a personal ChatGPT login. | `keys.providers.subtitle` | [orbit-app/src/components/SettingsModal.tsx:623](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:623) |
| Integrations | `keys.integrations.title` | [orbit-app/src/components/SettingsModal.tsx:629](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:629) |
| Settings | `settings.title` | [orbit-app/src/components/SettingsModal.tsx:839](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:839) |
| Search | `settings.search` | [orbit-app/src/components/SettingsModal.tsx:810](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:810) |
| Search settings | `settings.searchAria` | [orbit-app/src/components/SettingsModal.tsx:811](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:811) |
| Nothing matches “{query}” | `settings.noMatch` | [orbit-app/src/components/SettingsModal.tsx:817](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:817) |
| Close settings | `settings.close` | [orbit-app/src/components/SettingsModal.tsx:857](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:857) |

## orbit-app/src/components/SettingsPrimitives.tsx

Fonte: [orbit-app/src/components/SettingsPrimitives.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsPrimitives.tsx:1). 2 linhas com controlos reconhecidos.

## orbit-app/src/components/ShareTeamDialog.tsx

Fonte: [orbit-app/src/components/ShareTeamDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:1). 11 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Bots | `teamShare.part.bots` | [orbit-app/src/components/ShareTeamDialog.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:29) |
| Skills · arrive switched off | `teamShare.part.skills` | [orbit-app/src/components/ShareTeamDialog.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:30) |
| Playbooks | `teamShare.part.playbooks` | [orbit-app/src/components/ShareTeamDialog.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:31) |
| Group chats | `teamShare.part.rooms` | [orbit-app/src/components/ShareTeamDialog.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:32) |
| Routines · arrive paused | `teamShare.part.routines` | [orbit-app/src/components/ShareTeamDialog.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:33) |
| Shared instructions | `teamShare.part.brief` | [orbit-app/src/components/ShareTeamDialog.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:34) |
| Included | `teamShare.yes` | [orbit-app/src/components/ShareTeamDialog.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:34) |
| None | `teamShare.none` | [orbit-app/src/components/ShareTeamDialog.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:37) |
| Chief of Staff | `teamShare.part.leader` | [orbit-app/src/components/ShareTeamDialog.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:35) |
| Connections · addresses only | `teamShare.part.connections` | [orbit-app/src/components/ShareTeamDialog.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:36) |
| Starter notes | `teamShare.part.notes` | [orbit-app/src/components/ShareTeamDialog.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:37) |
| What's in the file | `teamShare.included` | [orbit-app/src/components/ShareTeamDialog.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:42) |
| Never included: chat history, keys and passwords, model choices, computers, and who can see each bot. | `teamShare.never` | [orbit-app/src/components/ShareTeamDialog.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:53) |
| Removed what looked like a key or password from: | `teamShare.redacted` | [orbit-app/src/components/ShareTeamDialog.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:57) |
| Left out: | `teamShare.skipped` | [orbit-app/src/components/ShareTeamDialog.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:65) |
| General | `teamLibrary.general` | [orbit-app/src/components/ShareTeamDialog.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:179) |
| Share {name} | `teamShare.title` | [orbit-app/src/components/ShareTeamDialog.tsx:179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:179) |
| Saves the whole team as one file: its bots, their instructions and skills, group chats, routines and shared instructions. Send the file to someone to add in Templates → Import. | `teamShare.intro` | [orbit-app/src/components/ShareTeamDialog.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:180) |
| Close share team | `teamShare.close` | [orbit-app/src/components/ShareTeamDialog.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:182) |
| Saved {filename} | `teamShare.saved` | [orbit-app/src/components/ShareTeamDialog.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:187) |
| Send it to someone to add in Templates → Import. Share the team again after changes to make a new version. | `teamShare.savedHint` | [orbit-app/src/components/ShareTeamDialog.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:188) |
| Preparing the team… | `teamShare.preparing` | [orbit-app/src/components/ShareTeamDialog.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:197) |
| Include starter notes (each bot's MEMORY.md and topic notes) | `teamShare.includeNotes` | [orbit-app/src/components/ShareTeamDialog.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:202) |
| Starter notes are included. Anything that looks like a key or password is removed. Daily logs and chat history are not included. | `teamShare.notesIncluded` | [orbit-app/src/components/ShareTeamDialog.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:204) |
| Starter notes are not included. | `teamShare.notesExcluded` | [orbit-app/src/components/ShareTeamDialog.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:204) |
| Include skills | `teamShare.includeSkills` | [orbit-app/src/components/ShareTeamDialog.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:206) |
| This team's bots have no skills. | `teamShare.noSkills` | [orbit-app/src/components/ShareTeamDialog.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:207) |
| Name | `teamShare.name` | [orbit-app/src/components/ShareTeamDialog.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:220) |
| Version | `teamShare.release` | [orbit-app/src/components/ShareTeamDialog.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:223) |
| Use a higher version each time you share an update, such as 1.0.1. | `teamShare.releaseHint` | [orbit-app/src/components/ShareTeamDialog.tsx:227](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:227) |
| Release notes | `teamShare.notes` | [orbit-app/src/components/ShareTeamDialog.tsx:228](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:228) |
| Tagline | `teamShare.tagline` | [orbit-app/src/components/ShareTeamDialog.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:231) |
| Summary | `teamShare.summary` | [orbit-app/src/components/ShareTeamDialog.tsx:234](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:234) |
| Done | `teamShare.done` | [orbit-app/src/components/ShareTeamDialog.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:243) |
| Cancel | `common.cancel` | [orbit-app/src/components/ShareTeamDialog.tsx:246](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:246) |
| Saving… | `teamShare.saving` | [orbit-app/src/components/ShareTeamDialog.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:250) |
| Save file | `teamShare.save` | [orbit-app/src/components/ShareTeamDialog.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:250) |

## orbit-app/src/components/SidebarBotActivity.tsx

Fonte: [orbit-app/src/components/SidebarBotActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| New thread | `task.newShort` | [orbit-app/src/components/SidebarBotActivity.tsx:12](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:12) |
| Waiting | `task.waiting` | [orbit-app/src/components/SidebarBotActivity.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:153) |
| Working | `chat.activity.working` | [orbit-app/src/components/SidebarBotActivity.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:146) |
| Waiting on teammate | `task.waitingOnTeammate` | [orbit-app/src/components/SidebarBotActivity.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:117) |
| Queued | `task.queued` | [orbit-app/src/components/SidebarBotActivity.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:146) |
| Unread | `task.unread` | [orbit-app/src/components/SidebarBotActivity.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:147) |
| {title} · {name} · {status} | `attention.item` | [orbit-app/src/components/SidebarBotActivity.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:119) |
| Waiting for you… | `sidebar.preview.waiting` | [orbit-app/src/components/SidebarBotActivity.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:146) |
| Waiting on a teammate… | `sidebar.preview.waitingOnTeammate` | [orbit-app/src/components/SidebarBotActivity.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:146) |

## orbit-app/src/components/SidebarPhoneButton.tsx

Fonte: [orbit-app/src/components/SidebarPhoneButton.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Checking device status | `sidebar.phone.checking` | [orbit-app/src/components/SidebarPhoneButton.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:42) |
| Device status unavailable | `sidebar.phone.unavailable` | [orbit-app/src/components/SidebarPhoneButton.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:52) |
| Remote access off | `sidebar.phone.off` | [orbit-app/src/components/SidebarPhoneButton.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:60) |
| Pair a device | `sidebar.phone.pair` | [orbit-app/src/components/SidebarPhoneButton.tsx:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:66) |
| Device connected | `sidebar.phone.connectedOne` | [orbit-app/src/components/SidebarPhoneButton.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:74) |
| {count} devices connected | `sidebar.phone.connectedAll` | [orbit-app/src/components/SidebarPhoneButton.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:76) |
| {connected} of {count} devices connected | `sidebar.phone.connectedSome` | [orbit-app/src/components/SidebarPhoneButton.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:77) |
| Device paired — not connected | `sidebar.phone.disconnectedOne` | [orbit-app/src/components/SidebarPhoneButton.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:84) |
| {count} devices paired — none connected | `sidebar.phone.disconnectedMany` | [orbit-app/src/components/SidebarPhoneButton.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:85) |
| Device active recently | `sidebar.phone.recentOne` | [orbit-app/src/components/SidebarPhoneButton.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:99) |
| {count} devices active recently | `sidebar.phone.recentAll` | [orbit-app/src/components/SidebarPhoneButton.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:101) |
| {recent} of {count} devices active recently | `sidebar.phone.recentSome` | [orbit-app/src/components/SidebarPhoneButton.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:102) |
| Device paired — not recently active | `sidebar.phone.staleOne` | [orbit-app/src/components/SidebarPhoneButton.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:109) |
| {count} devices paired — none recently active | `sidebar.phone.staleMany` | [orbit-app/src/components/SidebarPhoneButton.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:110) |

## orbit-app/src/components/SidebarThreadRow.tsx

Fonte: [orbit-app/src/components/SidebarThreadRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:1). 11 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| just now | `task.updated.justNow` | [orbit-app/src/components/SidebarThreadRow.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:34) |
| {count} min ago | `task.updated.minutes` | [orbit-app/src/components/SidebarThreadRow.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:36) |
| {count} h ago | `task.updated.hours` | [orbit-app/src/components/SidebarThreadRow.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:40) |
| yesterday | `task.updated.yesterday` | [orbit-app/src/components/SidebarThreadRow.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:42) |
| {count} d ago | `task.updated.days` | [orbit-app/src/components/SidebarThreadRow.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:46) |
| opened by {name} | `task.openedBy` | [orbit-app/src/components/SidebarThreadRow.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:79) |
| closed by {name} | `task.closedBy` | [orbit-app/src/components/SidebarThreadRow.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:89) |
| Archived | `task.archived` | [orbit-app/src/components/SidebarThreadRow.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:311) |
| Snoozed | `task.snoozed` | [orbit-app/src/components/SidebarThreadRow.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:311) |
| Waiting | `task.waiting` | [orbit-app/src/components/SidebarThreadRow.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:322) |
| Waiting on teammate | `task.waitingOnTeammate` | [orbit-app/src/components/SidebarThreadRow.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:322) |
| Working | `chat.activity.working` | [orbit-app/src/components/SidebarThreadRow.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:322) |
| Queued | `task.queued` | [orbit-app/src/components/SidebarThreadRow.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:322) |
| Rename thread | `task.renameAria` | [orbit-app/src/components/SidebarThreadRow.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:335) |
| Closed | `task.closed` | [orbit-app/src/components/SidebarThreadRow.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:311) |
| Unread | `task.unread` | [orbit-app/src/components/SidebarThreadRow.tsx:323](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:323) |
| Pin | `sidebar.bot.pin` | [orbit-app/src/components/SidebarThreadRow.tsx:342](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:342) |
| Actions for {title} | `task.actions` | [orbit-app/src/components/SidebarThreadRow.tsx:331](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:331) |
| Copy link | `task.copyLink` | [orbit-app/src/components/SidebarThreadRow.tsx:334](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:334) |
| Move to folder | `folder.move` | [orbit-app/src/components/SidebarThreadRow.tsx:336](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:336) |
| Move {title} to folder | `folder.moveNamed` | [orbit-app/src/components/SidebarThreadRow.tsx:337](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:337) |
| No folder | `folder.none` | [orbit-app/src/components/SidebarThreadRow.tsx:339](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:339) |
| Unpin | `sidebar.bot.unpin` | [orbit-app/src/components/SidebarThreadRow.tsx:342](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:342) |
| Unarchive | `task.unarchive` | [orbit-app/src/components/SidebarThreadRow.tsx:343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:343) |
| Archive | `task.archive` | [orbit-app/src/components/SidebarThreadRow.tsx:343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:343) |
| Snooze | `task.snooze` | [orbit-app/src/components/SidebarThreadRow.tsx:345](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:345) |
| Until new activity | `task.snoozeUntilActivity` | [orbit-app/src/components/SidebarThreadRow.tsx:347](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:347) |
| Until 6 PM | `task.snoozeTonight` | [orbit-app/src/components/SidebarThreadRow.tsx:347](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:347) |
| Until 9 AM tomorrow | `task.snoozeTomorrow` | [orbit-app/src/components/SidebarThreadRow.tsx:347](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:347) |
| Stop snoozing | `task.stopSnoozing` | [orbit-app/src/components/SidebarThreadRow.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:352) |
| Delete thread | `task.deleteAria` | [orbit-app/src/components/SidebarThreadRow.tsx:355](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:355) |
| Delete thread? | `task.deleteConfirm` | [orbit-app/src/components/SidebarThreadRow.tsx:355](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:355) |
| “{title}” and its conversation will be deleted. This cannot be undone. | `task.deleteBody` | [orbit-app/src/components/SidebarThreadRow.tsx:355](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:355) |

## orbit-app/src/components/SignInAccessCard.tsx

Fonte: [orbit-app/src/components/SignInAccessCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not save: {error} | `remote.signInAccess.error` | [orbit-app/src/components/SignInAccessCard.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:77) |
| Enter an email address, or @domain for everyone at that domain. | `remote.signInAccess.invalid` | [orbit-app/src/components/SignInAccessCard.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:86) |
| Who can sign in with an email | `remote.signInAccess.title` | [orbit-app/src/components/SignInAccessCard.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:96) |
| People on this list sign in at /pair with a one-time code sent to their email. Full access is everything the owner can do; chat and approvals is for people who only talk to the bots. | `remote.signInAccess.subtitle` | [orbit-app/src/components/SignInAccessCard.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:96) |
| Send them this link: | `remote.signInAccess.link` | [orbit-app/src/components/SignInAccessCard.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:99) |
| name@company.com or @company.com | `remote.signInAccess.placeholder` | [orbit-app/src/components/SignInAccessCard.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:116) |
| Full access | `remote.serverPairing.scope.admin` | [orbit-app/src/components/SignInAccessCard.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:138) |
| Chat and approvals only | `remote.serverPairing.scope.client` | [orbit-app/src/components/SignInAccessCard.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:138) |
| Add | `remote.signInAccess.add` | [orbit-app/src/components/SignInAccessCard.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:127) |
| Nobody yet. Add an address, or @yourcompany.com for everyone at your company. | `remote.signInAccess.empty` | [orbit-app/src/components/SignInAccessCard.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:131) |
| Remove | `remote.signInAccess.remove` | [orbit-app/src/components/SignInAccessCard.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:141) |
| Changes apply immediately. Removing someone stops new sign-ins; their existing devices stay signed in until you sign them out above. | `remote.signInAccess.note` | [orbit-app/src/components/SignInAccessCard.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:147) |

## orbit-app/src/components/SkillRequestPreview.tsx

Fonte: [orbit-app/src/components/SkillRequestPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkillRequestPreview.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This proposal was created by an older build and cannot be safely applied. Deny it, then ask the bot to | `skillRequestPreview.ui.thisProposalWasCreatedByAn` | [orbit-app/src/components/SkillRequestPreview.tsx:11](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkillRequestPreview.tsx:11) |

## orbit-app/src/components/SkinPicker.tsx

Fonte: [orbit-app/src/components/SkinPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkinPicker.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/SoulField.tsx

Fonte: [orbit-app/src/components/SoulField.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Standing instructions (SOUL.md) | `soulField.ui.standingInstructionsSoulMd` | [orbit-app/src/components/SoulField.tsx:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:81) |
| Move instructions into SOUL.md | `soulField.ui.moveInstructionsIntoSoulMd` | [orbit-app/src/components/SoulField.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:90) |
| SOUL.md on disk was edited outside the app. | `soul.ui.soulMdOnDiskWasEdited` | [orbit-app/src/components/SoulField.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:96) |
| Use the file | `soulField.ui.useTheFile` | [orbit-app/src/components/SoulField.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:103) |
| Keep the saved version | `soulField.ui.keepTheSavedVersion` | [orbit-app/src/components/SoulField.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:106) |
| In this bot’s context on every turn. | `soul.ui.inThisBotsContextOnEveryTurn` | [orbit-app/src/components/SoulField.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:122) |
| Mirrored to | `soul.ui.mirroredTo` | [orbit-app/src/components/SoulField.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:122) |

## orbit-app/src/components/SpeakButton.tsx

Fonte: [orbit-app/src/components/SpeakButton.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SpeakButton.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Pick a voice in this agent's profile to read messages aloud | `chat.speak.needsVoice` | [orbit-app/src/components/SpeakButton.tsx:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SpeakButton.tsx:41) |
| Stop speaking | `chat.speak.stop` | [orbit-app/src/components/SpeakButton.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SpeakButton.tsx:43) |
| Read this aloud | `chat.speak.read` | [orbit-app/src/components/SpeakButton.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SpeakButton.tsx:44) |

## orbit-app/src/components/TaskPicker.tsx

Fonte: [orbit-app/src/components/TaskPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:1). 16 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| No folder | `folder.none` | [orbit-app/src/components/TaskPicker.tsx:429](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:429) |
| All threads · {label} ({detail}) | `task.switchWithUsageDetail` | [orbit-app/src/components/TaskPicker.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:244) |
| All threads | `task.switch` | [orbit-app/src/components/TaskPicker.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:283) |
| Search threads | `task.search` | [orbit-app/src/components/TaskPicker.tsx:319](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:319) |
| {count} matching threads | `task.matching` | [orbit-app/src/components/TaskPicker.tsx:324](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:324) |
| Threads | `task.list` | [orbit-app/src/components/TaskPicker.tsx:324](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:324) |
| Active Threads | `attention.title` | [orbit-app/src/components/TaskPicker.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:326) |
| Nothing matches “{query}” | `task.noMatch` | [orbit-app/src/components/TaskPicker.tsx:331](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:331) |
| Rename thread | `task.renameAria` | [orbit-app/src/components/TaskPicker.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:352) |
| Click to switch · double-click or right-click to rename | `task.renameHint` | [orbit-app/src/components/TaskPicker.tsx:391](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:391) |
| Waiting | `task.waiting` | [orbit-app/src/components/TaskPicker.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:579) |
| Waiting on teammate | `task.waitingOnTeammate` | [orbit-app/src/components/TaskPicker.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:579) |
| Working | `chat.activity.working` | [orbit-app/src/components/TaskPicker.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:579) |
| Unread | `task.unread` | [orbit-app/src/components/TaskPicker.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:579) |
| Unpin | `sidebar.bot.unpin` | [orbit-app/src/components/TaskPicker.tsx:407](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:407) |
| Pin | `sidebar.bot.pin` | [orbit-app/src/components/TaskPicker.tsx:407](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:407) |
| Rename {title} | `task.renameNamed` | [orbit-app/src/components/TaskPicker.tsx:417](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:417) |
| Rename this thread | `task.renameTitle` | [orbit-app/src/components/TaskPicker.tsx:418](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:418) |
| Move to folder | `folder.move` | [orbit-app/src/components/TaskPicker.tsx:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:424) |
| Move {title} to folder | `folder.moveNamed` | [orbit-app/src/components/TaskPicker.tsx:426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:426) |
| Snooze | `task.snooze` | [orbit-app/src/components/TaskPicker.tsx:445](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:445) |
| Until new activity | `task.snoozeUntilActivity` | [orbit-app/src/components/TaskPicker.tsx:446](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:446) |
| Until 6 PM | `task.snoozeTonight` | [orbit-app/src/components/TaskPicker.tsx:447](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:447) |
| Until 9 AM tomorrow | `task.snoozeTomorrow` | [orbit-app/src/components/TaskPicker.tsx:448](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:448) |
| Stop snoozing | `task.stopSnoozing` | [orbit-app/src/components/TaskPicker.tsx:449](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:449) |
| Copy link | `task.copyLink` | [orbit-app/src/components/TaskPicker.tsx:455](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:455) |
| Unarchive | `task.unarchive` | [orbit-app/src/components/TaskPicker.tsx:495](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:495) |
| Archive | `task.archive` | [orbit-app/src/components/TaskPicker.tsx:465](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:465) |
| Delete thread | `task.deleteAria` | [orbit-app/src/components/TaskPicker.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:475) |
| Delete this thread and its conversation | `task.deleteTitle` | [orbit-app/src/components/TaskPicker.tsx:476](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:476) |
| Archived ({count}) | `task.archivedList` | [orbit-app/src/components/TaskPicker.tsx:489](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:489) |
| New thread | `task.newShort` | [orbit-app/src/components/TaskPicker.tsx:510](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:510) |
| Saving folder order… | `folder.reordering` | [orbit-app/src/components/TaskPicker.tsx:532](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:532) |
| Folder order saved | `folder.reordered` | [orbit-app/src/components/TaskPicker.tsx:534](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:534) |
| Marking folder as read… | `folder.markingRead` | [orbit-app/src/components/TaskPicker.tsx:539](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:539) |
| Folder marked as read | `folder.markedRead` | [orbit-app/src/components/TaskPicker.tsx:542](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:542) |
| Other activity ({count}) | `task.otherActivity` | [orbit-app/src/components/TaskPicker.tsx:577](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:577) |
| Queued | `task.queued` | [orbit-app/src/components/TaskPicker.tsx:579](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:579) |

## orbit-app/src/components/TeamDialog.tsx

Fonte: [orbit-app/src/components/TeamDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Rename team | `team.rename` | [orbit-app/src/components/TeamDialog.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:32) |
| Move bots to {name} | `team.moveTo` | [orbit-app/src/components/TeamDialog.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:32) |
| Create team | `team.create` | [orbit-app/src/components/TeamDialog.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:101) |
| A team with that name already exists. Use Move bots on its team card. | `team.duplicate` | [orbit-app/src/components/TeamDialog.tsx:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:41) |
| Close team dialog | `team.closeDialog` | [orbit-app/src/components/TeamDialog.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:76) |
| Team name | `team.name` | [orbit-app/src/components/TeamDialog.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:78) |
| Checked bots belong to this team. Uncheck a bot to move it to General. | `team.manageIntro` | [orbit-app/src/components/TeamDialog.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:85) |
| Choose existing bots to move here. | `team.moveIntro` | [orbit-app/src/components/TeamDialog.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:85) |
| Start empty, or choose existing bots to move here. | `team.createIntro` | [orbit-app/src/components/TeamDialog.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:85) |
| Moving changes who they can work with and which shared instructions they read. Their chats stay with them. | `team.moveWarning` | [orbit-app/src/components/TeamDialog.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:85) |
| Existing bots | `team.existingBots` | [orbit-app/src/components/TeamDialog.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:88) |
| No other bots to move. You can add bots later. | `team.noBots` | [orbit-app/src/components/TeamDialog.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:89) |
| Cancel | `common.cancel` | [orbit-app/src/components/TeamDialog.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:98) |
| Saving… | `team.saving` | [orbit-app/src/components/TeamDialog.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:101) |
| Save name | `folder.saveName` | [orbit-app/src/components/TeamDialog.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:101) |
| Save | `common.save` | [orbit-app/src/components/TeamDialog.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:101) |
| Move selected bots | `team.moveSelected` | [orbit-app/src/components/TeamDialog.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:101) |

## orbit-app/src/components/TeamLibraryPanel.tsx

Fonte: [orbit-app/src/components/TeamLibraryPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:1). 23 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Shared instructions | `teamImport.brief` | [orbit-app/src/components/TeamLibraryPanel.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:139) |
| Backup notes | `library.ui.backupNotes` | [orbit-app/src/components/TeamLibraryPanel.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:144) |
| Routines: {count} · paused | `teamImport.routinesPaused` | [orbit-app/src/components/TeamLibraryPanel.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:152) |
| Connections to finish: {count} · keys and passwords are never included | `teamImport.connections` | [orbit-app/src/components/TeamLibraryPanel.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:174) |
| Starter notes: {count} | `teamImport.notes` | [orbit-app/src/components/TeamLibraryPanel.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:155) |
| Preset bots: {count} · not added by this version | `teamImport.presets` | [orbit-app/src/components/TeamLibraryPanel.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:156) |
| Included skills — added switched off | `teamImport.skillsOff` | [orbit-app/src/components/TeamLibraryPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:161) |
| Review each skill in its bot profile before switching it on. Imported instructions do not run automatically. | `teamImport.skillsReview` | [orbit-app/src/components/TeamLibraryPanel.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:163) |
| Offered skills — not added to any bot | `teamImport.offeredSkills` | [orbit-app/src/components/TeamLibraryPanel.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:168) |
| Team members | `library.ui.teamMembers` | [orbit-app/src/components/TeamLibraryPanel.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:182) |
| Bots, shared instructions, the Chief of Staff, group chats, playbooks and starter notes are added. Skills arrive switched off and routines paused. Connections arrive without their keys; finish them in Plugins → MCP servers. Chat history, keys and passwords, model choices and computers are never included. | `teamImport.sharedTeamSafety` | [orbit-app/src/components/TeamLibraryPanel.tsx:203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:203) |
| {count} bots · shared team | `teamImport.sharedTeam` | [orbit-app/src/components/TeamLibraryPanel.tsx:542](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:542) |
| Back to templates | `library.ui.backToTemplates` | [orbit-app/src/components/TeamLibraryPanel.tsx:557](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:557) |
| Open the community templates repository | `library.ui.openTheCommunityTemplatesRepository` | [orbit-app/src/components/TeamLibraryPanel.tsx:566](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:566) |
| Community repo | `library.ui.communityRepo` | [orbit-app/src/components/TeamLibraryPanel.tsx:569](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:569) |
| Imported bots and teams are added as new copies; duplicate names get numbered. | `teamImport.backupCopies` | [orbit-app/src/components/TeamLibraryPanel.tsx:586](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:586) |
| Adds a new team for {name}. Existing teams stay unchanged; duplicate names get numbered. | `teamImport.newSection` | [orbit-app/src/components/TeamLibraryPanel.tsx:587](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:587) |
| Template source | `library.ui.templateSource` | [orbit-app/src/components/TeamLibraryPanel.tsx:604](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:604) |
| Explore | `teamLibraryPanel.ui.explore` | [orbit-app/src/components/TeamLibraryPanel.tsx:617](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:617) |
| Import | `teamLibraryPanel.ui.import` | [orbit-app/src/components/TeamLibraryPanel.tsx:631](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:631) |
| From a folder | `teamLibraryPanel.ui.fromAFolder` | [orbit-app/src/components/TeamLibraryPanel.tsx:645](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:645) |
| Share | `teamLibrary.shareTab` | [orbit-app/src/components/TeamLibraryPanel.tsx:659](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:659) |
| Search templates | `library.ui.searchTemplates` | [orbit-app/src/components/TeamLibraryPanel.tsx:669](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:669) |
| Built into Orbit | `library.ui.builtIn` | [orbit-app/src/components/TeamLibraryPanel.tsx:681](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:681) |
| Creating | `library.ui.creating` | [orbit-app/src/components/TeamLibraryPanel.tsx:699](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:699) |
| Open | `library.ui.open` | [orbit-app/src/components/TeamLibraryPanel.tsx:699](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:699) |
| Create | `library.ui.create` | [orbit-app/src/components/TeamLibraryPanel.tsx:699](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:699) |
| Search results | `library.ui.searchResults` | [orbit-app/src/components/TeamLibraryPanel.tsx:707](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:707) |
| Community templates | `library.ui.communityTemplates` | [orbit-app/src/components/TeamLibraryPanel.tsx:707](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:707) |
| Loading templates… | `library.ui.loadingTemplates` | [orbit-app/src/components/TeamLibraryPanel.tsx:711](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:711) |
| Try again | `library.ui.tryAgain` | [orbit-app/src/components/TeamLibraryPanel.tsx:717](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:717) |
| {bots} bots · {playbooks} playbooks | `library.ui.teamCounts` | [orbit-app/src/components/TeamLibraryPanel.tsx:729](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:729) |
| Loading | `library.ui.loading` | [orbit-app/src/components/TeamLibraryPanel.tsx:740](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:740) |
| Load | `library.ui.load` | [orbit-app/src/components/TeamLibraryPanel.tsx:740](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:740) |
| No templates found | `library.ui.noTemplatesFound` | [orbit-app/src/components/TeamLibraryPanel.tsx:748](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:748) |
| Try a different search. | `library.ui.tryADifferentSearch` | [orbit-app/src/components/TeamLibraryPanel.tsx:749](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:749) |
| Bring your own team | `library.ui.bringYourOwnTeam` | [orbit-app/src/components/TeamLibraryPanel.tsx:769](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:769) |
| Choose a backup or team file | `library.ui.chooseABackupOrTeamFile` | [orbit-app/src/components/TeamLibraryPanel.tsx:791](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:791) |
| Drop a .mausbackup.json, BotMRR .md or legacy .mausteam.json here. You’ll preview it before anything is added. | `library.ui.dropAMausbackupJsonBotmrrMd` | [orbit-app/src/components/TeamLibraryPanel.tsx:792](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:792) |
| Load from GitHub | `library.ui.loadFromGithub` | [orbit-app/src/components/TeamLibraryPanel.tsx:797](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:797) |
| Paste a public repo or a direct team JSON link. | `library.ui.pasteAPublicRepoOrA` | [orbit-app/src/components/TeamLibraryPanel.tsx:798](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:798) |
| github.com/owner/repo | `library.ui.githubComOwnerRepo` | [orbit-app/src/components/TeamLibraryPanel.tsx:804](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:804) |
| GitHub team URL | `library.ui.githubTeamUrl` | [orbit-app/src/components/TeamLibraryPanel.tsx:805](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:805) |
| Load | `teamLibraryPanel.ui.load` | [orbit-app/src/components/TeamLibraryPanel.tsx:814](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:814) |
| Share a whole team as one file: bots, skills, group chats, routines and more. Chat history, keys and passwords never go in it. | `teamLibrary.shareIntro` | [orbit-app/src/components/TeamLibraryPanel.tsx:825](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:825) |
| Add a bot to a team first, then share the team here. | `teamLibrary.shareEmpty` | [orbit-app/src/components/TeamLibraryPanel.tsx:827](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:827) |
| General | `teamLibrary.general` | [orbit-app/src/components/TeamLibraryPanel.tsx:839](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:839) |
| Bots: {count} | `teamLibrary.shareBots` | [orbit-app/src/components/TeamLibraryPanel.tsx:835](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:835) |
| Share the {name} team | `teamLibrary.shareTeamAria` | [orbit-app/src/components/TeamLibraryPanel.tsx:839](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:839) |
| Share team… | `teamLibrary.shareTeam` | [orbit-app/src/components/TeamLibraryPanel.tsx:843](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:843) |
| Start from a project folder | `library.ui.startFromAProjectFolder` | [orbit-app/src/components/TeamLibraryPanel.tsx:854](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:854) |
| /path/to/your/project | `library.ui.pathToYourProject` | [orbit-app/src/components/TeamLibraryPanel.tsx:864](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:864) |
| Project folder to scout | `library.ui.projectFolderToScout` | [orbit-app/src/components/TeamLibraryPanel.tsx:865](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:865) |
| Browse | `teamLibraryPanel.ui.browse` | [orbit-app/src/components/TeamLibraryPanel.tsx:875](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:875) |
| Suggested team | `library.ui.suggestedTeam` | [orbit-app/src/components/TeamLibraryPanel.tsx:906](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:906) |
| From the community directory — tick to add | `library.ui.fromTheCommunityDirectoryTickTo` | [orbit-app/src/components/TeamLibraryPanel.tsx:927](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:927) |
| Read this bot's page before adding it | `library.ui.readThisBotSPageBefore` | [orbit-app/src/components/TeamLibraryPanel.tsx:958](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:958) |
| Group chat name | `library.ui.groupChatName` | [orbit-app/src/components/TeamLibraryPanel.tsx:973](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:973) |
| Creates the team as new bots, opens a group chat for them, and points its working folder here. | `teamLibraryPanel.ui.createsTheTeamAsNewBots` | [orbit-app/src/components/TeamLibraryPanel.tsx:986](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:986) |

## orbit-app/src/components/TeamPicker.tsx

Fonte: [orbit-app/src/components/TeamPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Move to team | `sidebar.section.moveToContext` | [orbit-app/src/components/TeamPicker.tsx:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:72) |
| New team… | `sidebar.section.newContext` | [orbit-app/src/components/TeamPicker.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:104) |
| New team name | `sidebar.section.newContextAria` | [orbit-app/src/components/TeamPicker.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:105) |
| Add | `common.add` | [orbit-app/src/components/TeamPicker.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:116) |
| Move to General | `sidebar.section.removeFromContext` | [orbit-app/src/components/TeamPicker.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:127) |

## orbit-app/src/components/ThreadChip.tsx

Fonte: [orbit-app/src/components/ThreadChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadChip.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Open #{title} | `chat.openThread` | [orbit-app/src/components/ThreadChip.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadChip.tsx:23) |

## orbit-app/src/components/ThreadCleanupSettings.tsx

Fonte: [orbit-app/src/components/ThreadCleanupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not save event log settings. Please try again. | `settings.threadCleanup.error` | [orbit-app/src/components/ThreadCleanupSettings.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:76) |
| Enter a number of days between 1 and 3650. | `settings.threadCleanup.invalidRetention` | [orbit-app/src/components/ThreadCleanupSettings.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:121) |
| Enter a size between 0.25 and 4096 MiB. | `settings.threadCleanup.invalidCap` | [orbit-app/src/components/ThreadCleanupSettings.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:137) |
| Event log cleanup | `settings.threadCleanup.title` | [orbit-app/src/components/ThreadCleanupSettings.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:150) |
| Trim the logs threads accumulate while they run. | `settings.threadCleanup.subtitle` | [orbit-app/src/components/ThreadCleanupSettings.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:150) |
| Delete event logs of finished threads after | `settings.threadCleanup.retention.enable` | [orbit-app/src/components/ThreadCleanupSettings.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:161) |
| days | `settings.threadCleanup.retention.unit` | [orbit-app/src/components/ThreadCleanupSettings.tsx:185](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:185) |
| Off by default. When on, a daily sweep deletes the event-log files of threads that closed or were archived more than this many days ago. It only removes event-log files — never threads or transcripts. | `settings.threadCleanup.retention.help` | [orbit-app/src/components/ThreadCleanupSettings.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:188) |
| Trim each event log to | `settings.threadCleanup.cap.enable` | [orbit-app/src/components/ThreadCleanupSettings.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:200) |
| MiB | `settings.threadCleanup.cap.unit` | [orbit-app/src/components/ThreadCleanupSettings.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:224) |
| Off by default. When on, each thread's event log is kept at or below this size. Cleanup only removes event-log files — never threads or transcripts. | `settings.threadCleanup.cap.help` | [orbit-app/src/components/ThreadCleanupSettings.tsx:227](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:227) |
| Saving… | `settings.threadCleanup.saving` | [orbit-app/src/components/ThreadCleanupSettings.tsx:229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:229) |

## orbit-app/src/components/ThreadConcurrencySettings.tsx

Fonte: [orbit-app/src/components/ThreadConcurrencySettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not save the thread limit. Please try again. | `settings.threads.error` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:24) |
| Parallel threads | `settings.threads.title` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:31) |
| Choose how much each bot can work on at once. | `settings.threads.subtitle` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:31) |
| Maximum running threads per bot | `settings.threads.label` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:32) |
| Applies to a bot's 1:1 threads. Extra messages queue until a slot opens. A room turn runs one at a time per bot, and direct messages queue behind it. Delegated work waits for a free thread. Threads waiting for approval use a slot. Lowering this limit does not stop running work; model limits and shared-computer protections still apply. | `settings.threads.help` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:39) |
| Saving… | `settings.threads.saving` | [orbit-app/src/components/ThreadConcurrencySettings.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:40) |

## orbit-app/src/components/ThreadRefs.tsx

Fonte: [orbit-app/src/components/ThreadRefs.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadRefs.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Open #{title} on {name} | `chat.openThreadOn` | [orbit-app/src/components/ThreadRefs.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadRefs.tsx:78) |
| Open #{title} | `chat.openThread` | [orbit-app/src/components/ThreadRefs.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadRefs.tsx:78) |

## orbit-app/src/components/ThreadUsageChip.tsx

Fonte: [orbit-app/src/components/ThreadUsageChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadUsageChip.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| 1 turn | `chat.usage.turnsOne` | [orbit-app/src/components/ThreadUsageChip.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadUsageChip.tsx:17) |
| {count} turns | `chat.usage.turnsMany` | [orbit-app/src/components/ThreadUsageChip.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadUsageChip.tsx:17) |
| Long thread: the model re-reads all of it on every message. A new thread starts small. | `chat.usage.contextNudge` | [orbit-app/src/components/ThreadUsageChip.tsx:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadUsageChip.tsx:24) |

## orbit-app/src/components/ToolActivity.tsx

Fonte: [orbit-app/src/components/ToolActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Running | `toolDetail.running` | [orbit-app/src/components/ToolActivity.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:19) |
| Failed | `toolDetail.failed` | [orbit-app/src/components/ToolActivity.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:19) |
| Completed | `toolDetail.completed` | [orbit-app/src/components/ToolActivity.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:19) |
| {name} · {status} · Tool details | `toolDetail.label` | [orbit-app/src/components/ToolActivity.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:25) |
| Input | `toolDetail.input` | [orbit-app/src/components/ToolActivity.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:37) |
| Result | `toolDetail.output` | [orbit-app/src/components/ToolActivity.tsx:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:41) |
| Waiting for the tool to finish… | `toolDetail.waiting` | [orbit-app/src/components/ToolActivity.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:42) |
| No output was recorded for this call. | `toolDetail.noOutput` | [orbit-app/src/components/ToolActivity.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:42) |
| Shortened, automatically redacted preview. Review before sharing. | `toolDetail.previewHint` | [orbit-app/src/components/ToolActivity.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:44) |

## orbit-app/src/components/TurnNarrationRun.tsx

Fonte: [orbit-app/src/components/TurnNarrationRun.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TurnNarrationRun.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/components/UpdateBanner.tsx

Fonte: [orbit-app/src/components/UpdateBanner.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:1). 5 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Something went wrong. | `update.ui.somethingWentWrong` | [orbit-app/src/components/UpdateBanner.tsx:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:17) |
| No update has been published for this platform yet. | `update.ui.noUpdatePublished` | [orbit-app/src/components/UpdateBanner.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:19) |
| Couldn't reach the update server. | `update.ui.couldNotReachServer` | [orbit-app/src/components/UpdateBanner.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:21) |
| {app} update · {version} | `update.ui.sourceAvailable` | [orbit-app/src/components/UpdateBanner.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:55) |
| {app} {version} is available | `update.ui.available` | [orbit-app/src/components/UpdateBanner.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:55) |
| Building the update… | `update.ui.buildingUpdate` | [orbit-app/src/components/UpdateBanner.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:57) |
| Downloading {version}… | `update.ui.downloading` | [orbit-app/src/components/UpdateBanner.tsx:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:57) |
| Preparing update… | `update.ui.preparingUpdate` | [orbit-app/src/components/UpdateBanner.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:59) |
| {version} is ready | `update.ui.ready` | [orbit-app/src/components/UpdateBanner.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:61) |
| Opening a terminal… | `update.ui.openingTerminal` | [orbit-app/src/components/UpdateBanner.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:64) |
| Restarting to update… | `update.ui.restartingToUpdate` | [orbit-app/src/components/UpdateBanner.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:65) |
| Finish in a terminal | `update.ui.finishInTerminal` | [orbit-app/src/components/UpdateBanner.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:67) |
| Update failed | `update.ui.updateFailed` | [orbit-app/src/components/UpdateBanner.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:68) |
| New code in your Orbit repository. | `update.ui.newCode` | [orbit-app/src/components/UpdateBanner.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:71) |
| A newer version is ready to download. | `update.ui.newerVersion` | [orbit-app/src/components/UpdateBanner.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:71) |
| Starting… | `update.ui.starting` | [orbit-app/src/components/UpdateBanner.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:130) |
| Starting download… | `update.ui.startingDownload` | [orbit-app/src/components/UpdateBanner.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:76) |
| Download complete. macOS is preparing the update. | `update.ui.macPreparing` | [orbit-app/src/components/UpdateBanner.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:79) |
| Copy the install command and open a terminal. | `update.ui.copyInstallCommand` | [orbit-app/src/components/UpdateBanner.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:82) |
| Not signed with your certificate: macOS will ask for Screen Recording and Microphone again. | `update.ui.signingChanged` | [orbit-app/src/components/UpdateBanner.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:84) |
| Restart to finish updating. | `update.ui.restartToFinish` | [orbit-app/src/components/UpdateBanner.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:85) |
| Copying the command… | `update.ui.copyingCommand` | [orbit-app/src/components/UpdateBanner.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:88) |
| {app} will reopen in a moment. | `update.ui.reopen` | [orbit-app/src/components/UpdateBanner.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:89) |
| Command copied — paste it in the terminal that opened. | `update.ui.commandCopiedOpened` | [orbit-app/src/components/UpdateBanner.tsx:92](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:92) |
| Command copied — paste it in a terminal to finish. | `update.ui.commandCopied` | [orbit-app/src/components/UpdateBanner.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:93) |
| {error} Quit and reopen {app} before trying the update again. | `update.ui.quitAndReopen` | [orbit-app/src/components/UpdateBanner.tsx:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:95) |
| Preparing… | `update.ui.preparing` | [orbit-app/src/components/UpdateBanner.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:125) |
| Opening… | `update.ui.opening` | [orbit-app/src/components/UpdateBanner.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:136) |
| Restarting… | `update.ui.restarting` | [orbit-app/src/components/UpdateBanner.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:136) |
| Build update | `update.ui.buildUpdate` | [orbit-app/src/components/UpdateBanner.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:130) |
| Download | `update.ui.download` | [orbit-app/src/components/UpdateBanner.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:130) |
| Install | `update.ui.install` | [orbit-app/src/components/UpdateBanner.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:137) |
| Restart to update | `update.ui.restartToUpdate` | [orbit-app/src/components/UpdateBanner.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:137) |
| Checking… | `update.ui.checking` | [orbit-app/src/components/UpdateBanner.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:142) |
| Try again | `update.ui.tryAgain` | [orbit-app/src/components/UpdateBanner.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:142) |
| Dismiss | `update.ui.dismiss` | [orbit-app/src/components/UpdateBanner.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:148) |
| Later | `update.ui.later` | [orbit-app/src/components/UpdateBanner.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:148) |

## orbit-app/src/components/UsageBudget.tsx

Fonte: [orbit-app/src/components/UsageBudget.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:1). 11 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Enter a limit of 0 or more and a warning percentage between 1 and 100. | `usage.budget.invalid` | [orbit-app/src/components/UsageBudget.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:56) |
| Monthly spend limit | `usage.budget.title` | [orbit-app/src/components/UsageBudget.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:73) |
| Once the month's cost reaches the limit, no bot in this workspace starts a turn until an admin raises it. Admins are notified once a month at the warning level and once at the limit. | `usage.budget.subtitle` | [orbit-app/src/components/UsageBudget.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:73) |
| Limit reached: new turns are refused | `usage.budget.reached` | [orbit-app/src/components/UsageBudget.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:78) |
| Nearing the limit | `usage.budget.nearing` | [orbit-app/src/components/UsageBudget.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:78) |
| Within the limit | `usage.budget.within` | [orbit-app/src/components/UsageBudget.tsx:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:78) |
| {spent} of {cap} ({percent}%) | `usage.budget.spent` | [orbit-app/src/components/UsageBudget.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:80) |
| No limit is set. Bots spend freely. | `usage.budget.none` | [orbit-app/src/components/UsageBudget.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:87) |
| Limit per month (USD) | `usage.budget.monthly` | [orbit-app/src/components/UsageBudget.tsx:92](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:92) |
| Warn at (%) | `usage.budget.warnAt` | [orbit-app/src/components/UsageBudget.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:96) |
| Save | `common.save` | [orbit-app/src/components/UsageBudget.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:191) |
| Counts what engines report (real on your keys, an equivalent on personal subscriptions) and, for engines that report no price, an estimate from list prices or your own prices. Models with no known price are not counted. Set 0 to remove the limit. | `usage.budget.hint` | [orbit-app/src/components/UsageBudget.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:102) |
| Check the numbers for {model}: prices must be 0 or more. | `usage.prices.invalid` | [orbit-app/src/components/UsageBudget.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:142) |
| Currency must be a three-letter code, like USD. | `usage.prices.currencyInvalid` | [orbit-app/src/components/UsageBudget.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:148) |
| Sell prices | `usage.prices.title` | [orbit-app/src/components/UsageBudget.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:165) |
| What you charge per million tokens, by model. History and the CSV export gain a billable column; the provider's own cost stays alongside. | `usage.prices.subtitle` | [orbit-app/src/components/UsageBudget.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:165) |
| Currency | `usage.prices.currency` | [orbit-app/src/components/UsageBudget.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:169) |
| Model | `usage.prices.colModel` | [orbit-app/src/components/UsageBudget.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:180) |
| Input / 1M | `usage.prices.colInput` | [orbit-app/src/components/UsageBudget.tsx:181](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:181) |
| Output / 1M | `usage.prices.colOutput` | [orbit-app/src/components/UsageBudget.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:182) |
| Cached / 1M | `usage.prices.colCached` | [orbit-app/src/components/UsageBudget.tsx:183](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:183) |
| model id, driver/model, or default | `usage.prices.modelPlaceholder` | [orbit-app/src/components/UsageBudget.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:180) |
| Remove this price | `usage.prices.remove` | [orbit-app/src/components/UsageBudget.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:184) |
| Add model | `usage.prices.add` | [orbit-app/src/components/UsageBudget.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:189) |
| A row named default prices any model not listed. Cached input falls back to the input rate when left blank. For engines that report no cost, a price set here for a model also replaces the list price in its cost estimate and the spend limit. | `usage.prices.hint` | [orbit-app/src/components/UsageBudget.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:194) |

## orbit-app/src/components/UsageHistory.tsx

Fonte: [orbit-app/src/components/UsageHistory.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Not from a routine | `usage.history.notRoutine` | [orbit-app/src/components/UsageHistory.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:58) |
| This computer | `usage.history.owner` | [orbit-app/src/components/UsageHistory.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:60) |
| Bot to bot | `usage.history.botToBot` | [orbit-app/src/components/UsageHistory.tsx:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:61) |
| Routine: {name} | `usage.history.routine` | [orbit-app/src/components/UsageHistory.tsx:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:62) |
| {amount} of this is estimated | `usage.history.estimatedPart` | [orbit-app/src/components/UsageHistory.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:85) |
| Nothing recorded in this period. | `usage.history.empty` | [orbit-app/src/components/UsageHistory.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:96) |
| Turns | `usage.colTurns` | [orbit-app/src/components/UsageHistory.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:106) |
| Cost | `usage.colCost` | [orbit-app/src/components/UsageHistory.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:108) |
| Billable | `usage.history.colBillable` | [orbit-app/src/components/UsageHistory.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:109) |
| {input} in, {output} out, {cached} of the input re-read from cache | `usage.history.tokenSplit` | [orbit-app/src/components/UsageHistory.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:115) |
| Total | `usage.history.total` | [orbit-app/src/components/UsageHistory.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:123) |
| ~ marks a cost that includes an estimate: {amount} in this period is priced from list prices (or your own) because the engine reports tokens but no price. | `usage.history.estimated` | [orbit-app/src/components/UsageHistory.tsx:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:133) |
| {count} turn(s) used a model with no known price and are not in the cost column. | `usage.history.unpriced` | [orbit-app/src/components/UsageHistory.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:136) |
| History | `usage.history.title` | [orbit-app/src/components/UsageHistory.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:168) |
| Every settled turn, kept month by month on the server. Pick a period, group it, or export it for an invoice. | `usage.history.subtitle` | [orbit-app/src/components/UsageHistory.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:168) |
| Period | `usage.history.period` | [orbit-app/src/components/UsageHistory.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:173) |
| This month | `usage.history.thisMonth` | [orbit-app/src/components/UsageHistory.tsx:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:176) |
| Last month | `usage.history.lastMonth` | [orbit-app/src/components/UsageHistory.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:177) |
| Last 30 days | `usage.history.last30Days` | [orbit-app/src/components/UsageHistory.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:178) |
| Group by | `usage.history.groupBy` | [orbit-app/src/components/UsageHistory.tsx:180](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:180) |
| Export CSV | `usage.history.export` | [orbit-app/src/components/UsageHistory.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:202) |
| Checking… | `common.checking` | [orbit-app/src/components/UsageHistory.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:207) |

## orbit-app/src/components/UsageSection.tsx

Fonte: [orbit-app/src/components/UsageSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Usage | `usage.title` | [orbit-app/src/components/UsageSection.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:34) |
| Tokens and cost per bot, added up from every settled turn. Only engines that report a price show one. | `usage.subtitle` | [orbit-app/src/components/UsageSection.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:34) |
| Nothing spent yet — figures appear after a bot's first turn. | `usage.empty` | [orbit-app/src/components/UsageSection.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:36) |
| Bot | `usage.colBot` | [orbit-app/src/components/UsageSection.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:40) |
| Turns | `usage.colTurns` | [orbit-app/src/components/UsageSection.tsx:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:41) |
| Cost | `usage.colCost` | [orbit-app/src/components/UsageSection.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:43) |
| All bots | `usage.allBots` | [orbit-app/src/components/UsageSection.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:59) |
| Cost is {caption}. | `usage.costLine` | [orbit-app/src/components/UsageSection.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:69) |
| as each engine reports it — on a subscription it's an equivalent, not a charge | `usage.costMixed` | [orbit-app/src/components/UsageSection.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:71) |

## orbit-app/src/components/VerifyCard.tsx

Fonte: [orbit-app/src/components/VerifyCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Expand the run | `chat.verify.expand` | [orbit-app/src/components/VerifyCard.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:56) |
| Collapse the run | `chat.verify.collapse` | [orbit-app/src/components/VerifyCard.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:56) |
| This run | `chat.verify.aria` | [orbit-app/src/components/VerifyCard.tsx:59](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:59) |
| This run | `chat.verify.title` | [orbit-app/src/components/VerifyCard.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:65) |
| Dismiss the run | `chat.verify.dismiss` | [orbit-app/src/components/VerifyCard.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:87) |
| Run steps | `chat.verify.steps` | [orbit-app/src/components/VerifyCard.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:96) |
| verified | `chat.verify.verifiedTag` | [orbit-app/src/components/VerifyCard.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:104) |
| Skill staged for your review | `chat.verify.staged` | [orbit-app/src/components/VerifyCard.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:113) |
| Save as skill | `chat.verify.save` | [orbit-app/src/components/VerifyCard.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:122) |
| Adds the run to your message; add any notes, then send. | `chat.verify.saveHint` | [orbit-app/src/components/VerifyCard.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:124) |

## orbit-app/src/components/VoiceNoteBubble.tsx

Fonte: [orbit-app/src/components/VoiceNoteBubble.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceNoteBubble.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Pause voice note | `chat.voiceNote.pause` | [orbit-app/src/components/VoiceNoteBubble.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceNoteBubble.tsx:116) |
| Play voice note | `chat.voiceNote.play` | [orbit-app/src/components/VoiceNoteBubble.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceNoteBubble.tsx:116) |
| Seek voice note | `chat.voiceNote.seek` | [orbit-app/src/components/VoiceNoteBubble.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceNoteBubble.tsx:123) |

## orbit-app/src/components/VoiceSettings.tsx

Fonte: [orbit-app/src/components/VoiceSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:1). 12 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Host · Grok | `voice.grok.host` | [orbit-app/src/components/VoiceSettings.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:88) |
| The server address must start with http:// or https:// | `voice.ui.theServerAddressMustStartWith` | [orbit-app/src/components/VoiceSettings.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:188) |
| Voice | `voice.ui.voice` | [orbit-app/src/components/VoiceSettings.tsx:384](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:384) |
| Choose a voice installed on this computer, or use your configured voice provider. | `jarvis.voice.device` | [orbit-app/src/components/VoiceSettings.tsx:211](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:211) |
| Grok uses the workspace’s existing xAI key. | `voice.grok.sharedKey` | [orbit-app/src/components/VoiceSettings.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:220) |
| Voice on this device | `jarvis.voice.output` | [orbit-app/src/components/VoiceSettings.tsx:229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:229) |
| Voice output on this Mac | `voice.ui.voiceOutputOnThisMac` | [orbit-app/src/components/VoiceSettings.tsx:229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:229) |
| System voices | `jarvis.voice.system` | [orbit-app/src/components/VoiceSettings.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:231) |
| Voice engine | `voice.ui.voiceEngine` | [orbit-app/src/components/VoiceSettings.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:257) |
| Grok (xAI) | `voice.grok.label` | [orbit-app/src/components/VoiceSettings.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:263) |
| Connected | `voice.ui.connected` | [orbit-app/src/components/VoiceSettings.tsx:290](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:290) |
| Save | `voice.ui.save` | [orbit-app/src/components/VoiceSettings.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:354) |
| The xAI key is saved. Grok detects the spoken language from your text. | `voice.grok.ready` | [orbit-app/src/components/VoiceSettings.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:326) |
| Add an xAI API key in Settings → Connections on the host to use Grok voice. | `voice.grok.missingKey` | [orbit-app/src/components/VoiceSettings.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:326) |
| Chatterbox server | `voice.ui.chatterboxServer` | [orbit-app/src/components/VoiceSettings.tsx:334](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:334) |
| Saved | `voice.ui.saved` | [orbit-app/src/components/VoiceSettings.tsx:335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:335) |
| http://127.0.0.1:4123 | `voice.ui.http1270014123` | [orbit-app/src/components/VoiceSettings.tsx:343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:343) |
| Chatterbox server address | `voice.ui.chatterboxServerAddress` | [orbit-app/src/components/VoiceSettings.tsx:344](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:344) |
| Model id — default chatterbox-turbo | `voice.ui.modelIdDefaultChatterboxTurbo` | [orbit-app/src/components/VoiceSettings.tsx:362](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:362) |
| Chatterbox model | `voice.ui.chatterboxModel` | [orbit-app/src/components/VoiceSettings.tsx:363](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:363) |
| How to run one locally | `voiceSettings.ui.howToRunOneLocally` | [orbit-app/src/components/VoiceSettings.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:376) |
| Current agent voice | `voice.ui.currentAgentVoice` | [orbit-app/src/components/VoiceSettings.tsx:402](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:402) |
| Hear this voice | `voice.ui.hearThisVoice` | [orbit-app/src/components/VoiceSettings.tsx:415](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:415) |
| Read replies aloud | `voice.ui.readRepliesAloud` | [orbit-app/src/components/VoiceSettings.tsx:426](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:426) |
| Speak this agent's answers as they arrive, even from another chat. | `voiceSettings.ui.speakThisAgentSAnswersAs` | [orbit-app/src/components/VoiceSettings.tsx:428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:428) |
| Read this bot's replies aloud | `voice.ui.readThisBotSRepliesAloud` | [orbit-app/src/components/VoiceSettings.tsx:433](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:433) |

## orbit-app/src/components/WebhooksPanel.tsx

Fonte: [orbit-app/src/components/WebhooksPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:1). 19 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Create an automation | `webhooks.createAnAutomation` | [orbit-app/src/components/WebhooksPanel.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:132) |
| Each request starts a new task in the bot chat. | `webhooks.eachRequestStartsANewTask` | [orbit-app/src/components/WebhooksPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:161) |
| Close webhook editor | `webhooks.closeWebhookEditor` | [orbit-app/src/components/WebhooksPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:161) |
| Who receives the tasks? | `webhooks.whoReceivesTheTasks` | [orbit-app/src/components/WebhooksPanel.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:163) |
| Send the task in the request: | `webhooks.sendTheTaskInTheRequest` | [orbit-app/src/components/WebhooksPanel.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:164) |
| Advanced options | `webhooks.advancedOptions` | [orbit-app/src/components/WebhooksPanel.tsx:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:166) |
| Name | `webhooks.name` | [orbit-app/src/components/WebhooksPanel.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:168) |
| Default instructions | `webhooks.defaultInstructions` | [orbit-app/src/components/WebhooksPanel.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:169) |
| For every event, summarize what happened and suggest the next step… | `webhooks.forEveryEventSummarizeWhatHappened` | [orbit-app/src/components/WebhooksPanel.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:169) |
| Use this only when every event needs the same handling rule. Otherwise the request’s task is used. | `webhooks.useThisOnlyWhenEveryEvent` | [orbit-app/src/components/WebhooksPanel.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:169) |
| Run on | `webhooks.runOn` | [orbit-app/src/components/WebhooksPanel.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:170) |
| This computer | `webhooks.thisComputer` | [orbit-app/src/components/WebhooksPanel.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:170) |
| Cloud VM | `webhooks.cloudVm` | [orbit-app/src/components/WebhooksPanel.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:170) |
| Only accept event types | `webhooks.onlyAcceptEventTypes` | [orbit-app/src/components/WebhooksPanel.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:171) |
| push, workflow_run | `webhooks.pushWorkflowRun` | [orbit-app/src/components/WebhooksPanel.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:171) |
| Comma-separated values from the sender’s event-type header. | `webhooks.commaSeparatedValuesFromTheSender` | [orbit-app/src/components/WebhooksPanel.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:171) |
| Unfinished tasks at once | `webhooks.maxPendingRuns` | [orbit-app/src/components/WebhooksPanel.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:172) |
| How many of this webhook’s tasks can be queued or running together. More requests get HTTP 429 until one finishes. Leave blank for {count}. | `webhooks.maxPendingRunsHint` | [orbit-app/src/components/WebhooksPanel.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:172) |
| Cancel | `webhooks.cancel` | [orbit-app/src/components/WebhooksPanel.tsx:177](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:177) |
| Create your first webhook | `webhooks.createYourFirstWebhook` | [orbit-app/src/components/WebhooksPanel.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:309) |
| Choose a bot, copy one command, and every request becomes a new task in its chat. | `webhooks.chooseABotCopyOneCommand` | [orbit-app/src/components/WebhooksPanel.tsx:310](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:310) |
| Create webhook | `webhooks.createWebhook` | [orbit-app/src/components/WebhooksPanel.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:311) |
| Create a bot first, then come back here. | `webhooks.createABotFirstThenCome` | [orbit-app/src/components/WebhooksPanel.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:312) |
| Your webhooks | `webhooks.yourWebhooks` | [orbit-app/src/components/WebhooksPanel.tsx:318](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:318) |
| Edit settings | `webhooks.editSettings` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| Delete | `webhooks.delete` | [orbit-app/src/components/WebhooksPanel.tsx:349](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:349) |
| Setup | `webhooks.setup` | [orbit-app/src/components/WebhooksPanel.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:354) |
| Send a task | `webhooks.sendATask` | [orbit-app/src/components/WebhooksPanel.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:361) |
| Terminal | `webhooks.terminal` | [orbit-app/src/components/WebhooksPanel.tsx:365](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:365) |
| Rotate private URL | `webhooks.rotatePrivateUrl` | [orbit-app/src/components/WebhooksPanel.tsx:365](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:365) |
| The private URL is shown once. Generate a replacement to copy your webhook command; any older command for this webhook will stop working. | `webhooks.thePrivateUrlIsShownOnce` | [orbit-app/src/components/WebhooksPanel.tsx:370](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:370) |
| Keep Orbit open so it can receive requests. | `webhooks.keepOrbitOpenSoItCan` | [orbit-app/src/components/WebhooksPanel.tsx:374](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:374) |
| Request received | `webhooks.requestReceived` | [orbit-app/src/components/WebhooksPanel.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:376) |
| Turn on | `webhooks.turnOn` | [orbit-app/src/components/WebhooksPanel.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:376) |
| Tasks go to | `webhooks.tasksGoTo` | [orbit-app/src/components/WebhooksPanel.tsx:379](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:379) |
| Runs on | `webhooks.runsOn` | [orbit-app/src/components/WebhooksPanel.tsx:379](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:379) |
| Advanced | `webhooks.advanced` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| Default instruction: | `webhooks.defaultInstruction` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| The task or message sent with each request becomes the bot instruction. | `webhooks.theTaskOrMessageSentWith` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| Accepted events: | `webhooks.acceptedEvents` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| All event types are accepted. | `webhooks.allEventTypesAreAccepted` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| Unfinished tasks at once: | `webhooks.maxPendingRunsLabel` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| {count}. More requests get HTTP 429 until one finishes. | `webhooks.maxPendingRunsSummary` | [orbit-app/src/components/WebhooksPanel.tsx:382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:382) |
| Recent deliveries | `webhooks.recentDeliveries` | [orbit-app/src/components/WebhooksPanel.tsx:387](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:387) |
| Accepted and rejected requests update automatically. | `webhooks.acceptedAndRejectedRequestsUpdateAutomat` | [orbit-app/src/components/WebhooksPanel.tsx:387](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:387) |
| No requests yet. Use the command in Setup to send one. | `webhooks.noRequestsYetUseTheCommand` | [orbit-app/src/components/WebhooksPanel.tsx:389](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:389) |
| Open this execution in the bot chat | `webhooks.openThisExecutionInTheBot` | [orbit-app/src/components/WebhooksPanel.tsx:394](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:394) |
| Open chat | `webhooks.openChat` | [orbit-app/src/components/WebhooksPanel.tsx:394](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:394) |

## orbit-app/src/components/WindowCaptionButtons.tsx

Fonte: [orbit-app/src/components/WindowCaptionButtons.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Minimize | `window.minimize` | [orbit-app/src/components/WindowCaptionButtons.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:55) |
| Restore | `window.restore` | [orbit-app/src/components/WindowCaptionButtons.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:64) |
| Maximize | `window.maximize` | [orbit-app/src/components/WindowCaptionButtons.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:64) |
| Close | `window.close` | [orbit-app/src/components/WindowCaptionButtons.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:73) |

## orbit-app/src/components/WorkspaceBackupSettings.tsx

Fonte: [orbit-app/src/components/WorkspaceBackupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:1). 11 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Validated backup | `backup.preview` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:16](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:16) |
| Created | `backup.date` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:18) |
| App version | `backup.version` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:19) |
| Bots | `backup.bots` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:20) |
| Groups | `backup.groups` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:21](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:21) |
| Threads | `backup.threads` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:22](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:22) |
| Messages | `backup.messages` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:23) |
| Files | `backup.files` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:24) |
| Uncompressed bytes | `backup.bytes` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:25) |
| Not included | `backup.exclusions` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:28](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:28) |
| A password-protected backup of this workspace: bots, conversations, instructions, local files, and non-secret settings. Drafts and preferences from this browser are included. | `backup.scope` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:131) |
| Saved account credentials and connections are not included. Reconnect your accounts on a new machine; existing credentials on the destination stay unchanged. External CLI sign-ins and remote VM disks are not included. | `backup.excluded` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:132) |
| Chats, drafts, and user files are not automatically redacted and may contain pasted secrets. Keep this backup private and save its password safely; it cannot be recovered. | `backup.privacy` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:133) |
| The backup is ready to restore. Fully quit Orbit and reopen it to finish. For a self-hosted server, restart the server process, then reload this browser. Do not just close this window. | `backup.restart` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:203) |
| A workspace backup operation is already running. | `backup.serverBusy` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:136) |
| Checking backup availability… | `backup.checkStatus` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:136) |
| Retry | `connectors.action.retry` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:205) |
| Export full backup | `backup.export` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:141) |
| Use a password of at least 12 characters. You will need it to import this backup. | `backup.passwordHint` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:137) |
| Backup password | `backup.exportPassword` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:139) |
| Confirm backup password | `backup.confirmPassword` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:140) |
| Creating encrypted backup… | `backup.exporting` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:141) |
| Download {filename} | `backup.downloadAgain` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:142) |
| Import backup | `backup.import` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:145) |
| Choose an encrypted .orbitbackup file and validate it before changing anything. Backups support up to 10 GB of workspace data. Older team backups and shareable templates can still be imported from Templates. | `backup.importHint` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:145) |
| Backup file | `backup.file` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:147) |
| Password for this backup | `backup.importPassword` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:148) |
| Validating backup… | `backup.validating` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:148) |
| Validate backup | `backup.validate` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:148) |
| This replaces the current workspace; it does not merge. A recoverable safety backup of the current workspace is kept before replacement. Restart is required. | `backup.replaceWarning` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:152) |
| Only restore backups you trust: instructions, skills, and bot permissions are restored too. Reconnect accounts as needed. Routines, webhooks, and calendar calls arrive paused; pending work is not resumed. | `backup.trustWarning` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:153) |
| Type REPLACE to confirm | `backup.confirmReplace` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:154) |
| Preparing replacement… | `backup.restoring` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:155) |
| Replace workspace | `backup.replace` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:155) |
| Restoring this browser’s saved drafts and preferences… | `backup.recovering` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:203) |
| Keep this browser’s current drafts and preferences. This does not undo the workspace restore. | `backup.skipDraftsHint` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:207) |
| Continue without restoring drafts | `backup.skipDrafts` | [orbit-app/src/components/WorkspaceBackupSettings.tsx:208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:208) |

## orbit-app/src/components/WorkspacesSection.tsx

Fonte: [orbit-app/src/components/WorkspacesSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:1). 18 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| No workspaces on {domain} yet. | `workspaces.empty` | [orbit-app/src/components/WorkspacesSection.tsx:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:39) |
| Workspace | `workspaces.colWorkspace` | [orbit-app/src/components/WorkspacesSection.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:43) |
| State | `workspaces.colState` | [orbit-app/src/components/WorkspacesSection.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:44) |
| This month | `workspaces.colMonth` | [orbit-app/src/components/WorkspacesSection.tsx:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:45) |
| Setting up | `workspaces.provisioning` | [orbit-app/src/components/WorkspacesSection.tsx:51](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:51) |
| Needs recovery | `workspaces.error` | [orbit-app/src/components/WorkspacesSection.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:52) |
| Data retained | `workspaces.retained` | [orbit-app/src/components/WorkspacesSection.tsx:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:53) |
| Suspended | `workspaces.suspended` | [orbit-app/src/components/WorkspacesSection.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:54) |
| Running | `workspaces.running` | [orbit-app/src/components/WorkspacesSection.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:54) |
| Contact the server operator to inspect or recover this workspace. | `workspaces.recoveryHint` | [orbit-app/src/components/WorkspacesSection.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:60) |
| {turns} turns this month | `workspaces.turns` | [orbit-app/src/components/WorkspacesSection.tsx:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:63) |
| Users | `workspaces.users` | [orbit-app/src/components/WorkspacesSection.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:68) |
| Resume | `workspaces.resume` | [orbit-app/src/components/WorkspacesSection.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:69) |
| Suspend | `workspaces.suspend` | [orbit-app/src/components/WorkspacesSection.tsx:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:69) |
| Delete | `workspaces.delete` | [orbit-app/src/components/WorkspacesSection.tsx:272](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:272) |
| Name | `workspaces.name` | [orbit-app/src/components/WorkspacesSection.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:117) |
| Admin email | `workspaces.adminEmail` | [orbit-app/src/components/WorkspacesSection.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:123) |
| Members (optional) | `workspaces.members` | [orbit-app/src/components/WorkspacesSection.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:127) |
| Monthly spend limit (USD, optional) | `workspaces.cap` | [orbit-app/src/components/WorkspacesSection.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:131) |
| Anthropic API key for this workspace (optional) | `workspaces.anthropicKey` | [orbit-app/src/components/WorkspacesSection.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:135) |
| The name becomes the address. The admin signs in with an emailed code; members get chat and approvals. A key here runs the workspace's Claude bots on it and is never shown again. | `workspaces.createHint` | [orbit-app/src/components/WorkspacesSection.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:138) |
| Creating… this takes about a minute. | `workspaces.creating` | [orbit-app/src/components/WorkspacesSection.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:142) |
| Create workspace | `workspaces.create` | [orbit-app/src/components/WorkspacesSection.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:142) |
| Who may sign in to {slug} | `workspaces.usersTitle` | [orbit-app/src/components/WorkspacesSection.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:170) |
| Email or @domain | `workspaces.email` | [orbit-app/src/components/WorkspacesSection.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:172) |
| chat and approvals only | `workspaces.chatOnly` | [orbit-app/src/components/WorkspacesSection.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:173) |
| Working… | `workspaces.working` | [orbit-app/src/components/WorkspacesSection.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:257) |
| Add | `workspaces.addUser` | [orbit-app/src/components/WorkspacesSection.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:174) |
| Remove | `workspaces.removeUser` | [orbit-app/src/components/WorkspacesSection.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:175) |
| Every running workspace restarted on the new release. | `workspaces.upgraded` | [orbit-app/src/components/WorkspacesSection.tsx:241](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:241) |
| Client workspaces | `workspaces.title` | [orbit-app/src/components/WorkspacesSection.tsx:253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:253) |
| Each workspace on this server is its own account, service, data and sign-in list at its own address. Create one, manage who may sign in, pause or remove it, and upgrade them all in one go. | `workspaces.subtitle` | [orbit-app/src/components/WorkspacesSection.tsx:253](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:253) |
| Refresh | `workspaces.refresh` | [orbit-app/src/components/WorkspacesSection.tsx:255](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:255) |
| New workspace | `workspaces.new` | [orbit-app/src/components/WorkspacesSection.tsx:256](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:256) |
| Upgrade all | `workspaces.upgradeAll` | [orbit-app/src/components/WorkspacesSection.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:257) |
| Checking… | `common.checking` | [orbit-app/src/components/WorkspacesSection.tsx:262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:262) |
| Delete {slug}? | `workspaces.deleteTitle` | [orbit-app/src/components/WorkspacesSection.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:270) |
| Keep the data folder | `workspaces.keepData` | [orbit-app/src/components/WorkspacesSection.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:278) |

## orbit-app/src/orbit/ArtifactCard.tsx

Fonte: [orbit-app/src/orbit/ArtifactCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Go to {name} | `orbit.offer.go` | [orbit-app/src/orbit/ArtifactCard.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:32) |
| {name} wants to show you {file} | `orbit.offer.aria` | [orbit-app/src/orbit/ArtifactCard.tsx:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:32) |
| View | `orbit.offer.view` | [orbit-app/src/orbit/ArtifactCard.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:42) |
| Later | `orbit.offer.later` | [orbit-app/src/orbit/ArtifactCard.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:43) |
| {name} is showing you | `orbit.offer.showing` | [orbit-app/src/orbit/ArtifactCard.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:87) |
| Talk to {name} | `orbit.offer.talk` | [orbit-app/src/orbit/ArtifactCard.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:104) |
| Close | `common.close` | [orbit-app/src/orbit/ArtifactCard.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:107) |
| Reply to {name} | `orbit.offer.reply` | [orbit-app/src/orbit/ArtifactCard.tsx:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:133) |
| Send | `orbit.offer.send` | [orbit-app/src/orbit/ArtifactCard.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:135) |
| {name}'s screen | `computer.screenOf` | [orbit-app/src/orbit/ArtifactCard.tsx:190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:190) |
| Waiting for the next frame… | `orbit.offer.screenWaiting` | [orbit-app/src/orbit/ArtifactCard.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:191) |
| Reconnecting… | `orbit.offer.reconnecting` | [orbit-app/src/orbit/ArtifactCard.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:206) |
| Live | `orbit.offer.live` | [orbit-app/src/orbit/ArtifactCard.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:197) |
| Paused | `orbit.offer.paused` | [orbit-app/src/orbit/ArtifactCard.tsx:197](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:197) |
| Hand back | `orbit.offer.handBack` | [orbit-app/src/orbit/ArtifactCard.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:202) |
| Take control | `computer.takeControl` | [orbit-app/src/orbit/ArtifactCard.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:202) |
| {name} is paused for you · you have the computer | `orbit.offer.held` | [orbit-app/src/orbit/ArtifactCard.tsx:212](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:212) |
| Open the desktop | `orbit.offer.openDesktop` | [orbit-app/src/orbit/ArtifactCard.tsx:215](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:215) |
| Opening the file… | `orbit.offer.loading` | [orbit-app/src/orbit/ArtifactCard.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:244) |
| Couldn’t open this file: {error} | `orbit.offer.failed` | [orbit-app/src/orbit/ArtifactCard.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:245) |
| {kind} · open on the canvas | `orbit.offer.openOnCanvas` | [orbit-app/src/orbit/ArtifactCard.tsx:269](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:269) |

## orbit-app/src/orbit/artifacts.ts

Fonte: [orbit-app/src/orbit/artifacts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/artifacts.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Computer | `orbit.offer.computer` | [orbit-app/src/orbit/artifacts.ts:95](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/artifacts.ts:95) |

## orbit-app/src/orbit/detail/BotPanels.tsx

Fonte: [orbit-app/src/orbit/detail/BotPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:1). 18 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Default model for groups and new threads. Also updates the selected idle thread; other existing threads keep their model. The list comes from the engine itself. | `orbit.p.engine.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:134) |
| MODEL | `orbit.p.engine.model` | [orbit-app/src/orbit/detail/BotPanels.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:136) |
| Stop this bot's turn before changing its model | `model.busy` | [orbit-app/src/orbit/detail/BotPanels.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:139) |
| {engine} offers one model here. | `orbit.p.engine.oneModel` | [orbit-app/src/orbit/detail/BotPanels.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:139) |
| EFFORT | `orbit.p.engine.effort` | [orbit-app/src/orbit/detail/BotPanels.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:142) |
| EFFORT · NOT SUPPORTED BY THIS ENGINE | `orbit.p.engine.effortNone` | [orbit-app/src/orbit/detail/BotPanels.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:142) |
| Default | `orbit.p.engine.effortDefault` | [orbit-app/src/orbit/detail/BotPanels.tsx:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:144) |
| Driver | `orbit.p.engine.driver` | [orbit-app/src/orbit/detail/BotPanels.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:150) |
| Bot coordination | `orbit.p.engine.coordination` | [orbit-app/src/orbit/detail/BotPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:151) |
| Supported | `orbit.p.engine.supported` | [orbit-app/src/orbit/detail/BotPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:151) |
| Not supported · chat only | `orbit.p.engine.chatOnly` | [orbit-app/src/orbit/detail/BotPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:151) |
| SWITCH ENGINE | `orbit.p.engine.switch` | [orbit-app/src/orbit/detail/BotPanels.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:153) |
| in use | `orbit.p.engine.inUse` | [orbit-app/src/orbit/detail/BotPanels.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:159) |
| ready | `orbit.p.engine.ready` | [orbit-app/src/orbit/detail/BotPanels.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:159) |
| Custom ACP agent | `orbit.p.engine.custom` | [orbit-app/src/orbit/detail/BotPanels.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:165) |
| Set CLI… | `orbit.p.engine.customMeta` | [orbit-app/src/orbit/detail/BotPanels.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:165) |
| Refreshing models… | `orbit.p.engine.refreshing` | [orbit-app/src/orbit/detail/BotPanels.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:168) |
| Refresh {engine} models | `orbit.p.engine.refresh` | [orbit-app/src/orbit/detail/BotPanels.tsx:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:168) |
| Engine settings | `orbit.p.engine.settings` | [orbit-app/src/orbit/detail/BotPanels.tsx:169](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:169) |
| Switch model with Ask permissions? | `model.providerSwitch.title` | [orbit-app/src/orbit/detail/BotPanels.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:173) |
| Switch this thread and the bot default to {model}, with Ask permissions and existing tool approvals cleared for both. Groups and new threads use this default. Other existing threads stay unchanged. You can review access for the new provider afterward. | `model.providerSwitch.botBody` | [orbit-app/src/orbit/detail/BotPanels.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:174) |
| Switch with Ask | `model.providerSwitch.confirm` | [orbit-app/src/orbit/detail/BotPanels.tsx:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:176) |
| WORKS ON | `orbit.p.computer.worksOn` | [orbit-app/src/orbit/detail/BotPanels.tsx:219](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:219) |
| Approve for me on this computer lets the provider’s reviewer act on your own desktop. | `orbit.p.computer.localAuto` | [orbit-app/src/orbit/detail/BotPanels.tsx:226](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:226) |
| Cloud computer | `orbit.p.computer.cloudBackend` | [orbit-app/src/orbit/detail/BotPanels.tsx:230](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:230) |
| Boat | `orbit.p.computer.boatBackend` | [orbit-app/src/orbit/detail/BotPanels.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:250) |
| Your VPS | `orbit.p.computer.vps` | [orbit-app/src/orbit/detail/BotPanels.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:250) |
| This bot's engine can't drive a VPS | `orbit.p.computer.vpsUnsupported` | [orbit-app/src/orbit/detail/BotPanels.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:233) |
| What Auto may use when a task needs a cloud computer. Looking here doesn't start one. | `orbit.p.computer.autoCloudNote` | [orbit-app/src/orbit/detail/BotPanels.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:236) |
| VPS | `orbit.p.computer.vpsTitle` | [orbit-app/src/orbit/detail/BotPanels.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:239) |
| Start the VPS automatically | `orbit.p.computer.autoStartVps` | [orbit-app/src/orbit/detail/BotPanels.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:239) |
| Lets Auto create or wake this bot's container when a task needs it. | `orbit.p.computer.autoStartVpsDesc` | [orbit-app/src/orbit/detail/BotPanels.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:239) |
| open the live screen | `orbit.p.computer.openScreen` | [orbit-app/src/orbit/detail/BotPanels.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:243) |
| Live · agent cursor | `orbit.p.computer.live` | [orbit-app/src/orbit/detail/BotPanels.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:243) |
| Idle | `orbit.p.computer.asleep` | [orbit-app/src/orbit/detail/BotPanels.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:243) |
| Working folder | `orbit.p.computer.folder` | [orbit-app/src/orbit/detail/BotPanels.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:270) |
| Private workspace | `orbit.p.computer.privateFolder` | [orbit-app/src/orbit/detail/BotPanels.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:248) |
| This thread works in | `orbit.p.computer.pinned` | [orbit-app/src/orbit/detail/BotPanels.tsx:249](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:249) |
| Provider | `orbit.p.computer.provider` | [orbit-app/src/orbit/detail/BotPanels.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:250) |
| Active routines | `orbit.p.computer.routines` | [orbit-app/src/orbit/detail/BotPanels.tsx:251](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:251) |
| Take control | `orbit.p.computer.takeControl` | [orbit-app/src/orbit/detail/BotPanels.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:254) |
| Open VM | `orbit.p.computer.openVm` | [orbit-app/src/orbit/detail/BotPanels.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:254) |
| Open desktop | `orbit.p.computer.openDesktop` | [orbit-app/src/orbit/detail/BotPanels.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:254) |
| Open the computer panel | `orbit.p.computer.openPanel` | [orbit-app/src/orbit/detail/BotPanels.tsx:256](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:256) |
| Choose working folder… | `orbit.p.computer.chooseFolder` | [orbit-app/src/orbit/detail/BotPanels.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:257) |
| Use its private folder | `orbit.p.computer.clearFolder` | [orbit-app/src/orbit/detail/BotPanels.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:258) |
| Private bot folder, or an absolute path | `orbit.p.computer.folderPlaceholder` | [orbit-app/src/orbit/detail/BotPanels.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:270) |
| Save | `common.save` | [orbit-app/src/orbit/detail/BotPanels.tsx:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:273) |
| computer is off | `orbit.p.browser.computerOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:300) |
| This server has no browser engine. | `browser.noEngine` | [orbit-app/src/orbit/detail/BotPanels.tsx:301](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:301) |
| switched off in Experimental | `orbit.p.browser.featureOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:302](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:302) |
| this engine can’t use it | `orbit.p.browser.engineCant` | [orbit-app/src/orbit/detail/BotPanels.tsx:303](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:303) |
| Own browser, own logins | `orbit.p.browser.titleOn` | [orbit-app/src/orbit/detail/BotPanels.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:305) |
| Browser off | `orbit.p.browser.titleOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:305) |
| A browser tab inside the app with a profile just for this bot, so logins survive restarts. Grab the mouse for a login or CAPTCHA, then hand it back. | `orbit.p.browser.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:305) |
| browser viewport | `orbit.p.browser.viewport` | [orbit-app/src/orbit/detail/BotPanels.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:306) |
| Browsing | `orbit.p.browser.browsing` | [orbit-app/src/orbit/detail/BotPanels.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:306) |
| Idle | `orbit.p.browser.idle` | [orbit-app/src/orbit/detail/BotPanels.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:306) |
| Profile | `orbit.p.browser.profile` | [orbit-app/src/orbit/detail/BotPanels.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:309) |
| This bot’s own profile | `orbit.p.browser.ownProfile` | [orbit-app/src/orbit/detail/BotPanels.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:309) |
| BROWSER ACCESS | `orbit.p.browser.access` | [orbit-app/src/orbit/detail/BotPanels.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:311) |
| Built-in browser | `orbit.p.browser.builtin` | [orbit-app/src/orbit/detail/BotPanels.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:312) |
| Give this bot a built-in browser | `orbit.p.browser.builtinLabel` | [orbit-app/src/orbit/detail/BotPanels.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:312) |
| Browser profiles | `orbit.p.browser.profiles` | [orbit-app/src/orbit/detail/BotPanels.tsx:315](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:315) |
| Phones | `orbit.p.phone.title` | [orbit-app/src/orbit/detail/BotPanels.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:326) |
| Connect an Android phone so the bot can tap, type and read its screen. Separately, the iPhone and Android companion apps let you chat, approve and call your bots from anywhere. | `orbit.p.phone.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:326) |
| Open the device panel | `orbit.p.phone.android` | [orbit-app/src/orbit/detail/BotPanels.tsx:328](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:328) |
| Pair a phone | `orbit.p.phone.pair` | [orbit-app/src/orbit/detail/BotPanels.tsx:329](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:329) |
| MCP servers · {mcp} on | `orbit.p.apps.titleMcp` | [orbit-app/src/orbit/detail/BotPanels.tsx:352](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:352) |
| MCP servers give this bot tools: Linear, GitHub, a database, a browser. Find them in Explore, or add your own. Commands run on this computer with the variables you provide; URL servers get the headers you set. | `orbit.p.apps.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:353](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:353) |
| MCP SERVERS | `orbit.p.apps.mcp` | [orbit-app/src/orbit/detail/BotPanels.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:354) |
| Could not refresh MCP servers. | `botAccess.mcpRefreshError` | [orbit-app/src/orbit/detail/BotPanels.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:354) |
| Loading MCP servers… | `mcp.loading` | [orbit-app/src/orbit/detail/BotPanels.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:354) |
| No MCP servers added yet. | `botAccess.mcpEmpty` | [orbit-app/src/orbit/detail/BotPanels.tsx:354](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:354) |
| Switched off under Plugins — test it and turn it on there first. | `botAccess.mcpDisabled` | [orbit-app/src/orbit/detail/BotPanels.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:357) |
| Let this bot use {name} | `botAccess.mcpAllow` | [orbit-app/src/orbit/detail/BotPanels.tsx:359](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:359) |
| Wait until this bot finishes all active tasks before changing its MCP servers. | `botAccess.mcpBusy` | [orbit-app/src/orbit/detail/BotPanels.tsx:362](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:362) |
| WEBHOOKS | `orbit.p.apps.webhooks` | [orbit-app/src/orbit/detail/BotPanels.tsx:364](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:364) |
| {count} deliveries | `orbit.p.apps.deliveries` | [orbit-app/src/orbit/detail/BotPanels.tsx:366](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:366) |
| Explore MCP servers | `orbit.p.apps.browse` | [orbit-app/src/orbit/detail/BotPanels.tsx:370](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:370) |
| Add an MCP server… | `botAccess.mcpAdd` | [orbit-app/src/orbit/detail/BotPanels.tsx:371](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:371) |
| Use every enabled server | `botAccess.mcpUseAll` | [orbit-app/src/orbit/detail/BotPanels.tsx:372](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:372) |
| Retry | `connectors.action.retry` | [orbit-app/src/orbit/detail/BotPanels.tsx:373](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:373) |
| Work {name} delegates runs with Full access, whatever each teammate’s own level. | `orbit.p.approvals.chiefFull` | [orbit-app/src/orbit/detail/BotPanels.tsx:412](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:412) |
| Work delegated by {name} runs with Full access. | `orbit.p.approvals.delegatedFull` | [orbit-app/src/orbit/detail/BotPanels.tsx:413](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:413) |
| Stop this bot's turn before changing its approval level | `approvalMode.busy` | [orbit-app/src/orbit/detail/BotPanels.tsx:414](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:414) |
| Full access is enabled only from the desktop app. | `orbit.p.approvals.fullDesktop` | [orbit-app/src/orbit/detail/BotPanels.tsx:415](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:415) |
| Each level is the engine’s own permission mode, passed straight through. It applies to new threads, routines and work delegated to this bot. | `orbit.p.approvals.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:418](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:418) |
| APPROVAL LEVEL | `orbit.p.approvals.level` | [orbit-app/src/orbit/detail/BotPanels.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:419) |
| Role | `orbit.p.approvals.role` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| built in · works across every team | `orbit.agent.scope` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| Chief of Staff · {team} | `orbit.p.approvals.chiefOf` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| Member | `orbit.p.approvals.member` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| reports to {name} | `orbit.reportsTo` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| reports to you | `orbit.reportsToYou` | [orbit-app/src/orbit/detail/BotPanels.tsx:423](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:423) |
| Always allowed | `orbit.p.approvals.always` | [orbit-app/src/orbit/detail/BotPanels.tsx:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:424) |
| {count} tools | `orbit.p.approvals.tools` | [orbit-app/src/orbit/detail/BotPanels.tsx:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:424) |
| Engine | `orbit.p.approvals.engine` | [orbit-app/src/orbit/detail/BotPanels.tsx:425](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:425) |
| ALWAYS ALLOWED · TAP TO REVOKE | `orbit.p.approvals.revoke` | [orbit-app/src/orbit/detail/BotPanels.tsx:428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:428) |
| TEAM | `orbit.p.approvals.team` | [orbit-app/src/orbit/detail/BotPanels.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:430) |
| Ask me before contacting other bots | `orbit.p.approvals.askPeers` | [orbit-app/src/orbit/detail/BotPanels.tsx:431](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:431) |
| This engine cannot contact other bots | `orbit.p.approvals.cantCoordinate` | [orbit-app/src/orbit/detail/BotPanels.tsx:450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:450) |
| Chief of {team} | `orbit.p.approvals.chiefSwitch` | [orbit-app/src/orbit/detail/BotPanels.tsx:432](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:432) |
| takes over from {name} | `orbit.p.approvals.fromChief` | [orbit-app/src/orbit/detail/BotPanels.tsx:432](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:432) |
| Apply Full access to all threads | `orbit.p.approvals.applyAll` | [orbit-app/src/orbit/detail/BotPanels.tsx:448](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:448) |
| Manage command allowlist | `commandAllowlist.manage` | [orbit-app/src/orbit/detail/BotPanels.tsx:449](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:449) |
| Default voice | `orbit.p.voice.default` | [orbit-app/src/orbit/detail/BotPanels.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:475) |
| Replies can be read aloud as they land. On a call the bot narrates what it’s doing and takes approvals out loud with a clear “yes” or “no”. | `orbit.p.voice.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:475) |
| VOICE | `orbit.p.voice.list` | [orbit-app/src/orbit/detail/BotPanels.tsx:476](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:476) |
| Read replies aloud | `orbit.p.voice.aloud` | [orbit-app/src/orbit/detail/BotPanels.tsx:477](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:477) |
| Alerts | `orbit.p.voice.alerts` | [orbit-app/src/orbit/detail/BotPanels.tsx:478](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:478) |
| when it finishes or needs input | `orbit.p.voice.alertsOn` | [orbit-app/src/orbit/detail/BotPanels.tsx:478](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:478) |
| off · this bot stays quiet | `orbit.p.voice.alertsOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:478](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:478) |
| Voice notes | `orbit.p.voice.notes` | [orbit-app/src/orbit/detail/BotPanels.tsx:480](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:480) |
| it can send spoken notes | `orbit.p.voice.notesOn` | [orbit-app/src/orbit/detail/BotPanels.tsx:480](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:480) |
| off · text replies only | `orbit.p.voice.notesOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:480](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:480) |
| Let this bot send voice notes | `orbit.p.voice.notesLabel` | [orbit-app/src/orbit/detail/BotPanels.tsx:481](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:481) |
| Call {name} | `orbit.p.voice.call` | [orbit-app/src/orbit/detail/BotPanels.tsx:487](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:487) |
| Voice keys | `orbit.p.voice.keys` | [orbit-app/src/orbit/detail/BotPanels.tsx:488](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:488) |
| {count} turns | `orbit.p.usage.turns` | [orbit-app/src/orbit/detail/BotPanels.tsx:502](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:502) |
| No usage recorded yet for this bot. | `orbit.p.usage.none` | [orbit-app/src/orbit/detail/BotPanels.tsx:503](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:503) |
| What this bot has spent across its tasks, as reported by its engine. Cost {caption}. | `orbit.p.usage.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:503](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:503) |
| This engine doesn’t report a price; tokens are counted. | `orbit.p.usage.unpriced` | [orbit-app/src/orbit/detail/BotPanels.tsx:503](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:503) |
| Turns | `orbit.p.usage.turnsRow` | [orbit-app/src/orbit/detail/BotPanels.tsx:505](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:505) |
| Tokens | `orbit.p.usage.tokens` | [orbit-app/src/orbit/detail/BotPanels.tsx:506](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:506) |
| Cost | `orbit.p.usage.cost` | [orbit-app/src/orbit/detail/BotPanels.tsx:507](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:507) |
| All bots → | `orbit.p.usage.all` | [orbit-app/src/orbit/detail/BotPanels.tsx:509](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:509) |
| {count} routines active | `orbit.p.routines.title` | [orbit-app/src/orbit/detail/BotPanels.tsx:530](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:530) |
| Runs on a schedule (once, weekdays, every N minutes, or cron) or when a webhook arrives, using this bot’s model and computer. Each run starts with fresh context. | `orbit.p.routines.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:530](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:530) |
| {count} runs need a look — they failed or stopped and you haven’t seen them yet. | `orbit.p.routines.failed` | [orbit-app/src/orbit/detail/BotPanels.tsx:531](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:531) |
| SCHEDULE | `orbit.p.routines.schedule` | [orbit-app/src/orbit/detail/BotPanels.tsx:532](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:532) |
| Loading… | `orbit.panel.loading` | [orbit-app/src/orbit/detail/BotPanels.tsx:597](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:597) |
| No routines yet. | `orbit.p.routines.none` | [orbit-app/src/orbit/detail/BotPanels.tsx:532](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:532) |
| Off | `orbit.p.routines.off` | [orbit-app/src/orbit/detail/BotPanels.tsx:541](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:541) |
| Next run | `orbit.p.routines.next` | [orbit-app/src/orbit/detail/BotPanels.tsx:541](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:541) |
| Last run | `orbit.p.routines.last` | [orbit-app/src/orbit/detail/BotPanels.tsx:542](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:542) |
| Hasn't run yet | `orbit.p.routines.never` | [orbit-app/src/orbit/detail/BotPanels.tsx:542](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:542) |
| Runs with | `routines.runsWith` | [orbit-app/src/orbit/detail/BotPanels.tsx:543](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:543) |
| the bot's default | `orbit.p.routines.botDefault` | [orbit-app/src/orbit/detail/BotPanels.tsx:543](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:543) |
| Turn off | `orbit.p.routines.turnOff` | [orbit-app/src/orbit/detail/BotPanels.tsx:546](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:546) |
| Turn on | `orbit.p.routines.turnOn` | [orbit-app/src/orbit/detail/BotPanels.tsx:546](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:546) |
| Starting… | `orbit.p.routines.starting` | [orbit-app/src/orbit/detail/BotPanels.tsx:547](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:547) |
| Run now | `orbit.p.routines.runNow` | [orbit-app/src/orbit/detail/BotPanels.tsx:547](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:547) |
| Edit | `orbit.p.routines.edit` | [orbit-app/src/orbit/detail/BotPanels.tsx:551](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:551) |
| Run logs | `orbit.p.routines.logs` | [orbit-app/src/orbit/detail/BotPanels.tsx:552](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:552) |
| Mark failures as seen | `orbit.p.routines.markSeen` | [orbit-app/src/orbit/detail/BotPanels.tsx:558](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:558) |
| New routine | `orbit.p.routines.new` | [orbit-app/src/orbit/detail/BotPanels.tsx:559](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:559) |
| All run logs | `orbit.p.routines.allLogs` | [orbit-app/src/orbit/detail/BotPanels.tsx:560](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:560) |
| Open calendar | `orbit.panel.openCalendar` | [orbit-app/src/orbit/detail/BotPanels.tsx:561](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:561) |
| {count} changes | `orbit.p.history.count` | [orbit-app/src/orbit/detail/BotPanels.tsx:594](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:594) |
| Settings history | `orbit.p.history.title` | [orbit-app/src/orbit/detail/BotPanels.tsx:594](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:594) |
| Every settings change for this bot. Undo puts the previous value back. | `orbit.p.history.desc` | [orbit-app/src/orbit/detail/BotPanels.tsx:595](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:595) |
| Couldn’t load history. | `orbit.p.history.error` | [orbit-app/src/orbit/detail/BotPanels.tsx:596](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:596) |
| CHANGES | `orbit.p.history.changes` | [orbit-app/src/orbit/detail/BotPanels.tsx:597](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:597) |
| No changes yet. | `orbit.p.history.none` | [orbit-app/src/orbit/detail/BotPanels.tsx:597](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:597) |
| Undo | `orbit.p.history.undo` | [orbit-app/src/orbit/detail/BotPanels.tsx:608](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:608) |
| Undo this change? | `orbit.p.history.confirmTitle` | [orbit-app/src/orbit/detail/BotPanels.tsx:606](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:606) |
| Puts the previous value back. The current value stays in history. | `orbit.p.history.confirmBody` | [orbit-app/src/orbit/detail/BotPanels.tsx:607](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:607) |

## orbit-app/src/orbit/detail/HubPanels.tsx

Fonte: [orbit-app/src/orbit/detail/HubPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:1). 19 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Team actions | `orbit.team.menu` | [orbit-app/src/orbit/detail/HubPanels.tsx:88](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:88) |
| Add bots | `orbit.hub.p.addBots` | [orbit-app/src/orbit/detail/HubPanels.tsx:448](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:448) |
| Rename team | `orbit.team.rename` | [orbit-app/src/orbit/detail/HubPanels.tsx:94](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:94) |
| Share team… | `team.share` | [orbit-app/src/orbit/detail/HubPanels.tsx:450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:450) |
| Delete team… | `orbit.team.delete` | [orbit-app/src/orbit/detail/HubPanels.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:97) |
| ({count} archived) | `orbit.team.deleteArchived` | [orbit-app/src/orbit/detail/HubPanels.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:130) |
| Delete {name}? | `orbit.team.deleteTitle` | [orbit-app/src/orbit/detail/HubPanels.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:147) |
| What happens to its bots and channels | `orbit.team.deleteChoice` | [orbit-app/src/orbit/detail/HubPanels.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:149) |
| Move them to General | `orbit.team.deleteKeep` | [orbit-app/src/orbit/detail/HubPanels.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:150) |
| They keep all their history in General: {things}. Only the team and its instructions go. | `orbit.team.deleteKeepDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:150) |
|  and  | `orbit.team.and` | [orbit-app/src/orbit/detail/HubPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:151) |
| Delete them too | `orbit.team.deleteAll` | [orbit-app/src/orbit/detail/HubPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:151) |
| This deletes {things}, then the team, its instructions and routines. It can't be undone. | `orbit.team.deleteWith` | [orbit-app/src/orbit/detail/HubPanels.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:151) |
| The team is empty. This removes it, with its instructions. | `orbit.team.deleteEmpty` | [orbit-app/src/orbit/detail/HubPanels.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:154) |
| Cancel | `common.cancel` | [orbit-app/src/orbit/detail/HubPanels.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:158) |
| Deleting… | `orbit.team.deleting` | [orbit-app/src/orbit/detail/HubPanels.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:160) |
| Delete team | `orbit.team.deleteConfirm` | [orbit-app/src/orbit/detail/HubPanels.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:160) |
| Delete team and bots | `orbit.team.deleteAllConfirm` | [orbit-app/src/orbit/detail/HubPanels.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:160) |
| Hide settings | `orbit.hub.lessSettings` | [orbit-app/src/orbit/detail/HubPanels.tsx:175](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:175) |
| {count} ready | `orbit.hub.v.signedIn` | [orbit-app/src/orbit/detail/HubPanels.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:186) |
| {count} keys saved | `orbit.hub.v.keys` | [orbit-app/src/orbit/detail/HubPanels.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:191) |
| write-only | `orbit.hub.v.writeOnly` | [orbit-app/src/orbit/detail/HubPanels.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:191) |
| Explore MCP servers | `orbit.hub.v.appsExplore` | [orbit-app/src/orbit/detail/HubPanels.tsx:193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:193) |
| MCP servers from the registry | `orbit.hub.v.appsAndMcp` | [orbit-app/src/orbit/detail/HubPanels.tsx:193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:193) |
| Phones & computers | `orbit.hub.v.devices` | [orbit-app/src/orbit/detail/HubPanels.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:194) |
| pair with a code | `orbit.hub.v.pair` | [orbit-app/src/orbit/detail/HubPanels.tsx:194](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:194) |
| {spent} of {budget} | `orbit.hub.v.spendOf` | [orbit-app/src/orbit/detail/HubPanels.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:198) |
| {pct}% of the monthly budget | `orbit.hub.v.pct` | [orbit-app/src/orbit/detail/HubPanels.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:198) |
| across every task | `orbit.hub.v.allTime` | [orbit-app/src/orbit/detail/HubPanels.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:198) |
| add one from a bot | `orbit.hub.v.addFromBot` | [orbit-app/src/orbit/detail/HubPanels.tsx:202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:202) |
| Install a team | `orbit.val.install` | [orbit-app/src/orbit/detail/HubPanels.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:204) |
| from Markdown | `orbit.hub.v.fromMarkdown` | [orbit-app/src/orbit/detail/HubPanels.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:204) |
| {count} skins | `orbit.hub.v.skins` | [orbit-app/src/orbit/detail/HubPanels.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:205) |
| You | `orbit.hub.v.justYou` | [orbit-app/src/orbit/detail/HubPanels.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:206) |
| Owner | `orbit.hub.v.owner` | [orbit-app/src/orbit/detail/HubPanels.tsx:206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:206) |
| This workspace | `orbit.hub.v.workspace` | [orbit-app/src/orbit/detail/HubPanels.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:207) |
| back up & restore | `orbit.hub.v.backups` | [orbit-app/src/orbit/detail/HubPanels.tsx:207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:207) |
| General | `orbit.hub.v.system` | [orbit-app/src/orbit/detail/HubPanels.tsx:208](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:208) |
| Engines | `orbit.hub.p.engines` | [orbit-app/src/orbit/detail/HubPanels.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:224) |
| The agent CLIs on this machine, each with your own login. Point any engine at a custom binary, or add an ACP agent or OpenAI-compatible endpoint with no code. | `orbit.hub.p.enginesDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:224) |
| INSTALLED | `orbit.hub.p.installed` | [orbit-app/src/orbit/detail/HubPanels.tsx:225](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:225) |
| No engines found yet. | `orbit.hub.p.noEngines` | [orbit-app/src/orbit/detail/HubPanels.tsx:225](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:225) |
| configured | `orbit.hub.p.configured` | [orbit-app/src/orbit/detail/HubPanels.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:233) |
| not set | `orbit.hub.p.notSet` | [orbit-app/src/orbit/detail/HubPanels.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:233) |
| Keys & connections | `orbit.hub.p.keys` | [orbit-app/src/orbit/detail/HubPanels.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:235) |
| Paste a key once; it stays on this computer and the fleet reloads instantly. Keys are write-only: the app only ever sees that one is configured. | `orbit.hub.p.keysDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:235) |
| CREDENTIALS | `orbit.hub.p.credentials` | [orbit-app/src/orbit/detail/HubPanels.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:236) |
| Voice provider | `orbit.hub.p.voices` | [orbit-app/src/orbit/detail/HubPanels.tsx:239](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:239) |
| Apps and MCP servers | `orbit.hub.p.apps` | [orbit-app/src/orbit/detail/HubPanels.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:245) |
| Tools your bots can use, from the public MCP registries or your own servers. Each bot chooses which ones it mounts. | `orbit.hub.p.appsDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:245) |
| Explore MCP servers | `orbit.hub.p.browseApps` | [orbit-app/src/orbit/detail/HubPanels.tsx:247](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:247) |
| Installed servers | `orbit.hub.p.mcpServers` | [orbit-app/src/orbit/detail/HubPanels.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:248) |
| Remote access | `orbit.hub.p.remote` | [orbit-app/src/orbit/detail/HubPanels.tsx:252](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:252) |
| Pair a phone or another desktop with a six-digit code over managed HTTPS or Tailscale. A paired desktop runs as a client of this host; cloud-desktop access stays off per device until you grant it. | `orbit.hub.p.remoteDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:252](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:252) |
| Usage | `orbit.hub.p.usage` | [orbit-app/src/orbit/detail/HubPanels.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:259) |
| Tokens and cost per bot. A monthly spend limit warns at a threshold you choose. | `orbit.hub.p.usageDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:259) |
| {spent} of {budget} · warns at {warn}% | `orbit.hub.p.budget` | [orbit-app/src/orbit/detail/HubPanels.tsx:260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:260) |
| BY BOT | `orbit.hub.p.byBot` | [orbit-app/src/orbit/detail/HubPanels.tsx:261](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:261) |
| No usage recorded yet for this bot. | `orbit.p.usage.none` | [orbit-app/src/orbit/detail/HubPanels.tsx:261](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:261) |
| tokens | `orbit.hub.p.tokens` | [orbit-app/src/orbit/detail/HubPanels.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:263) |
| Calendar & run logs | `orbit.hub.p.calendar` | [orbit-app/src/orbit/detail/HubPanels.tsx:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:273) |
| Every routine across your teams. Missed runs get a receipt, overlapping runs are skipped, and an optional run limit stops stuck work. | `orbit.hub.p.calendarDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:273) |
| View | `calendar.viewLabel` | [orbit-app/src/orbit/detail/HubPanels.tsx:275](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:275) |
| Schedule | `calendar.tab.schedule` | [orbit-app/src/orbit/detail/HubPanels.tsx:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:276) |
| Run logs | `routines.logs` | [orbit-app/src/orbit/detail/HubPanels.tsx:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:276) |
| Webhooks | `calendar.tab.webhooks` | [orbit-app/src/orbit/detail/HubPanels.tsx:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:276) |
| SHOW | `orbit.hub.p.show` | [orbit-app/src/orbit/detail/HubPanels.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:278) |
| All | `orbit.hub.p.all` | [orbit-app/src/orbit/detail/HubPanels.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:279) |
| Problems | `orbit.hub.p.problems` | [orbit-app/src/orbit/detail/HubPanels.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:279) |
| Active | `orbit.hub.p.active` | [orbit-app/src/orbit/detail/HubPanels.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:279) |
| RECENT RUNS | `orbit.hub.p.runs` | [orbit-app/src/orbit/detail/HubPanels.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:281) |
| No runs yet. | `orbit.hub.p.noRuns` | [orbit-app/src/orbit/detail/HubPanels.tsx:281](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:281) |
| Bots | `calendar.bots` | [orbit-app/src/orbit/detail/HubPanels.tsx:289](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:289) |
| Drag {name} onto the schedule | `calendar.dragBot` | [orbit-app/src/orbit/detail/HubPanels.tsx:291](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:291) |
| Drag onto a time | `calendar.drag` | [orbit-app/src/orbit/detail/HubPanels.tsx:296](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:296) |
| Open full calendar | `orbit.hub.p.openCalendar` | [orbit-app/src/orbit/detail/HubPanels.tsx:476](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:476) |
| Team library | `orbit.hub.p.library` | [orbit-app/src/orbit/detail/HubPanels.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:305) |
| Install a complete team from one Markdown file. You review it first: bots, Chief, channels, connections (off until you approve) and routines (paused). Packages never carry credentials, conversations, permissions, memory or computer access. | `orbit.hub.p.libraryDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:305) |
| Install a team | `orbit.hub.p.install` | [orbit-app/src/orbit/detail/HubPanels.tsx:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:306) |
| Appearance | `orbit.hub.p.appearance` | [orbit-app/src/orbit/detail/HubPanels.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:311) |
| Background | `jarvis.solar.preference.background` | [orbit-app/src/orbit/detail/HubPanels.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:309) |
| A skin restyles the whole app. Bots keep their own colours on the canvas. | `orbit.hub.p.appearanceDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:311) |
| SKINS | `orbit.hub.p.skins` | [orbit-app/src/orbit/detail/HubPanels.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:312) |
| in use | `orbit.p.engine.inUse` | [orbit-app/src/orbit/detail/HubPanels.tsx:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:312) |
| People & organization | `orbit.hub.p.people` | [orbit-app/src/orbit/detail/HubPanels.tsx:315](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:315) |
| Invite people to this workspace. Each person has a role; bot ownership and computer sharing stay per workspace. | `orbit.hub.p.peopleDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:315](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:315) |
| Backups | `orbit.hub.p.workspaces` | [orbit-app/src/orbit/detail/HubPanels.tsx:317](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:317) |
| Everything lives in ~/.orbit on this computer. Back up a workspace or the whole company, and restore on another machine. | `orbit.hub.p.workspacesDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:317](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:317) |
| System | `orbit.hub.p.system` | [orbit-app/src/orbit/detail/HubPanels.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:320) |
| How the app itself behaves: how threads are kept, updates, language and shortcuts. | `orbit.hub.p.systemDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:320) |
| Threads at once | `orbit.hub.p.threadsAtOnce` | [orbit-app/src/orbit/detail/HubPanels.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:322) |
| {count} per bot | `orbit.hub.p.perBot` | [orbit-app/src/orbit/detail/HubPanels.tsx:322](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:322) |
| Language | `orbit.hub.p.language` | [orbit-app/src/orbit/detail/HubPanels.tsx:323](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:323) |
| Shortcuts | `orbit.hub.p.shortcuts` | [orbit-app/src/orbit/detail/HubPanels.tsx:324](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:324) |
| Keyboard shortcuts | `orbit.hub.p.shortcutsAll` | [orbit-app/src/orbit/detail/HubPanels.tsx:327](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:327) |
| Replay the welcome tour | `orbit.hub.p.replay` | [orbit-app/src/orbit/detail/HubPanels.tsx:328](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:328) |
| About {app} | `orbit.pal.about` | [orbit-app/src/orbit/detail/HubPanels.tsx:329](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:329) |
| All settings | `orbit.hub.p.allSettings` | [orbit-app/src/orbit/detail/HubPanels.tsx:333](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:333) |
| Shared instructions | `team.instructions` | [orbit-app/src/orbit/detail/HubPanels.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:361) |
| shared with the team | `orbit.hub.v.shared` | [orbit-app/src/orbit/detail/HubPanels.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:361) |
| Empty | `orbit.hub.v.empty` | [orbit-app/src/orbit/detail/HubPanels.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:361) |
| add team facts | `orbit.hub.v.addFacts` | [orbit-app/src/orbit/detail/HubPanels.tsx:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:361) |
| None assigned | `orbit.hub.v.noComputer` | [orbit-app/src/orbit/detail/HubPanels.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:419) |
| Assign one | `orbit.hub.v.assign` | [orbit-app/src/orbit/detail/HubPanels.tsx:363](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:363) |
| No Chief | `orbit.val.chiefNone` | [orbit-app/src/orbit/detail/HubPanels.tsx:364](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:364) |
| reports to you | `orbit.reportsToYou` | [orbit-app/src/orbit/detail/HubPanels.tsx:364](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:364) |
| none yet | `orbit.hub.v.noneYet` | [orbit-app/src/orbit/detail/HubPanels.tsx:367](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:367) |
| No team | `orbit.noTeam` | [orbit-app/src/orbit/detail/HubPanels.tsx:409](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:409) |
| {team} instructions | `orbit.hub.p.instructions` | [orbit-app/src/orbit/detail/HubPanels.tsx:416](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:416) |
| Shared context every bot in {team} reads on every turn. | `orbit.hub.p.instructionsDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:416](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:416) |
| A Boat computer assigned to the whole team. Moving it to another team keeps its files and signed-in accounts on the computer. | `orbit.hub.p.teamComputerDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:419) |
| State | `orbit.hub.p.state` | [orbit-app/src/orbit/detail/HubPanels.tsx:420](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:420) |
| Used by | `orbit.hub.p.usedBy` | [orbit-app/src/orbit/detail/HubPanels.tsx:420](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:420) |
| Manage team computers | `orbit.hub.p.manageComputers` | [orbit-app/src/orbit/detail/HubPanels.tsx:421](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:421) |
| Chief · {name} | `orbit.teamChief` | [orbit-app/src/orbit/detail/HubPanels.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:430) |
| No Chief of Staff | `orbit.hub.p.noChief` | [orbit-app/src/orbit/detail/HubPanels.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:430) |
| The Chief is your one contact for this team. It delegates, combines results, and handles incidents so failed runs are retried before they reach you. | `orbit.hub.p.chiefDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:430](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:430) |
| MAKE CHIEF | `orbit.hub.p.makeChief` | [orbit-app/src/orbit/detail/HubPanels.tsx:431](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:431) |
| current Chief | `orbit.hub.p.currentChief` | [orbit-app/src/orbit/detail/HubPanels.tsx:432](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:432) |
| {name} stops being Chief | `orbit.team.removeChief` | [orbit-app/src/orbit/detail/HubPanels.tsx:435](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:435) |
| Click a bot to talk to it. | `orbit.hub.p.membersDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:440](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:440) |
| Members | `orbit.hub.members` | [orbit-app/src/orbit/detail/HubPanels.tsx:441](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:441) |
| No bots on this team yet. | `orbit.hub.noMembers` | [orbit-app/src/orbit/detail/HubPanels.tsx:441](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:441) |
| Chief of Staff | `chat.chiefOfStaff` | [orbit-app/src/orbit/detail/HubPanels.tsx:443](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:443) |
| New bot | `orbit.empty.newBot` | [orbit-app/src/orbit/detail/HubPanels.tsx:447](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:447) |
| Rename {name} team | `team.renameAria` | [orbit-app/src/orbit/detail/HubPanels.tsx:449](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:449) |
| Delete {name} team | `team.deleteAria` | [orbit-app/src/orbit/detail/HubPanels.tsx:452](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:452) |
| Delete {name} team? | `team.deleteTitle` | [orbit-app/src/orbit/detail/HubPanels.tsx:456](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:456) |
| This deletes the empty team and its shared instructions. This cannot be undone. | `team.deleteDescription` | [orbit-app/src/orbit/detail/HubPanels.tsx:456](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:456) |
| Delete team | `team.delete` | [orbit-app/src/orbit/detail/HubPanels.tsx:457](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:457) |
| Channels | `orbit.hub.channels` | [orbit-app/src/orbit/detail/HubPanels.tsx:463](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:463) |
| Separate conversations per context, each with its own transcript, shared instructions, working folder and reply rule: the lead replies, everyone replies, or only @mentions. | `orbit.hub.p.channelsDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:462](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:462) |
| No channels with this team's bots. | `orbit.hub.noChannels` | [orbit-app/src/orbit/detail/HubPanels.tsx:463](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:463) |
| everyone replies | `orbit.hub.p.everyone` | [orbit-app/src/orbit/detail/HubPanels.tsx:465](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:465) |
| only @mentions | `orbit.hub.p.mentions` | [orbit-app/src/orbit/detail/HubPanels.tsx:465](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:465) |
| the lead replies | `orbit.hub.p.lead` | [orbit-app/src/orbit/detail/HubPanels.tsx:465](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:465) |
| New channel | `orbit.hub.p.newChannel` | [orbit-app/src/orbit/detail/HubPanels.tsx:467](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:467) |
| {team} routines | `orbit.hub.p.teamRoutines` | [orbit-app/src/orbit/detail/HubPanels.tsx:472](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:472) |
| Scheduled and webhook-triggered runs for this team. | `orbit.hub.p.teamRoutinesDesc` | [orbit-app/src/orbit/detail/HubPanels.tsx:472](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:472) |
| SCHEDULE | `orbit.p.routines.schedule` | [orbit-app/src/orbit/detail/HubPanels.tsx:473](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:473) |
| No routines yet. | `orbit.p.routines.none` | [orbit-app/src/orbit/detail/HubPanels.tsx:473](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:473) |
| {name} shared instructions | `team.instructionsTitle` | [orbit-app/src/orbit/detail/HubPanels.tsx:515](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:515) |
| Keep durable team facts here. Private notes stay in each bot’s own Memory. | `orbit.hub.p.instructionsHint` | [orbit-app/src/orbit/detail/HubPanels.tsx:519](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:519) |
| bytes | `orbit.hub.p.bytes` | [orbit-app/src/orbit/detail/HubPanels.tsx:520](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:520) |
| Saving… | `orbit.p.memory.saving` | [orbit-app/src/orbit/detail/HubPanels.tsx:524](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:524) |
| Save shared instructions | `team.instructionsSave` | [orbit-app/src/orbit/detail/HubPanels.tsx:524](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:524) |
| System language | `orbit.hub.v.systemLanguage` | [orbit-app/src/orbit/detail/HubPanels.tsx:546](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:546) |

## orbit-app/src/orbit/detail/MemoryPanel.tsx

Fonte: [orbit-app/src/orbit/detail/MemoryPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:1). 12 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Put {path} back the way it was. | `orbit.p.memory.reverted` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:100) |
| Delete {name}? The Changes tab can bring it back. | `orbit.p.memory.deleteConfirm` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:105) |
| Memory | `orbit.sys.memory` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:145) |
| Memory | `orbit.p.memory.title` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:145) |
| Plain markdown in this bot’s workspace on this computer. Saving a note is the bot’s choice; use Remember this on any message to save it yourself. | `orbit.p.memory.desc` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:145](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:145) |
| Upkeep | `orbit.p.memory.upkeep` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:156) |
| Memory upkeep | `orbit.p.memory.upkeepSwitch` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:156](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:156) |
| Keeps these notes in shape without the bot having to remember to: it notices facts you mention in chats and files them (core facts here, detail in topic files it creates), and tidies up every night: expired notes are archived, duplicates merged, contradicted notes crossed out. Facts about you are added to About me, where every bot reads them and you can remove any. Every change shows under Changes and can be undone. | `orbit.p.memory.upkeepDesc` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:157](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:157) |
| This bot's engine can't make the quick background model call upkeep uses, so it only archives expired notes and merges exact duplicates. Claude and chat-model engines can do the rest. | `orbit.p.memory.upkeepNoModel` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:158) |
| Tidying… | `orbit.p.memory.tidying` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:161) |
| Tidy up now | `orbit.p.memory.tidyNow` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:161) |
| Last tidy-up {when}: {summary}. | `orbit.p.memory.lastTidy` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:163) |
| Not tidied yet. | `orbit.p.memory.notTidied` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:163](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:163) |
| Topics · {count} | `orbit.p.memory.topics` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:172](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:172) |
| Daily log | `orbit.p.memory.logs` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:173) |
| Changes | `orbit.p.memory.changes` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:174) |
| {name} changed this file while you were editing. Reload to see its version, or overwrite it with yours. | `orbit.p.memory.conflict` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:182) |
| Reload | `orbit.p.memory.reload` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:184) |
| Overwrite with mine | `orbit.p.memory.overwrite` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:185](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:185) |
| Bot memory | `orbit.p.memory.aria` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:190](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:190) |
| Nothing remembered yet. The bot writes durable notes here — or add your own. | `orbit.p.memory.placeholder` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:191) |
| Write the note here. | `orbit.p.memory.topicPlaceholder` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:191) |
| YOUR DRAFT (KEPT) | `orbit.p.memory.kept` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:196](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:196) |
| Daily logs are the bot’s own record of what it did; they are not loaded into conversations and are read-only here. | `orbit.p.memory.logReadOnly` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:201](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:201) |
| Cancel | `common.cancel` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:204) |
| Saving… | `orbit.p.memory.saving` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:205) |
| Save | `orbit.p.memory.save` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:205](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:205) |
| Nothing saved yet. The bot adds notes as it learns, or you can write one yourself. | `orbit.p.memory.empty` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:216](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:216) |
| Edit MEMORY.md | `orbit.p.memory.edit` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:218](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:218) |
| Open | `orbit.p.memory.open` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:223) |
| No topic files yet. | `orbit.p.memory.noTopics` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:224) |
| New topic, e.g. clients | `orbit.p.memory.newTopic` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:227](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:227) |
| Give the topic a name — letters, numbers, spaces, dots or dashes. | `orbit.p.memory.topicName` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:230](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:230) |
| Add topic | `orbit.p.memory.addTopic` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:230](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:230) |
| Read | `orbit.p.memory.read` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:235) |
| No daily logs yet. | `orbit.p.memory.noLogs` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:236](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:236) |
| Undoing… | `orbit.p.memory.undoing` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:243) |
| Undo | `orbit.p.memory.undo` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:243) |
| Loading… | `orbit.panel.loading` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:247](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:247) |
| No changes yet. | `orbit.p.memory.noChanges` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:247](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:247) |
| Open in Obsidian | `orbit.p.memory.obsidian` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:254) |
| Delete | `orbit.p.memory.delete` | [orbit-app/src/orbit/detail/MemoryPanel.tsx:280](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:280) |

## orbit-app/src/orbit/detail/NewBotPanel.tsx

Fonte: [orbit-app/src/orbit/detail/NewBotPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Add at least one email address, or choose Admins only. | `botSettings.visibility.needPeople` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:46) |
| Creating… | `orbit.new.creating` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:149) |
| New Bot | `orbit.new.name` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:100) |
| New bot | `orbit.new.kicker` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:102) |
| Pick a starting point | `orbit.new.title` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:102) |
| A job only fills in the name, job and standing instructions. Nothing is connected, scheduled or given access for you. | `orbit.new.desc` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:103) |
| It joins {team}. | `orbit.new.joins` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:103) |
| Create an agent or team | `jarvis.solar.create.category` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:105](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:105) |
| Agents | `jarvis.solar.create.agents` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:106) |
| Teams | `orbit.new.teams` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:135) |
| Search roles and teams… | `jarvis.solar.create.search` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:109) |
| Who can see it | `botSettings.visibility.title` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:114) |
| Everyone who can sign in | `botSettings.visibility.everyone` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:117) |
| Admins only | `botSettings.visibility.admins` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:118) |
| Only these people | `botSettings.visibility.people` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:119) |
| One email or @company.com per line | `botSettings.visibility.peoplePlaceholder` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:124) |
| Email addresses | `botSettings.visibility.peopleLabel` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:124) |
| Blank bot | `newBot.blank` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:131) |
| No preset instructions. Send it /setup to shape its role. | `newBot.blankDescription` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:131](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:131) |
| Empty team | `orbit.new.emptyTeam` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:138) |
| A team with a name and nothing in it yet; add bots to it afterwards. | `orbit.new.emptyTeamDesc` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:139) |
| On your map · open | `orbit.new.teamOpen` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:151) |
| {count} bots | `orbit.new.teamSize` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:152) |
| No matching roles or teams. Try another search. | `jarvis.solar.create.noMatches` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:161) |
| Cancel | `common.cancel` | [orbit-app/src/orbit/detail/NewBotPanel.tsx:162](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:162) |

## orbit-app/src/orbit/detail/primitives.tsx

Fonte: [orbit-app/src/orbit/detail/primitives.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/primitives.tsx:1). 7 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Back to chat | `orbit.panel.backToChat` | [orbit-app/src/orbit/detail/primitives.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/primitives.tsx:25) |
| Loading… | `orbit.panel.loading` | [orbit-app/src/orbit/detail/primitives.tsx:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/primitives.tsx:63) |

## orbit-app/src/orbit/detail/ProfilePanels.tsx

Fonte: [orbit-app/src/orbit/detail/ProfilePanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:1). 4 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Profile | `orbit.sys.profile` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:31) |
| How this bot introduces itself, and the standing instructions it reads on every turn. | `orbit.p.profile.desc` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:31](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:31) |
| Name | `orbit.p.profile.name` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:33) |
| Role | `orbit.p.profile.role` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:34) |
| What it does | `orbit.p.profile.rolePlaceholder` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:34) |
| Blurb | `orbit.p.profile.blurb` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:36) |
| One line on what this bot is for | `orbit.p.profile.blurbPlaceholder` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:37) |
| STANDING INSTRUCTIONS · SOUL.MD | `orbit.p.profile.soul` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:43](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:43) |
| COLOUR | `orbit.p.profile.colour` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:47) |
| Who can see it | `botSettings.visibility.title` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:58](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:58) |
| Slack | `orbit.p.profile.slack` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:65) |
| Overview | `orbit.p.profile.overview` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:70) |
| Settings history | `orbit.menu.history` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:71) |
| Overview | `orbit.p.overview.kicker` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:101) |
| Couldn’t refresh — showing the last loaded overview. | `orbit.p.overview.stale` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:103) |
| Couldn’t load the overview. | `orbit.p.overview.error` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:104) |
| Status | `orbit.p.overview.status` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:106) |
| Waiting on you | `orbit.val.waiting` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:106) |
| Working | `orbit.val.working` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:106) |
| Idle | `orbit.val.idle` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:106](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:106) |
| Model | `orbit.p.overview.model` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:107) |
| Works on | `orbit.p.overview.works` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:108) |
| Approvals | `orbit.p.overview.approvals` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:109](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:109) |
| Knows | `orbit.p.overview.does` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:110) |
| {count} things it does | `orbit.p.overview.doesCount` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:110) |
| DOES | `orbit.p.overview.doesList` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:114) |
| REACHES | `orbit.p.overview.reaches` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:115) |
| WON’T | `orbit.p.overview.wont` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:116) |
| Nothing held back. | `orbit.p.overview.wontNone` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:116) |
| Optional ways to customize this bot. You can start chatting now. | `botSetup.optional` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:118) |
| Set up | `orbit.p.overview.setup` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:120) |
| WHAT THE MODEL SEES · ~{tokens} TOKENS | `orbit.p.overview.prompt` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:130](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:130) |
| Hide prompt preview | `orbit.p.overview.hidePrompt` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:141) |
| Prompt preview | `orbit.p.overview.showPrompt` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:141) |
| Edit profile | `orbit.p.overview.edit` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:142) |
| Run /setup | `orbit.p.overview.setupCmd` | [orbit-app/src/orbit/detail/ProfilePanels.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:143) |

## orbit-app/src/orbit/detail/SkillsPanel.tsx

Fonte: [orbit-app/src/orbit/detail/SkillsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:1). 7 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Could not load skills. | `orbit.p.skills.loadError` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:112) |
| The skill contents are unavailable; remove and import or learn it again. | `orbit.p.skills.unavailable` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:52) |
| Could not update this skill. | `orbit.p.skills.updateError` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:67) |
| Remove the skill “{name}”? | `orbit.p.skills.removeConfirm` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:70) |
| Could not remove this skill. | `orbit.p.skills.removeError` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:76) |
| Imported {count} — review and turn them on above. | `orbit.p.skills.imported` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:86) |
| Could not import that skill. | `orbit.p.skills.importError` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:89) |
| Skills | `orbit.sys.skills` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:96) |
| {on} of {total} skills on | `orbit.p.skills.title` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:97) |
| No skills yet | `orbit.p.skills.none` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:97) |
| {team} SKILLS | `orbit.p.skills.teamList` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:101) |
| SKILLS | `orbit.p.skills.list` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:101](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:101) |
| No skills yet. Import one below, or let the bot learn one. | `orbit.p.skills.empty` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:102) |
| View {name} | `orbit.p.skills.view` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:113) |
| WAITING FOR YOUR REVIEW | `orbit.p.skills.staged` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:119) |
| GitHub URL or owner/repo | `orbit.p.skills.importPlaceholder` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:124) |
| Importing… | `orbit.p.skills.importing` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:127) |
| Import | `orbit.p.skills.import` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:127](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:127) |
| Browse team playbooks | `orbit.p.skills.library` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:132) |
| Read the skill before it reaches this bot. Turning it on adds it to what the bot can load. | `orbit.p.skills.reviewHint` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:138) |
| Remove | `orbit.p.skills.remove` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:141](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:141) |
| Cancel | `common.cancel` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:142) |
| Turn on | `orbit.p.skills.enable` | [orbit-app/src/orbit/detail/SkillsPanel.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:143) |

## orbit-app/src/orbit/OrbitChrome.tsx

Fonte: [orbit-app/src/orbit/OrbitChrome.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:1). 21 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Team map | `orbit.teamMap` | [orbit-app/src/orbit/OrbitChrome.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:25) |
| Active Threads | `attention.title` | [orbit-app/src/orbit/OrbitChrome.tsx:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:55) |
| active thread | `orbit.activeThreadOne` | [orbit-app/src/orbit/OrbitChrome.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:50) |
| active threads | `orbit.activeThreadMany` | [orbit-app/src/orbit/OrbitChrome.tsx:50](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:50) |
| No active threads | `attention.empty` | [orbit-app/src/orbit/OrbitChrome.tsx:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:56) |
| Working | `chat.activity.working` | [orbit-app/src/orbit/OrbitChrome.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:85) |
| Queued | `task.queued` | [orbit-app/src/orbit/OrbitChrome.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:85) |
| Unread | `task.unread` | [orbit-app/src/orbit/OrbitChrome.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:85) |
| waiting on you | `orbit.waitingOnYou` | [orbit-app/src/orbit/OrbitChrome.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:85) |
| {name} is waiting | `orbit.waitingOne` | [orbit-app/src/orbit/OrbitChrome.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:124) |
| {count} waiting | `orbit.waitingCount` | [orbit-app/src/orbit/OrbitChrome.tsx:124](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:124) |
| Allow all {count} | `orbit.allowAll` | [orbit-app/src/orbit/OrbitChrome.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:143) |
| Allow once | `orbit.allowOnce` | [orbit-app/src/orbit/OrbitChrome.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:143) |
| Deny | `orbit.deny` | [orbit-app/src/orbit/OrbitChrome.tsx:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:146) |
| Open | `orbit.openThread` | [orbit-app/src/orbit/OrbitChrome.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:152) |
| {quick} to type · {talk} to talk | `orbit.agent.hotkeys` | [orbit-app/src/orbit/OrbitChrome.tsx:183](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:183) |
| {key} from anywhere | `orbit.agent.hotkey` | [orbit-app/src/orbit/OrbitChrome.tsx:184](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:184) |
| {key} to talk | `orbit.agent.talkHotkey` | [orbit-app/src/orbit/OrbitChrome.tsx:185](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:185) |
| built in · works across every team | `orbit.agent.scope` | [orbit-app/src/orbit/OrbitChrome.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:186) |
| Needs you | `orbit.agent.needsYou` | [orbit-app/src/orbit/OrbitChrome.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:187) |
| Working… | `orbit.agent.working` | [orbit-app/src/orbit/OrbitChrome.tsx:187](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:187) |
| Open Orbit, your assistant | `orbit.agent.open` | [orbit-app/src/orbit/OrbitChrome.tsx:189](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:189) |
| LINES | `orbit.legend.lines` | [orbit-app/src/orbit/OrbitChrome.tsx:212](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:212) |
| Reports to you | `orbit.legend.reports` | [orbit-app/src/orbit/OrbitChrome.tsx:213](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:213) |
| Team · Chief hands work down | `orbit.legend.chiefDown` | [orbit-app/src/orbit/OrbitChrome.tsx:214](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:214) |
| Can talk · you drew it | `orbit.legend.canTalk` | [orbit-app/src/orbit/OrbitChrome.tsx:215](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:215) |
| Waiting on you | `orbit.legend.waiting` | [orbit-app/src/orbit/OrbitChrome.tsx:216](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:216) |
| GESTURES | `orbit.legend.gestures` | [orbit-app/src/orbit/OrbitChrome.tsx:218](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:218) |
| Click a bot to talk to it | `orbit.legend.clickBot` | [orbit-app/src/orbit/OrbitChrome.tsx:219](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:219) |
| Drag a Chief to move its team | `orbit.legend.dragChief` | [orbit-app/src/orbit/OrbitChrome.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:220) |
| Drag from a bot’s + to connect two bots | `orbit.legend.dragPlus` | [orbit-app/src/orbit/OrbitChrome.tsx:221](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:221) |
| Drag empty space to pan, scroll to zoom | `orbit.legend.pan` | [orbit-app/src/orbit/OrbitChrome.tsx:222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:222) |
| Click You or a team name for settings | `orbit.legend.clickYou` | [orbit-app/src/orbit/OrbitChrome.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:223) |
| Key | `orbit.legend.title` | [orbit-app/src/orbit/OrbitChrome.tsx:229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:229) |
| Zoom out | `orbit.zoomOut` | [orbit-app/src/orbit/OrbitChrome.tsx:233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:233) |
| Zoom in | `orbit.zoomIn` | [orbit-app/src/orbit/OrbitChrome.tsx:234](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:234) |
| Fit | `orbit.fit` | [orbit-app/src/orbit/OrbitChrome.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:235) |
| Chief of Staff | `chat.chiefOfStaff` | [orbit-app/src/orbit/OrbitChrome.tsx:268](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:268) |
| Choose who this goes to | `orbit.composer.to` | [orbit-app/src/orbit/OrbitChrome.tsx:274](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:274) |
| Tell {name} what you want done | `orbit.composer.placeholder` | [orbit-app/src/orbit/OrbitChrome.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:279) |
| Message {name} | `composer.placeholder.bot` | [orbit-app/src/orbit/OrbitChrome.tsx:280](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:280) |
| Send | `chat.send` | [orbit-app/src/orbit/OrbitChrome.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:283) |
| Undo | `orbit.toast.undo` | [orbit-app/src/orbit/OrbitChrome.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:309) |
| Close | `common.close` | [orbit-app/src/orbit/OrbitChrome.tsx:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:311) |
| {a} and {b} | `orbit.line.title` | [orbit-app/src/orbit/OrbitChrome.tsx:343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:343) |
| Let them talk | `orbit.line.talk` | [orbit-app/src/orbit/OrbitChrome.tsx:353](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:353) |

## orbit-app/src/orbit/OrbitSheet.tsx

Fonte: [orbit-app/src/orbit/OrbitSheet.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitSheet.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Close | `common.close` | [orbit-app/src/orbit/OrbitSheet.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitSheet.tsx:102) |

## orbit-app/src/orbit/OrbitShell.tsx

Fonte: [orbit-app/src/orbit/OrbitShell.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1). 15 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| You | `orbit.you` | [orbit-app/src/orbit/OrbitShell.tsx:891](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:891) |
| click to talk | `orbit.clickToTalk` | [orbit-app/src/orbit/OrbitShell.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:64) |
| click for your settings | `orbit.clickForSettings` | [orbit-app/src/orbit/OrbitShell.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:65) |
| waiting on you | `orbit.waitingOnYou` | [orbit-app/src/orbit/OrbitShell.tsx:808](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:808) |
| run stalled | `orbit.runStalled` | [orbit-app/src/orbit/OrbitShell.tsx:808](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:808) |
| Chief · {name} | `orbit.teamChief` | [orbit-app/src/orbit/OrbitShell.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:68) |
| coordinated by {name} | `orbit.teamCoordinated` | [orbit-app/src/orbit/OrbitShell.tsx:911](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:911) |
| no Chief · reports to you | `orbit.teamNoChief` | [orbit-app/src/orbit/OrbitShell.tsx:911](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:911) |
| New bot | `orbit.newBot` | [orbit-app/src/orbit/OrbitShell.tsx:689](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:689) |
| New bot in {team} | `orbit.newBotIn` | [orbit-app/src/orbit/OrbitShell.tsx:811](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:811) |
| can talk | `orbit.canTalk` | [orbit-app/src/orbit/OrbitShell.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:75) |
| their conversation | `orbit.conversation` | [orbit-app/src/orbit/OrbitShell.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:76) |
| {chief} → {team} | `orbit.link.grant` | [orbit-app/src/orbit/OrbitShell.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:77) |
| {a} and {b} are on the same team, so they can already talk | `orbit.link.sameTeam` | [orbit-app/src/orbit/OrbitShell.tsx:243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:243) |
| Only a Chief can work with another team. Make {a} or {b} a Chief first | `orbit.link.needsChief` | [orbit-app/src/orbit/OrbitShell.tsx:245](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:245) |
| {name} has no team yet. Put it on a team first | `orbit.link.noTeam` | [orbit-app/src/orbit/OrbitShell.tsx:248](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:248) |
| {a} already works with {team} | `orbit.link.already` | [orbit-app/src/orbit/OrbitShell.tsx:250](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:250) |
| {a} can now work with {team} | `orbit.link.added` | [orbit-app/src/orbit/OrbitShell.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:258) |
| {a} no longer works with {team} | `orbit.link.removed` | [orbit-app/src/orbit/OrbitShell.tsx:270](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:270) |
| System | `orbit.hub.system` | [orbit-app/src/orbit/OrbitShell.tsx:487](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:487) |
| Solar workspace | `jarvis.solar.workspace` | [orbit-app/src/orbit/OrbitShell.tsx:487](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:487) |
| Development | `jarvis.dev.title` | [orbit-app/src/orbit/OrbitShell.tsx:490](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:490) |
| Files | `jarvis.dev.files` | [orbit-app/src/orbit/OrbitShell.tsx:490](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:490) |
| Code | `jarvis.dev.code` | [orbit-app/src/orbit/OrbitShell.tsx:490](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:490) |
| Background | `jarvis.solar.preference.background` | [orbit-app/src/orbit/OrbitShell.tsx:496](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:496) |
| Orbit — {name} | `orbit.titleBot` | [orbit-app/src/orbit/OrbitShell.tsx:689](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:689) |
| No team | `orbit.noTeam` | [orbit-app/src/orbit/OrbitShell.tsx:908](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:908) |
| Orbit — Team map | `orbit.title` | [orbit-app/src/orbit/OrbitShell.tsx:690](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:690) |
| New | `orbit.newMenu` | [orbit-app/src/orbit/OrbitShell.tsx:730](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:730) |
| New bot | `orbit.newMenu.bot` | [orbit-app/src/orbit/OrbitShell.tsx:736](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:736) |
| New team | `orbit.newMenu.team` | [orbit-app/src/orbit/OrbitShell.tsx:737](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:737) |
| New channel | `orbit.newMenu.channel` | [orbit-app/src/orbit/OrbitShell.tsx:738](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:738) |
| Search or jump · ⌘K | `orbit.search` | [orbit-app/src/orbit/OrbitShell.tsx:749](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:749) |
| New Bot | `orbit.new.name` | [orbit-app/src/orbit/OrbitShell.tsx:903](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:903) |
| Team map | `orbit.map.aria` | [orbit-app/src/orbit/OrbitShell.tsx:800](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:800) |
| {team} team | `orbit.map.team` | [orbit-app/src/orbit/OrbitShell.tsx:804](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:804) |
| Working | `orbit.val.working` | [orbit-app/src/orbit/OrbitShell.tsx:808](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:808) |
| {name} · Owner · this computer hosts every bot | `orbit.hub.youSub` | [orbit-app/src/orbit/OrbitShell.tsx:891](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:891) |
| You | `orbit.hub.v.justYou` | [orbit-app/src/orbit/OrbitShell.tsx:891](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:891) |
| Archived bots | `orbit.hub.archived` | [orbit-app/src/orbit/OrbitShell.tsx:897](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:897) |
| {count} archived | `orbit.hub.archivedCount` | [orbit-app/src/orbit/OrbitShell.tsx:898](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:898) |
| Start from a job, or from nothing. You can change everything afterwards. | `orbit.new.sub` | [orbit-app/src/orbit/OrbitShell.tsx:903](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:903) |
| Chief {name} | `orbit.teamChiefSub` | [orbit-app/src/orbit/OrbitShell.tsx:911](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:911) |
| {a} can ask and hand work to {team} | `orbit.line.talkSub` | [orbit-app/src/orbit/OrbitShell.tsx:950](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:950) |
| Open their conversation | `orbit.line.open` | [orbit-app/src/orbit/OrbitShell.tsx:952](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:952) |
| Everything they asked each other, in one place | `orbit.line.openSub` | [orbit-app/src/orbit/OrbitShell.tsx:952](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:952) |
| New channel with both | `orbit.line.new` | [orbit-app/src/orbit/OrbitShell.tsx:954](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:954) |
| You, {a} and {b} in one channel | `orbit.line.newSub` | [orbit-app/src/orbit/OrbitShell.tsx:954](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:954) |
| Connecting to your workspace… | `jarvis.solar.connecting` | [orbit-app/src/orbit/OrbitShell.tsx:959](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:959) |
| Close | `common.close` | [orbit-app/src/orbit/OrbitShell.tsx:964](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:964) |
| Can’t reach the harness at {host}. Your bots are paused and nothing is lost. | `orbit.offline` | [orbit-app/src/orbit/OrbitShell.tsx:971](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:971) |
| Retry | `orbit.retry` | [orbit-app/src/orbit/OrbitShell.tsx:972](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:972) |
| No AI engine is available. | `jarvis.solar.noEngine` | [orbit-app/src/orbit/OrbitShell.tsx:979](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:979) |
| Configure an engine | `jarvis.solar.configure` | [orbit-app/src/orbit/OrbitShell.tsx:979](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:979) |
| 1 bot added · existing bots and chats kept | `sidebar.teamImportedOne` | [orbit-app/src/orbit/OrbitShell.tsx:1006](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1006) |
| {count} bots added · existing bots and chats kept | `sidebar.teamImportedMany` | [orbit-app/src/orbit/OrbitShell.tsx:1006](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1006) |
| Harness on {host} | `orbit.start.harness` | [orbit-app/src/orbit/OrbitShell.tsx:1031](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1031) |
| Loading bots and threads | `orbit.start.bots` | [orbit-app/src/orbit/OrbitShell.tsx:1032](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1032) |
| Checking engines | `orbit.start.engines` | [orbit-app/src/orbit/OrbitShell.tsx:1033](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1033) |
| Waking computers | `orbit.start.computers` | [orbit-app/src/orbit/OrbitShell.tsx:1034](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1034) |
| Starting {app} | `orbit.start.title` | [orbit-app/src/orbit/OrbitShell.tsx:1040](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1040) |
| checking… | `orbit.start.checking` | [orbit-app/src/orbit/OrbitShell.tsx:1046](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1046) |
| Your canvas is empty | `orbit.empty.title` | [orbit-app/src/orbit/OrbitShell.tsx:1066](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1066) |
| Every bot is a real agent running on engines you already have. Create one, or install a whole team from a Markdown playbook. | `orbit.empty.body` | [orbit-app/src/orbit/OrbitShell.tsx:1067](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1067) |
| Create a bot | `orbit.empty.create` | [orbit-app/src/orbit/OrbitShell.tsx:1069](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1069) |
| Install a team | `orbit.empty.install` | [orbit-app/src/orbit/OrbitShell.tsx:1070](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1070) |
| Check engines | `orbit.empty.engines` | [orbit-app/src/orbit/OrbitShell.tsx:1071](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1071) |
| ENGINES ON THIS COMPUTER | `orbit.empty.enginesHere` | [orbit-app/src/orbit/OrbitShell.tsx:1075](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1075) |
| signed in | `orbit.empty.signedIn` | [orbit-app/src/orbit/OrbitShell.tsx:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1083) |
| installed · not signed in | `orbit.empty.notSignedIn` | [orbit-app/src/orbit/OrbitShell.tsx:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1083) |
| not installed | `orbit.empty.notInstalled` | [orbit-app/src/orbit/OrbitShell.tsx:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1083) |
| Sign in | `orbit.empty.signIn` | [orbit-app/src/orbit/OrbitShell.tsx:1084](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1084) |
| Hidden from the map | `orbit.hub.hidden` | [orbit-app/src/orbit/OrbitShell.tsx:1114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1114) |
| Show on the map | `orbit.hub.showOnMap` | [orbit-app/src/orbit/OrbitShell.tsx:1120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1120) |
| Chat width | `orbit.chatDivider` | [orbit-app/src/orbit/OrbitShell.tsx:1139](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1139) |
| Drag to resize the chat · double-click to reset | `orbit.chatDividerHint` | [orbit-app/src/orbit/OrbitShell.tsx:1142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1142) |

## orbit-app/src/orbit/SettingsPanels.tsx

Fonte: [orbit-app/src/orbit/SettingsPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SettingsPanels.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Back | `orbit.panel.backToYou` | [orbit-app/src/orbit/SettingsPanels.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SettingsPanels.tsx:36) |
| You | `orbit.you` | [orbit-app/src/orbit/SettingsPanels.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SettingsPanels.tsx:37) |
| Settings | `settings.title` | [orbit-app/src/orbit/SettingsPanels.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SettingsPanels.tsx:37) |

## orbit-app/src/orbit/SolarAppearance.tsx

Fonte: [orbit-app/src/orbit/SolarAppearance.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarAppearance.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Background | `jarvis.solar.preference.background` | [orbit-app/src/orbit/SolarAppearance.tsx:7](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarAppearance.tsx:7) |
| Glow | `jarvis.solar.preference.glow` | [orbit-app/src/orbit/SolarAppearance.tsx:11](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarAppearance.tsx:11) |

## orbit-app/src/orbit/SolarChrome.tsx

Fonte: [orbit-app/src/orbit/SolarChrome.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:1). 10 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Add an agent | `jarvis.solar.add` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| An individual specialist | `jarvis.solar.agentDetail` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| Add a team | `jarvis.solar.addTeam` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| A lead and their agents | `jarvis.solar.teamDetail` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| Add a conversation | `jarvis.solar.addChannel` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| Bring people and agents together | `jarvis.solar.conversationDetail` | [orbit-app/src/orbit/SolarChrome.tsx:23](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:23) |
| Solar | `jarvis.solar.brand` | [orbit-app/src/orbit/SolarChrome.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:25) |
| Solar workspace | `jarvis.solar.workspace` | [orbit-app/src/orbit/SolarChrome.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:75) |
| Workspace actions | `jarvis.solar.navigation` | [orbit-app/src/orbit/SolarChrome.tsx:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:26) |
| Search agents, tasks… | `jarvis.solar.search` | [orbit-app/src/orbit/SolarChrome.tsx:27](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:27) |
| Create | `jarvis.solar.create` | [orbit-app/src/orbit/SolarChrome.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:29) |
| Send a message to an agent | `jarvis.solar.messageForm` | [orbit-app/src/orbit/SolarChrome.tsx:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:60) |
| Choose the recipient | `jarvis.solar.recipient` | [orbit-app/src/orbit/SolarChrome.tsx:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:81) |
| Find an agent… | `jarvis.solar.findRecipient` | [orbit-app/src/orbit/SolarChrome.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:73) |
| No agents match this search. | `jarvis.solar.noRecipients` | [orbit-app/src/orbit/SolarChrome.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:76) |
| Dismiss | `jarvis.solar.dismiss` | [orbit-app/src/orbit/SolarChrome.tsx:79](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:79) |
| Listening… | `jarvis.solar.voice.listening` | [orbit-app/src/orbit/SolarChrome.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:80) |
| Message {name}… | `jarvis.solar.message` | [orbit-app/src/orbit/SolarChrome.tsx:82](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:82) |
| Send message | `jarvis.solar.send` | [orbit-app/src/orbit/SolarChrome.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:84) |

## orbit-app/src/orbit/SolarConstellation.tsx

Fonte: [orbit-app/src/orbit/SolarConstellation.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarConstellation.tsx:1). 1 linhas com controlos reconhecidos.

## orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx

Fonte: [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Discard this draft and reload the saved file? | `jarvis.dev.discard` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:87](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:87) |
| Choose a new file name. | `jarvis.dev.exists` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:98) |
| Development | `jarvis.dev.title` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:107) |
| Local workspace | `jarvis.dev.local` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:107) |
| Files | `jarvis.dev.files` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:111) |
| Computer | `orbit.sys.computer` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:108) |
| Close | `common.close` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:113) |
| Refresh files | `jarvis.dev.refresh` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:111) |
| New file | `jarvis.dev.new` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123) |
| File name | `jarvis.dev.filename` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:113) |
| Files belong to this conversation’s local project. Hidden files and linked folders are excluded. | `jarvis.dev.scope` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:115](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:115) |
| Editor | `jarvis.dev.editor` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:117) |
| Unsaved changes | `jarvis.dev.unsaved` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:118) |
| Code | `jarvis.dev.code` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:121) |
| Preview | `jarvis.dev.preview` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:121) |
| Reload saved version | `jarvis.dev.reload` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:120) |
| Save | `jarvis.dev.save` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:120](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:120) |
| lines | `jarvis.dev.lines` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122) |
| Draft retained in this tab | `jarvis.dev.draft` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122) |
| Saved | `jarvis.dev.saved` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122) |
| Static preview · scripts disabled | `jarvis.dev.static` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:122) |
| Build alongside the conversation | `jarvis.dev.start` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123) |
| Open a project file, edit code or write a page. Your agent’s chat stays beside your work. | `jarvis.dev.intro` | [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:123) |

## orbit-app/src/orbit/SolarFocus.tsx

Fonte: [orbit-app/src/orbit/SolarFocus.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarFocus.tsx:1). 1 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Agents | `jarvis.solar.create.agents` | [orbit-app/src/orbit/SolarFocus.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarFocus.tsx:46) |

## orbit-app/src/orbit/SolarMap.tsx

Fonte: [orbit-app/src/orbit/SolarMap.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:1). 9 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Arrangement kept for this session; browser storage is unavailable. | `jarvis.solar.sessionOnly` | [orbit-app/src/orbit/SolarMap.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:153) |
| Arrangement saved · Ctrl/⌘ Z to undo | `jarvis.solar.saved` | [orbit-app/src/orbit/SolarMap.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:154) |
| Jarvis solar system. Open an agent or drag it to arrange the map. | `jarvis.solar.map` | [orbit-app/src/orbit/SolarMap.tsx:199](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:199) |
| The 3D view is unavailable on this device. | `jarvis.solar.renderFailed` | [orbit-app/src/orbit/SolarMap.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:220) |
| Retry | `orbit.retry` | [orbit-app/src/orbit/SolarMap.tsx:220](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:220) |
| Your solar system | `jarvis.solar.system` | [orbit-app/src/orbit/SolarMap.tsx:222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:222) |
| {count} agents · {teams} planets | `jarvis.solar.count` | [orbit-app/src/orbit/SolarMap.tsx:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:223) |
| Open {name} · {status} | `jarvis.solar.open` | [orbit-app/src/orbit/SolarMap.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:235) |
| {name} · click to open, drag to move. Arrow keys move; Shift moves farther. | `jarvis.solar.moveHint` | [orbit-app/src/orbit/SolarMap.tsx:235](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:235) |
| Your first planet starts with an agent. | `jarvis.solar.empty` | [orbit-app/src/orbit/SolarMap.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:257) |
| Add an agent | `jarvis.solar.add` | [orbit-app/src/orbit/SolarMap.tsx:257](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:257) |
| Map controls | `jarvis.solar.controls` | [orbit-app/src/orbit/SolarMap.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:258) |
| Zoom out | `jarvis.solar.zoomOut` | [orbit-app/src/orbit/SolarMap.tsx:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:259) |
| Zoom in | `jarvis.solar.zoomIn` | [orbit-app/src/orbit/SolarMap.tsx:261](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:261) |
| Fit the whole system | `jarvis.solar.fit` | [orbit-app/src/orbit/SolarMap.tsx:263](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:263) |
| Show hierarchy lines | `jarvis.solar.connections` | [orbit-app/src/orbit/SolarMap.tsx:264](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:264) |
| Restore the default arrangement | `jarvis.solar.reset` | [orbit-app/src/orbit/SolarMap.tsx:265](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:265) |
| Drag to arrange | `jarvis.solar.drag` | [orbit-app/src/orbit/SolarMap.tsx:267](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:267) |

## orbit-app/src/orbit/SolarSystemArc.tsx

Fonte: [orbit-app/src/orbit/SolarSystemArc.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarSystemArc.tsx:1). 3 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Previous system | `jarvis.solar.arc.previous` | [orbit-app/src/orbit/SolarSystemArc.tsx:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarSystemArc.tsx:40) |
| Next system | `jarvis.solar.arc.next` | [orbit-app/src/orbit/SolarSystemArc.tsx:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarSystemArc.tsx:42) |
| Drag to browse systems | `jarvis.solar.arc.drag` | [orbit-app/src/orbit/SolarSystemArc.tsx:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarSystemArc.tsx:44) |

## orbit-app/src/orbit/systems.ts

Fonte: [orbit-app/src/orbit/systems.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Streaming | `orbit.st.streaming` | [orbit-app/src/orbit/systems.ts:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:60) |
| Ready | `orbit.st.ready` | [orbit-app/src/orbit/systems.ts:60](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:60) |
| Live · agent cursor | `orbit.st.live` | [orbit-app/src/orbit/systems.ts:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:61) |
| None | `orbit.st.none` | [orbit-app/src/orbit/systems.ts:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:61) |
| Idle | `orbit.st.idle` | [orbit-app/src/orbit/systems.ts:61](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:61) |
| Own profile | `orbit.st.ownProfile` | [orbit-app/src/orbit/systems.ts:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:62) |
| Off | `orbit.val.off` | [orbit-app/src/orbit/systems.ts:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:64) |
| Logins persist | `orbit.st.logins` | [orbit-app/src/orbit/systems.ts:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:62) |
| Not available | `orbit.st.unavailable` | [orbit-app/src/orbit/systems.ts:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:62) |
| Phone | `orbit.st.phone` | [orbit-app/src/orbit/systems.ts:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:63) |
| Pair a phone | `orbit.st.pairPhone` | [orbit-app/src/orbit/systems.ts:63](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:63) |
| Every MCP server | `orbit.st.mcpAll` | [orbit-app/src/orbit/systems.ts:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:64) |
| {count} MCP servers | `orbit.val.mcpCount` | [orbit-app/src/orbit/systems.ts:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:64) |
| MCP servers | `orbit.st.mcpServers` | [orbit-app/src/orbit/systems.ts:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:64) |
| Waiting on you | `orbit.val.waiting` | [orbit-app/src/orbit/systems.ts:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:65) |
| Nothing pending | `orbit.st.nothingPending` | [orbit-app/src/orbit/systems.ts:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:65) |
| {on} of {total} on | `orbit.st.skillsOn` | [orbit-app/src/orbit/systems.ts:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:66) |
| No skills yet | `orbit.st.noSkills` | [orbit-app/src/orbit/systems.ts:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:66) |
| Skills | `orbit.sys.skills` | [orbit-app/src/orbit/systems.ts:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:66) |
| Reusable know-how | `orbit.st.reusable` | [orbit-app/src/orbit/systems.ts:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:66) |
| {lines} / {max} lines | `orbit.st.lines` | [orbit-app/src/orbit/systems.ts:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:67) |
| {count} topics | `orbit.st.topics` | [orbit-app/src/orbit/systems.ts:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:67) |
| Notes between tasks | `orbit.st.notes` | [orbit-app/src/orbit/systems.ts:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:67) |
| {count} active | `orbit.st.active` | [orbit-app/src/orbit/systems.ts:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:68) |
| No routines yet | `orbit.st.noRoutines` | [orbit-app/src/orbit/systems.ts:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:68) |
| Last run failed | `orbit.st.lastFailed` | [orbit-app/src/orbit/systems.ts:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:68) |
| Add one | `orbit.st.addOne` | [orbit-app/src/orbit/systems.ts:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:68) |
| Default voice | `orbit.p.voice.default` | [orbit-app/src/orbit/systems.ts:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:69) |
| Reads replies aloud | `orbit.val.readAloud` | [orbit-app/src/orbit/systems.ts:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:69) |
| Silent | `orbit.st.silent` | [orbit-app/src/orbit/systems.ts:69](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:69) |

## orbit-app/src/shell/QuickBar.tsx

Fonte: [orbit-app/src/shell/QuickBar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:1). 6 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Sent without your screen: Orbit needs Screen Recording to see it. | `orbitShell.screen.deniedSent` | [orbit-app/src/shell/QuickBar.tsx:89](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:89) |
| {name} is taking a while. The answer will be in Orbit when it's ready. | `orbitShell.turnTimedOut` | [orbit-app/src/shell/QuickBar.tsx:99](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:99) |
| Couldn't send: {error} | `orbitShell.quick.sendFailed` | [orbit-app/src/shell/QuickBar.tsx:116](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:116) |
| Tell {name} what you want done | `orbit.composer.placeholder` | [orbit-app/src/shell/QuickBar.tsx:161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:161) |
| Message {name} | `composer.placeholder.bot` | [orbit-app/src/shell/QuickBar.tsx:162](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:162) |
| Talk instead | `orbitShell.quick.talk` | [orbit-app/src/shell/QuickBar.tsx:167](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:167) |
| Stop | `orbitShell.quick.stop` | [orbit-app/src/shell/QuickBar.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:173) |
| Send | `chat.send` | [orbit-app/src/shell/QuickBar.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:178) |
| There's no bot to answer yet. Open Orbit to set one up. | `orbitShell.quick.noAgent` | [orbit-app/src/shell/QuickBar.tsx:191](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:191) |
| Open System Settings | `orbitShell.openSystemSettings` | [orbit-app/src/shell/QuickBar.tsx:198](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:198) |
| Open in Orbit | `orbitShell.quick.openInOrbit` | [orbit-app/src/shell/QuickBar.tsx:210](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:210) |

## orbit-app/src/shell/TalkSurface.tsx

Fonte: [orbit-app/src/shell/TalkSurface.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:1). 2 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| There's no bot to answer yet. Open Orbit to set one up. | `orbitShell.quick.noAgent` | [orbit-app/src/shell/TalkSurface.tsx:215](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:215) |
| {name} is taking a while. The answer will be in Orbit when it's ready. | `orbitShell.turnTimedOut` | [orbit-app/src/shell/TalkSurface.tsx:237](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:237) |
| That didn't go through: {error} | `orbitShell.talk.failed` | [orbit-app/src/shell/TalkSurface.tsx:258](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:258) |
| Orbit is already listening in the app. | `orbitShell.talk.busyElsewhere` | [orbit-app/src/shell/TalkSurface.tsx:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:276) |
| I didn't catch that. | `orbitShell.talk.nothingHeard` | [orbit-app/src/shell/TalkSurface.tsx:285](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:285) |
| I couldn't hear you. Check that Orbit may use the microphone and speech recognition. | `orbitShell.talk.cantHear` | [orbit-app/src/shell/TalkSurface.tsx:336](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:336) |
| Screen access is paused, so I'm only listening. | `orbitShell.talk.paused` | [orbit-app/src/shell/TalkSurface.tsx:346](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:346) |
| Open System Settings | `orbitShell.openSystemSettings` | [orbit-app/src/shell/TalkSurface.tsx:504](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:504) |
| Close | `common.close` | [orbit-app/src/shell/TalkSurface.tsx:507](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:507) |
| Talk to {name} | `orbitShell.talk.label` | [orbit-app/src/shell/TalkSurface.tsx:545](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:545) |

## orbit-app/src/pair/PairPage.tsx

Fonte: [orbit-app/src/pair/PairPage.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:1). 11 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Open the app | `pairPage.ui.openTheApp` | [orbit-app/src/pair/PairPage.tsx:111](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:111) |
| Email | `pairPage.ui.email` | [orbit-app/src/pair/PairPage.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:117) |
| Code from the email | `pairPage.ui.codeFromTheEmail` | [orbit-app/src/pair/PairPage.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:136) |
| This device | `pairPage.ui.thisDevice` | [orbit-app/src/pair/PairPage.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:186) |
| Send a new code | `pairPage.ui.sendANewCode` | [orbit-app/src/pair/PairPage.tsx:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:160) |
| Have a pairing code instead? | `pairPage.ui.haveAPairingCodeInstead` | [orbit-app/src/pair/PairPage.tsx:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:164) |
| Pairing code | `pairPage.ui.pairingCode` | [orbit-app/src/pair/PairPage.tsx:170](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:170) |
| Sign in with your email instead | `pairPage.ui.signInWithYourEmailInstead` | [orbit-app/src/pair/PairPage.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:195) |

## orbit-app/src/lib/activity-runs.ts

Fonte: [orbit-app/src/lib/activity-runs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Worked for {elapsed} | `chat.run.workedFor` | [orbit-app/src/lib/activity-runs.ts:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:77) |
| Worked | `chat.run.worked` | [orbit-app/src/lib/activity-runs.ts:78](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:78) |
| +{count} more | `chat.run.more` | [orbit-app/src/lib/activity-runs.ts:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:153) |
| {count} steps · {tools} | `chat.run.steps` | [orbit-app/src/lib/activity-runs.ts:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:154) |

## orbit-app/src/lib/activity.ts

Fonte: [orbit-app/src/lib/activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| This computer | `activity.actor.loopback` | [orbit-app/src/lib/activity.ts:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:55) |
| Local service | `activity.actor.worker` | [orbit-app/src/lib/activity.ts:56](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:56) |
| Command line | `activity.actor.cli` | [orbit-app/src/lib/activity.ts:57](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:57) |
| {decision}: {tool} | `activity.approvalLine` | [orbit-app/src/lib/activity.ts:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:70) |
| in {bot} | `activity.approvalIn` | [orbit-app/src/lib/activity.ts:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:71) |

## orbit-app/src/lib/browser-profiles.ts

Fonte: [orbit-app/src/lib/browser-profiles.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/browser-profiles.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {names} is still running. Stop that bot before deleting this browser profile. | `settings.profiles.busyOne` | [orbit-app/src/lib/browser-profiles.ts:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/browser-profiles.ts:44) |
| {names} are still running. Stop those bots before deleting this browser profile. | `settings.profiles.busyMany` | [orbit-app/src/lib/browser-profiles.ts:45](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/browser-profiles.ts:45) |

## orbit-app/src/lib/feature-flags.ts

Fonte: [orbit-app/src/lib/feature-flags.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/feature-flags.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| The browser engine is not installed on this server yet. Enable the browser switches in App Settings → Experimental and the bot's Access settings, then open Bot's computer → Browser to install it. Or run `orbit browser install` on the server. | `browser.notInstalled` | [orbit-app/src/lib/feature-flags.ts:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/feature-flags.ts:17) |
| This server has no browser engine. | `browser.noEngine` | [orbit-app/src/lib/feature-flags.ts:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/feature-flags.ts:19) |

## orbit-app/src/lib/group-routing.ts

Fonte: [orbit-app/src/lib/group-routing.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Reply here to continue the bot-to-bot conversation. | `room.hint.dm` | [orbit-app/src/lib/group-routing.ts:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:24) |
| Everyone responds unless you @mention specific bots. | `room.hint.everyone` | [orbit-app/src/lib/group-routing.ts:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:26) |
| Mention a bot with @ to bring them in. | `room.hint.mentions` | [orbit-app/src/lib/group-routing.ts:27](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:27) |
| The lead bot | `room.hint.leadFallback` | [orbit-app/src/lib/group-routing.ts:28](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:28) |
| {name} responds by default — @mention someone else to choose them instead. | `room.hint.lead` | [orbit-app/src/lib/group-routing.ts:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:29) |
| continue the conversation | `composer.hint.dm` | [orbit-app/src/lib/group-routing.ts:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:33) |
| everyone responds | `composer.hint.everyone` | [orbit-app/src/lib/group-routing.ts:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:35) |
| @ to bring a bot in | `composer.hint.mentions` | [orbit-app/src/lib/group-routing.ts:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:36) |
| {name} responds | `composer.hint.responder` | [orbit-app/src/lib/group-routing.ts:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:37) |
| Lead | `composer.hint.lead` | [orbit-app/src/lib/group-routing.ts:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:38) |

## orbit-app/src/lib/live-activity.ts

Fonte: [orbit-app/src/lib/live-activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-activity.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Thinking | `chat.activity.thinking` | [orbit-app/src/lib/live-activity.ts:44](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-activity.ts:44) |
| Working | `chat.activity.working` | [orbit-app/src/lib/live-activity.ts:53](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-activity.ts:53) |

## orbit-app/src/lib/mac-cua-permissions.ts

Fonte: [orbit-app/src/lib/mac-cua-permissions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mac-cua-permissions.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Screen Recording and Accessibility are required for Orbit to use this computer. Grant them in System Settings → Privacy & Security, then relaunch Orbit. | `computer.mac.permission.requiredBoth` | [orbit-app/src/lib/mac-cua-permissions.ts:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mac-cua-permissions.ts:19) |
| {permission} is required for Orbit to use this computer. Grant it in System Settings → Privacy & Security, then relaunch Orbit. | `computer.mac.permission.requiredOne` | [orbit-app/src/lib/mac-cua-permissions.ts:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mac-cua-permissions.ts:20) |

## orbit-app/src/lib/memory.ts

Fonte: [orbit-app/src/lib/memory.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| nothing to tidy | `memory.tidy.nothing` | [orbit-app/src/lib/memory.ts:160](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:160) |

## orbit-app/src/lib/phone-setup.ts

Fonte: [orbit-app/src/lib/phone-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/phone-setup.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {message} Reference: {reference}. | `phone.error.reference` | [orbit-app/src/lib/phone-setup.ts:450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/phone-setup.ts:450) |

## orbit-app/src/lib/replies.ts

Fonte: [orbit-app/src/lib/replies.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| [image] | `chat.reply.image` | [orbit-app/src/lib/replies.ts:9](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:9) |
| [file] | `chat.reply.file` | [orbit-app/src/lib/replies.ts:9](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:9) |
| You | `chat.you` | [orbit-app/src/lib/replies.ts:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:17) |
| Assistant | `chat.assistant` | [orbit-app/src/lib/replies.ts:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:18) |

## orbit-app/src/lib/routine-display.ts

Fonte: [orbit-app/src/lib/routine-display.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Finished schedule | `routines.finishedSchedule` | [orbit-app/src/lib/routine-display.ts:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:32) |
| Active | `routines.activeSchedule` | [orbit-app/src/lib/routine-display.ts:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:33) |
| Paused | `routines.pausedSchedule` | [orbit-app/src/lib/routine-display.ts:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:33) |
| No next run scheduled | `routines.noNextRun` | [orbit-app/src/lib/routine-display.ts:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:38) |
| Next {time} | `routines.nextRun` | [orbit-app/src/lib/routine-display.ts:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:38) |

## orbit-app/src/lib/team-share.ts

Fonte: [orbit-app/src/lib/team-share.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-share.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| connection | `teamShare.field.connection` | [orbit-app/src/lib/team-share.ts:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-share.ts:81) |
| skill | `teamShare.field.skill` | [orbit-app/src/lib/team-share.ts:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-share.ts:81) |
| shared instructions | `teamShare.field.brief` | [orbit-app/src/lib/team-share.ts:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-share.ts:85) |

## orbit-app/src/lib/transcript-announcer.ts

Fonte: [orbit-app/src/lib/transcript-announcer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-announcer.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {name} needs your approval | `chat.announce.approval` | [orbit-app/src/lib/transcript-announcer.ts:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-announcer.ts:37) |
| {name} replied: {text} | `chat.announce.replied` | [orbit-app/src/lib/transcript-announcer.ts:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-announcer.ts:46) |
| {name} replied | `chat.announce.repliedEmpty` | [orbit-app/src/lib/transcript-announcer.ts:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-announcer.ts:47) |

## orbit-app/src/lib/usage.ts

Fonte: [orbit-app/src/lib/usage.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| {tokens} uncached input | `chat.usage.uncachedInput` | [orbit-app/src/lib/usage.ts:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:75) |
| {tokens} cached input | `chat.usage.cachedInput` | [orbit-app/src/lib/usage.ts:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:75) |
| {tokens} input (cached + uncached) | `chat.usage.totalInput` | [orbit-app/src/lib/usage.ts:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:76) |
| {tokens} output | `chat.usage.output` | [orbit-app/src/lib/usage.ts:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:77) |
| New tokens leave out {cached} of input re-read from the provider's cache, because each turn resends the whole conversation with the system prompt and tool schemas. Counting those re-reads, {total} went through the model. Hover a figure for the split. | `usage.cachedNote` | [orbit-app/src/lib/usage.ts:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:112) |
| ctx {value} | `chat.usage.contextShort` | [orbit-app/src/lib/usage.ts:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:135) |
| Context {tokens} ({percent}% of {window}) | `chat.usage.contextOfWindow` | [orbit-app/src/lib/usage.ts:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:143) |
| Context {tokens} | `chat.usage.context` | [orbit-app/src/lib/usage.ts:144](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:144) |
| Last message: {detail} | `chat.usage.lastTurnSplit` | [orbit-app/src/lib/usage.ts:151](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:151) |
| {tokens} uncached | `chat.usage.uncachedShort` | [orbit-app/src/lib/usage.ts:158](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:158) |
| {tokens} input | `chat.usage.inputShort` | [orbit-app/src/lib/usage.ts:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:159) |
| equivalent — on your subscription, not billed | `chat.usage.captionSubscription` | [orbit-app/src/lib/usage.ts:164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:164) |
| billed to your API key | `chat.usage.captionMetered` | [orbit-app/src/lib/usage.ts:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:165) |
| as reported by the engine | `chat.usage.captionEngine` | [orbit-app/src/lib/usage.ts:166](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:166) |

## orbit-app/src/lib/verify-steps.ts

Fonte: [orbit-app/src/lib/verify-steps.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| 1 step | `chat.verify.stepsOne` | [orbit-app/src/lib/verify-steps.ts:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:308) |
| {count} steps | `chat.verify.stepsMany` | [orbit-app/src/lib/verify-steps.ts:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:308) |
| {count} verified | `chat.verify.verifiedCount` | [orbit-app/src/lib/verify-steps.ts:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:309) |
| {count} failed | `chat.verify.failed` | [orbit-app/src/lib/verify-steps.ts:310](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:310) |
| {count} running | `chat.verify.running` | [orbit-app/src/lib/verify-steps.ts:311](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:311) |
| 1 dry run | `chat.verify.dryRunOne` | [orbit-app/src/lib/verify-steps.ts:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:312) |
| {count} dry runs | `chat.verify.dryRunMany` | [orbit-app/src/lib/verify-steps.ts:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:312) |

## orbit-app/src/state/store.tsx

Fonte: [orbit-app/src/state/store.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:1). 0 linhas com controlos reconhecidos.

| Rótulo / texto | Chave | Fonte |
| --- | --- | --- |
| Your bot was created, but its preset could not be fully applied. Review its instructions in settings: {error} | `newBot.profileFailed` | [orbit-app/src/state/store.tsx:3254](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3254) |

## orbit-app/electron/fixtures/browser-closed-shadow.cjs

Fonte: [orbit-app/electron/fixtures/browser-closed-shadow.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/fixtures/browser-closed-shadow.cjs:1). 4 linhas com controlos reconhecidos.

## orbit-app/electron/main.mjs

Fonte: [orbit-app/electron/main.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:1). 2 linhas com controlos reconhecidos.

## orbit-app/electron/startup-screen.mjs

Fonte: [orbit-app/electron/startup-screen.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/startup-screen.mjs:1). 1 linhas com controlos reconhecidos.

## orbit-app/companion/src/control.ts

Fonte: [orbit-app/companion/src/control.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/control.ts:1). 4 linhas com controlos reconhecidos.

## orbit-app/companion/src/solar-browser.ts

Fonte: [orbit-app/companion/src/solar-browser.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:1). 1 linhas com controlos reconhecidos.

## orbit-app/enterprise/server/workspace-access.ts

Fonte: [orbit-app/enterprise/server/workspace-access.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:1). 1 linhas com controlos reconhecidos.
