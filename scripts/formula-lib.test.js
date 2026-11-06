import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  MANAGED_BEGIN,
  MANAGED_END,
  formulas,
  findAsset,
  readPinnedVersion,
  renderManaged,
  tagFromVersion,
  updateFormula,
  versionFromTag,
} from "./formula-lib.js";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const trusttunnel = formulas.find((f) => f.file === "Formula/trusttunnel.rb");
const client = formulas.find((f) => f.file === "Formula/trusttunnel-client.rb");

/** Realistic release payload for TrustTunnel/TrustTunnel (tag has no suffix). */
const trustTunnelRelease = {
  tag_name: "v1.1.0",
  assets: [
    { name: "trusttunnel-v1.1.0-linux-aarch64-dbgsym.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64-dbgsym.tar.gz", digest: "sha256:c176dcace0dd907cf9782186dcaf2ed029af8c17a2a842627541af012a692005" },
    { name: "trusttunnel-v1.1.0-linux-aarch64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz", digest: "sha256:c2aee17a1ced349283cba4775202e2baba053b8ea835d4cc23dc67d16c6b9686" },
    { name: "trusttunnel-v1.1.0-linux-x86_64-dbgsym.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64-dbgsym.tar.gz", digest: "sha256:9a59ef5ed967b6141090ef9d932897f3b08814f08cbc0cbfdb6a85404efb08e5" },
    { name: "trusttunnel-v1.1.0-linux-x86_64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz", digest: "sha256:91c2ea3db7416a01b5258a4c047ec22890490bc55e1b194206031aa75144f0e7" },
    { name: "trusttunnel-v1.1.0-macos-universal-dbgsym.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal-dbgsym.tar.gz", digest: "sha256:aaae897550205b85f9c7bd6ba3b50e955266f0834fbb38178c9a54cc394e347c" },
    { name: "trusttunnel-v1.1.0-macos-universal.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz", digest: "sha256:126a5688e922ce8f83d4de2d8a2659b3aab97820184d30f2edbecc0ec4a32ae5" },
  ],
};

/** Realistic release payload for TrustTunnel/TrustTunnelClient (tag has no suffix). */
const trustTunnelClientRelease = {
  tag_name: "v1.1.11",
  assets: [
    { name: "trusttunnel_client-v1.1.11-linux-aarch64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-aarch64.tar.gz", digest: "sha256:880e9c8afd5cce7ff38c53978f0ea530ff95e679bcfef69c5127b26b3692d110" },
    { name: "trusttunnel_client-v1.1.11-linux-armv7.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-armv7.tar.gz", digest: "sha256:90c032f1b6de3bc797f8d144582805b565190e56fd5636a5eed089d7458ac1bc" },
    { name: "trusttunnel_client-v1.1.11-linux-mips.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-mips.tar.gz", digest: "sha256:376b834e87f8987c92b2a96765379fa74cf27cb591c3a4bb4b7f0f483168cd92" },
    { name: "trusttunnel_client-v1.1.11-linux-mipsel.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-mipsel.tar.gz", digest: "sha256:fa4ca450e01f0ebacc6ee3f5865b8f31912c6edbe164929c33732db2968951dc" },
    { name: "trusttunnel_client-v1.1.11-linux-x86_64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-x86_64.tar.gz", digest: "sha256:00e0546a6b35840dbb92b741dff3da6732a74bf2d6c581e044bb4567c0d96825" },
    { name: "trusttunnel_client-v1.1.11-macos-universal.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-macos-universal.tar.gz", digest: "sha256:e2c67aaea941fcdcfc24ec9868164462fcea8d1f731f6928c49bbef300dcf1a3" },
    { name: "trusttunnel_client-v1.1.11-windows-aarch64.zip", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-windows-aarch64.zip", digest: "sha256:8c6b3ad5d90db795e4f00f9545076c06c2bbd8d673c9888b8169bf460d658a85" },
    { name: "trusttunnel_client-v1.1.11-windows-i686.zip", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-windows-i686.zip", digest: "sha256:f464c2fdd6ac5cc79865ba7502152c456ff366e8f533e28d23c6241b3f57945f" },
    { name: "trusttunnel_client-v1.1.11-windows-x86_64.zip", browser_download_url: "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-windows-x86_64.zip", digest: "sha256:c6db992c1164abef1a19a8289173be23d87c6f8c039360dbe9b7fdef89a9e526" },
  ],
};

test("versionFromTag strips the v prefix", () => {
  assert.equal(versionFromTag("v2.10.1"), "2.10.1");
  assert.equal(versionFromTag("v2.10.1", ""), "2.10.1");
});

test("versionFromTag strips the -release tag suffix", () => {
  assert.equal(versionFromTag("v1.4.13-release", "-release"), "1.4.13");
  assert.equal(versionFromTag("v1.7.12-release", "-release"), "1.7.12");
});

test("tagFromVersion round-trips with versionFromTag", () => {
  assert.equal(tagFromVersion("1.4.13", "-release"), "v1.4.13-release");
  assert.equal(versionFromTag(tagFromVersion("1.4.13", "-release"), "-release"), "1.4.13");
  assert.equal(versionFromTag(tagFromVersion("2.10.1", ""), ""), "2.10.1");
});

test("findAsset matches patterns in priority order", () => {
  const release = {
    assets: [
      { name: "trusttunnel-v1.1.0-macos.tar.gz" },
      { name: "trusttunnel-v1.1.0-macos-universal.tar.gz" },
    ],
  };
  // The universal build is preferred when both exist.
  const hit = findAsset(release, [/-macos-universal\.tar\.gz$/, /-macos\.tar\.gz$/]);
  assert.equal(hit.name, "trusttunnel-v1.1.0-macos-universal.tar.gz");
  assert.equal(findAsset(release, [/-linux-aarch64\.tar\.gz$/]), undefined);
});

test("renderManaged renders an exact pinned block for trusttunnel", () => {
  assert.equal(
    renderManaged(trusttunnel, trustTunnelRelease),
    [
      "  # --- BEGIN MANAGED ---",
      '  version "1.1.0"',
      "",
      '  url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz"',
      '  sha256 "126a5688e922ce8f83d4de2d8a2659b3aab97820184d30f2edbecc0ec4a32ae5"',
      "",
      "  on_linux do",
      "    if Hardware::CPU.arm?",
      '      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz"',
      '      sha256 "c2aee17a1ced349283cba4775202e2baba053b8ea835d4cc23dc67d16c6b9686"',
      "    else",
      '      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz"',
      '      sha256 "91c2ea3db7416a01b5258a4c047ec22890490bc55e1b194206031aa75144f0e7"',
      "    end",
      "  end",
      "  # --- END MANAGED ---",
    ].join("\n"),
  );
});

test("renderManaged renders an exact pinned block for trusttunnel-client", () => {
  assert.equal(
    renderManaged(client, trustTunnelClientRelease),
    [
      "  # --- BEGIN MANAGED ---",
      '  version "1.1.11"',
      "",
      '  url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-macos-universal.tar.gz"',
      '  sha256 "e2c67aaea941fcdcfc24ec9868164462fcea8d1f731f6928c49bbef300dcf1a3"',
      "",
      "  on_linux do",
      "    if Hardware::CPU.arm?",
      '      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-aarch64.tar.gz"',
      '      sha256 "880e9c8afd5cce7ff38c53978f0ea530ff95e679bcfef69c5127b26b3692d110"',
      "    else",
      '      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-x86_64.tar.gz"',
      '      sha256 "00e0546a6b35840dbb92b741dff3da6732a74bf2d6c581e044bb4567c0d96825"',
      "    end",
      "  end",
      "  # --- END MANAGED ---",
    ].join("\n"),
  );
});

test("renderManaged throws when a platform asset is missing", () => {
  const release = { tag_name: "v1.1.0", assets: [] };
  assert.throws(() => renderManaged(trusttunnel, release), /No "macos" asset/);
});

test("renderManaged throws when a platform asset has no digest", () => {
  const release = {
    tag_name: "v1.1.0",
    assets: [
      { name: "trusttunnel-v1.1.0-macos-universal.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz" },
      { name: "trusttunnel-v1.1.0-linux-aarch64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz", digest: "sha256:c2aee17a1ced349283cba4775202e2baba053b8ea835d4cc23dc67d16c6b9686" },
      { name: "trusttunnel-v1.1.0-linux-x86_64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz", digest: "sha256:91c2ea3db7416a01b5258a4c047ec22890490bc55e1b194206031aa75144f0e7" },
    ],
  };
  assert.throws(() => renderManaged(trusttunnel, release), /No "macos" asset/);
});

test("renderManaged throws when a platform asset has an invalid digest", () => {
  const release = {
    tag_name: "v1.1.0",
    assets: [
      { name: "trusttunnel-v1.1.0-macos-universal.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz", digest: "sha256:" },
      { name: "trusttunnel-v1.1.0-linux-aarch64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz", digest: "sha256:c2aee17a1ced349283cba4775202e2baba053b8ea835d4cc23dc67d16c6b9686" },
      { name: "trusttunnel-v1.1.0-linux-x86_64.tar.gz", browser_download_url: "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz", digest: "sha256:91c2ea3db7416a01b5258a4c047ec22890490bc55e1b194206031aa75144f0e7" },
    ],
  };
  assert.throws(() => renderManaged(trusttunnel, release), /No "macos" asset/);
});

test("updateFormula rewrites only the managed block", () => {
  const before = [
    'class Trusttunnel < Formula',
    '  desc "VPN endpoint with the TrustTunnel protocol"',
    '  license "Apache-2.0"',
    "",
    "  # human-authored note that must survive",
    "  # --- BEGIN MANAGED ---",
    '  version "1.0.0"',
    "",
    "  url \"https://old.example/trusttunnel.tar.gz\"",
    '  sha256 "1111111111111111111111111111111111111111111111111111111111111111"',
    "",
    "  on_linux do",
    "    if Hardware::CPU.arm?",
    "      url \"https://old.example/arm.tar.gz\"",
    '      sha256 "2222222222222222222222222222222222222222222222222222222222222222"',
    "    else",
    "      url \"https://old.example/x86.tar.gz\"",
    '      sha256 "3333333333333333333333333333333333333333333333333333333333333333"',
    "    end",
    "  end",
    "  # --- END MANAGED ---",
    "",
    "  def install",
    '    bin.install "trusttunnel_endpoint"',
    "  end",
    "end",
    "",
  ].join("\n");

  const after = updateFormula(before, trusttunnel, trustTunnelRelease);

  // Outside content is preserved verbatim.
  assert.ok(after.includes('class Trusttunnel < Formula'));
  assert.ok(after.includes('desc "VPN endpoint with the TrustTunnel protocol"'));
  assert.ok(after.includes("# human-authored note that must survive"));
  assert.ok(after.includes('bin.install "trusttunnel_endpoint"'));
  assert.ok(after.endsWith("end\n"));

  // Old pinned values are gone, new ones are in.
  assert.ok(!after.includes('version "1.0.0"'));
  assert.ok(!after.includes("old.example"));
  assert.ok(after.includes('version "1.1.0"'));
  assert.ok(after.includes("126a5688e922ce8f83d4de2d8a2659b3aab97820184d30f2edbecc0ec4a32ae5"));

  // The markers are still present, so a later run is possible.
  assert.ok(after.includes(MANAGED_BEGIN));
  assert.ok(after.includes(MANAGED_END));
});

test("updateFormula is idempotent", () => {
  const seed = [
    "  # --- BEGIN MANAGED ---",
    '  version "1.0.0"',
    "  # --- END MANAGED ---",
    "",
  ].join("\n");
  const once = updateFormula(seed, trusttunnel, trustTunnelRelease);
  const twice = updateFormula(once, trusttunnel, trustTunnelRelease);
  assert.equal(twice, once);
});

test("updateFormula throws when the managed markers are absent", () => {
  assert.throws(
    () => updateFormula("class Trusttunnel < Formula\nend\n", trusttunnel, trustTunnelRelease),
    /no managed metadata block/,
  );
});

test("updateFormula throws when the managed markers are out of order", () => {
  const text = [
    "class Trusttunnel < Formula",
    "  # --- END MANAGED ---",
    '  version "1.0.0"',
    "  # --- BEGIN MANAGED ---",
    "end",
  ].join("\n");
  assert.throws(
    () => updateFormula(text, trusttunnel, trustTunnelRelease),
    /no managed metadata block/,
  );
});

test("readPinnedVersion extracts the pinned version", () => {
  assert.equal(readPinnedVersion('version "1.4.13"\n'), "1.4.13");
  assert.equal(readPinnedVersion("no version here\n"), null);
});

// Regression guard: every definition lists all expected platforms, and the
// checked-in formulas still carry a valid managed block with a pinned version
// (keeps the script and the tap in sync without needing the network).
test("every formula definition lists the expected platforms", () => {
  assert.equal(formulas.length, 2);
  for (const def of formulas) {
    const keys = def.platforms.map((p) => p.key);
    assert.deepEqual(keys, ["macos", "linuxAarch64", "linuxX86_64"], def.file);
    for (const { patterns } of def.platforms) {
      assert.ok(patterns.length > 0, `${def.file}: empty patterns for a platform`);
    }
  }
});

for (const def of formulas) {
  test(`${def.file}: has a managed block with a pinned version`, async () => {
    const text = await readFile(path.join(repoRoot, def.file), "utf8");
    assert.ok(text.includes(MANAGED_BEGIN), `${def.file} is missing ${MANAGED_BEGIN}`);
    assert.ok(text.includes(MANAGED_END), `${def.file} is missing ${MANAGED_END}`);
    assert.ok(readPinnedVersion(text) !== null, `${def.file} has no pinned version`);
  });
}
