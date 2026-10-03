// The whole app, once paired: one canvas. You in the middle, your teams
// around you, every bot as its character. Tap a bot and the camera flies to
// it and it steps up to the corner, the way the desktop's bot does for its
// calendar or a file it shows; its chat takes the rest of the screen. Its
// settings button flies it back to the middle with its systems round it, on
// their own, no chat; a system steps it up to the corner again with that
// system in the chat's place. Tap the canvas or "‹ Team map" to fly back.
// Nothing is pushed and nothing opens as a sheet.
//
// Desktop: src/orbit/OrbitShell.tsx and scene.ts (camTarget and its covered
// corner, focusGeom, the systems orbit). Styling: the phone prototype. The
// owner's calls, 2026-09-26: PRODUCT.md.
import SwiftUI
import CompanionCore

/// What the camera is on.
enum OrbitFocus: Equatable {
    case map
    case bot(String)
    case room(String)
    case you

    /// The canvas's name for it.
    var canvasId: String? {
        switch self {
        case .map: nil
        case let .bot(id): id
        case let .room(id): "channel:\(id)"
        case .you: "you"
        }
    }
}

/// The camera and the focus animation, stepped once a frame. A class, so
/// drawing a frame doesn't re-render the views around the canvas.
final class CameraRig {
    var cam = MapCamera()
    /// where the map was left: the fit, or wherever it was panned and zoomed
    var user = MapCamera()
    var fitted = false
    var focusT: Double = 0
    var revealStart: Double = 0
    var focusKey: String?
    var moving = false
    /// the last tap on empty canvas, for a double tap
    var lastEmptyTap: Date?
    private var lastT: Double?

    /// Ease toward the target the way the desktop does (8% a frame at 60 fps),
    /// whatever the frame rate.
    func step(to target: MapCamera, focused: Bool, snap: Bool, t: Double, size: CGSize) {
        let dt = lastT.map { max(0, min(0.1, t - $0)) } ?? 0
        lastT = t
        let k = snap ? 1 : 1 - pow(1 - 0.085, dt * 60)
        let a0 = cam.anchorPoint(in: size), a1 = target.anchorPoint(in: size)
        cam.center.x += (target.center.x - cam.center.x) * k
        cam.center.y += (target.center.y - cam.center.y) * k
        // scale eases in log space, so a long zoom doesn't rush its start
        cam.scale = exp(log(cam.scale) + (log(target.scale) - log(cam.scale)) * k)
        let ka = snap ? 1 : 1 - pow(1 - 0.12, dt * 60)
        cam.anchor = CGPoint(x: a0.x + (a1.x - a0.x) * ka, y: a0.y + (a1.y - a0.y) * ka)
        focusT += ((focused ? 1 : 0) - focusT) * (snap ? 1 : k)
        moving = abs(target.scale - cam.scale) / cam.scale > 0.003
            || hypot(target.center.x - cam.center.x, target.center.y - cam.center.y) * cam.scale > 1
            || hypot(a1.x - cam.anchor!.x, a1.y - cam.anchor!.y) > 1
            || abs((focused ? 1 : 0) - focusT) > 0.01
    }
}

/// Where things go on this phone's screen.
struct ShellGeometry {
    let size: CGSize
    let safe: EdgeInsets
    /// the "‹ Team map" row
    var linkY: CGFloat { safe.top + 20 }
    /// The band the focused character and its systems sit in.
    var ringTop: CGFloat { safe.top + 50 }
    var ringBottom: CGFloat { size.height - safe.bottom - 40 }
    var fx: CGFloat { size.width / 2 }
    var fy: CGFloat { (ringTop + ringBottom) / 2 - 20 }
    /// the character at the top while its chat has the screen: in the middle
    /// of the back link's row, its name under it, so the top isn't all on
    /// one side (the back link left, Chat or Settings right)
    var cornerPoint: CGPoint { CGPoint(x: size.width / 2, y: linkY + 2) }
    let cornerR: CGFloat = 17
    /// where the name under the top character sits
    var headerNameY: CGFloat { linkY + 45 }
    /// where the chat starts, under the character and its name
    var columnTop: CGFloat { safe.top + 94 }
    let focusR: CGFloat = 32
    /// A system label's size: the ring keeps every label on screen.
    static let labelSize = CGSize(width: 128, height: 34)

    /// Where each system sits: two arcs round the character, like ( ), the
    /// desktop's orbit fitted to a tall phone. Each side is spaced evenly
    /// from top to bottom, so labels never crowd where an even ellipse bunches
    /// them (its top and bottom), and the whole height is used. The right side
    /// sits half a step off the left, so no two labels share a row even where
    /// the arcs come close. Clockwise from the top right: down the right, then
    /// up the left.
    func ringSlots(_ n: Int) -> [CGPoint] {
        guard n > 0 else { return [] }
        let half = Self.labelSize.width / 2
        let rx = size.width / 2 - half - 10
        // a short ring (You's six) stays near the character, not the whole height
        let reach: CGFloat = n <= 6 ? 230 : .greatestFiniteMagnitude
        let top = max(ringTop + 24, fy - reach), bottom = min(ringBottom - 12, fy + reach)
        let ry = max(fy - top, bottom - fy) / 0.93
        let left = (n + 1) / 2, right = n - left
        let step = left > 1 ? (bottom - top) / CGFloat(left - 1) : 0
        func arc(_ count: Int, from start: CGFloat, to end: CGFloat, side: CGFloat) -> [CGPoint] {
            (0..<count).map { k in
                let y = count == 1 ? (start + end) / 2 : start + (end - start) * CGFloat(k) / CGFloat(count - 1)
                let t = max(-1, min(1, (y - fy) / ry))
                return CGPoint(x: fx + side * rx * CGFloat((1 - t * t).squareRoot()), y: y)
            }
        }
        let rightSide = arc(right, from: top + step / 2, to: bottom - step / 2, side: 1)
        let leftSide = arc(left, from: top, to: bottom, side: -1)
        return rightSide + leftSide.reversed()
    }

    /// Where a system's line stops: where it meets the label's box.
    func lineEnd(_ slot: CGPoint) -> CGPoint {
        let dx = slot.x - fx, dy = slot.y - fy
        let hw = Self.labelSize.width / 2 + 4, hh = Self.labelSize.height / 2 + 2
        // step back from the label's centre toward the character to its edge
        let tx = dx == 0 ? CGFloat.infinity : hw / abs(dx), ty = dy == 0 ? CGFloat.infinity : hh / abs(dy)
        let back = min(1, min(tx, ty))
        return CGPoint(x: slot.x - dx * back, y: slot.y - dy * back)
    }
}

/// What opens on the bare map, from the bottom, where there is no bot to
/// step aside.
enum MapPanel: Equatable {
    case waiting, newGroup, newSection
}

/// One system around a focused bot or channel.
struct ShellSystem: Identifiable {
    let id: String
    let icon: String
    let label: String
    var value: String = ""
    var warn = false
    var live = false
    var selected = false
    let open: () -> Void
}

struct OrbitShell: View {
    @EnvironmentObject private var session: Session
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @AppStorage(PrefKey.mapDrift) private var mapDrift = true
    @Environment(\.scenePhase) private var scenePhase

    @State private var focus: OrbitFocus = .map
    @State private var openChat: Chat?
    /// a system open in the chat's place, the bot in the corner
    @State private var panel: OrbitPanel?
    /// one of You's systems, You in the corner
    @State private var youPanel: YouPanel?
    @State private var mapPanel: MapPanel?
    /// a panel the chat opened in its own place (threads, the + menu's)
    @State private var chatPanel: OrbitPanel?
    /// the focused bot's settings: it in the middle, its systems round it
    @State private var settingsOpen = false
    @State private var searching = false
    @State private var rig = CameraRig()
    /// Where the camera settled, for the elements VoiceOver and the UI tests
    /// see over the drawn characters (the canvas moves every frame; they
    /// follow once it holds still).
    @State private var settledCam = MapCamera()
    @State private var chars = MapCharacters()
    @State private var dragStart: MapCamera?
    @State private var pinchStart: MapCamera?
    @State private var ringShown = false
    @State private var showingWalkie = false
    @State private var draft = ""
    @State private var addresseeId: String?
    @State private var sending = false
    @FocusState private var composerFocused: Bool

    private var model: OrbitMapModel { OrbitMapModel(state: session.state, connected: session.status == .live || session.status == .connecting) }

    var body: some View {
        GeometryReader { outer in
            let geo = ShellGeometry(size: CGSize(width: outer.size.width + outer.safeAreaInsets.leading + outer.safeAreaInsets.trailing,
                                                 height: outer.size.height + outer.safeAreaInsets.top + outer.safeAreaInsets.bottom),
                                    safe: outer.safeAreaInsets)
            let model = model.laidOut(portrait: geo.size.height > geo.size.width)
            let homes = model.homes()
            let systems = systems(model: model)
            ZStack(alignment: .topLeading) {
                Orbit.canvas.ignoresSafeArea()
                canvasLayer(model: model, homes: homes, geo: geo, systems: systems)
                    .ignoresSafeArea()

                if focus != .map && showsRing {
                    focusOverlay(model: model, geo: geo, systems: systems)
                        .ignoresSafeArea()
                        .transition(.opacity)
                }

                if focus != .map && !showsRing {
                    cornerHeader(geo: geo)
                        .ignoresSafeArea()
                        .transition(.opacity)
                    column(geo: geo)
                        .transition(.asymmetric(insertion: .offset(y: 50).combined(with: .opacity), removal: .opacity))
                        .zIndex(2)
                }

                if model.bots.isEmpty && focus == .map { emptyState }

                topBar(model: model, geo: geo)
                    .ignoresSafeArea(.keyboard)

                if focus == .map {
                    mapBottom(model: model)
                        .opacity(mapPanel == nil ? 1 : 0)
                        .allowsHitTesting(mapPanel == nil)
                        .transition(.opacity)
                    if searching { searchPanel(geo: geo) }
                    if mapPanel != nil { mapPanelLayer(geo: geo) }
                }
            }
            .animation(.spring(response: 0.42, dampingFraction: 0.86), value: focus)
            .animation(.spring(response: 0.36, dampingFraction: 0.86), value: searching)
            .animation(.spring(response: 0.36, dampingFraction: 0.86), value: mapPanel)
            .animation(.spring(response: 0.42, dampingFraction: 0.86), value: panel)
            .animation(.spring(response: 0.42, dampingFraction: 0.86), value: settingsOpen)
            .animation(.spring(response: 0.42, dampingFraction: 0.86), value: youPanel)
            .onAppear { fitIfNeeded(homes: homes, geo: geo) }
            .onValueChange(of: homes.keys.sorted()) { _ in fitIfNeeded(homes: homes, geo: geo, force: focus == .map) }
        }
        // the chat waiting at the bottom shows its last line
        .task(id: openChat?.threadId) {
            if let chat = openChat { await session.loadThreadIfNeeded(chat.threadId) }
        }
        .onValueChange(of: session.notificationChat) { chat in
            guard let chat else { return }
            open(chat)
            session.consumeNotificationChat()
        }
        // an orbit://chat link (a widget row) opens its chat the same way
        .onValueChange(of: session.pendingChat) { chat in
            guard let chat else { return }
            open(chat)
            session.consumePendingChat()
        }
        .onValueChange(of: focusStillExists) { exists in if !exists { goToMap() } }
        .task {
            if let chat = session.notificationChat {
                open(chat)
                session.consumeNotificationChat()
            }
            if let chat = session.pendingChat {
                open(chat)
                session.consumePendingChat()
            }
        }
#if DEBUG
        // Preview-only routes let the screenshot harness reach screens that
        // normally require a paired computer and a tap.
        .task {
            let args = ProcessInfo.processInfo.arguments
            // the preview state arrives a moment after launch
            for _ in 0..<40 where model.addressees.isEmpty { try? await Task.sleep(for: .milliseconds(100)) }
            if args.contains("-open-new-section") { mapPanel = .newSection }
            if args.contains("-open-new-group") { mapPanel = .newGroup }
            if args.contains("-open-walkie") { showingWalkie = true }
            if args.contains("-open-waiting") { mapPanel = .waiting }
            if args.contains("-open-search") { searching = true }
            if args.contains("-open-first"), focus == .map, let first = model.addressees.first {
                open(session.threadSelection.restoringThread(.bot(first), connectionID: session.connection?.id))
            }
            if args.contains("-open-settings") { settingsOpen = true }
            if let i = args.firstIndex(of: "-open-panel"), i + 1 < args.count, let p = OrbitPanel(rawValue: args[i + 1]) { settingsOpen = true; panel = p }
            if args.contains("-open-you") { openYou() }
            if let i = args.firstIndex(of: "-open-you-panel"), i + 1 < args.count, let p = YouPanel(rawValue: args[i + 1]) { openYou(); youPanel = p }
        }
#endif
        .fullScreenCover(isPresented: $showingWalkie) {
            WalkieView { chat in
                showingWalkie = false
                open(chat)
            }
            .environmentObject(session)
        }
    }

    /// The bot or channel in focus was deleted, or this computer went away.
    private var focusStillExists: Bool {
        switch focus {
        case .map, .you: true
        case let .bot(id): session.state.bot(id) != nil || session.state.bots.isEmpty
        case let .room(id): session.state.rooms.contains { $0.id == id } || session.state.rooms.isEmpty
        }
    }

    // MARK: - The canvas

    private func cameraTarget(model: OrbitMapModel, homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry) -> MapCamera {
        let focusPoint = showsRing ? CGPoint(x: geo.fx, y: geo.fy) : geo.cornerPoint
        let radius = showsRing ? geo.focusR : geo.cornerR
        switch focus {
        case .map:
            return rig.user
        case let .bot(id):
            guard let home = homes[id] else { return rig.user }
            let base = home.chief ? TeamMapCanvas.chiefR : TeamMapCanvas.memberR
            // the focused character is drawn at focusR; the map around it
            // is zoomed as if everything grew to that size
            return MapCamera(center: home.point, scale: max(1.2, radius / base * 1.25), anchor: focusPoint)
        case let .room(id):
            guard let channel = model.channels.first(where: { $0.id == id }) else { return rig.user }
            // frame the channel with its members, between the two systems
            let centre = model.channelPos(channel, homes: homes)
            let pts = channel.memberIds.compactMap { homes[$0]?.point } + [centre]
            let xs = pts.map(\.x), ys = pts.map(\.y)
            let spanX = max(120, xs.max()! - xs.min()! + 90), spanY = max(100, ys.max()! - ys.min()! + 90)
            let mid = CGPoint(x: (xs.max()! + xs.min()!) / 2, y: (ys.max()! + ys.min()!) / 2)
            let s = min((geo.size.width - 250) / spanX, (geo.ringBottom - geo.ringTop - 70) / spanY, 1.0)
            return showsRing ? MapCamera(center: mid, scale: max(0.25, s), anchor: CGPoint(x: geo.fx, y: geo.fy))
                : MapCamera(center: centre, scale: 0.55, anchor: focusPoint)
        case .you:
            return MapCamera(center: OrbitMapModel.you, scale: 1.1, anchor: focusPoint)
        }
    }

    private func canvasLayer(model: OrbitMapModel, homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry, systems: [ShellSystem]) -> some View {
        let live = !reduceMotion && scenePhase == .active
        let slots = geo.ringSlots(systems.count)
        let focusKey = focus.canvasId
        let ringOn = focus != .map && showsRing
        let radius = showsRing ? geo.focusR : geo.cornerR
        return TimelineView(.animation(minimumInterval: 1.0 / 60.0, paused: !live)) { timeline in
            let t = timeline.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 100_000)
            ZStack {
                Canvas { ctx, size in
                    let snap = !live || dragStart != nil || pinchStart != nil
                    if rig.focusKey != focusKey || (ringOn && rig.revealStart < 0) {
                        rig.focusKey = focusKey
                        rig.revealStart = ringOn ? t : -1
                    }
                    if !ringOn { rig.revealStart = -1 }
                    // read each frame: a pan, a pinch or a refit moves the
                    // map's own camera without re-rendering the views
                    let target = cameraTarget(model: model, homes: homes, geo: geo)
                    let wasMoving = rig.moving
                    rig.step(to: target, focused: focus != .map, snap: snap, t: t, size: size)
                    if !rig.moving, dragStart == nil, pinchStart == nil, (wasMoving || !settledCam.near(rig.cam)) {
                        let cam = rig.cam
                        DispatchQueue.main.async { if !settledCam.near(cam) { settledCam = cam } }
                    }
                    var f = CanvasFocus()
                    f.id = focusKey ?? rig.focusKey
                    f.t = rig.focusT
                    f.R = radius
                    f.highlight = ringOn
                    if ringOn {
                        f.ring = slots.map(geo.lineEnd)
                        f.live = Set(systems.indices.filter { systems[$0].live })
                        f.warn = Set(systems.indices.filter { systems[$0].warn })
                        f.revealStart = rig.revealStart
                    }
                    TeamMapCanvas.draw(&ctx, size: size, model: model, homes: homes, camera: rig.cam, chars: chars, t: t, reduced: !live, drift: mapDrift, focus: f)
                }
                .accessibilityHidden(true)

                if focus == .map { mapTargets(model: model, homes: homes, size: geo.size) }
            }
        }
        .contentShape(Rectangle())
        .gesture(panGesture, including: focus == .map ? .all : .none)
        .simultaneousGesture(pinchGesture, including: focus == .map ? .all : .none)
        .simultaneousGesture(SpatialTapGesture().onEnded { value in
            tapCanvas(at: value.location, model: model, homes: homes, geo: geo)
        })
    }

    /// Transparent elements over the characters, for VoiceOver and the UI
    /// tests; taps land on the canvas itself.
    @ViewBuilder
    private func mapTargets(model: OrbitMapModel, homes: [String: (point: CGPoint, chief: Bool)], size: CGSize) -> some View {
        let cam = settledCam
        ForEach(model.bots) { bot in
            if let home = homes[bot.id] {
                let R = (home.chief ? TeamMapCanvas.chiefR : TeamMapCanvas.memberR) * cam.sizeFactor
                Color.clear
                    .frame(width: R * 2 + 18, height: R * 2 + 18)
                    .position(cam.screen(home.point, in: size))
                    .accessibilityElement()
                    .accessibilityAddTraits(.isButton)
                    .accessibilityLabel(Text(verbatim: bot.bot.name))
                    .accessibilityValue(Text(bot.waiting ? "Waiting on you" : bot.busy ? "Working" : bot.unread ? "Unread" : ""))
                    .accessibilityIdentifier("map-bot.\(bot.id)")
                    .accessibilityAction { open(bot.bot) }
                    .allowsHitTesting(false)
            }
        }
        ForEach(model.channels) { channel in
            Color.clear
                .frame(width: 90, height: 30)
                .position(cam.screen(model.channelPos(channel, homes: homes), in: size))
                .accessibilityElement()
                .accessibilityAddTraits(.isButton)
                .accessibilityLabel(Text(verbatim: channel.name))
                .accessibilityIdentifier("map-channel.\(channel.id)")
                .accessibilityAction { open(Chat.room(channel.room)) }
                .allowsHitTesting(false)
        }
        Color.clear
            .frame(width: 52, height: 60)
            .position(cam.screen(OrbitMapModel.you, in: size))
            .accessibilityElement()
            .accessibilityAddTraits(.isButton)
            .accessibilityLabel("You")
            .accessibilityIdentifier("map-you")
            .accessibilityAction { openYou() }
            .allowsHitTesting(false)
    }

    /// On the map: the nearest character, channel or You under the finger.
    /// Focused: the character opens its settings (or closes a panel), and
    /// anywhere else on the canvas goes back to the map.
    private func tapCanvas(at point: CGPoint, model: OrbitMapModel, homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry) {
        guard dragStart == nil, pinchStart == nil else { return }
        if focus != .map {
            if showsRing {
                // the bot itself opens its own settings; anywhere else on the
                // canvas closes the settings for its chat
                if hypot(point.x - geo.fx, point.y - geo.fy) < geo.focusR + 18 {
                    if case .bot = focus { openPanel(.settings) } else if case .room = focus { openPanel(.channel) }
                } else if focus == .you {
                    goToMap()
                } else {
                    settingsOpen = false
                }
                return
            }
            if hypot(point.x - geo.cornerPoint.x, point.y - geo.cornerPoint.y) < geo.cornerR + 20, focus == .you {
                youPanel = nil
                return
            }
            if hypot(point.x - geo.cornerPoint.x, point.y - geo.cornerPoint.y) < geo.cornerR + 20, focus != .you {
                // the bot in the corner: its settings (from a system, back to them)
                panel = nil
                settingsOpen = true
                return
            }
            goToMap()
            return
        }
        if mapPanel != nil { mapPanel = nil; return }
        if searching { searching = false; return }
        composerFocused = false
        let cam = rig.cam
        var best: (distance: Double, action: () -> Void)?
        func consider(_ p: CGPoint, reach: Double, _ action: @escaping () -> Void) {
            let d = Double(hypot(p.x - point.x, p.y - point.y))
            if d <= reach, d < (best?.distance ?? .infinity) { best = (d, action) }
        }
        for bot in model.bots {
            guard let home = homes[bot.id] else { continue }
            let R = (home.chief ? TeamMapCanvas.chiefR : TeamMapCanvas.memberR) * cam.sizeFactor
            consider(cam.screen(home.point, in: geo.size), reach: R + 12) { open(bot.bot) }
        }
        for channel in model.channels {
            consider(cam.screen(model.channelPos(channel, homes: homes), in: geo.size), reach: 40) { open(Chat.room(channel.room)) }
        }
        consider(cam.screen(OrbitMapModel.you, in: geo.size), reach: 30) { openYou() }
        if let best { best.action(); return }
        // two taps on empty canvas: everyone in view again (one tap
        // recogniser, so a tap on a bot never waits to see if a second comes)
        let now = Date()
        if let last = rig.lastEmptyTap, now.timeIntervalSince(last) < 0.4 {
            rig.lastEmptyTap = nil
            refit(homes: homes, geo: geo)
        } else {
            rig.lastEmptyTap = now
        }
    }

    private var panGesture: some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
                if dragStart == nil { dragStart = rig.user }
                guard let start = dragStart else { return }
                rig.user.center = CGPoint(x: start.center.x - value.translation.width / start.scale,
                                          y: start.center.y - value.translation.height / start.scale)
            }
            .onEnded { _ in dragStart = nil }
    }

    // MagnificationGesture rather than iOS 17's MagnifyGesture, so the map
    // still pinches on iOS 16; both report the same scale factor.
    private var pinchGesture: some Gesture {
        MagnificationGesture()
            .onChanged { magnification in
                if pinchStart == nil { pinchStart = rig.user }
                guard let start = pinchStart else { return }
                rig.user.scale = min(1.4, max(0.15, start.scale * magnification))
            }
            .onEnded { _ in pinchStart = nil }
    }

    private func fitIfNeeded(homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry, force: Bool = false) {
        guard force || !rig.fitted, geo.size.width > 0 else { return }
        rig.fitted = true
        rig.user = fitCamera(homes: homes, geo: geo)
        if focus == .map && !force { rig.cam = rig.user }
    }

    private func refit(homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry) {
        rig.user = fitCamera(homes: homes, geo: geo)
    }

    private func fitCamera(homes: [String: (point: CGPoint, chief: Bool)], geo: ShellGeometry) -> MapCamera {
        var insets = geo.safe
        insets.top += 60
        insets.bottom += 120
        var cam = MapCamera.fit(homes.values.map(\.point), in: geo.size, insets: insets)
        cam.anchor = CGPoint(x: geo.size.width / 2, y: geo.size.height / 2)
        return cam
    }

    // MARK: - Focus: the character's name and its systems

    private func focusOverlay(model: OrbitMapModel, geo: ShellGeometry, systems: [ShellSystem]) -> some View {
        let slots = geo.ringSlots(systems.count)
        return ZStack(alignment: .topLeading) {
            VStack(spacing: 3) {
                Text(verbatim: focusName)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(focusColor)
                    .lineLimit(1)
                // in the ring, just the role: the systems sit close either side
                if !ringSubtitle.isEmpty {
                    Text(verbatim: ringSubtitle)
                        .font(.system(size: 11.5))
                        .foregroundStyle(Orbit.ink55)
                        .multilineTextAlignment(.center)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                }
            }
            .frame(width: min(124, geo.size.width - 2 * 132))
            .padding(.vertical, 3)
            // the systems' lines run behind the name, not through it
            .background(RoundedRectangle(cornerRadius: 8).fill(Orbit.canvas.opacity(0.92)).blur(radius: 4))
            .position(x: geo.fx, y: focusedRoom != nil ? geo.ringBottom - 30 : geo.fy + geo.focusR + 28)
            .opacity(ringShown ? 1 : 0)
            .animation(reduceMotion ? nil : .easeOut(duration: 0.3).delay(0.3), value: ringShown)
            .allowsHitTesting(false)
            .accessibilityElement(children: .combine)
            .accessibilityIdentifier("focus-name")

            // the character itself, for VoiceOver and the UI tests
            Color.clear
                .frame(width: geo.focusR * 2 + 16, height: geo.focusR * 2 + 16)
                .position(x: geo.fx, y: geo.fy)
                .accessibilityElement()
                .accessibilityAddTraits(.isButton)
                .accessibilityLabel(Text("Open \(focusName) settings"))
                .accessibilityIdentifier("focus-character")
                .accessibilityAction { if case .bot = focus { openPanel(.settings) } else if case .room = focus { openPanel(.channel) } }
                .allowsHitTesting(false)

            ForEach(Array(systems.enumerated()), id: \.element.id) { index, system in
                if index < slots.count {
                    systemLabel(system, right: slots[index].x > geo.fx)
                        .position(slots[index])
                        .opacity(ringShown ? 1 : 0)
                        .offset(y: ringShown ? 0 : 8)
                        .animation(reduceMotion ? nil : .easeOut(duration: 0.3).delay(0.45 + Double(index) * 0.04), value: ringShown)
                }
            }
        }
        .onAppear { ringShown = true }
        .onDisappear { ringShown = false }
    }

    private func systemLabel(_ system: ShellSystem, right: Bool) -> some View {
        let tint = system.warn ? Orbit.amber : system.live ? focusColor : Orbit.ink60
        // the text sits against the side facing the character, where its spoke
        // ends; centred in the box it floated up to 20pt away from the dot
        return Button(action: system.open) {
            VStack(alignment: right ? .leading : .trailing, spacing: 2) {
                HStack(spacing: 5) {
                    Image(systemName: system.icon).font(.system(size: 11, weight: .medium)).foregroundStyle(tint)
                    Text(verbatim: system.label)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(system.selected ? Orbit.ink : Orbit.ink90)
                        .minimumScaleFactor(0.85)
                }
                if !system.value.isEmpty {
                    Text(verbatim: system.value)
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundStyle(system.warn ? Orbit.amberText : Orbit.ink40)
                }
            }
            .lineLimit(1)
            .truncationMode(.tail)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .frame(width: ShellGeometry.labelSize.width, alignment: right ? .leading : .trailing)
            .background(RoundedRectangle(cornerRadius: 9).fill(system.selected ? Orbit.fill10 : .clear))
            .overlay(RoundedRectangle(cornerRadius: 9).strokeBorder(system.selected ? Orbit.borderStrong : .clear))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(verbatim: system.value.isEmpty ? system.label : "\(system.label), \(system.value)"))
        .accessibilityAddTraits(system.selected ? .isSelected : [])
        .accessibilityIdentifier("chip-\(system.id)")
    }

    private var focusedBot: Bot? {
        if case let .bot(id) = focus { return session.state.bot(id) }
        return nil
    }

    private var focusedRoom: Room? {
        if case let .room(id) = focus { return session.state.rooms.first { $0.id == id } }
        return nil
    }

    private var focusName: String {
        switch focus {
        case .map: ""
        case .you: String(localized: "You")
        case .bot: focusedBot?.name ?? ""
        case .room: focusedRoom.map { $0.name.hasPrefix("#") ? $0.name : "#\($0.name)" } ?? ""
        }
    }

    private var focusColor: Color {
        if let bot = focusedBot { return OrbitPalette.label(bot.color) }
        if let room = focusedRoom, let lead = room.memberIds.compactMap({ session.state.bot($0) }).first { return OrbitPalette.label(lead.color) }
        return Orbit.ink
    }

    /// "Writer · Research · reports to Atlas"
    /// Under the name in the ring: the bot's role (or a channel's or You's
    /// line), one short line.
    private var ringSubtitle: String {
        if let bot = focusedBot { return bot.chiefOfStaff == true ? String(localized: "Chief of Staff") : bot.title }
        return focusSubtitle
    }

    private var focusSubtitle: String {
        if let bot = focusedBot {
            let team = bot.section?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
            let role = bot.chiefOfStaff == true ? String(localized: "Chief of Staff") : bot.title
            let chief = team.isEmpty || bot.chiefOfStaff == true ? nil : session.state.bots.first {
                $0.chiefOfStaff == true && $0.hidden != true && $0.section?.trimmingCharacters(in: .whitespacesAndNewlines) == team
            }
            let reports = chief.map { String(localized: "reports to \($0.name)") } ?? String(localized: "reports to you")
            return [role, team, reports].filter { !$0.isEmpty }.joined(separator: " · ")
        }
        if let room = focusedRoom {
            return room.memberIds.compactMap { session.state.bot($0)?.name }.joined(separator: ", ")
        }
        if focus == .you { return session.connection?.name ?? "" }
        return ""
    }

    private func systems(model: OrbitMapModel) -> [ShellSystem] {
        if focus == .you { return youSystems }
        if let room = focusedRoom {
            _ = room
            return [
                ShellSystem(id: "channel", icon: "number", label: String(localized: "Channel"), value: String(localized: "Members, rule"), selected: panel == .channel) { toggle(.channel) },
                ShellSystem(id: "threads", icon: "square.stack", label: String(localized: "Threads"), selected: panel == .threads) { toggle(.threads) },
            ]
        }
        guard let bot = focusedBot else { return [] }
        let working = session.state.isBusy(bot)
        let waiting = session.state.isWaiting(bot)
        let selection = bot.currentTaskModelSelection
        let model = selection.model.isEmpty ? String(localized: "Default model") : selection.model
        let engine = selection.effort.flatMap { $0.isEmpty ? nil : "\(model) · \($0)" } ?? model
        let browserOn = bot.browser != false && bot.computer != "none" && bot.computer != "off"
        func sys(_ p: OrbitPanel, _ icon: String, _ label: String, _ value: String, warn: Bool = false, live: Bool = false) -> ShellSystem {
            ShellSystem(id: p.rawValue, icon: icon, label: label, value: value, warn: warn, live: live, selected: panel == p) { toggle(p) }
        }
        return [
            sys(.profile, "person.text.rectangle", String(localized: "Profile"), bot.title.isEmpty ? String(localized: "Name, role") : bot.title),
            sys(.engine, "cpu", String(localized: "Engine"), engine, live: working),
            sys(.computer, "display", String(localized: "Computer"), computerLabel(bot), live: working && bot.computer != "none"),
            sys(.browser, "macwindow", String(localized: "Browser"), browserOn ? String(localized: "Own profile") : String(localized: "Off")),
            sys(.apps, "powerplug", String(localized: "Apps & MCP"), bot.mcpServers.map { $0.isEmpty ? String(localized: "None") : String(localized: "\($0.count) MCP servers") } ?? String(localized: "Every MCP server")),
            sys(.approvals, "checkmark.shield", String(localized: "Approvals"), waiting ? String(localized: "Waiting") : approvalLabel(bot.currentTaskApprovalMode), warn: waiting, live: waiting),
            sys(.voice, "waveform", String(localized: "Voice"), bot.speakReplies == true ? String(localized: "Reads aloud") : String(localized: "Silent")),
            sys(.usage, "chart.bar", String(localized: "Usage"), String(localized: "This month")),
            sys(.routines, "calendar.badge.clock", String(localized: "Routines"), String(localized: "Scheduled work")),
            sys(.memory, "brain", String(localized: "Memory"), "MEMORY.md"),
            sys(.skills, "sparkles", String(localized: "Skills"), String(localized: "Reusable")),
        ]
    }

    /// Round You: the phone's version of the desktop's You hub.
    private var youSystems: [ShellSystem] {
        func sys(_ p: YouPanel, _ icon: String, _ label: String, _ value: String, warn: Bool = false, live: Bool = false) -> ShellSystem {
            ShellSystem(id: "you-\(p.rawValue)", icon: icon, label: label, value: value, warn: warn, live: live, selected: youPanel == p) {
                dismissKeyboard(); Haptics.selection(); youPanel = p
            }
        }
        let connected = session.status == .live
        let notifications: Bool = {
            switch session.notificationAuthorization {
            case .authorized, .provisional, .ephemeral: true
            default: false
            }
        }()
        var out = [
            sys(.computer, "laptopcomputer", String(localized: "Computer"), connected ? String(localized: "Connected") : String(localized: "Offline"), warn: !connected, live: connected),
            sys(.notifications, "bell", String(localized: "Notifications"), notifications ? String(localized: "On") : String(localized: "Off")),
            sys(.chat, "bubble.left.and.bubble.right", String(localized: "Chat"), String(localized: "Activity, replies")),
            sys(.language, "globe", String(localized: "Language"), String(localized: "Inside Orbit")),
        ]
        if session.connection != nil {
            out.append(sys(.routines, "calendar.badge.clock", String(localized: "Routines"), String(localized: "Threads, schedules")))
            if session.canAdminister { out.append(sys(.apps, "powerplug", String(localized: "Apps"), String(localized: "MCP servers"))) }
            // a hidden bot is off the map and out of Search: this is the way back
            let hidden = session.state.bots.filter { $0.hidden == true }.count
            if hidden > 0 { out.append(sys(.hidden, "eye.slash", String(localized: "Hidden bots"), String(localized: "\(hidden) hidden"))) }
        }
        return out
    }

    private func computerLabel(_ bot: Bot) -> String {
        switch bot.computer ?? "" {
        case "cloud": return bot.cloudBackend == "vps" ? String(localized: "Your server") : String(localized: "Cloud desktop")
        case "vm", "local-vm", "box": return String(localized: "Local VM")
        case "host", "local", "mac": return String(localized: "This computer")
        case "browser": return String(localized: "Browser only")
        case "none", "off": return String(localized: "No computer")
        default: return String(localized: "This computer")
        }
    }

    // MARK: - Sheets

    /// Waiting on you and a new channel or section: up from the bottom of the
    /// map, the map still round them.
    private func mapPanelLayer(geo: ShellGeometry) -> some View {
        VStack(spacing: 0) {
            Color.clear.frame(height: geo.size.height * 0.28).allowsHitTesting(false)
            Group {
                switch mapPanel {
                case .waiting:
                    WaitingView { chat in mapPanel = nil; open(chat) }
                case .newGroup:
                    NewGroupSheet { room in mapPanel = nil; open(Chat.room(room)) }
                case .newSection:
                    NewSectionSheet()
                case .none:
                    EmptyView()
                }
            }
            .inOrbitColumn { mapPanel = nil }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(.top, 18)
            .padding(.bottom, geo.safe.bottom)
            // no card: like the column, the map fades out behind it
            .background(Orbit.canvas)
            .mask(VStack(spacing: 0) {
                LinearGradient(colors: [.clear, .black], startPoint: .top, endPoint: .bottom).frame(height: 28)
                Color.black
            })
        }
        .ignoresSafeArea(.container, edges: .bottom)
        .transition(.offset(y: 80).combined(with: .opacity))
        .zIndex(3)
    }

    /// Settings open: the bot in the middle with its systems. Otherwise it
    /// is in the corner and its chat (or You's settings) has the screen.
    private var showsRing: Bool {
        switch focus {
        case .map: false
        case .you: youPanel == nil
        default: settingsOpen && panel == nil
        }
    }

    /// Under the character at the top: its name and where it sits. A channel
    /// has no character of its own, so its name takes the character's place.
    private func cornerHeader(geo: ShellGeometry) -> some View {
        VStack(alignment: .center, spacing: 1) {
            Text(verbatim: focusName)
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(focusColor)
                .lineLimit(1)
            if !focusSubtitle.isEmpty {
                Text(verbatim: focusSubtitle)
                    .font(.system(size: 11.5))
                    .foregroundStyle(Orbit.ink55)
                    .lineLimit(1)
            }
        }
        .multilineTextAlignment(.center)
        .frame(width: focusedRoom != nil ? geo.size.width - 200 : geo.size.width - 48, alignment: .center)
        .position(x: geo.size.width / 2, y: focusedRoom != nil ? geo.linkY + 8 : geo.headerNameY)
        .allowsHitTesting(false)
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("focus-name")
    }

    /// The chat, or You's settings, under the corner: the rest of the screen.
    private func column(geo: ShellGeometry) -> some View {
        VStack(spacing: 0) {
            Color.clear.frame(height: geo.columnTop - geo.safe.top).allowsHitTesting(false)
            Group {
                switch focus {
                case .you:
                    if let p = youPanel {
                        NavigationStack {
                            YouPanelView(panel: p) { youPanel = $0 }
                                .toolbar(.hidden, for: .navigationBar)
                        }
                        .id(p)
                        .inOrbitColumn { youPanel = nil }
                        .transition(.opacity)
                    }
                case .bot, .room:
                    if let chat = openChat {
                        ZStack {
                            ChatView(chat: chat, panel: $chatPanel)
                                .id(chat.conversationID)
                                .environment(\.orbitLeave, { goToMap() })
                                .opacity(panel == nil ? 1 : 0)
                                .allowsHitTesting(panel == nil)
                            if let p = panel {
                                // a system in the chat's place; Done goes back
                                // to the bot's settings
                                OrbitPanelView(panel: p, chat: live(chat), leave: { goToMap() })
                                    .id(p)
                                    .inOrbitColumn { panel = nil }
                                    .transition(.opacity)
                            }
                        }
                    }
                case .map:
                    EmptyView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            // no surface of its own, as on the desktop: the column sits on the
            // canvas (faded behind it) and only softens where it starts
            .background(Orbit.canvas.opacity(0.94))
            .mask(VStack(spacing: 0) {
                LinearGradient(colors: [.clear, .black], startPoint: .top, endPoint: .bottom).frame(height: 14)
                Color.black
            })
        }
        // to the bottom edge, and above the keyboard
        .ignoresSafeArea(.container, edges: .bottom)
    }

    /// The chat as the stream has it now (busy, unread, thread title).
    private func live(_ chat: Chat) -> Chat {
        switch chat {
        case let .bot(bot): session.state.bot(bot.id).flatMap { $0.projected(forThread: chat.threadId) }.map(Chat.bot) ?? chat
        case let .room(room): session.state.rooms.first { $0.id == room.id }.map(Chat.room) ?? chat
        }
    }

    // MARK: - Bars

    private func topBar(model: OrbitMapModel, geo: ShellGeometry) -> some View {
        VStack(spacing: 8) {
            if focus == .map {
                HStack(spacing: 8) {
                    Button { searching.toggle() } label: {
                        HStack(spacing: 9) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 14, weight: .medium))
                            Text("Search or jump")
                                .font(.system(size: 14.5))
                            Spacer(minLength: 0)
                        }
                        .foregroundStyle(Orbit.ink50)
                        .padding(.horizontal, 14)
                        .frame(maxWidth: .infinity)
                        .orbitPill(height: 42)
                        .contentShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .opacity(searching ? 0 : 1)
                    .accessibilityIdentifier("map-search")

                    // making things and Walkie, one tap from the map (upstream's
                    // roster had both in its bar; Search alone hid them)
                    if session.canAdminister {
                        Menu {
                            Button("New bot", systemImage: "person.badge.plus") { runAction(.newBot) }
                            Button("New team", systemImage: "square.stack.3d.up") { runAction(.newSection) }
                            Button("New channel", systemImage: "number") { runAction(.newGroup) }
                        } label: {
                            topBarCircle("plus")
                        }
                        .accessibilityLabel("New")
                        .accessibilityIdentifier("map-new")
                    }
                    Button { runAction(.walkie) } label: { topBarCircle("waveform") }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Walkie-talkie")
                        .accessibilityIdentifier("map-walkie")

                    Button { openYou() } label: {
                        Image(systemName: "person")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(Orbit.ink80)
                            .frame(width: 42, height: 42)
                            .background(Circle().fill(Orbit.pill))
                            .overlay(Circle().strokeBorder(Orbit.hairline))
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("You and settings")
                    .accessibilityIdentifier("map-settings")
                }
                .padding(.horizontal, 14)
                .padding(.top, 4)
                .transition(.opacity)
            } else {
                HStack(spacing: 8) {
                    teamMapLink
                    Spacer(minLength: 8)
                    if focus != .you { settingsToggle }
                }
                .frame(height: 40)
                .padding(.horizontal, 10)
                .transition(.opacity)
            }
            if focus == .map { StatusBanner() }
        }
        .padding(.top, geo.safe.top > 0 ? 0 : 8)
    }

    /// The bot's settings on their own, and back to its chat.
    private var settingsToggle: some View {
        Button {
            dismissKeyboard()
            Haptics.selection()
            if showsRing { settingsOpen = false } else if panel != nil { panel = nil; settingsOpen = false } else { settingsOpen = true }
        } label: {
            HStack(spacing: 6) {
                Image(systemName: settingsOpen ? "bubble.left" : "slider.horizontal.3")
                    .font(.system(size: 13, weight: .medium))
                Text(settingsOpen ? String(localized: "Chat") : String(localized: "Settings"))
                    .font(.system(size: 13.5, weight: .medium))
            }
            .foregroundStyle(Orbit.ink80)
            .padding(.horizontal, 12)
            .frame(height: 32)
            .background(Capsule().fill(Orbit.pill))
            .overlay(Capsule().strokeBorder(Orbit.hairline))
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier(settingsOpen ? "focus-chat" : "focus-settings")
    }

    /// The one link: back to the whole map. Unread elsewhere rides on it.
    /// The one way back, as on the desktop, where the link names where it
    /// goes: from a system, its bot (back to the orbit); from anywhere
    /// else, the team map.
    private var teamMapLink: some View {
        let unread = max(0, session.state.unreadCount - ((openChat?.unread ?? false) ? 1 : 0))
        // a panel the chat opened (threads, the + menu's) goes back to the chat
        let toBot = (panel != nil && focus != .you) || (focus == .you && youPanel != nil) || (chatPanel != nil && focus != .you)
        return Button {
            dismissKeyboard()
            if toBot {
                if chatPanel != nil && panel == nil && focus != .you { chatPanel = nil }
                else if focus == .you { youPanel = youPanel == .quickReplies ? .chat : nil } else { panel = nil; settingsOpen = true }
            } else { goToMap() }
        } label: {
            HStack(spacing: 3) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 14, weight: .semibold))
                if toBot { Text(verbatim: focusName).font(.system(size: 14.5)) } else { Text("Team map").font(.system(size: 14.5)) }
                if unread > 0 && !toBot {
                    Text(verbatim: "\(unread)")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 6)
                        .frame(minWidth: 18, minHeight: 18)
                        .background(Capsule().fill(Orbit.fill10))
                        .padding(.leading, 4)
                }
            }
            .foregroundStyle(Orbit.ink60)
            .padding(.horizontal, 6)
            .frame(height: 36)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(toBot ? Text(verbatim: focusName) : Text("Team map"))
        .accessibilityIdentifier("back")
    }

    private func mapBottom(model: OrbitMapModel) -> some View {
        let waiting = session.state.updates.filter { $0.kind == .needsYou }
        let others = session.state.updates.filter { $0.kind != .needsYou }
        return VStack(spacing: 10) {
            Spacer(minLength: 0)
            if waiting.isEmpty && !others.isEmpty && !searching {
                // nothing waiting: what's working or finished, quietly
                Button { mapPanel = .waiting } label: {
                    HStack(spacing: 8) {
                        FaceStack(chats: others.map(\.chat), size: 26)
                        Text(verbatim: updatesLine(others))
                            .font(.system(size: 13.5, weight: .medium))
                            .foregroundStyle(Orbit.ink80)
                            .padding(.leading, 2)
                    }
                    .padding(.leading, 5)
                    .padding(.trailing, 14)
                    .frame(height: 36)
                    .background(Capsule().fill(Orbit.pill))
                    .overlay(Capsule().strokeBorder(Orbit.hairline))
                }
                .buttonStyle(.plain)
                .transition(.opacity)
                .accessibilityIdentifier("map-updates")
            }
            if !waiting.isEmpty && !searching {
                Button { mapPanel = .waiting } label: {
                    HStack(spacing: 8) {
                        FaceStack(chats: waiting.map(\.chat), size: 26)
                        Text("\(waiting.count) waiting")
                            .font(.system(size: 13.5, weight: .medium))
                            .foregroundStyle(Orbit.ink)
                            .padding(.leading, 2)
                    }
                    .padding(.leading, 5)
                    .padding(.trailing, 14)
                    .frame(height: 36)
                    .background(Capsule().fill(Color(red: 28 / 255, green: 19 / 255, blue: 8 / 255).opacity(0.92)))
                    .overlay(Capsule().strokeBorder(Orbit.amber.opacity(0.27)))
                }
                .buttonStyle(.plain)
                .transition(.scale(scale: 0.96, anchor: .bottom).combined(with: .opacity))
                .accessibilityIdentifier("map-waiting")
            }
            if !searching, let addressee = addressee(in: model) {
                composer(to: addressee, model: model)
                    .transition(.opacity)
            }
        }
        .animation(.spring(response: 0.32, dampingFraction: 0.8), value: waiting.count)
        .padding(.horizontal, 14)
        .padding(.bottom, 8)
    }

    // MARK: - Search, on the map

    /// The pill grows into the search: its field where the pill was, the
    /// results under it, the map still round it.
    private func searchPanel(geo: ShellGeometry) -> some View {
        SearchView(open: { chat in searching = false; open(chat) }, action: runAction)
            .inOrbitColumn { searching = false }
            .frame(maxHeight: geo.size.height * 0.62, alignment: .top)
            .padding(.vertical, 8)
            .background(RoundedRectangle(cornerRadius: Orbit.sheetRadius, style: .continuous).fill(Orbit.panel))
            .overlay(RoundedRectangle(cornerRadius: Orbit.sheetRadius, style: .continuous).strokeBorder(Orbit.hairline))
            .shadow(color: .black.opacity(0.45), radius: 24, y: 8)
            .padding(.horizontal, 8)
            .transition(.scale(scale: 0.96, anchor: .top).combined(with: .opacity))
            .zIndex(3)
    }

    private func updatesLine(_ updates: [ChatUpdate]) -> String {
        let working = updates.filter { $0.kind == .working }.count
        let toReview = updates.filter { $0.kind == .toReview }.count
        return [working > 0 ? String(localized: "\(working) working") : nil,
                toReview > 0 ? String(localized: "\(toReview) to review") : nil].compactMap { $0 }.joined(separator: " · ")
    }

    private func topBarCircle(_ symbol: String) -> some View {
        Image(systemName: symbol)
            .font(.system(size: 16, weight: .medium))
            .foregroundStyle(Orbit.ink80)
            .frame(width: 42, height: 42)
            .background(Circle().fill(Orbit.pill))
            .overlay(Circle().strokeBorder(Orbit.hairline))
            .contentShape(Circle())
    }

    private func runAction(_ action: SearchAction) {
        searching = false
        switch action {
        case .newBot: createBot()
        case .newGroup: mapPanel = .newGroup
        case .newSection: mapPanel = .newSection
        case .walkie: showingWalkie = true
        case .waiting: mapPanel = .waiting
        case .settings: openYou()
        }
    }

    // MARK: - The map's composer

    private func addressee(in model: OrbitMapModel) -> Bot? {
        let candidates = model.addressees
        if let id = addresseeId, let bot = candidates.first(where: { $0.id == id }) { return bot }
        return candidates.first
    }

    /// One line to your Chief (or the bot you pick): what you want done.
    private func composer(to bot: Bot, model: OrbitMapModel) -> some View {
        HStack(spacing: 8) {
            Menu {
                ForEach(model.addressees) { candidate in
                    Button {
                        addresseeId = candidate.id
                    } label: {
                        Text(verbatim: candidate.name)
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    BotAvatarView(bot: bot, size: 30)
                    Text(verbatim: bot.name)
                        .font(.system(size: 13.5, weight: .medium))
                        .foregroundStyle(OrbitPalette.label(bot.color))
                        .lineLimit(1)
                }
                .padding(.leading, 4)
                .padding(.trailing, 12)
                .frame(height: 38)
                .background(Capsule().fill(Color.black.opacity(0.25)))
            }
            .accessibilityLabel(Text("Talking to \(bot.name). Choose who to talk to"))

            TextField(text: $draft, axis: .vertical) {
                Text("Tell \(bot.name) what you want done").foregroundStyle(Orbit.ink40)
            }
            .lineLimit(1...4)
            .font(.system(size: 14.5))
            .foregroundStyle(Orbit.ink)
            .focused($composerFocused)
            .submitLabel(.send)
            .onSubmit { send(to: bot) }
            .accessibilityIdentifier("map-composer")

            Button { send(to: bot) } label: {
                Image(systemName: "arrow.up")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Color(hex: "#070707"))
                    .frame(width: 38, height: 38)
                    .background(Circle().fill(Orbit.ink.opacity(canSend ? 1 : 0.35)))
            }
            .buttonStyle(.plain)
            .disabled(!canSend)
            .accessibilityLabel("Send")
            .accessibilityIdentifier("map-send")
        }
        .padding(.horizontal, 7)
        .frame(minHeight: 52)
        .background(RoundedRectangle(cornerRadius: 26).fill(Orbit.composer))
    }

    private var canSend: Bool { !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !sending }

    private func send(to bot: Bot) {
        let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty, !sending else { return }
        sending = true
        let chat = session.threadSelection.restoringThread(.bot(bot), connectionID: session.connection?.id)
        Task {
            let sent = await session.send(text: text, attachments: [], to: chat)
            sending = false
            guard sent else { return }
            draft = ""
            composerFocused = false
            Haptics.impact(.medium)
            open(chat)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Spacer()
            Spacer()
            Text("No bots yet")
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(Orbit.ink)
            Text("Bots you create on your computer show up here.")
                .font(.system(size: 13))
                .foregroundStyle(Orbit.ink55)
                .multilineTextAlignment(.center)
            if session.canAdminister {
                Button("New bot", action: createBot)
                    .font(.system(size: 13.5, weight: .medium))
                    .foregroundStyle(Orbit.ink)
                    .padding(.horizontal, 14)
                    .frame(height: 34)
                    .background(Capsule().strokeBorder(Orbit.borderStrong))
                    .padding(.top, 6)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 40)
    }

    // MARK: - Going places

    /// Fly to a bot from the map: it sits in the middle with its systems.
    private func open(_ bot: Bot) {
        Haptics.selection()
        open(session.threadSelection.restoringThread(.bot(bot), connectionID: session.connection?.id))
    }

    /// Fly to a chat's bot or channel: it steps up to the corner and its
    /// chat has the screen.
    private func open(_ chat: Chat) {
        dismissKeyboard()
        searching = false
        chatPanel = nil
        openChat = chat
        switch chat {
        case let .bot(bot): focus = .bot(bot.id)
        case let .room(room): focus = .room(room.id)
        }
        settingsOpen = false
        panel = nil
        mapPanel = nil
    }

    private func openYou() {
        Haptics.selection()
        dismissKeyboard()
        searching = false
        openChat = nil
        settingsOpen = false
        panel = nil
        youPanel = nil
        mapPanel = nil
        focus = .you
    }

    private func goToMap() {
        dismissKeyboard()
        settingsOpen = false
        focus = .map
    }

    /// A system: the bot steps up to the corner and the system takes the
    /// chat's place.
    private func openPanel(_ p: OrbitPanel) {
        dismissKeyboard()
        Haptics.selection()
        settingsOpen = true
        panel = p
    }

    private func toggle(_ p: OrbitPanel) {
        if panel == p { panel = nil } else { openPanel(p) }
    }

    private func dismissKeyboard() {
        composerFocused = false
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }

    private func createBot() {
        Task {
            if let bot = await session.createBot() {
                Haptics.success()
                open(Chat.bot(bot))
            }
        }
    }
}

/// Connection state, shown only when it is not "fine".
struct StatusBanner: View {
    @EnvironmentObject private var session: Session

    var body: some View {
        Group {
            switch session.status {
            case .live, .unpaired:
                EmptyView()
            case .connecting:
                banner(Text("Connecting…"), systemImage: "arrow.triangle.2.circlepath", tint: Orbit.ink60)
            case let .offline(reason):
                banner(Text(verbatim: reason), systemImage: "wifi.slash", tint: Orbit.amberText)
            case .unauthorized:
                banner(Text("This device was unpaired on the computer."), systemImage: "lock.slash", tint: Orbit.dangerText)
            }
        }
        .animation(.default, value: session.status)
    }

    private func banner(_ text: Text, systemImage: String, tint: Color) -> some View {
        Label { text } icon: { Image(systemName: systemImage) }
            .font(.system(size: 12.5))
            .foregroundStyle(tint)
            .padding(.horizontal, 12)
            .frame(height: 30)
            .background(Capsule().fill(Orbit.raised))
            .overlay(Capsule().strokeBorder(Orbit.border))
    }
}
