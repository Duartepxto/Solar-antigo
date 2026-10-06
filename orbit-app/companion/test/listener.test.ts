import { delimiter, join } from "node:path";
import type { NetworkInterfaceInfo } from "node:os";
import { describe, expect, it } from "vitest";

import { lanAddresses, searchPath, tailscaleCandidates } from "../src/listener.ts";

describe("Windows phone addresses", () => {
  const ipv4 = (address: string): NetworkInterfaceInfo => ({ address, family: "IPv4", internal: false, netmask: "255.255.255.0", mac: "00:00:00:00:00:00", cidr: `${address}/24` });
  it("puts physical Windows networks before VPN and VM adapters regardless of enumeration order", () => {
    expect(lanAddresses({
      "Radmin VPN": [ipv4("26.104.174.227")],
      "vEthernet (WSL)": [ipv4("172.22.138.54")],
      "Ethernet": [ipv4("192.168.1.81")],
      "Wi-Fi": [ipv4("192.168.2.10")],
    })).toEqual(["192.168.1.81", "192.168.2.10", "26.104.174.227", "172.22.138.54"]);
  });
  it("retains VPN routes as fallback and preserves macOS ranking and link-local filtering", () => {
    expect(lanAddresses({
      "utun4": [ipv4("100.100.1.2")],
      "bridge100": [ipv4("192.168.64.1")],
      "en0": [ipv4("192.168.1.2"), ipv4("169.254.1.2")],
    })).toEqual(["192.168.1.2", "100.100.1.2", "192.168.64.1"]);
  });
});

describe("tailscaleCandidates", () => {
  it("includes the standard Windows install locations", () => {
    const candidates = tailscaleCandidates("/home/test");
    expect(candidates).toContain("C:\\Program Files\\Tailscale\\tailscale.exe");
    expect(candidates).toContain("C:\\Program Files (x86)\\Tailscale\\tailscale.exe");
  });

  it("keeps the absolute candidates in documented lookup order with bare PATH last", () => {
    const home = "/home/test";
    expect(tailscaleCandidates(home)).toEqual([
      "/Applications/Tailscale.app/Contents/MacOS/Tailscale",
      join(home, "Applications", "Tailscale.app", "Contents", "MacOS", "Tailscale"),
      "/opt/homebrew/bin/tailscale",
      "/usr/local/bin/tailscale",
      "/usr/bin/tailscale",
      "/run/current-system/sw/bin/tailscale",
      "C:\\Program Files\\Tailscale\\tailscale.exe",
      "C:\\Program Files (x86)\\Tailscale\\tailscale.exe",
      "tailscale",
    ]);
  });
});

describe("searchPath", () => {
  it("joins PATH with fallback directories using the platform delimiter", () => {
    const before = process.env.PATH;
    process.env.PATH = "/my/bin";
    try {
      const result = searchPath();
      expect(result).toBe(
        ["/my/bin", "/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"].join(delimiter),
      );
      // The join character is the real check: ':' on POSIX, ';' on Windows.
      expect(result).toContain(delimiter);
    } finally {
      if (before === undefined) {
        delete process.env.PATH;
      } else {
        process.env.PATH = before;
      }
    }
  });
});
