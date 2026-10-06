# Solar — referências de API e módulos de backend

Extração estática; inclui referências de clientes e guards, não apenas definições de endpoints. Regex, segmentos dinâmicos e duplicados são conservados para rastreabilidade. Métodos, autenticação e disponibilidade têm de ser confirmados no handler.

## orbit-app/src/components/AboutMeSettings.tsx

- `/api/config` — [orbit-app/src/components/AboutMeSettings.tsx:15](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:15)
- `/api/profile/learned` — [orbit-app/src/components/AboutMeSettings.tsx:75](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:75)
- `/api/profile/learned/${encodeURIComponent(id)}/remove` — [orbit-app/src/components/AboutMeSettings.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:85)

## orbit-app/src/components/ActivitySection.tsx

- `/api/admin-activity${query}` — [orbit-app/src/components/ActivitySection.tsx:71](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:71)
- `/api/admin-activity.csv${query}` — [orbit-app/src/components/ActivitySection.tsx:113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:113)

## orbit-app/src/components/ApiKeys.tsx

- `/api/config` — [orbit-app/src/components/ApiKeys.tsx:412](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:412)
- `/api/keys/test` — [orbit-app/src/components/ApiKeys.tsx:244](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:244)

## orbit-app/src/components/ArchivedBotsDialog.tsx

- `/api/bots/${bot.id}` — [orbit-app/src/components/ArchivedBotsDialog.tsx:153](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:153)

## orbit-app/src/components/AttachmentPreview.tsx

- `/api/threads/${encodeURIComponent(message.threadId)}/messages/${encodeURIComponent(message.messageId)}/file?preview=1&ref=${sourceOffset}` — [orbit-app/src/components/AttachmentPreview.tsx:204](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:204)
- `/api/threads/${encodeURIComponent(message.threadId)}/messages/${encodeURIComponent(message.messageId)}/file` — [orbit-app/src/components/AttachmentPreview.tsx:218](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:218)

## orbit-app/src/components/AutomaticRecoverySettings.tsx

- `/api/config` — [orbit-app/src/components/AutomaticRecoverySettings.tsx:26](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:26)

## orbit-app/src/components/bot-settings/useSlackManagement.ts

- `/api/bots/${encodeURIComponent(botId)}/slack-management` — [orbit-app/src/components/bot-settings/useSlackManagement.ts:27](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/useSlackManagement.ts:27)

## orbit-app/src/components/bot-settings/VisibilitySection.tsx

- `/api/groups/${groupId}` — [orbit-app/src/components/bot-settings/VisibilitySection.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:86)
- `/api/bots/${bot.id}` — [orbit-app/src/components/bot-settings/VisibilitySection.tsx:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:104)

## orbit-app/src/components/BrowserPanel.tsx

- `/api/bots/${encodeURIComponent(bot.id)}/browser/action` — [orbit-app/src/components/BrowserPanel.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:54)
- `/api/bots/${encodeURIComponent(bot.id)}/browser/live` — [orbit-app/src/components/BrowserPanel.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:84)
- `/api/auth/session` — [orbit-app/src/components/BrowserPanel.tsx:251](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:251)
- `/api/browser-engine/install` — [orbit-app/src/components/BrowserPanel.tsx:255](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:255)

## orbit-app/src/components/BrowserProfilesManager.tsx

- `/api/config` — [orbit-app/src/components/BrowserProfilesManager.tsx:52](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:52)
- `/api/bots/${encodeURIComponent(currentBot.id)}` — [orbit-app/src/components/BrowserProfilesManager.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:119)

## orbit-app/src/components/CanvasComputers.tsx

- `/api/team-computers/${encodeURIComponent(held)}/control` — [orbit-app/src/components/CanvasComputers.tsx:68](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:68)
- `/api/team-computers` — [orbit-app/src/components/CanvasComputers.tsx:200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:200)
- `/api/team-computers/${encodeURIComponent(id)}/${action}` — [orbit-app/src/components/CanvasComputers.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:178)
- `/api/team-computers/${encodeURIComponent(target.computer.id)}` — [orbit-app/src/components/CanvasComputers.tsx:277](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:277)

## orbit-app/src/components/ChatFindBar.tsx

- `/api/search?q=${encodeURIComponent(trimmed)}&limit=100&threadId=${encodeURIComponent(threadId)}` — [orbit-app/src/components/ChatFindBar.tsx:34](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:34)

## orbit-app/src/components/ClaudeAccountSettings.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}` — [orbit-app/src/components/ClaudeAccountSettings.tsx:137](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:137)
- `/api/instances/claude-accounts` — [orbit-app/src/components/ClaudeAccountSettings.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:29)
- `/api/instances/${encodeURIComponent(instance.instanceId)}/auth/sign-out` — [orbit-app/src/components/ClaudeAccountSettings.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:152)

## orbit-app/src/components/ClaudeSignIn.tsx

- `/api/instances/${encodeURIComponent(instanceId)}/auth` — [orbit-app/src/components/ClaudeSignIn.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:36)

## orbit-app/src/components/ClaudeUpdatePrompt.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}/claude-update` — [orbit-app/src/components/ClaudeUpdatePrompt.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:35)

## orbit-app/src/components/CodexAccountSettings.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}/auth/sign-out` — [orbit-app/src/components/CodexAccountSettings.tsx:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:36)

## orbit-app/src/components/CodexDeviceSignIn.tsx

- `/api/instances/${encodeURIComponent(instanceId)}/auth` — [orbit-app/src/components/CodexDeviceSignIn.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:97)

## orbit-app/src/components/CommandAllowlistDialog.tsx

- `/api/bots/${encodeURIComponent(botId)}/command-allowlist` — [orbit-app/src/components/CommandAllowlistDialog.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:30)

## orbit-app/src/components/CommandPalette.tsx

- `/api/search?q=${encodeURIComponent(q)}&limit=12` — [orbit-app/src/components/CommandPalette.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:102)

## orbit-app/src/components/ComputerPanel.tsx

- `/api/bots/${profileBot.id}/${suffix}?threadId=${encodeURIComponent(profileBot.threadId)}` — [orbit-app/src/components/ComputerPanel.tsx:246](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:246)
- `/api/bots/${bot.id}/computer/provision` — [orbit-app/src/components/ComputerPanel.tsx:1165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1165)
- `/api/bots/${bot.id}/computer/control` — [orbit-app/src/components/ComputerPanel.tsx:983](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:983)
- `/api/bots/${bot.id}/computer/${kind}` — [orbit-app/src/components/ComputerPanel.tsx:1089](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1089)
- `/api/bots/${bot.id}/local-computer/remove` — [orbit-app/src/components/ComputerPanel.tsx:1134](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1134)
- `/api/bots/${bot.id}/local-computer/run` — [orbit-app/src/components/ComputerPanel.tsx:1140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1140)
- `/api/bots/${bot.id}/computer/remove` — [orbit-app/src/components/ComputerPanel.tsx:1164](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1164)

## orbit-app/src/components/CustomDomainSettings.tsx

- `/api/settings/custom-domain` — [orbit-app/src/components/CustomDomainSettings.tsx:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:125)

## orbit-app/src/components/EngineSetup.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}/install` — [orbit-app/src/components/EngineSetup.tsx:285](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:285)
- `/api/instances/${encodeURIComponent(instance.instanceId)}/auth/start` — [orbit-app/src/components/EngineSetup.tsx:294](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:294)
- `/api/instances/${encodeURIComponent(instance.instanceId)}/auth/complete` — [orbit-app/src/components/EngineSetup.tsx:308](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:308)

## orbit-app/src/components/EnginesSettings.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}` — [orbit-app/src/components/EnginesSettings.tsx:225](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:225)
- `/api/cli-test` — [orbit-app/src/components/EnginesSettings.tsx:97](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:97)
- `/api/instances/${encodeURIComponent(instance.instanceId)}/claude-update` — [orbit-app/src/components/EnginesSettings.tsx:241](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:241)

## orbit-app/src/components/GroupView.tsx

- `/api/groups/${group.id}` — [orbit-app/src/components/GroupView.tsx:548](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:548)
- `/api/groups/${group.id}/setup` — [orbit-app/src/components/GroupView.tsx:701](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:701)

## orbit-app/src/components/InspectorPanel.tsx

- `/api/threads/${threadId}/events?limit=400` — [orbit-app/src/components/InspectorPanel.tsx:47](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:47)

## orbit-app/src/components/LinuxLocalControl.tsx

- `/api/local-computer/interrupt` — [orbit-app/src/components/LinuxLocalControl.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:38)

## orbit-app/src/components/LocalComputerSection.tsx

- `/api/local-computer` — [orbit-app/src/components/LocalComputerSection.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:283)
- `/api/local-computer/instances` — [orbit-app/src/components/LocalComputerSection.tsx:284](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:284)
- `/api/computers/boxes` — [orbit-app/src/components/LocalComputerSection.tsx:285](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:285)
- `/api/computers/vps` — [orbit-app/src/components/LocalComputerSection.tsx:286](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:286)
- `/api/bots/${instance.botId}/local-computer/remove` — [orbit-app/src/components/LocalComputerSection.tsx:309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:309)
- `/api/computers/boxes/${encodeURIComponent(instance.boxId)}/${action}` — [orbit-app/src/components/LocalComputerSection.tsx:326](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:326)
- `/api/computers/vps/${encodeURIComponent(instance.name)}/remove` — [orbit-app/src/components/LocalComputerSection.tsx:340](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:340)
- `/api/local-computer/${action}` — [orbit-app/src/components/LocalComputerSection.tsx:999](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:999)
- `/api/config` — [orbit-app/src/components/LocalComputerSection.tsx:1052](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1052)

## orbit-app/src/components/LocalVmWorkspace.tsx

- `/api/bots/${botId}/computer/control` — [orbit-app/src/components/LocalVmWorkspace.tsx:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:84)
- `/api/bots/${botId}/local-computer` — [orbit-app/src/components/LocalVmWorkspace.tsx:325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:325)

## orbit-app/src/components/McpExplore.tsx

- `/api/mcp/catalog/entry?id=${encodeURIComponent(openEntryId)}` — [orbit-app/src/components/McpExplore.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:117)
- `/api/mcp/catalog?all=1&cursor=${encodeURIComponent(next)}` — [orbit-app/src/components/McpExplore.tsx:152](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:152)
- `/api/mcp/servers` — [orbit-app/src/components/McpExplore.tsx:278](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:278)
- `/api/mcp/servers/${name}` — [orbit-app/src/components/McpExplore.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:279)
- `/api/mcp/servers/${name}/sign-in` — [orbit-app/src/components/McpExplore.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:283)

## orbit-app/src/components/McpServersPanel.tsx

- `/api/mcp/servers/import` — [orbit-app/src/components/McpServersPanel.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:195)
- `/api/mcp/servers` — [orbit-app/src/components/McpServersPanel.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:283)
- `/api/mcp/servers/${encodeURIComponent(name)}` — [orbit-app/src/components/McpServersPanel.tsx:283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:283)
- `/api/mcp/servers/${server.name}` — [orbit-app/src/components/McpServersPanel.tsx:396](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:396)
- `/api/mcp/servers/${server.name}/test` — [orbit-app/src/components/McpServersPanel.tsx:337](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:337)
- `/api/mcp/servers/${name}/sign-in` — [orbit-app/src/components/McpServersPanel.tsx:357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:357)
- `/api/mcp/servers/${server.name}/sign-out` — [orbit-app/src/components/McpServersPanel.tsx:372](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:372)
- `/api/config` — [orbit-app/src/components/McpServersPanel.tsx:745](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:745)

## orbit-app/src/components/onboarding/beats/EnginesBeat.tsx

- `/api/instances` — [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:76)

## orbit-app/src/components/onboarding/beats/HelloBeat.tsx

- `/api/config` — [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:30)

## orbit-app/src/components/onboarding/FirstConversationTour.tsx

- `/api/config` — [orbit-app/src/components/onboarding/FirstConversationTour.tsx:77](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/FirstConversationTour.tsx:77)

## orbit-app/src/components/onboarding/GuidedTour.tsx

- `/api/config` — [orbit-app/src/components/onboarding/GuidedTour.tsx:149](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:149)

## orbit-app/src/components/onboarding/WelcomeFlow.tsx

- `/api/config` — [orbit-app/src/components/onboarding/WelcomeFlow.tsx:165](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:165)

## orbit-app/src/components/onboarding/WelcomeGate.tsx

- `/api/auth/session` — [orbit-app/src/components/onboarding/WelcomeGate.tsx:33](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeGate.tsx:33)

## orbit-app/src/components/PendingApproval.tsx

- `/api/config` — [orbit-app/src/components/PendingApproval.tsx:343](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:343)

## orbit-app/src/components/PeopleSection.tsx

- `/api/config` — [orbit-app/src/components/PeopleSection.tsx:264](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:264)
- `/api/auth/sessions` — [orbit-app/src/components/PeopleSection.tsx:229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:229)
- `/api/usage?groupBy=user` — [orbit-app/src/components/PeopleSection.tsx:230](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:230)
- `/api/settings/custom-domain` — [orbit-app/src/components/PeopleSection.tsx:231](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:231)

## orbit-app/src/components/ProviderIconPicker.tsx

- `/api/instances/${encodeURIComponent(instance.instanceId)}/icon` — [orbit-app/src/components/ProviderIconPicker.tsx:65](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:65)

## orbit-app/src/components/remote-desktop-panel.tsx

- `/api/bots/${bot.id}/computer/screenshot` — [orbit-app/src/components/remote-desktop-panel.tsx:121](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:121)
- `/api/bots/${bot.id}/computer/control` — [orbit-app/src/components/remote-desktop-panel.tsx:183](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:183)
- `/api/bots/${bot.id}/computer/join` — [orbit-app/src/components/remote-desktop-panel.tsx:171](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:171)
- `/api/bots/${bot.id}/computer/viewer-close` — [orbit-app/src/components/remote-desktop-panel.tsx:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:188)

## orbit-app/src/components/RemoteAgentSettingsPanel.tsx

- `/api/bots/${bot.id}/profile` — [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:38](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:38)

## orbit-app/src/components/RoomTurnTimeoutSettings.tsx

- `/api/config` — [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:37](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:37)

## orbit-app/src/components/RoutineCalendarPage.tsx

- `/api/routines/${existingRoutine.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:555](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:555)
- `/api/routines` — [orbit-app/src/components/RoutineCalendarPage.tsx:1098](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1098)
- `/api/calendar-calls/${existingCall.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:571](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:571)
- `/api/calendar-calls` — [orbit-app/src/components/RoutineCalendarPage.tsx:1712](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1712)
- `/api/calendar-calls/${call.id}/room` — [orbit-app/src/components/RoutineCalendarPage.tsx:1511](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1511)
- `/api/calendar-calls/${call.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:1809](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1809)
- `/api/routine-runs/${run.id}/cancel` — [orbit-app/src/components/RoutineCalendarPage.tsx:1585](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1585)
- `/api/routines/${routine.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:1803](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1803)
- `/api/routines/${item.routine.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:1819](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1819)
- `/api/calendar-calls/${item.call.id}` — [orbit-app/src/components/RoutineCalendarPage.tsx:1822](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1822)

## orbit-app/src/components/SecretRequestCard.tsx

- `/api/bots/${encodeURIComponent(botId)}/secret-cards/${encodeURIComponent(message.id)}` — [orbit-app/src/components/SecretRequestCard.tsx:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:25)
- `/api/config` — [orbit-app/src/components/SecretRequestCard.tsx:86](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:86)

## orbit-app/src/components/ServerPairingCard.tsx

- `/api/auth/sessions` — [orbit-app/src/components/ServerPairingCard.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:80)
- `/api/config` — [orbit-app/src/components/ServerPairingCard.tsx:93](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:93)
- `/api/auth/pairing` — [orbit-app/src/components/ServerPairingCard.tsx:119](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:119)
- `/api/auth/sessions/${encodeURIComponent(id)}` — [orbit-app/src/components/ServerPairingCard.tsx:132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:132)

## orbit-app/src/components/SettingsModal.tsx

- `/api/config` — [orbit-app/src/components/SettingsModal.tsx:450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:450)

## orbit-app/src/components/ShareTeamDialog.tsx

- `/api/teams/export` — [orbit-app/src/components/ShareTeamDialog.tsx:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:136)

## orbit-app/src/components/SignInAccessCard.tsx

- `/api/config` — [orbit-app/src/components/SignInAccessCard.tsx:74](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:74)
- `/api/settings/custom-domain` — [orbit-app/src/components/SignInAccessCard.tsx:54](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:54)

## orbit-app/src/components/SoulField.tsx

- `/api/bots/${bot.id}/soul` — [orbit-app/src/components/SoulField.tsx:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:46)
- `/api/bots/${bot.id}/soul/${action}` — [orbit-app/src/components/SoulField.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:64)

## orbit-app/src/components/TeamDialog.tsx

- `/api/sidebar-sections?section=${encodeURIComponent(section!)}` — [orbit-app/src/components/TeamDialog.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:48)
- `/api/sidebar-sections` — [orbit-app/src/components/TeamDialog.tsx:48](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:48)

## orbit-app/src/components/TeamLibraryPanel.tsx

- `/api/team-library/catalog` — [orbit-app/src/components/TeamLibraryPanel.tsx:268](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:268)
- `/api/team-library/teams/${entry.slug}` — [orbit-app/src/components/TeamLibraryPanel.tsx:360](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:360)
- `/api/team-library/github` — [orbit-app/src/components/TeamLibraryPanel.tsx:377](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:377)
- `/api/teams/import?mode=add` — [orbit-app/src/components/TeamLibraryPanel.tsx:405](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:405)
- `/api/teams/scout?cwd=${encodeURIComponent(folder)}` — [orbit-app/src/components/TeamLibraryPanel.tsx:442](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:442)
- `/api/teams/scout/directory?cwd=${encodeURIComponent(folder)}` — [orbit-app/src/components/TeamLibraryPanel.tsx:449](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:449)
- `/api/teams/import?mode=project&cwd=${encodeURIComponent(scoutedFolder)}&room=${encodeURIComponent(room)}` — [orbit-app/src/components/TeamLibraryPanel.tsx:499](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:499)

## orbit-app/src/components/ThreadCleanupSettings.tsx

- `/api/config` — [orbit-app/src/components/ThreadCleanupSettings.tsx:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:70)

## orbit-app/src/components/ThreadConcurrencySettings.tsx

- `/api/config` — [orbit-app/src/components/ThreadConcurrencySettings.tsx:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:18)

## orbit-app/src/components/UsageBudget.tsx

- `/api/config` — [orbit-app/src/components/UsageBudget.tsx:154](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:154)

## orbit-app/src/components/UsageHistory.tsx

- `/api/usage.csv?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}` — [orbit-app/src/components/UsageHistory.tsx:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:67)
- `/api/usage?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}&groupBy=${groupBy}` — [orbit-app/src/components/UsageHistory.tsx:143](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:143)

## orbit-app/src/components/VoiceSettings.tsx

- `/api/tts/voices` — [orbit-app/src/components/VoiceSettings.tsx:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:123)
- `/api/config` — [orbit-app/src/components/VoiceSettings.tsx:195](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:195)

## orbit-app/src/components/WebhooksPanel.tsx

- `/api/webhooks/${webhook.id}` — [orbit-app/src/components/WebhooksPanel.tsx:262](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:262)
- `/api/webhooks` — [orbit-app/src/components/WebhooksPanel.tsx:147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:147)
- `/api/webhooks/${webhook.id}/rotate` — [orbit-app/src/components/WebhooksPanel.tsx:279](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:279)

## orbit-app/src/components/WorkspaceBackupSettings.tsx

- `/api/workspace-backup/status` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:178](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:178)
- `/api/workspace-backup/export` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:73)
- `/api/workspace-backup/download/${encodeURIComponent(result.id)}` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:80](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:80)
- `/api/workspace-backup/upload` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:96)
- `/api/workspace-backup/preview` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:102)
- `/api/workspace-backup/restore` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:117](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:117)
- `/api/workspace-backup/client-state` — [orbit-app/src/components/WorkspaceBackupSettings.tsx:186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:186)

## orbit-app/src/components/WorkspacesSection.tsx

- `/api/fleet` — [orbit-app/src/components/WorkspacesSection.tsx:35](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:35)
- `/api/fleet/workspaces` — [orbit-app/src/components/WorkspacesSection.tsx:100](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:100)
- `/api/fleet/workspaces/${encodeURIComponent(slug)}/users` — [orbit-app/src/components/WorkspacesSection.tsx:159](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:159)
- `/api/fleet/workspaces/${encodeURIComponent(slug)}/${action}` — [orbit-app/src/components/WorkspacesSection.tsx:209](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:209)
- `/api/fleet/workspaces/${encodeURIComponent(slug)}` — [orbit-app/src/components/WorkspacesSection.tsx:226](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:226)
- `/api/fleet/upgrade` — [orbit-app/src/components/WorkspacesSection.tsx:240](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:240)

## orbit-app/src/orbit/ArtifactCard.tsx

- `/api/bots/${art.botId}/computer/control` — [orbit-app/src/orbit/ArtifactCard.tsx:173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:173)

## orbit-app/src/orbit/artifacts.ts

- `/api/threads/${encodeURIComponent(offer.threadId)}/messages/${encodeURIComponent(offer.messageId)}/file` — [orbit-app/src/orbit/artifacts.ts:133](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/artifacts.ts:133)

## orbit-app/src/orbit/detail/BotPanels.tsx

- `/api/bots/${bot.id}` — [orbit-app/src/orbit/detail/BotPanels.tsx:266](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:266)
- `/api/bots/${bot.id}/history?limit=100` — [orbit-app/src/orbit/detail/BotPanels.tsx:578](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:578)
- `/api/bots/${bot.id}/history/rollback` — [orbit-app/src/orbit/detail/BotPanels.tsx:587](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:587)

## orbit-app/src/orbit/detail/HubPanels.tsx

- `/api/team-computers` — [orbit-app/src/orbit/detail/HubPanels.tsx:376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:376)
- `/api/sidebar-sections?section=${encodeURIComponent(team.key)}` — [orbit-app/src/orbit/detail/HubPanels.tsx:400](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:400)
- `/api/section-context?section=${encodeURIComponent(section)}` — [orbit-app/src/orbit/detail/HubPanels.tsx:538](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:538)

## orbit-app/src/orbit/detail/ProfilePanels.tsx

- `/api/bots/${bot.id}/overview?threadId=${encodeURIComponent(bot.threadId)}` — [orbit-app/src/orbit/detail/ProfilePanels.tsx:90](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:90)
- `/api/bots/${bot.id}/system-prompt` — [orbit-app/src/orbit/detail/ProfilePanels.tsx:91](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:91)

## orbit-app/src/orbit/detail/SkillsPanel.tsx

- `/api/bots/${bot.id}/skills` — [orbit-app/src/orbit/detail/SkillsPanel.tsx:85](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:85)
- `/api/bots/${bot.id}/skills/${encodeURIComponent(skill.name)}` — [orbit-app/src/orbit/detail/SkillsPanel.tsx:73](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:73)
- `/api/bots/${bot.id}/skills/${encodeURIComponent(review.skill.name)}` — [orbit-app/src/orbit/detail/SkillsPanel.tsx:64](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:64)

## orbit-app/src/orbit/OrbitShell.tsx

- `/api/team-map` — [orbit-app/src/orbit/OrbitShell.tsx:192](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:192)
- `/api/bots/${focusId}/skills` — [orbit-app/src/orbit/OrbitShell.tsx:408](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:408)

## orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx

- `/api/bots/${bot.id}/solar-workspace?threadId=${encodeURIComponent(bot.threadId)}` — [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:29)

## orbit-app/src/shell/orbit-client.ts

- `/api/orbit-agent` — [orbit-app/src/shell/orbit-client.ts:41](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:41)
- `/api/bots?messages=0` — [orbit-app/src/shell/orbit-client.ts:108](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:108)
- `/api/bots/${encodeURIComponent(target.botId)}/messages` — [orbit-app/src/shell/orbit-client.ts:76](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:76)
- `/api/bots/${encodeURIComponent(target.botId)}/interrupt` — [orbit-app/src/shell/orbit-client.ts:84](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:84)
- `/api/threads/${encodeURIComponent(threadId)}/messages?limit=20` — [orbit-app/src/shell/orbit-client.ts:112](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:112)
- `/api/events` — [orbit-app/src/shell/orbit-client.ts:138](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:138)

## orbit-app/src/lib/brand.ts

- `/api/brand` — [orbit-app/src/lib/brand.ts:123](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/brand.ts:123)

## orbit-app/src/lib/composer-attachments.ts

- `/api/attachments?uploadId=${encodeURIComponent(uploadId)}` — [orbit-app/src/lib/composer-attachments.ts:321](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-attachments.ts:321)
- `/api/files?name=${encodeURIComponent(file.name)}&uploadId=${encodeURIComponent(uploadId)}` — [orbit-app/src/lib/composer-attachments.ts:353](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-attachments.ts:353)
- `/api/attachments/${encodeURIComponent(name)}` — [orbit-app/src/lib/composer-attachments.ts:777](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-attachments.ts:777)

## orbit-app/src/lib/focus-message.ts

- `/api/bots/${bot.id}/tasks/${hit.threadId}` — [orbit-app/src/lib/focus-message.ts:24](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/focus-message.ts:24)
- `/api/groups/${group.id}/tasks/${hit.threadId}` — [orbit-app/src/lib/focus-message.ts:28](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/focus-message.ts:28)
- `/api/bots/${bot.id}/active-branch` — [orbit-app/src/lib/focus-message.ts:32](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/focus-message.ts:32)

## orbit-app/src/lib/folder-read.ts

- `/api/bots/${bot.id}/read` — [orbit-app/src/lib/folder-read.ts:20](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/folder-read.ts:20)

## orbit-app/src/lib/live-events.ts

- `/api/events` — [orbit-app/src/lib/live-events.ts:9](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-events.ts:9)

## orbit-app/src/lib/mcp-servers.ts

- `/api/mcp/servers` — [orbit-app/src/lib/mcp-servers.ts:36](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mcp-servers.ts:36)

## orbit-app/src/lib/memory.ts

- `/api/bots/${botId}/memory` — [orbit-app/src/lib/memory.ts:70](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:70)
- `/api/bots/${botId}/memory/file?path=${encodeURIComponent(path)}` — [orbit-app/src/lib/memory.ts:98](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:98)
- `/api/bots/${botId}/memory/file` — [orbit-app/src/lib/memory.ts:81](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:81)
- `/api/bots/${botId}/memory/journal?limit=${limit}` — [orbit-app/src/lib/memory.ts:102](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:102)
- `/api/bots/${botId}/memory/journal/${encodeURIComponent(entryId)}/revert` — [orbit-app/src/lib/memory.ts:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:107)
- `/api/bots/${botId}/memory/upkeep` — [orbit-app/src/lib/memory.ts:146](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:146)
- `/api/bots/${botId}/memory/tidy` — [orbit-app/src/lib/memory.ts:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:150)
- `/api/bots/${botId}/memory/open` — [orbit-app/src/lib/memory.ts:174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:174)

## orbit-app/src/lib/session.ts

- `/api/auth/session` — [orbit-app/src/lib/session.ts:25](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/session.ts:25)
- `/api/auth/pair` — [orbit-app/src/lib/session.ts:104](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/session.ts:104)
- `/api/auth/email/start` — [orbit-app/src/lib/session.ts:135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/session.ts:135)
- `/api/auth/email/verify` — [orbit-app/src/lib/session.ts:140](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/session.ts:140)

## orbit-app/src/lib/solar-voice.ts

- `/api/solar-voice/transcribe` — [orbit-app/src/lib/solar-voice.ts:46](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/solar-voice.ts:46)
- `/api/solar-voice/status` — [orbit-app/src/lib/solar-voice.ts:62](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/solar-voice.ts:62)

## orbit-app/src/lib/tts/index.ts

- `/api/tts/prepare` — [orbit-app/src/lib/tts/index.ts:306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/tts/index.ts:306)
- `/api/tts/speak` — [orbit-app/src/lib/tts/index.ts:321](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/tts/index.ts:321)

## orbit-app/src/lib/welcome-bot.ts

- `/api/bots/${encodeURIComponent(bot.id)}` — [orbit-app/src/lib/welcome-bot.ts:8](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/welcome-bot.ts:8)
- `/api/bots` — [orbit-app/src/lib/welcome-bot.ts:8](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/welcome-bot.ts:8)

## orbit-app/src/state/store.tsx

- `/api/bots` — [orbit-app/src/state/store.tsx:3283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3283)
- `/api/orbit/source` — [orbit-app/src/state/store.tsx:2327](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2327)
- `/api/bots/${bot.id}` — [orbit-app/src/state/store.tsx:3288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3288)
- `/api/routines` — [orbit-app/src/state/store.tsx:3583](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3583)
- `/api/sidebar-sections?section=${encodeURIComponent(section)}` — [orbit-app/src/state/store.tsx:2387](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2387)
- `/api/routines/${routine.id}` — [orbit-app/src/state/store.tsx:2380](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2380)
- `/api/groups/${id}` — [orbit-app/src/state/store.tsx:2382](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2382)
- `/api/bots/${id}` — [orbit-app/src/state/store.tsx:2385](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2385)
- `/api/bots/${created.bot.id}` — [orbit-app/src/state/store.tsx:2400](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2400)
- `/api/section-context?section=${encodeURIComponent(template.team)}` — [orbit-app/src/state/store.tsx:2402](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2402)
- `/api/threads/:id/messages?before=` — [orbit-app/src/state/store.tsx:2415](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2415)
- `/api/bots/${botId}/tasks/${threadId}` — [orbit-app/src/state/store.tsx:2461](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2461)
- `/api/bots/${botId}` — [orbit-app/src/state/store.tsx:3309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3309)
- `/api/bots?messages=${MESSAGE_PAGE_SIZE}` — [orbit-app/src/state/store.tsx:3644](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3644)
- `/api/bots/${botId}/cards/${messageId}` — [orbit-app/src/state/store.tsx:2787](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2787)
- `/api/threads/${action.threadId}/messages?limit=${MESSAGE_PAGE_SIZE}&before=${encodeURIComponent(before)}` — [orbit-app/src/state/store.tsx:2973](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:2973)
- `/api/routines/${action.routineId}` — [orbit-app/src/state/store.tsx:3004](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3004)
- `/api/routines/${action.routineId}/run` — [orbit-app/src/state/store.tsx:3008](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3008)
- `/api/routine-runs/${action.runId}/cancel` — [orbit-app/src/state/store.tsx:3017](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3017)
- `/api/routine-runs/${action.runId}/seen` — [orbit-app/src/state/store.tsx:3020](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3020)
- `/api/routine-runs/seen-all` — [orbit-app/src/state/store.tsx:3023](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3023)
- `/api/bots/${action.botId}/queue/${action.queueId}` — [orbit-app/src/state/store.tsx:3026](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3026)
- `/api/bots/${action.botId}/queue/${action.queueId}/steer` — [orbit-app/src/state/store.tsx:3034](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3034)
- `/api/groups/${action.groupId}/queue/${action.queueId}` — [orbit-app/src/state/store.tsx:3052](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3052)
- `/api/groups/${action.groupId}/queue/${action.queueId}/steer` — [orbit-app/src/state/store.tsx:3060](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3060)
- `/api/bots/${action.botId}/messages` — [orbit-app/src/state/store.tsx:3222](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3222)
- `/api/bots/${action.botId}/messages/${action.messageId}/edit` — [orbit-app/src/state/store.tsx:3129](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3129)
- `/api/bots/${action.botId}/active-branch` — [orbit-app/src/state/store.tsx:3148](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3148)
- `/api/threads/${action.threadId}/respond` — [orbit-app/src/state/store.tsx:3155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3155)
- `/api/bots/${action.alwaysAllow.botId}/always-allow` — [orbit-app/src/state/store.tsx:3176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3176)
- `/api/bots/${action.alwaysAllow.botId}` — [orbit-app/src/state/store.tsx:3176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3176)
- `/api/bots/${action.botId}` — [orbit-app/src/state/store.tsx:3320](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3320)
- `/api/bots/${action.id}/read` — [orbit-app/src/state/store.tsx:3328](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3328)
- `/api/groups/${action.id}/read` — [orbit-app/src/state/store.tsx:3330](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3330)
- `/api/groups` — [orbit-app/src/state/store.tsx:3335](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3335)
- `/api/groups/${action.groupId}/messages` — [orbit-app/src/state/store.tsx:3357](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3357)
- `/api/groups/${action.groupId}` — [orbit-app/src/state/store.tsx:3405](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3405)
- `/api/bots/${action.botId}/projects` — [orbit-app/src/state/store.tsx:3428](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3428)
- `/api/bots/${action.botId}/projects/${action.projectId}` — [orbit-app/src/state/store.tsx:3440](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3440)
- `/api/bots/${action.botId}/projects/order` — [orbit-app/src/state/store.tsx:3445](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3445)
- `/api/bots/${action.botId}/interrupt` — [orbit-app/src/state/store.tsx:3450](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3450)
- `/api/bots/${action.botId}/tasks` — [orbit-app/src/state/store.tsx:3469](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3469)
- `/api/bots/${action.botId}/tasks/${action.threadId}?messages=${MESSAGE_PAGE_SIZE}` — [orbit-app/src/state/store.tsx:3470](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3470)
- `/api/bots/${action.botId}/tasks/${action.threadId}` — [orbit-app/src/state/store.tsx:3485](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3485)
- `/api/groups/${action.groupId}/tasks` — [orbit-app/src/state/store.tsx:3492](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3492)
- `/api/groups/${action.groupId}/tasks/${action.threadId}?messages=${MESSAGE_PAGE_SIZE}` — [orbit-app/src/state/store.tsx:3497](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3497)
- `/api/groups/${action.groupId}/tasks/${action.threadId}` — [orbit-app/src/state/store.tsx:3516](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3516)
- `/api/groups/${action.groupId}/interrupt` — [orbit-app/src/state/store.tsx:3521](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3521)
- `/api/instances` — [orbit-app/src/state/store.tsx:3904](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3904)
- `/api/config` — [orbit-app/src/state/store.tsx:3576](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3576)
- `/api/webhooks` — [orbit-app/src/state/store.tsx:3590](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3590)
- `/api/bots/${bot.id}/read` — [orbit-app/src/state/store.tsx:3770](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3770)
- `/api/groups/${group.id}/read` — [orbit-app/src/state/store.tsx:3783](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3783)
- `/api/instances/${encodeURIComponent(instanceId)}/refresh-models` — [orbit-app/src/state/store.tsx:3912](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:3912)

## orbit-app/server/bot-visibility.ts

- `/api/routines/wake` — [orbit-app/server/bot-visibility.ts:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-visibility.ts:273)
- `/api/routine-runs/seen-all` — [orbit-app/server/bot-visibility.ts:273](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-visibility.ts:273)

## orbit-app/server/browser-proxy.ts

- `/api/internal/browser/mcp` — [orbit-app/server/browser-proxy.ts:55](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-proxy.ts:55)

## orbit-app/server/cli.ts

- `/api/health` — [orbit-app/server/cli.ts:361](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli.ts:361)
- `/api/auth/pairing` — [orbit-app/server/cli.ts:541](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli.ts:541)
- `/api/auth/sessions/${encodeURIComponent(options.revoke)}` — [orbit-app/server/cli.ts:584](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli.ts:584)
- `/api/auth/sessions` — [orbit-app/server/cli.ts:596](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli.ts:596)

## orbit-app/server/drivers/agents-call.ts

- `/api/internal/tool-result` — [orbit-app/server/drivers/agents-call.ts:288](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:288)
- `/api/internal/options-card` — [orbit-app/server/drivers/agents-call.ts:445](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:445)
- `/api/internal/shared-computers` — [orbit-app/server/drivers/agents-call.ts:464](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:464)
- `/api/internal/room-targets` — [orbit-app/server/drivers/agents-call.ts:481](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:481)
- `/api/internal/coordinate-bots` — [orbit-app/server/drivers/agents-call.ts:507](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:507)
- `/api/internal/agents?self=${encodeURIComponent(BOT_ID)}` — [orbit-app/server/drivers/agents-call.ts:514](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:514)
- `/api/internal/rooms?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:534](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:534)
- `/api/internal/post-to-room` — [orbit-app/server/drivers/agents-call.ts:569](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:569)
- `/api/internal/ask-bot` — [orbit-app/server/drivers/agents-call.ts:583](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:583)
- `/api/internal/delegate-bot` — [orbit-app/server/drivers/agents-call.ts:643](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:643)
- `/api/internal/delegations/${encodeURIComponent(taskId)}?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:671](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:671)
- `/api/internal/computer/select` — [orbit-app/server/drivers/agents-call.ts:704](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:704)
- `/api/internal/threads?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:711](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:711)
- `/api/internal/threads/${encodeURIComponent(threadId)}/close` — [orbit-app/server/drivers/agents-call.ts:728](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:728)
- `/api/internal/threads` — [orbit-app/server/drivers/agents-call.ts:750](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:750)
- `/api/internal/team-setup-catalog` — [orbit-app/server/drivers/agents-call.ts:786](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:786)
- `/api/internal/bot-deletion-requests` — [orbit-app/server/drivers/agents-call.ts:790](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:790)
- `/api/internal/team-setup-requests` — [orbit-app/server/drivers/agents-call.ts:790](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:790)
- `/api/internal/create-bot` — [orbit-app/server/drivers/agents-call.ts:810](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:810)
- `/api/internal/set-thread-access` — [orbit-app/server/drivers/agents-call.ts:841](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:841)
- `/api/internal/create-room` — [orbit-app/server/drivers/agents-call.ts:875](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:875)
- `/api/internal/manage-room` — [orbit-app/server/drivers/agents-call.ts:902](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:902)
- `/api/internal/request-credential` — [orbit-app/server/drivers/agents-call.ts:924](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:924)
- `/api/internal/voice-note` — [orbit-app/server/drivers/agents-call.ts:949](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:949)
- `/api/internal/orbit/status` — [orbit-app/server/drivers/agents-call.ts:962](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:962)
- `/api/internal/orbit/thread?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:970](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:970)
- `/api/internal/orbit/logs?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:977](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:977)
- `/api/internal/orbit/propose-settings` — [orbit-app/server/drivers/agents-call.ts:988](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:988)
- `/api/internal/orbit/propose-mcp` — [orbit-app/server/drivers/agents-call.ts:988](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:988)
- `/api/internal/routines?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:998](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:998)
- `/api/internal/routine-requests` — [orbit-app/server/drivers/agents-call.ts:1057](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1057)
- `/api/internal/profile-requests` — [orbit-app/server/drivers/agents-call.ts:1083](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1083)
- `/api/internal/model-requests` — [orbit-app/server/drivers/agents-call.ts:1110](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1110)
- `/api/internal/memory` — [orbit-app/server/drivers/agents-call.ts:1135](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1135)
- `/api/internal/retry-thread` — [orbit-app/server/drivers/agents-call.ts:1162](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1162)
- `/api/internal/memory/log` — [orbit-app/server/drivers/agents-call.ts:1173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1173)
- `/api/internal/session-search?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:1193](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1193)
- `/api/internal/session-read?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:1242](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1242)
- `/api/internal/skills?${query.toString()}` — [orbit-app/server/drivers/agents-call.ts:1256](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1256)
- `/api/internal/skills/stage` — [orbit-app/server/drivers/agents-call.ts:1300](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1300)

## orbit-app/server/drivers/dweb-proxy.ts

- `/api/repo/status` — [orbit-app/server/drivers/dweb-proxy.ts:96](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/dweb-proxy.ts:96)
- `/api/opencode/models` — [orbit-app/server/drivers/dweb-proxy.ts:107](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/dweb-proxy.ts:107)
- `/api/opencode/run` — [orbit-app/server/drivers/dweb-proxy.ts:125](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/dweb-proxy.ts:125)

## orbit-app/server/drivers/phone-proxy.ts

- `/api/internal/phone/claim` — [orbit-app/server/drivers/phone-proxy.ts:271](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/phone-proxy.ts:271)

## orbit-app/server/index.ts

- `/api/internal/` — [orbit-app/server/index.ts:14057](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14057)
- `/api/testing/` — [orbit-app/server/index.ts:1147](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:1147)
- `/api/bots` — [orbit-app/server/index.ts:18233](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:18233)
- `/api/teams/import` — [orbit-app/server/index.ts:17471](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17471)
- `/api/webhooks` — [orbit-app/server/index.ts:16621](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16621)
- `/api/auth/pairing` — [orbit-app/server/index.ts:13927](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13927)
- `/api/instances/claude-accounts` — [orbit-app/server/index.ts:20948](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20948)
- `/api/internal/agents` — [orbit-app/server/index.ts:14271](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14271)
- `/api/internal/ask-bot` — [orbit-app/server/index.ts:14997](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14997)
- `/api/internal/delegate-bot` — [orbit-app/server/index.ts:15376](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15376)
- `/api/threads/:threadId/messages/:id/image` — [orbit-app/server/index.ts:4508](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:4508)
- `/api/events` — [orbit-app/server/index.ts:17229](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17229)
- `/api/health/hosted` — [orbit-app/server/index.ts:13626](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13626)
- `/api/auth/pair` — [orbit-app/server/index.ts:13704](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13704)
- `/api/pair` — [orbit-app/server/index.ts:13760](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13760)
- `/api/auth/email/start` — [orbit-app/server/index.ts:13681](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13681)
- `/api/auth/email/verify` — [orbit-app/server/index.ts:13671](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13671)
- `/api/auth/hosted/` — [orbit-app/server/index.ts:13644](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13644)
- `/api/` — [orbit-app/server/index.ts:13852](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13852)
- `/api/mcp/oauth/callback` — [orbit-app/server/index.ts:13741](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13741)
- `/api/health` — [orbit-app/server/index.ts:20708](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20708)
- `/api/brand` — [orbit-app/server/index.ts:20768](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20768)
- `/api/workspace-backup/restore` — [orbit-app/server/index.ts:13846](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13846)
- `/api/shared-computers/` — [orbit-app/server/index.ts:13985](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13985)
- `/api/auth/session` — [orbit-app/server/index.ts:13861](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13861)
- `/api/auth/stream-ticket` — [orbit-app/server/index.ts:13883](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13883)
- `/api/auth/logout` — [orbit-app/server/index.ts:13887](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13887)
- `/api/settings/custom-domain` — [orbit-app/server/index.ts:13931](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13931)
- `/api/desktop/shared-computer-control` — [orbit-app/server/index.ts:13964](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13964)
- `/api/shared-computers/connect` — [orbit-app/server/index.ts:13992](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:13992)
- `/api/auth/sessions` — [orbit-app/server/index.ts:14009](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14009)
- `/api/testing/internal-capability` — [orbit-app/server/index.ts:14023](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14023)
- `/api/internal/hook` — [orbit-app/server/index.ts:14161](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14161)
- `/api/internal/browser/mcp` — [orbit-app/server/index.ts:14216](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14216)
- `/api/internal/phone/claim` — [orbit-app/server/index.ts:14243](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14243)
- `/api/internal/computer-control` — [orbit-app/server/index.ts:16380](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16380)
- `/api/internal/computer-control/browser-profile` — [orbit-app/server/index.ts:16368](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16368)
- `/api/internal/computer/select` — [orbit-app/server/index.ts:14132](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14132)
- `/api/internal/tool-result` — [orbit-app/server/index.ts:14173](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14173)
- `/api/internal/options-card` — [orbit-app/server/index.ts:14182](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14182)
- `/api/internal/memory` — [orbit-app/server/index.ts:14206](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14206)
- `/api/internal/memory/log` — [orbit-app/server/index.ts:14211](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14211)
- `/api/internal/shared-computers` — [orbit-app/server/index.ts:14261](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14261)
- `/api/internal/threads` — [orbit-app/server/index.ts:15816](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15816)
- `/api/internal/rooms` — [orbit-app/server/index.ts:14384](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14384)
- `/api/internal/routines` — [orbit-app/server/index.ts:14410](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14410)
- `/api/internal/routine-requests` — [orbit-app/server/index.ts:14432](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14432)
- `/api/internal/profile-requests` — [orbit-app/server/index.ts:14493](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14493)
- `/api/internal/model-requests` — [orbit-app/server/index.ts:14523](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14523)
- `/api/internal/tightening-requests` — [orbit-app/server/index.ts:14552](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14552)
- `/api/internal/team-setup-catalog` — [orbit-app/server/index.ts:14582](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14582)
- `/api/internal/team-setup-requests` — [orbit-app/server/index.ts:14598](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14598)
- `/api/internal/bot-deletion-requests` — [orbit-app/server/index.ts:14612](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14612)
- `/api/internal/orbit/propose-settings` — [orbit-app/server/index.ts:14644](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14644)
- `/api/internal/orbit/propose-mcp` — [orbit-app/server/index.ts:14644](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14644)
- `/api/internal/orbit/` — [orbit-app/server/index.ts:14691](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14691)
- `/api/internal/session-search` — [orbit-app/server/index.ts:14789](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14789)
- `/api/internal/session-read` — [orbit-app/server/index.ts:14880](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14880)
- `/api/internal/skills` — [orbit-app/server/index.ts:14909](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14909)
- `/api/internal/skills/stage` — [orbit-app/server/index.ts:14924](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:14924)
- `/api/internal/retry-thread` — [orbit-app/server/index.ts:15339](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15339)
- `/api/internal/room-targets` — [orbit-app/server/index.ts:15469](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15469)
- `/api/internal/coordinate-bots` — [orbit-app/server/index.ts:15480](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15480)
- `/api/internal/post-to-room` — [orbit-app/server/index.ts:15648](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15648)
- `/api/internal/create-bot` — [orbit-app/server/index.ts:15951](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:15951)
- `/api/internal/set-thread-access` — [orbit-app/server/index.ts:16069](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16069)
- `/api/internal/create-room` — [orbit-app/server/index.ts:16224](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16224)
- `/api/internal/manage-room` — [orbit-app/server/index.ts:16200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16200)
- `/api/internal/request-credential` — [orbit-app/server/index.ts:16283](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16283)
- `/api/internal/voice-note` — [orbit-app/server/index.ts:16325](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16325)
- `/api/team-map` — [orbit-app/server/index.ts:16475](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16475)
- `/api/orbit/source` — [orbit-app/server/index.ts:16511](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16511)
- `/api/routines` — [orbit-app/server/index.ts:16527](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16527)
- `/api/routines/wake` — [orbit-app/server/index.ts:16536](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16536)
- `/api/routine-runs/seen-all` — [orbit-app/server/index.ts:16559](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16559)
- `/api/calendar-calls` — [orbit-app/server/index.ts:16574](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:16574)
- `/api/attachments` — [orbit-app/server/index.ts:17057](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17057)
- `/api/files` — [orbit-app/server/index.ts:17118](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17118)
- `/api/search` — [orbit-app/server/index.ts:17202](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17202)
- `/api/groups` — [orbit-app/server/index.ts:17306](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17306)
- `/api/teams/export` — [orbit-app/server/index.ts:17315](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17315)
- `/api/team-library/catalog` — [orbit-app/server/index.ts:17411](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17411)
- `/api/team-library/github` — [orbit-app/server/index.ts:17427](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17427)
- `/api/teams/scout` — [orbit-app/server/index.ts:17439](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17439)
- `/api/teams/scout/directory` — [orbit-app/server/index.ts:17454](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:17454)
- `/api/sidebar-sections` — [orbit-app/server/index.ts:18174](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:18174)
- `/api/bot-defaults` — [orbit-app/server/index.ts:18200](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:18200)
- `/api/bot-defaults/skills/preview` — [orbit-app/server/index.ts:18207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:18207)
- `/api/local-computer/interrupt` — [orbit-app/server/index.ts:19103](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:19103)
- `/api/section-context` — [orbit-app/server/index.ts:19203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:19203)
- `/api/solar-voice/status` — [orbit-app/server/index.ts:19309](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:19309)
- `/api/solar-voice/transcribe` — [orbit-app/server/index.ts:19310](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:19310)
- `/api/team-computers` — [orbit-app/server/index.ts:20391](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20391)
- `/api/computers/boxes` — [orbit-app/server/index.ts:20498](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20498)
- `/api/computers/vps` — [orbit-app/server/index.ts:20531](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20531)
- `/api/local-computer` — [orbit-app/server/index.ts:20562](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20562)
- `/api/local-computer/instances` — [orbit-app/server/index.ts:20565](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20565)
- `/api/local-computer/screenshot` — [orbit-app/server/index.ts:20616](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20616)
- `/api/browser-engine/install` — [orbit-app/server/index.ts:20717](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20717)
- `/api/edition` — [orbit-app/server/index.ts:20762](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20762)
- `/api/usage` — [orbit-app/server/index.ts:20798](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20798)
- `/api/usage.csv` — [orbit-app/server/index.ts:20804](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20804)
- `/api/keys/test` — [orbit-app/server/index.ts:20833](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20833)
- `/api/decisions` — [orbit-app/server/index.ts:20852](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20852)
- `/api/admin-activity` — [orbit-app/server/index.ts:20862](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20862)
- `/api/admin-activity.csv` — [orbit-app/server/index.ts:20862](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20862)
- `/api/decisions.csv` — [orbit-app/server/index.ts:20896](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20896)
- `/api/instances` — [orbit-app/server/index.ts:20910](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20910)
- `/api/instances/` — [orbit-app/server/index.ts:20919](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:20919)
- `/api/cli-candidates` — [orbit-app/server/index.ts:21027](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21027)
- `/api/cli-test` — [orbit-app/server/index.ts:21038](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21038)
- `/api/orbit-agent` — [orbit-app/server/index.ts:21179](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21179)
- `/api/mcp/catalog` — [orbit-app/server/index.ts:21186](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21186)
- `/api/mcp/catalog/entry` — [orbit-app/server/index.ts:21203](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21203)
- `/api/mcp/catalog/icon` — [orbit-app/server/index.ts:21207](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21207)
- `/api/mcp/servers` — [orbit-app/server/index.ts:21277](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21277)
- `/api/mcp/servers/import` — [orbit-app/server/index.ts:21305](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21305)
- `/api/config` — [orbit-app/server/index.ts:21384](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21384)
- `/api/tts/prepare` — [orbit-app/server/index.ts:21869](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21869)
- `/api/tts/voices` — [orbit-app/server/index.ts:21876](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21876)
- `/api/tts/speak` — [orbit-app/server/index.ts:21883](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:21883)

## orbit-app/server/mcp-catalog.ts

- `/api/mcp/catalog/icon?id=${encodeURIComponent(id)}` — [orbit-app/server/mcp-catalog.ts:223](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-catalog.ts:223)

## orbit-app/server/provider-key-check.ts

- `/api/v1/models` — [orbit-app/server/provider-key-check.ts:66](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/provider-key-check.ts:66)
- `/api/v1/key` — [orbit-app/server/provider-key-check.ts:67](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/provider-key-check.ts:67)

## orbit-app/server/request-auth.ts

- `/api/internal/` — [orbit-app/server/request-auth.ts:418](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:418)
- `/api/testing/internal-capability` — [orbit-app/server/request-auth.ts:419](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:419)
- `/api/auth/pair` — [orbit-app/server/request-auth.ts:420](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:420)
- `/api/pair` — [orbit-app/server/request-auth.ts:422](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:422)

## orbit-app/server/routes/bot-memory.ts

- `/api/profile/learned` — [orbit-app/server/routes/bot-memory.ts:155](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/bot-memory.ts:155)

## orbit-app/server/workspace-backup-http.ts

- `/api/workspace-backup` — [orbit-app/server/workspace-backup-http.ts:17](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-http.ts:17)
- `/api/auth/sessions` — [orbit-app/server/workspace-backup-http.ts:29](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-http.ts:29)
- `/api/auth/logout` — [orbit-app/server/workspace-backup-http.ts:30](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-http.ts:30)

## orbit-app/electron/companion-origin-gateway.mjs

- `/api/health` — [orbit-app/electron/companion-origin-gateway.mjs:142](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/companion-origin-gateway.mjs:142)

## orbit-app/electron/company-backups.mjs

- `/api/workspace-backup` — [orbit-app/electron/company-backups.mjs:18](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/company-backups.mjs:18)
- `/api/desktop/backups` — [orbit-app/electron/company-backups.mjs:19](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/company-backups.mjs:19)

## orbit-app/electron/computer-sharing.mjs

- `/api/auth/session` — [orbit-app/electron/computer-sharing.mjs:150](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:150)
- `/api/shared-computers/${grant.id}/${action}` — [orbit-app/electron/computer-sharing.mjs:168](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:168)
- `/api/shared-computers/connect` — [orbit-app/electron/computer-sharing.mjs:176](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:176)
- `/api/shared-computers/${grant.id}/disconnect` — [orbit-app/electron/computer-sharing.mjs:249](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:249)

## orbit-app/electron/control-plane-client.mjs

- `/api/auth/` — [orbit-app/electron/control-plane-client.mjs:188](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/control-plane-client.mjs:188)
- `/api/auth/email-otp/send-verification-otp` — [orbit-app/electron/control-plane-client.mjs:259](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/control-plane-client.mjs:259)
- `/api/auth/sign-in/email-otp` — [orbit-app/electron/control-plane-client.mjs:276](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/control-plane-client.mjs:276)
- `/api/auth/sign-out` — [orbit-app/electron/control-plane-client.mjs:408](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/control-plane-client.mjs:408)

## orbit-app/electron/desktop-companion-client.mjs

- `/api/` — [orbit-app/electron/desktop-companion-client.mjs:368](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-companion-client.mjs:368)

## orbit-app/electron/main.mjs

- `/api/workspace-backup/status` — [orbit-app/electron/main.mjs:1122](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:1122)
- `/api/health` — [orbit-app/electron/main.mjs:2113](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:2113)
- `/api/auth/stream-ticket` — [orbit-app/electron/main.mjs:2114](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:2114)
- `/api/desktop/backups` — [orbit-app/electron/main.mjs:2738](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:2738)
- `/api/desktop/backups/${input.id}` — [orbit-app/electron/main.mjs:2744](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:2744)
- `/api/workspace-backup/restore` — [orbit-app/electron/main.mjs:2756](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:2756)

## orbit-app/electron/managed-desktop.mjs

- `/api/desktop/session` — [orbit-app/electron/managed-desktop.mjs:280](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:280)
- `/api/public/config` — [orbit-app/electron/managed-desktop.mjs:407](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:407)
- `/api/desktop/session/renew` — [orbit-app/electron/managed-desktop.mjs:260](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:260)
- `/api/desktop/heartbeat` — [orbit-app/electron/managed-desktop.mjs:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:312)
- `/api/desktop/enrollment/token` — [orbit-app/electron/managed-desktop.mjs:359](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:359)
- `/api/desktop/enrollment` — [orbit-app/electron/managed-desktop.mjs:411](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:411)

## orbit-app/companion/src/proxy.ts

- `/api/pair` — [orbit-app/companion/src/proxy.ts:312](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/proxy.ts:312)
- `/api/companion/endpoints` — [orbit-app/companion/src/proxy.ts:350](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/proxy.ts:350)
- `/api/health` — [orbit-app/companion/src/proxy.ts:373](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/proxy.ts:373)
- `/api/events` — [orbit-app/companion/src/proxy.ts:424](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/proxy.ts:424)

## orbit-app/companion/src/routes.ts

- `/api/` — [orbit-app/companion/src/routes.ts:10](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/routes.ts:10)
- `/api/pair` — [orbit-app/companion/src/routes.ts:290](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/routes.ts:290)
- `/api/health` — [orbit-app/companion/src/routes.ts:295](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/routes.ts:295)

## orbit-app/companion/src/solar-browser.ts

- `/api/bots` — [orbit-app/companion/src/solar-browser.ts:39](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:39)
- `/api/pair` — [orbit-app/companion/src/solar-browser.ts:40](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:40)
- `/api/bots/` — [orbit-app/companion/src/solar-browser.ts:42](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:42)

## orbit-app/enterprise/server/workspace-access.ts

- `/api/auth/hosted/start` — [orbit-app/enterprise/server/workspace-access.ts:10](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:10)
- `/api/auth/hosted/callback` — [orbit-app/enterprise/server/workspace-access.ts:11](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:11)
- `/api/handoff/check` — [orbit-app/enterprise/server/workspace-access.ts:72](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:72)
- `/api/handoff/consume` — [orbit-app/enterprise/server/workspace-access.ts:136](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:136)

## Módulos analisados

- [orbit-app/src/components/about-me-draft.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/about-me-draft.ts:1)
- [orbit-app/src/components/AboutDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutDialog.tsx:1)
- [orbit-app/src/components/AboutMeSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:1)
- [orbit-app/src/components/ActivityRun.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivityRun.tsx:1)
- [orbit-app/src/components/ActivitySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:1)
- [orbit-app/src/components/AndroidDevicePanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:1)
- [orbit-app/src/components/ApiKeys.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:1)
- [orbit-app/src/components/ApprovalCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalCard.tsx:1)
- [orbit-app/src/components/ApprovalGlyph.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalGlyph.tsx:1)
- [orbit-app/src/components/ApprovalModeSelector.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:1)
- [orbit-app/src/components/ArchivedBotsDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ArchivedBotsDialog.tsx:1)
- [orbit-app/src/components/AttachmentGallery.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:1)
- [orbit-app/src/components/AttachmentPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:1)
- [orbit-app/src/components/AutomaticRecoverySettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AutomaticRecoverySettings.tsx:1)
- [orbit-app/src/components/Avatar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Avatar.tsx:1)
- [orbit-app/src/components/bot-settings/BotEditorContext.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/BotEditorContext.tsx:1)
- [orbit-app/src/components/bot-settings/field.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/field.ts:1)
- [orbit-app/src/components/bot-settings/HistorySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/HistorySection.tsx:1)
- [orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/ManagedTeamsSettings.tsx:1)
- [orbit-app/src/components/bot-settings/PromptPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/PromptPreview.tsx:1)
- [orbit-app/src/components/bot-settings/RoutinesSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/RoutinesSection.tsx:1)
- [orbit-app/src/components/bot-settings/SlackSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/SlackSection.tsx:1)
- [orbit-app/src/components/bot-settings/useBotSettingsDerived.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/useBotSettingsDerived.ts:1)
- [orbit-app/src/components/bot-settings/useSlackManagement.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/useSlackManagement.ts:1)
- [orbit-app/src/components/bot-settings/VisibilitySection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/VisibilitySection.tsx:1)
- [orbit-app/src/components/BotPickerList.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotPickerList.tsx:1)
- [orbit-app/src/components/BotProjects.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:1)
- [orbit-app/src/components/BrowserPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:1)
- [orbit-app/src/components/BrowserProfilesManager.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:1)
- [orbit-app/src/components/BrowserViewport.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserViewport.tsx:1)
- [orbit-app/src/components/CallView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:1)
- [orbit-app/src/components/CanvasComputers.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CanvasComputers.tsx:1)
- [orbit-app/src/components/ChatFindBar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatFindBar.tsx:1)
- [orbit-app/src/components/ChatHeader.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:1)
- [orbit-app/src/components/ChatMarkdown.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:1)
- [orbit-app/src/components/ChatView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1)
- [orbit-app/src/components/ClaudeAccountSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:1)
- [orbit-app/src/components/ClaudeSignIn.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeSignIn.tsx:1)
- [orbit-app/src/components/ClaudeUpdatePrompt.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeUpdatePrompt.tsx:1)
- [orbit-app/src/components/CloudBackendPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudBackendPicker.tsx:1)
- [orbit-app/src/components/CloudScreenPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CloudScreenPreview.tsx:1)
- [orbit-app/src/components/CodexAccountSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:1)
- [orbit-app/src/components/CodexDeviceSignIn.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexDeviceSignIn.tsx:1)
- [orbit-app/src/components/CommandAllowlistDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:1)
- [orbit-app/src/components/CommandPalette.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandPalette.tsx:1)
- [orbit-app/src/components/CompanionSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:1)
- [orbit-app/src/components/CompanyBackupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:1)
- [orbit-app/src/components/CompanyModels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:1)
- [orbit-app/src/components/Composer.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1)
- [orbit-app/src/components/ComposerAttachments.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:1)
- [orbit-app/src/components/ComposerQueuedMessages.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:1)
- [orbit-app/src/components/ComputerPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1)
- [orbit-app/src/components/ComputerSharingSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:1)
- [orbit-app/src/components/ConfirmDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConfirmDialog.tsx:1)
- [orbit-app/src/components/ConnectedWorkspacesSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:1)
- [orbit-app/src/components/ConnectionDetail.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectionDetail.tsx:1)
- [orbit-app/src/components/cursor-face-data.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/cursor-face-data.ts:1)
- [orbit-app/src/components/CursorAvatar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CursorAvatar.tsx:1)
- [orbit-app/src/components/CursorMark.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CursorMark.tsx:1)
- [orbit-app/src/components/CustomDomainSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CustomDomainSettings.tsx:1)
- [orbit-app/src/components/DesktopCapabilities.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DesktopCapabilities.tsx:1)
- [orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DesktopWorkspaceSwitcher.tsx:1)
- [orbit-app/src/components/DigestChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/DigestChip.tsx:1)
- [orbit-app/src/components/EngineGroupLabel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineGroupLabel.tsx:1)
- [orbit-app/src/components/EngineLibrary.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:1)
- [orbit-app/src/components/EngineSetup.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:1)
- [orbit-app/src/components/EnginesSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:1)
- [orbit-app/src/components/ExpandableText.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ExpandableText.tsx:1)
- [orbit-app/src/components/FullAccessWarning.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/FullAccessWarning.tsx:1)
- [orbit-app/src/components/GoalRunCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GoalRunCard.tsx:1)
- [orbit-app/src/components/GroupCallView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:1)
- [orbit-app/src/components/GroupUsageChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupUsageChip.tsx:1)
- [orbit-app/src/components/GroupView.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1)
- [orbit-app/src/components/HermesMark.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/HermesMark.tsx:1)
- [orbit-app/src/components/InspectorPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:1)
- [orbit-app/src/components/KeyboardShortcutsModal.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/KeyboardShortcutsModal.tsx:1)
- [orbit-app/src/components/LendingActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LendingActivity.tsx:1)
- [orbit-app/src/components/LicenseExpiryBanner.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LicenseExpiryBanner.tsx:1)
- [orbit-app/src/components/LinuxLocalControl.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LinuxLocalControl.tsx:1)
- [orbit-app/src/components/LocalComputerAutoWarning.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerAutoWarning.tsx:1)
- [orbit-app/src/components/LocalComputerSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1)
- [orbit-app/src/components/LocalScreenPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:1)
- [orbit-app/src/components/LocalVmWorkspace.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:1)
- [orbit-app/src/components/MacCuaRecoveryActions.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacCuaRecoveryActions.tsx:1)
- [orbit-app/src/components/MacLocalControl.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MacLocalControl.tsx:1)
- [orbit-app/src/components/ManageMembersPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:1)
- [orbit-app/src/components/McpExplore.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:1)
- [orbit-app/src/components/McpServersPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:1)
- [orbit-app/src/components/MentionText.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MentionText.tsx:1)
- [orbit-app/src/components/MentionTextarea.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MentionTextarea.tsx:1)
- [orbit-app/src/components/MessageActions.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MessageActions.tsx:1)
- [orbit-app/src/components/MicrophoneRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MicrophoneRow.tsx:1)
- [orbit-app/src/components/ModelPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:1)
- [orbit-app/src/components/NewChannelDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:1)
- [orbit-app/src/components/NoEngines.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NoEngines.tsx:1)
- [orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/EnginesBeat.tsx:1)
- [orbit-app/src/components/onboarding/beats/HelloBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/HelloBeat.tsx:1)
- [orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/MeetYourBotBeat.tsx:1)
- [orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/OrganisationRow.tsx:1)
- [orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PermissionsBeat.tsx:1)
- [orbit-app/src/components/onboarding/beats/PhoneBeat.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/PhoneBeat.tsx:1)
- [orbit-app/src/components/onboarding/beats/shared.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/beats/shared.tsx:1)
- [orbit-app/src/components/onboarding/FirstConversationTour.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/FirstConversationTour.tsx:1)
- [orbit-app/src/components/onboarding/GuidedTour.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/GuidedTour.tsx:1)
- [orbit-app/src/components/onboarding/ProgressDots.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/ProgressDots.tsx:1)
- [orbit-app/src/components/onboarding/reel/FeatureReel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/FeatureReel.tsx:1)
- [orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/reel/SolarFeatureReel.tsx:1)
- [orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/SharedWorkspaceHint.tsx:1)
- [orbit-app/src/components/onboarding/Spotlight.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/Spotlight.tsx:1)
- [orbit-app/src/components/onboarding/view-transition.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/view-transition.ts:1)
- [orbit-app/src/components/onboarding/WelcomeFlow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:1)
- [orbit-app/src/components/onboarding/WelcomeGate.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeGate.tsx:1)
- [orbit-app/src/components/OptionCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OptionCard.tsx:1)
- [orbit-app/src/components/OrbitAssistantSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:1)
- [orbit-app/src/components/OrganizationSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:1)
- [orbit-app/src/components/PendingApproval.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:1)
- [orbit-app/src/components/PeopleSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:1)
- [orbit-app/src/components/PhoneSetupFlow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1)
- [orbit-app/src/components/PlaceChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceChip.tsx:1)
- [orbit-app/src/components/PlaceIcon.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PlaceIcon.tsx:1)
- [orbit-app/src/components/PluginsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:1)
- [orbit-app/src/components/ProviderIconPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIconPicker.tsx:1)
- [orbit-app/src/components/ProviderIcons.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ProviderIcons.tsx:1)
- [orbit-app/src/components/QuestionCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:1)
- [orbit-app/src/components/RawMarkdownToggle.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RawMarkdownToggle.tsx:1)
- [orbit-app/src/components/remote-desktop-panel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:1)
- [orbit-app/src/components/RemoteAgentSettingsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteAgentSettingsPanel.tsx:1)
- [orbit-app/src/components/RemoteComputerSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:1)
- [orbit-app/src/components/ReplyQuote.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ReplyQuote.tsx:1)
- [orbit-app/src/components/RoomTurnTimeoutSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoomTurnTimeoutSettings.tsx:1)
- [orbit-app/src/components/RoutineCalendarPage.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1)
- [orbit-app/src/components/RoutineRunCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineRunCard.tsx:1)
- [orbit-app/src/components/routines/CalendarSidebar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CalendarSidebar.tsx:1)
- [orbit-app/src/components/routines/cron-editor.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/cron-editor.ts:1)
- [orbit-app/src/components/routines/CronScheduleFields.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:1)
- [orbit-app/src/components/routines/MiniMonth.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/MiniMonth.tsx:1)
- [orbit-app/src/components/routines/ResultsDestination.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:1)
- [orbit-app/src/components/routines/RoutineList.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineList.tsx:1)
- [orbit-app/src/components/routines/RoutineLogs.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/RoutineLogs.tsx:1)
- [orbit-app/src/components/RoutinesPage.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutinesPage.tsx:1)
- [orbit-app/src/components/RunLog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RunLog.tsx:1)
- [orbit-app/src/components/ScreenFrame.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ScreenFrame.tsx:1)
- [orbit-app/src/components/SecretRequestCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:1)
- [orbit-app/src/components/ServerPairingCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ServerPairingCard.tsx:1)
- [orbit-app/src/components/SettingsModal.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:1)
- [orbit-app/src/components/SettingsPrimitives.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsPrimitives.tsx:1)
- [orbit-app/src/components/ShareTeamDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:1)
- [orbit-app/src/components/ShortcutHint.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShortcutHint.tsx:1)
- [orbit-app/src/components/SidebarBotActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarBotActivity.tsx:1)
- [orbit-app/src/components/SidebarPhoneButton.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarPhoneButton.tsx:1)
- [orbit-app/src/components/SidebarThreadRow.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:1)
- [orbit-app/src/components/SignInAccessCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SignInAccessCard.tsx:1)
- [orbit-app/src/components/SkillRequestPreview.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkillRequestPreview.tsx:1)
- [orbit-app/src/components/SkinPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkinPicker.tsx:1)
- [orbit-app/src/components/SoulField.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SoulField.tsx:1)
- [orbit-app/src/components/SpeakButton.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SpeakButton.tsx:1)
- [orbit-app/src/components/TaskPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:1)
- [orbit-app/src/components/TeamDialog.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:1)
- [orbit-app/src/components/TeamLibraryPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:1)
- [orbit-app/src/components/TeamPicker.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamPicker.tsx:1)
- [orbit-app/src/components/ThreadChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadChip.tsx:1)
- [orbit-app/src/components/ThreadCleanupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:1)
- [orbit-app/src/components/ThreadConcurrencySettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadConcurrencySettings.tsx:1)
- [orbit-app/src/components/ThreadControls.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadControls.tsx:1)
- [orbit-app/src/components/ThreadRefs.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadRefs.tsx:1)
- [orbit-app/src/components/ThreadUsageChip.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadUsageChip.tsx:1)
- [orbit-app/src/components/ToolActivity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ToolActivity.tsx:1)
- [orbit-app/src/components/TranscriptAnnouncer.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TranscriptAnnouncer.tsx:1)
- [orbit-app/src/components/TurnNarrationRun.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TurnNarrationRun.tsx:1)
- [orbit-app/src/components/TurnPresence.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TurnPresence.tsx:1)
- [orbit-app/src/components/UpdateBanner.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UpdateBanner.tsx:1)
- [orbit-app/src/components/UsageBudget.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:1)
- [orbit-app/src/components/UsageHistory.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:1)
- [orbit-app/src/components/UsageSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:1)
- [orbit-app/src/components/VerifyCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:1)
- [orbit-app/src/components/VoiceNoteBubble.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceNoteBubble.tsx:1)
- [orbit-app/src/components/VoiceSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:1)
- [orbit-app/src/components/WebhooksPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:1)
- [orbit-app/src/components/WindowCaptionButtons.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WindowCaptionButtons.tsx:1)
- [orbit-app/src/components/WorkingIndicator.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkingIndicator.tsx:1)
- [orbit-app/src/components/WorkspaceBackupSettings.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:1)
- [orbit-app/src/components/WorkspacesSection.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:1)
- [orbit-app/src/orbit/ArtifactCard.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:1)
- [orbit-app/src/orbit/artifacts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/artifacts.ts:1)
- [orbit-app/src/orbit/characters.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/characters.ts:1)
- [orbit-app/src/orbit/ColumnLayer.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ColumnLayer.tsx:1)
- [orbit-app/src/orbit/detail/BotDetail.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotDetail.tsx:1)
- [orbit-app/src/orbit/detail/BotPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:1)
- [orbit-app/src/orbit/detail/HubPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:1)
- [orbit-app/src/orbit/detail/MemoryPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:1)
- [orbit-app/src/orbit/detail/NewBotPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:1)
- [orbit-app/src/orbit/detail/primitives.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/primitives.tsx:1)
- [orbit-app/src/orbit/detail/ProfilePanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:1)
- [orbit-app/src/orbit/detail/SkillsPanel.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:1)
- [orbit-app/src/orbit/events.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/events.ts:1)
- [orbit-app/src/orbit/GuideCharacter.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/GuideCharacter.tsx:1)
- [orbit-app/src/orbit/model.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/model.ts:1)
- [orbit-app/src/orbit/OrbitChrome.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitChrome.tsx:1)
- [orbit-app/src/orbit/OrbitFace.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitFace.tsx:1)
- [orbit-app/src/orbit/OrbitSheet.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitSheet.tsx:1)
- [orbit-app/src/orbit/OrbitShell.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1)
- [orbit-app/src/orbit/scene.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/scene.ts:1)
- [orbit-app/src/orbit/SettingsPanels.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SettingsPanels.tsx:1)
- [orbit-app/src/orbit/solar-camera.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-camera.ts:1)
- [orbit-app/src/orbit/solar-dictation.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-dictation.ts:1)
- [orbit-app/src/orbit/solar-face.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-face.ts:1)
- [orbit-app/src/orbit/solar-interaction.d.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-interaction.d.ts:1)
- [orbit-app/src/orbit/solar-interaction.js:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-interaction.js:1)
- [orbit-app/src/orbit/solar-miniatures.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-miniatures.ts:1)
- [orbit-app/src/orbit/solar-model.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-model.ts:1)
- [orbit-app/src/orbit/solar-portraits.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-portraits.ts:1)
- [orbit-app/src/orbit/solar-preferences.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-preferences.ts:1)
- [orbit-app/src/orbit/solar-presets.d.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-presets.d.ts:1)
- [orbit-app/src/orbit/solar-presets.js:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-presets.js:1)
- [orbit-app/src/orbit/solar-renderer.d.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-renderer.d.ts:1)
- [orbit-app/src/orbit/solar-renderer.js:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-renderer.js:1)
- [orbit-app/src/orbit/solar-state.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-state.ts:1)
- [orbit-app/src/orbit/solar-transfer.d.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-transfer.d.ts:1)
- [orbit-app/src/orbit/solar-transfer.js:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-transfer.js:1)
- [orbit-app/src/orbit/SolarAppearance.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarAppearance.tsx:1)
- [orbit-app/src/orbit/SolarChrome.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:1)
- [orbit-app/src/orbit/SolarConstellation.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarConstellation.tsx:1)
- [orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:1)
- [orbit-app/src/orbit/SolarFocus.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarFocus.tsx:1)
- [orbit-app/src/orbit/SolarIdentity.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarIdentity.tsx:1)
- [orbit-app/src/orbit/SolarMap.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:1)
- [orbit-app/src/orbit/SolarOrbitParticles.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarOrbitParticles.ts:1)
- [orbit-app/src/orbit/SolarPlanet.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarPlanet.tsx:1)
- [orbit-app/src/orbit/SolarSystemArc.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarSystemArc.tsx:1)
- [orbit-app/src/orbit/SolarWorld.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarWorld.tsx:1)
- [orbit-app/src/orbit/stage.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/stage.ts:1)
- [orbit-app/src/orbit/systems.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/systems.ts:1)
- [orbit-app/src/orbit/tool-icons.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/tool-icons.ts:1)
- [orbit-app/src/orbit/useSolarDictation.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/useSolarDictation.ts:1)
- [orbit-app/src/shell/face-loop.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/face-loop.ts:1)
- [orbit-app/src/shell/island-geometry.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/island-geometry.ts:1)
- [orbit-app/src/shell/island-hover.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/island-hover.ts:1)
- [orbit-app/src/shell/island-motion.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/island-motion.ts:1)
- [orbit-app/src/shell/main.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/main.tsx:1)
- [orbit-app/src/shell/orbit-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/orbit-client.ts:1)
- [orbit-app/src/shell/Overlay.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/Overlay.tsx:1)
- [orbit-app/src/shell/QuickBar.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:1)
- [orbit-app/src/shell/ShellCharacter.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/ShellCharacter.tsx:1)
- [orbit-app/src/shell/TalkSurface.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/TalkSurface.tsx:1)
- [orbit-app/src/shell/use-guide-pointer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/use-guide-pointer.ts:1)
- [orbit-app/src/pair/PairPage.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/pair/PairPage.tsx:1)
- [orbit-app/src/lib/activity-runs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity-runs.ts:1)
- [orbit-app/src/lib/activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/activity.ts:1)
- [orbit-app/src/lib/app-links.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/app-links.ts:1)
- [orbit-app/src/lib/bot-overview-types.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/bot-overview-types.ts:1)
- [orbit-app/src/lib/bot-roles.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/bot-roles.ts:1)
- [orbit-app/src/lib/bottom-follow.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/bottom-follow.ts:1)
- [orbit-app/src/lib/brand.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/brand.ts:1)
- [orbit-app/src/lib/browser-input-queue.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/browser-input-queue.ts:1)
- [orbit-app/src/lib/browser-profiles.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/browser-profiles.ts:1)
- [orbit-app/src/lib/calendar-calls.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/calendar-calls.ts:1)
- [orbit-app/src/lib/call-capability.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/call-capability.ts:1)
- [orbit-app/src/lib/call.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/call.ts:1)
- [orbit-app/src/lib/card-answer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/card-answer.ts:1)
- [orbit-app/src/lib/cn.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/cn.ts:1)
- [orbit-app/src/lib/code-block.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/code-block.ts:1)
- [orbit-app/src/lib/compact-chip.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/compact-chip.ts:1)
- [orbit-app/src/lib/companion-pairing.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/companion-pairing.ts:1)
- [orbit-app/src/lib/company-models.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/company-models.ts:1)
- [orbit-app/src/lib/composer-attachments.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-attachments.ts:1)
- [orbit-app/src/lib/composer-commands.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-commands.ts:1)
- [orbit-app/src/lib/composer-dock.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/composer-dock.ts:1)
- [orbit-app/src/lib/computer-control.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/computer-control.ts:1)
- [orbit-app/src/lib/computer-panel-view.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/computer-panel-view.ts:1)
- [orbit-app/src/lib/custom-models.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/custom-models.ts:1)
- [orbit-app/src/lib/desktop.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/desktop.ts:1)
- [orbit-app/src/lib/drafts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/drafts.ts:1)
- [orbit-app/src/lib/email-gate.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/email-gate.ts:1)
- [orbit-app/src/lib/engine-rail.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/engine-rail.ts:1)
- [orbit-app/src/lib/export-transcript.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/export-transcript.ts:1)
- [orbit-app/src/lib/feature-flags.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/feature-flags.ts:1)
- [orbit-app/src/lib/first-conversation.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/first-conversation.ts:1)
- [orbit-app/src/lib/focus-message.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/focus-message.ts:1)
- [orbit-app/src/lib/folder-order.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/folder-order.ts:1)
- [orbit-app/src/lib/folder-read.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/folder-read.ts:1)
- [orbit-app/src/lib/fonts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/fonts.ts:1)
- [orbit-app/src/lib/group-call.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-call.ts:1)
- [orbit-app/src/lib/group-routing.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/group-routing.ts:1)
- [orbit-app/src/lib/guided-tour.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/guided-tour.ts:1)
- [orbit-app/src/lib/i18n.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/i18n.ts:1)
- [orbit-app/src/lib/inspector.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/inspector.ts:1)
- [orbit-app/src/lib/keyboard-shortcuts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/keyboard-shortcuts.ts:1)
- [orbit-app/src/lib/language-preference.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/language-preference.ts:1)
- [orbit-app/src/lib/live-activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-activity.ts:1)
- [orbit-app/src/lib/live-events.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/live-events.ts:1)
- [orbit-app/src/lib/local-computer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/local-computer.ts:1)
- [orbit-app/src/lib/local-vm-workspace.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/local-vm-workspace.ts:1)
- [orbit-app/src/lib/local-voice.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/local-voice.ts:1)
- [orbit-app/src/lib/mac-cua-permissions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mac-cua-permissions.ts:1)
- [orbit-app/src/lib/markdown-tables.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/markdown-tables.ts:1)
- [orbit-app/src/lib/mascot.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mascot.ts:1)
- [orbit-app/src/lib/mcp-servers.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mcp-servers.ts:1)
- [orbit-app/src/lib/membership.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/membership.ts:1)
- [orbit-app/src/lib/memory.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/memory.ts:1)
- [orbit-app/src/lib/mentions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/mentions.ts:1)
- [orbit-app/src/lib/menu-side.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/menu-side.ts:1)
- [orbit-app/src/lib/microphone-choice.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/microphone-choice.ts:1)
- [orbit-app/src/lib/notification-preferences.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/notification-preferences.ts:1)
- [orbit-app/src/lib/notify.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/notify.ts:1)
- [orbit-app/src/lib/onboarding.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/onboarding.ts:1)
- [orbit-app/src/lib/orbit-point.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/orbit-point.ts:1)
- [orbit-app/src/lib/orbit-shell.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/orbit-shell.ts:1)
- [orbit-app/src/lib/page-visible.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/page-visible.ts:1)
- [orbit-app/src/lib/palette-rank.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/palette-rank.ts:1)
- [orbit-app/src/lib/peer-message.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/peer-message.ts:1)
- [orbit-app/src/lib/phone-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/phone-setup.ts:1)
- [orbit-app/src/lib/place.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/place.ts:1)
- [orbit-app/src/lib/push-to-talk.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/push-to-talk.ts:1)
- [orbit-app/src/lib/receipts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/receipts.ts:1)
- [orbit-app/src/lib/remote-desktop.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/remote-desktop.ts:1)
- [orbit-app/src/lib/rename.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/rename.ts:1)
- [orbit-app/src/lib/replies.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/replies.ts:1)
- [orbit-app/src/lib/room-activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/room-activity.ts:1)
- [orbit-app/src/lib/room-members.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/room-members.ts:1)
- [orbit-app/src/lib/room-turn-timeout.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/room-turn-timeout.ts:1)
- [orbit-app/src/lib/routine-calendar.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-calendar.ts:1)
- [orbit-app/src/lib/routine-display.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routine-display.ts:1)
- [orbit-app/src/lib/routines.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/routines.ts:1)
- [orbit-app/src/lib/schedule-label.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/schedule-label.ts:1)
- [orbit-app/src/lib/screen-preview.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/screen-preview.ts:1)
- [orbit-app/src/lib/search-hit.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/search-hit.ts:1)
- [orbit-app/src/lib/session.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/session.ts:1)
- [orbit-app/src/lib/short-path.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/short-path.ts:1)
- [orbit-app/src/lib/sidebar-preferences.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/sidebar-preferences.ts:1)
- [orbit-app/src/lib/skins.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/skins.ts:1)
- [orbit-app/src/lib/solar-call-decision.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/solar-call-decision.ts:1)
- [orbit-app/src/lib/solar-voice.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/solar-voice.ts:1)
- [orbit-app/src/lib/soul.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/soul.ts:1)
- [orbit-app/src/lib/taskTimeline.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/taskTimeline.ts:1)
- [orbit-app/src/lib/team-import.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-import.ts:1)
- [orbit-app/src/lib/team-map.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-map.ts:1)
- [orbit-app/src/lib/team-share.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-share.ts:1)
- [orbit-app/src/lib/team-templates.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/team-templates.ts:1)
- [orbit-app/src/lib/thread-preferences.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/thread-preferences.ts:1)
- [orbit-app/src/lib/thread-refs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/thread-refs.ts:1)
- [orbit-app/src/lib/transcript-announcer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-announcer.ts:1)
- [orbit-app/src/lib/transcript-window.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/transcript-window.ts:1)
- [orbit-app/src/lib/tts/index.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/tts/index.ts:1)
- [orbit-app/src/lib/tts/useSpeech.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/tts/useSpeech.ts:1)
- [orbit-app/src/lib/turn-tail.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/turn-tail.ts:1)
- [orbit-app/src/lib/updater.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/updater.ts:1)
- [orbit-app/src/lib/usage.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/usage.ts:1)
- [orbit-app/src/lib/use-organization-branding.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/use-organization-branding.ts:1)
- [orbit-app/src/lib/use-owner-or-admin.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/use-owner-or-admin.ts:1)
- [orbit-app/src/lib/verify-steps.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/verify-steps.ts:1)
- [orbit-app/src/lib/voice-key-draft.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/voice-key-draft.ts:1)
- [orbit-app/src/lib/webhook-credentials.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/webhook-credentials.ts:1)
- [orbit-app/src/lib/webhook-message.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/webhook-message.ts:1)
- [orbit-app/src/lib/webhooks.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/webhooks.ts:1)
- [orbit-app/src/lib/welcome-bot.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/welcome-bot.ts:1)
- [orbit-app/src/lib/working-time.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/working-time.ts:1)
- [orbit-app/src/lib/workspace-backup-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/workspace-backup-client.ts:1)
- [orbit-app/src/state/bot-patch-queue.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/bot-patch-queue.ts:1)
- [orbit-app/src/state/store.tsx:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/state/store.tsx:1)
- [orbit-app/server/account-signin.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/account-signin.ts:1)
- [orbit-app/server/admin-activity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/admin-activity.ts:1)
- [orbit-app/server/admission.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/admission.ts:1)
- [orbit-app/server/agent-tool-policy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/agent-tool-policy.ts:1)
- [orbit-app/server/aside-queue.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/aside-queue.ts:1)
- [orbit-app/server/atomic.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/atomic.ts:1)
- [orbit-app/server/attachments.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/attachments.ts:1)
- [orbit-app/server/auto-approve.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/auto-approve.ts:1)
- [orbit-app/server/auto-vm-claims.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/auto-vm-claims.ts:1)
- [orbit-app/server/automatic-recovery.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/automatic-recovery.ts:1)
- [orbit-app/server/boat-create-idempotency.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/boat-create-idempotency.ts:1)
- [orbit-app/server/boat-delete-journal.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/boat-delete-journal.ts:1)
- [orbit-app/server/boat.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/boat.ts:1)
- [orbit-app/server/bot-cwd.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-cwd.ts:1)
- [orbit-app/server/bot-directory.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-directory.ts:1)
- [orbit-app/server/bot-folder.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-folder.ts:1)
- [orbit-app/server/bot-overview.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-overview.ts:1)
- [orbit-app/server/bot-package.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-package.ts:1)
- [orbit-app/server/bot-profile.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-profile.ts:1)
- [orbit-app/server/bot-visibility.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-visibility.ts:1)
- [orbit-app/server/brand.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/brand.ts:1)
- [orbit-app/server/browser-bundle-release.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-bundle-release.ts:1)
- [orbit-app/server/browser-engine-release.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-engine-release.ts:1)
- [orbit-app/server/browser-engine.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-engine.ts:1)
- [orbit-app/server/browser-lifecycle-cleanup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-lifecycle-cleanup.ts:1)
- [orbit-app/server/browser-live.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-live.ts:1)
- [orbit-app/server/browser-profile-consent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-profile-consent.ts:1)
- [orbit-app/server/browser-profile-target.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-profile-target.ts:1)
- [orbit-app/server/browser-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-proxy.ts:1)
- [orbit-app/server/browser-runtime.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-runtime.ts:1)
- [orbit-app/server/browser-tool-shape.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-tool-shape.ts:1)
- [orbit-app/server/caddy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/caddy.ts:1)
- [orbit-app/server/calendar-calls.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/calendar-calls.ts:1)
- [orbit-app/server/channel-queue.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/channel-queue.ts:1)
- [orbit-app/server/checkpoints.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/checkpoints.ts:1)
- [orbit-app/server/chief-of-staff.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/chief-of-staff.ts:1)
- [orbit-app/server/claim-idle.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/claim-idle.ts:1)
- [orbit-app/server/claude-accounts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/claude-accounts.ts:1)
- [orbit-app/server/claude-update.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/claude-update.ts:1)
- [orbit-app/server/cli-api-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli-api-setup.ts:1)
- [orbit-app/server/cli-phone-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli-phone-setup.ts:1)
- [orbit-app/server/cli-prompts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli-prompts.ts:1)
- [orbit-app/server/cli-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli-setup.ts:1)
- [orbit-app/server/cli.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cli.ts:1)
- [orbit-app/server/cloud-backend.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cloud-backend.ts:1)
- [orbit-app/server/cloud-overflow.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/cloud-overflow.ts:1)
- [orbit-app/server/command-allowlist.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/command-allowlist.ts:1)
- [orbit-app/server/commands.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/commands.ts:1)
- [orbit-app/server/comms-visibility.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/comms-visibility.ts:1)
- [orbit-app/server/compaction-summary.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/compaction-summary.ts:1)
- [orbit-app/server/computer-control.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/computer-control.ts:1)
- [orbit-app/server/computer-observation.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/computer-observation.ts:1)
- [orbit-app/server/computer-wait.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/computer-wait.ts:1)
- [orbit-app/server/config.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/config.ts:1)
- [orbit-app/server/container-computer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/container-computer.ts:1)
- [orbit-app/server/container-mcp.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/container-mcp.ts:1)
- [orbit-app/server/context-budget.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/context-budget.ts:1)
- [orbit-app/server/context-rebuild.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/context-rebuild.ts:1)
- [orbit-app/server/contracts.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/contracts.ts:1)
- [orbit-app/server/control-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/control-client.ts:1)
- [orbit-app/server/custom-domain.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/custom-domain.ts:1)
- [orbit-app/server/data-dir-lease.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/data-dir-lease.ts:1)
- [orbit-app/server/decision-log.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/decision-log.ts:1)
- [orbit-app/server/default-model-selection.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/default-model-selection.ts:1)
- [orbit-app/server/delegations.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/delegations.ts:1)
- [orbit-app/server/delta-context.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/delta-context.ts:1)
- [orbit-app/server/digest.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/digest.ts:1)
- [orbit-app/server/drivers/acp/core.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/core.ts:1)
- [orbit-app/server/drivers/acp/cursor.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/cursor.ts:1)
- [orbit-app/server/drivers/acp/custom.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/custom.ts:1)
- [orbit-app/server/drivers/acp/droid.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/droid.ts:1)
- [orbit-app/server/drivers/acp/gemini.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/gemini.ts:1)
- [orbit-app/server/drivers/acp/grok.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/grok.ts:1)
- [orbit-app/server/drivers/acp/hermes.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/hermes.ts:1)
- [orbit-app/server/drivers/acp/kimi.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/kimi.ts:1)
- [orbit-app/server/drivers/acp/opencode-go.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/opencode-go.ts:1)
- [orbit-app/server/drivers/acp/qwen.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/acp/qwen.ts:1)
- [orbit-app/server/drivers/agents-call.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-call.ts:1)
- [orbit-app/server/drivers/agents-catalog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-catalog.ts:1)
- [orbit-app/server/drivers/agents-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-client.ts:1)
- [orbit-app/server/drivers/agents-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-proxy.ts:1)
- [orbit-app/server/drivers/agents-result.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-result.ts:1)
- [orbit-app/server/drivers/antigravity-acp.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/antigravity-acp.ts:1)
- [orbit-app/server/drivers/antigravity-release.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/antigravity-release.ts:1)
- [orbit-app/server/drivers/antigravity-runtime.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/antigravity-runtime.ts:1)
- [orbit-app/server/drivers/antigravity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/antigravity.ts:1)
- [orbit-app/server/drivers/boatagent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/boatagent.ts:1)
- [orbit-app/server/drivers/builtIn.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/builtIn.ts:1)
- [orbit-app/server/drivers/chat-boat-tools.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/chat-boat-tools.ts:1)
- [orbit-app/server/drivers/chat-images.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/chat-images.ts:1)
- [orbit-app/server/drivers/chat-mcp-tools.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/chat-mcp-tools.ts:1)
- [orbit-app/server/drivers/chat-tool-approval.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/chat-tool-approval.ts:1)
- [orbit-app/server/drivers/claude-catalog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/claude-catalog.ts:1)
- [orbit-app/server/drivers/claude-login-auth.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/claude-login-auth.ts:1)
- [orbit-app/server/drivers/claude.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/claude.ts:1)
- [orbit-app/server/drivers/codex-account-catalog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-account-catalog.ts:1)
- [orbit-app/server/drivers/codex-catalog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-catalog.ts:1)
- [orbit-app/server/drivers/codex-device-auth.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-device-auth.ts:1)
- [orbit-app/server/drivers/codex-identity.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-identity.ts:1)
- [orbit-app/server/drivers/codex-instructions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-instructions.ts:1)
- [orbit-app/server/drivers/codex-mcp-names.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-mcp-names.ts:1)
- [orbit-app/server/drivers/codex-orbit-home.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-orbit-home.ts:1)
- [orbit-app/server/drivers/codex-release.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-release.ts:1)
- [orbit-app/server/drivers/codex-tool-surface.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex-tool-surface.ts:1)
- [orbit-app/server/drivers/codex.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex.ts:1)
- [orbit-app/server/drivers/dweb-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/dweb-proxy.ts:1)
- [orbit-app/server/drivers/grok.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/grok.ts:1)
- [orbit-app/server/drivers/grokagent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/grokagent.ts:1)
- [orbit-app/server/drivers/local-inject.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/local-inject.ts:1)
- [orbit-app/server/drivers/minimax.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/minimax.ts:1)
- [orbit-app/server/drivers/mistral.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/mistral.ts:1)
- [orbit-app/server/drivers/native.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/native.ts:1)
- [orbit-app/server/drivers/openai-chat-protocol.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/openai-chat-protocol.ts:1)
- [orbit-app/server/drivers/openai-chat.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/openai-chat.ts:1)
- [orbit-app/server/drivers/openai-compat.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/openai-compat.ts:1)
- [orbit-app/server/drivers/permission-command.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/permission-command.ts:1)
- [orbit-app/server/drivers/phone-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/phone-proxy.ts:1)
- [orbit-app/server/drivers/pi-mcp-extension.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/pi-mcp-extension.ts:1)
- [orbit-app/server/drivers/pi.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/pi.ts:1)
- [orbit-app/server/drivers/prompt-split.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/prompt-split.ts:1)
- [orbit-app/server/drivers/retry.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/retry.ts:1)
- [orbit-app/server/drivers/session-idle.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/session-idle.ts:1)
- [orbit-app/server/engine-install.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/engine-install.ts:1)
- [orbit-app/server/enterprise.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/enterprise.ts:1)
- [orbit-app/server/env-path.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/env-path.ts:1)
- [orbit-app/server/environment.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/environment.ts:1)
- [orbit-app/server/exit.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/exit.ts:1)
- [orbit-app/server/external-runtime.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/external-runtime.ts:1)
- [orbit-app/server/fleet-agent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet-agent.ts:1)
- [orbit-app/server/fleet-cli.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet-cli.ts:1)
- [orbit-app/server/fleet-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet-client.ts:1)
- [orbit-app/server/fleet.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet.ts:1)
- [orbit-app/server/generated-image.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/generated-image.ts:1)
- [orbit-app/server/graceful-shutdown.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/graceful-shutdown.ts:1)
- [orbit-app/server/group-goal-run.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/group-goal-run.ts:1)
- [orbit-app/server/group-thread-usage.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/group-thread-usage.ts:1)
- [orbit-app/server/guarded-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/guarded-requests.ts:1)
- [orbit-app/server/harness/bus.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/harness/bus.ts:1)
- [orbit-app/server/harness/http.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/harness/http.ts:1)
- [orbit-app/server/harness/registry.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/harness/registry.ts:1)
- [orbit-app/server/harness-capabilities.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/harness-capabilities.ts:1)
- [orbit-app/server/hooks/orbit-hook.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/hooks/orbit-hook.ts:1)
- [orbit-app/server/hosted-contract.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/hosted-contract.ts:1)
- [orbit-app/server/hosted-models.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/hosted-models.ts:1)
- [orbit-app/server/hosted-slack.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/hosted-slack.ts:1)
- [orbit-app/server/incidents.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/incidents.ts:1)
- [orbit-app/server/index.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:1)
- [orbit-app/server/installed-playbooks.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/installed-playbooks.ts:1)
- [orbit-app/server/local-computer-consent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-computer-consent.ts:1)
- [orbit-app/server/local-computer-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-computer-proxy.ts:1)
- [orbit-app/server/local-computer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-computer.ts:1)
- [orbit-app/server/local-routing.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-routing.ts:1)
- [orbit-app/server/local-vm-idle.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-vm-idle.ts:1)
- [orbit-app/server/local-vm-inventory.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-vm-inventory.ts:1)
- [orbit-app/server/local-vm-lease.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-vm-lease.ts:1)
- [orbit-app/server/local-vm-seat-pool.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-vm-seat-pool.ts:1)
- [orbit-app/server/maintainer-upgrade.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/maintainer-upgrade.ts:1)
- [orbit-app/server/managed-desktop.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/managed-desktop.ts:1)
- [orbit-app/server/managed-policy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/managed-policy.ts:1)
- [orbit-app/server/mcp-bridge.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-bridge.ts:1)
- [orbit-app/server/mcp-catalog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-catalog.ts:1)
- [orbit-app/server/mcp-gate-config.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-gate-config.ts:1)
- [orbit-app/server/mcp-gate.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-gate.ts:1)
- [orbit-app/server/mcp-http.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-http.ts:1)
- [orbit-app/server/mcp-oauth.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-oauth.ts:1)
- [orbit-app/server/mcp-probe.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-probe.ts:1)
- [orbit-app/server/mcp-registry.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-registry.ts:1)
- [orbit-app/server/mcp-tool-images.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-tool-images.ts:1)
- [orbit-app/server/mcp-tool-schema.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-tool-schema.ts:1)
- [orbit-app/server/mcp-trim.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-trim.ts:1)
- [orbit-app/server/member-turn.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/member-turn.ts:1)
- [orbit-app/server/memory-capture.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-capture.ts:1)
- [orbit-app/server/memory-entries.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-entries.ts:1)
- [orbit-app/server/memory-journal.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-journal.ts:1)
- [orbit-app/server/memory-organize.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-organize.ts:1)
- [orbit-app/server/memory-store.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-store.ts:1)
- [orbit-app/server/memory-tidy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-tidy.ts:1)
- [orbit-app/server/memory-topics.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-topics.ts:1)
- [orbit-app/server/memory-upkeep.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-upkeep.ts:1)
- [orbit-app/server/message-db.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-db.ts:1)
- [orbit-app/server/message-file.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-file.ts:1)
- [orbit-app/server/message-search-query.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-search-query.ts:1)
- [orbit-app/server/message-search-worker.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-search-worker.ts:1)
- [orbit-app/server/message-search.worker.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-search.worker.ts:1)
- [orbit-app/server/model-context-window.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/model-context-window.ts:1)
- [orbit-app/server/model-prices.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/model-prices.ts:1)
- [orbit-app/server/model-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/model-requests.ts:1)
- [orbit-app/server/names.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/names.ts:1)
- [orbit-app/server/new-bot-defaults.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/new-bot-defaults.ts:1)
- [orbit-app/server/notify.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/notify.ts:1)
- [orbit-app/server/options-card.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/options-card.ts:1)
- [orbit-app/server/orbit-agent.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit-agent.ts:1)
- [orbit-app/server/orbit-change-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit-change-requests.ts:1)
- [orbit-app/server/orbit-source.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit-source.ts:1)
- [orbit-app/server/orbit-status-capsule.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit-status-capsule.ts:1)
- [orbit-app/server/orbit.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit.ts:1)
- [orbit-app/server/package-export.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/package-export.ts:1)
- [orbit-app/server/package-import.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/package-import.ts:1)
- [orbit-app/server/pair-cli.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/pair-cli.ts:1)
- [orbit-app/server/peer-approval-key.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/peer-approval-key.ts:1)
- [orbit-app/server/peer-approval.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/peer-approval.ts:1)
- [orbit-app/server/peer-delivery.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/peer-delivery.ts:1)
- [orbit-app/server/peer-provenance.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/peer-provenance.ts:1)
- [orbit-app/server/peer-roster.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/peer-roster.ts:1)
- [orbit-app/server/permission-proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/permission-proxy.ts:1)
- [orbit-app/server/phone-approval.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/phone-approval.ts:1)
- [orbit-app/server/phone-secret.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/phone-secret.ts:1)
- [orbit-app/server/prices.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/prices.ts:1)
- [orbit-app/server/private-screen-capture.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/private-screen-capture.ts:1)
- [orbit-app/server/procs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/procs.ts:1)
- [orbit-app/server/profile-learned.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/profile-learned.ts:1)
- [orbit-app/server/profile-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/profile-requests.ts:1)
- [orbit-app/server/profile-revision.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/profile-revision.ts:1)
- [orbit-app/server/profile-versions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/profile-versions.ts:1)
- [orbit-app/server/project-scout.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/project-scout.ts:1)
- [orbit-app/server/provider-auth-sessions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/provider-auth-sessions.ts:1)
- [orbit-app/server/provider-icon.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/provider-icon.ts:1)
- [orbit-app/server/provider-key-check.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/provider-key-check.ts:1)
- [orbit-app/server/proxy-paths.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/proxy-paths.ts:1)
- [orbit-app/server/published-teams.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/published-teams.ts:1)
- [orbit-app/server/recall-disclosure.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/recall-disclosure.ts:1)
- [orbit-app/server/recall.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/recall.ts:1)
- [orbit-app/server/recent-work.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/recent-work.ts:1)
- [orbit-app/server/redact.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/redact.ts:1)
- [orbit-app/server/repeat-detector.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/repeat-detector.ts:1)
- [orbit-app/server/replies.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/replies.ts:1)
- [orbit-app/server/request-auth.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:1)
- [orbit-app/server/resume-recovery.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/resume-recovery.ts:1)
- [orbit-app/server/room-cwd.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/room-cwd.ts:1)
- [orbit-app/server/room-handoffs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/room-handoffs.ts:1)
- [orbit-app/server/room-post-budget.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/room-post-budget.ts:1)
- [orbit-app/server/room-turn-timeout.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/room-turn-timeout.ts:1)
- [orbit-app/server/routes/bot-memory.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/bot-memory.ts:1)
- [orbit-app/server/routes/hosted-slack.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/hosted-slack.ts:1)
- [orbit-app/server/routes/table.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/table.ts:1)
- [orbit-app/server/routine-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routine-requests.ts:1)
- [orbit-app/server/routines.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routines.ts:1)
- [orbit-app/server/schema.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/schema.ts:1)
- [orbit-app/server/screen-frame-gate.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/screen-frame-gate.ts:1)
- [orbit-app/server/screen-frame-source.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/screen-frame-source.ts:1)
- [orbit-app/server/section-context.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/section-context.ts:1)
- [orbit-app/server/send-idempotency.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/send-idempotency.ts:1)
- [orbit-app/server/service-cli.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/service-cli.ts:1)
- [orbit-app/server/service-unit.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/service-unit.ts:1)
- [orbit-app/server/sessions.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/sessions.ts:1)
- [orbit-app/server/setup-mode.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/setup-mode.ts:1)
- [orbit-app/server/shared-computer-control.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/shared-computer-control.ts:1)
- [orbit-app/server/shared-computers.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/shared-computers.ts:1)
- [orbit-app/server/skill-fetch.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/skill-fetch.ts:1)
- [orbit-app/server/skill-learn.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/skill-learn.ts:1)
- [orbit-app/server/skill-library.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/skill-library.ts:1)
- [orbit-app/server/skills.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/skills.ts:1)
- [orbit-app/server/solar-speech.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/solar-speech.ts:1)
- [orbit-app/server/solar-workspace.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/solar-workspace.ts:1)
- [orbit-app/server/spend.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/spend.ts:1)
- [orbit-app/server/sse-fanout.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/sse-fanout.ts:1)
- [orbit-app/server/steer-queue.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/steer-queue.ts:1)
- [orbit-app/server/store.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/store.ts:1)
- [orbit-app/server/surface.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/surface.ts:1)
- [orbit-app/server/system-prompt.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/system-prompt.ts:1)
- [orbit-app/server/tailscale.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tailscale.ts:1)
- [orbit-app/server/team-backup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/team-backup.ts:1)
- [orbit-app/server/team-computers.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/team-computers.ts:1)
- [orbit-app/server/team-library.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/team-library.ts:1)
- [orbit-app/server/team-manifest.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/team-manifest.ts:1)
- [orbit-app/server/team-setup-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/team-setup-requests.ts:1)
- [orbit-app/server/thread-events.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/thread-events.ts:1)
- [orbit-app/server/thread-log-rotation.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/thread-log-rotation.ts:1)
- [orbit-app/server/thread-retention.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/thread-retention.ts:1)
- [orbit-app/server/thread-starters.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/thread-starters.ts:1)
- [orbit-app/server/tightening-requests.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tightening-requests.ts:1)
- [orbit-app/server/tool-results.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tool-results.ts:1)
- [orbit-app/server/tool-summary.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tool-summary.ts:1)
- [orbit-app/server/tts/chatterbox.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/chatterbox.ts:1)
- [orbit-app/server/tts/elevenlabs.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/elevenlabs.ts:1)
- [orbit-app/server/tts/fish.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/fish.ts:1)
- [orbit-app/server/tts/grok.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/grok.ts:1)
- [orbit-app/server/tts/index.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/index.ts:1)
- [orbit-app/server/tts/speech-text.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/speech-text.ts:1)
- [orbit-app/server/tts/system-voices.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/system-voices.ts:1)
- [orbit-app/server/tunnel.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tunnel.ts:1)
- [orbit-app/server/turn-context.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-context.ts:1)
- [orbit-app/server/turn-dispatch-guard.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-dispatch-guard.ts:1)
- [orbit-app/server/turn-images.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-images.ts:1)
- [orbit-app/server/turn-resources.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-resources.ts:1)
- [orbit-app/server/turn-watchdog.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-watchdog.ts:1)
- [orbit-app/server/usage-ledger.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/usage-ledger.ts:1)
- [orbit-app/server/vps-computer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/vps-computer.ts:1)
- [orbit-app/server/vps-container-mcp.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/vps-container-mcp.ts:1)
- [orbit-app/server/vps-ssh.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/vps-ssh.ts:1)
- [orbit-app/server/webhook-ingress.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/webhook-ingress.ts:1)
- [orbit-app/server/webhooks.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/webhooks.ts:1)
- [orbit-app/server/workspace-backup-http.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-http.ts:1)
- [orbit-app/server/workspace-backup-maintenance.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-maintenance.ts:1)
- [orbit-app/server/workspace-backup-policy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-policy.ts:1)
- [orbit-app/server/workspace-backup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup.ts:1)
- [orbit-app/server/workspace-backup.worker.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup.worker.ts:1)
- [orbit-app/server/workspace.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace.ts:1)
- [orbit-app/electron/android-device.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/android-device.mjs:1)
- [orbit-app/electron/app-permissions.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/app-permissions.mjs:1)
- [orbit-app/electron/approval-trusted-mode.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/approval-trusted-mode.cjs:1)
- [orbit-app/electron/build-speech-helper.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/build-speech-helper.mjs:1)
- [orbit-app/electron/capabilities.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/capabilities.cjs:1)
- [orbit-app/electron/companion-account-service.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/companion-account-service.mjs:1)
- [orbit-app/electron/companion-entry.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/companion-entry.mjs:1)
- [orbit-app/electron/companion-origin-gateway.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/companion-origin-gateway.mjs:1)
- [orbit-app/electron/companion.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/companion.mjs:1)
- [orbit-app/electron/company-backup-schedule.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/company-backup-schedule.mjs:1)
- [orbit-app/electron/company-backups.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/company-backups.mjs:1)
- [orbit-app/electron/computer-sharing.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:1)
- [orbit-app/electron/control-plane-client.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/control-plane-client.mjs:1)
- [orbit-app/electron/cua-connection.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua-connection.cjs:1)
- [orbit-app/electron/cua-embedded-daemon.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua-embedded-daemon.mjs:1)
- [orbit-app/electron/cua-linux-bundle.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua-linux-bundle.cjs:1)
- [orbit-app/electron/cua-linux-runtime.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua-linux-runtime.cjs:1)
- [orbit-app/electron/cua-linux.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua-linux.cjs:1)
- [orbit-app/electron/cua.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua.mjs:1)
- [orbit-app/electron/data-dir-lease.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/data-dir-lease.mjs:1)
- [orbit-app/electron/desktop-companion-client.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-companion-client.mjs:1)
- [orbit-app/electron/desktop-server-auth.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-server-auth.cjs:1)
- [orbit-app/electron/desktop-viewer-permissions.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-viewer-permissions.mjs:1)
- [orbit-app/electron/desktop-viewer.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-viewer.cjs:1)
- [orbit-app/electron/desktop-workspace.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/desktop-workspace.cjs:1)
- [orbit-app/electron/diagnostics.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/diagnostics.mjs:1)
- [orbit-app/electron/environments.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/environments.cjs:1)
- [orbit-app/electron/fixtures/browser-closed-shadow.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/fixtures/browser-closed-shadow.cjs:1)
- [orbit-app/electron/fixtures/updater-handoff.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/fixtures/updater-handoff.cjs:1)
- [orbit-app/electron/lending-activity.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/lending-activity.mjs:1)
- [orbit-app/electron/local-origin.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/local-origin.cjs:1)
- [orbit-app/electron/main.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:1)
- [orbit-app/electron/managed-companion-guardian-main.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-companion-guardian-main.mjs:1)
- [orbit-app/electron/managed-companion-guardian.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-companion-guardian.mjs:1)
- [orbit-app/electron/managed-companion-tunnel.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-companion-tunnel.mjs:1)
- [orbit-app/electron/managed-desktop.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-desktop.mjs:1)
- [orbit-app/electron/menu.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/menu.mjs:1)
- [orbit-app/electron/orbit-capture.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/orbit-capture.mjs:1)
- [orbit-app/electron/orbit-shell-prefs.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/orbit-shell-prefs.mjs:1)
- [orbit-app/electron/orbit-summon.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/orbit-summon.mjs:1)
- [orbit-app/electron/organization-branding.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/organization-branding.mjs:1)
- [orbit-app/electron/organization-entry.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/organization-entry.mjs:1)
- [orbit-app/electron/package-install-command.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/package-install-command.mjs:1)
- [orbit-app/electron/package-link.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/package-link.mjs:1)
- [orbit-app/electron/paste-menu-item.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/paste-menu-item.mjs:1)
- [orbit-app/electron/phone-secret-identity.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/phone-secret-identity.mjs:1)
- [orbit-app/electron/preload.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/preload.cjs:1)
- [orbit-app/electron/routine-wake.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/routine-wake.mjs:1)
- [orbit-app/electron/save-file.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/save-file.mjs:1)
- [orbit-app/electron/screen-preview.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/screen-preview.cjs:1)
- [orbit-app/electron/secure-credential-state.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/secure-credential-state.mjs:1)
- [orbit-app/electron/secure-credentials.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/secure-credentials.mjs:1)
- [orbit-app/electron/server-boot-probe.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/server-boot-probe.mjs:1)
- [orbit-app/electron/server-supervisor.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/server-supervisor.mjs:1)
- [orbit-app/electron/shared-computer-access.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/shared-computer-access.mjs:1)
- [orbit-app/electron/single-instance.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/single-instance.mjs:1)
- [orbit-app/electron/skin-overlay.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/skin-overlay.cjs:1)
- [orbit-app/electron/source-updater.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/source-updater.mjs:1)
- [orbit-app/electron/speech-input-prefs.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/speech-input-prefs.mjs:1)
- [orbit-app/electron/speech-owner.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/speech-owner.mjs:1)
- [orbit-app/electron/speech.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/speech.mjs:1)
- [orbit-app/electron/startup-cache-eviction.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/startup-cache-eviction.mjs:1)
- [orbit-app/electron/startup-screen-preload.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/startup-screen-preload.cjs:1)
- [orbit-app/electron/startup-screen.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/startup-screen.mjs:1)
- [orbit-app/electron/system-tray.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/system-tray.mjs:1)
- [orbit-app/electron/terminal-launch.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/terminal-launch.mjs:1)
- [orbit-app/electron/update-errors.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/update-errors.mjs:1)
- [orbit-app/electron/updater-coordinator.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/updater-coordinator.mjs:1)
- [orbit-app/electron/updater.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/updater.mjs:1)
- [orbit-app/electron/window-chrome.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/window-chrome.mjs:1)
- [orbit-app/electron/window-state.cjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/window-state.cjs:1)
- [orbit-app/electron/workspace-credentials.mjs:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/workspace-credentials.mjs:1)
- [orbit-app/companion/src/advertise-watch.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/advertise-watch.ts:1)
- [orbit-app/companion/src/connected-devices.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/connected-devices.ts:1)
- [orbit-app/companion/src/control.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/control.ts:1)
- [orbit-app/companion/src/devices.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/devices.ts:1)
- [orbit-app/companion/src/endpoints.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/endpoints.ts:1)
- [orbit-app/companion/src/index.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/index.ts:1)
- [orbit-app/companion/src/listener.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/listener.ts:1)
- [orbit-app/companion/src/mdns.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/mdns.ts:1)
- [orbit-app/companion/src/origin.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/origin.ts:1)
- [orbit-app/companion/src/phone-secret-key.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/phone-secret-key.ts:1)
- [orbit-app/companion/src/proxy.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/proxy.ts:1)
- [orbit-app/companion/src/routes.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/routes.ts:1)
- [orbit-app/companion/src/solar-browser.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:1)
- [orbit-app/companion/src/state.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/state.ts:1)
- [orbit-app/companion/src/viewer-relay.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/viewer-relay.ts:1)
- [orbit-app/companion/src/wire.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/wire.ts:1)
- [orbit-app/shared/approval-mode.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/approval-mode.ts:1)
- [orbit-app/shared/ask-question.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/ask-question.ts:1)
- [orbit-app/shared/bot-profile.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/bot-profile.ts:1)
- [orbit-app/shared/command-allowlist.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/command-allowlist.ts:1)
- [orbit-app/shared/computer-contention.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/computer-contention.ts:1)
- [orbit-app/shared/credential-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/credential-request.ts:1)
- [orbit-app/shared/cron-label.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/cron-label.ts:1)
- [orbit-app/shared/digest.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/digest.ts:1)
- [orbit-app/shared/group-goal-run.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/group-goal-run.ts:1)
- [orbit-app/shared/import-name.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/import-name.ts:1)
- [orbit-app/shared/inspector.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/inspector.ts:1)
- [orbit-app/shared/json.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/json.ts:1)
- [orbit-app/shared/learn-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/learn-request.ts:1)
- [orbit-app/shared/line-diff.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/line-diff.ts:1)
- [orbit-app/shared/markdown-windows-paths.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/markdown-windows-paths.ts:1)
- [orbit-app/shared/mascot-bodies.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/mascot-bodies.ts:1)
- [orbit-app/shared/mention-boundary.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/mention-boundary.ts:1)
- [orbit-app/shared/model-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/model-request.ts:1)
- [orbit-app/shared/new-bot-defaults.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/new-bot-defaults.ts:1)
- [orbit-app/shared/notification.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/notification.ts:1)
- [orbit-app/shared/options-card.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/options-card.ts:1)
- [orbit-app/shared/orbit-change.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/orbit-change.ts:1)
- [orbit-app/shared/package-format.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/package-format.ts:1)
- [orbit-app/shared/profile-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/profile-request.ts:1)
- [orbit-app/shared/provider-icon.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/provider-icon.ts:1)
- [orbit-app/shared/provider-safety.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/provider-safety.ts:1)
- [orbit-app/shared/redact.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/redact.ts:1)
- [orbit-app/shared/routine-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/routine-request.ts:1)
- [orbit-app/shared/routine-run.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/routine-run.ts:1)
- [orbit-app/shared/routine-schedule.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/routine-schedule.ts:1)
- [orbit-app/shared/routines.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/routines.ts:1)
- [orbit-app/shared/runtime-events.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/runtime-events.ts:1)
- [orbit-app/shared/skill-md.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/skill-md.ts:1)
- [orbit-app/shared/skill-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/skill-request.ts:1)
- [orbit-app/shared/team-backup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/team-backup.ts:1)
- [orbit-app/shared/team-computer.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/team-computer.ts:1)
- [orbit-app/shared/team-setup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/team-setup.ts:1)
- [orbit-app/shared/tightening-request.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/tightening-request.ts:1)
- [orbit-app/shared/tool-surface.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/tool-surface.ts:1)
- [orbit-app/shared/webhooks.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/webhooks.ts:1)
- [orbit-app/shared/wire.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/wire.ts:1)
- [orbit-app/shared/workspace-backup-client.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/workspace-backup-client.ts:1)
- [orbit-app/shared/workspace-backup.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/shared/workspace-backup.ts:1)
- [orbit-app/enterprise/server/index.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/index.ts:1)
- [orbit-app/enterprise/server/license.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/license.ts:1)
- [orbit-app/enterprise/server/workspace-access.ts:1](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/workspace-access.ts:1)
