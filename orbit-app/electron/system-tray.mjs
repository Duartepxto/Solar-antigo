// Retain the Windows notification-area identity across app restarts.
export function createSystemTray({ Tray, Menu, nativeImage, iconPath, getWindow, onQuit, appName = process.env.SOLAR_APP === "1" ? "Solar" : "Orbit Bot" }) {
  const tray = new Tray(nativeImage.createFromPath(iconPath).resize({ width: 20, height: 20 }),
    "889af657-21b5-4ec9-b5d0-cb798cbdfd30");
  let hidden = false;
  // The Orbit shell, when it runs, lends this icon its own menu and a click
  // that opens the quick bar: one icon in the notification area, not two.
  let lent = null;
  const show = () => {
    const win = getWindow();
    if (!win || win.isDestroyed()) return false;
    hidden = false;
    win.setSkipTaskbar(false);
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
    return true;
  };
  const ownMenu = () => Menu.buildFromTemplate([
    { label: `Open ${appName}`, click: show },
    { type: "separator" },
    { label: `Quit ${appName}`, click: onQuit },
  ]);
  tray.setToolTip(appName);
  tray.setContextMenu(ownMenu());
  tray.on("click", () => (lent ? lent.click() : show()));
  tray.on("double-click", show);
  return {
    show,
    hide(win) { hidden = true; win.setSkipTaskbar(true); win.hide(); },
    isHidden() { return hidden; },
    windowShown(win) { hidden = false; win.setSkipTaskbar(false); },
    /** The shell's menu and click on this icon, until `release()` gives it
     * back. The shell rebuilds its menu and sets it again with `setMenu`. */
    lend({ menu, click }) {
      const loan = { click };
      lent = loan;
      if (!tray.isDestroyed()) tray.setContextMenu(menu);
      return {
        setMenu(next) { if (lent === loan && !tray.isDestroyed()) tray.setContextMenu(next); },
        release() {
          if (lent !== loan) return;
          lent = null;
          if (!tray.isDestroyed()) tray.setContextMenu(ownMenu());
        },
      };
    },
    destroy() { if (!tray.isDestroyed()) tray.destroy(); },
  };
}
