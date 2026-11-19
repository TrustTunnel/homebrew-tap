class Trusttunnel < Formula
  desc "VPN endpoint with the TrustTunnel protocol"
  homepage "https://github.com/TrustTunnel/TrustTunnel"
  license "Apache-2.0"

  # Pinned to the latest release by scripts/update-versions.js, which runs on a
  # schedule (see .github/workflows/update-versions.yml). Do not edit the
  # managed block by hand — run `npm run update-versions` instead.
  # --- BEGIN MANAGED ---
  version "1.3.1"

  url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.3.1/trusttunnel-v1.3.1-macos-universal.tar.gz"
  sha256 "d99f7ec8f363835469e658c2120e9b17190928bb525093504592896c1756f652"

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.3.1/trusttunnel-v1.3.1-linux-aarch64.tar.gz"
      sha256 "b82795893d50ea1ffe92fe5712d14282a024e87ee968cca25afdc4cb0aae6238"
    else
      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.3.1/trusttunnel-v1.3.1-linux-x86_64.tar.gz"
      sha256 "29fd330eafab37eb8ab668dcbd57aa8f99b46e26b268e5dc9b416a483fadca97"
    end
  end
  # --- END MANAGED ---

  def install
    bin.install "trusttunnel_endpoint"
    bin.install "setup_wizard" => "trusttunnel-setup-wizard"
  end

  test do
    assert_match(/\A\d+(\.\d+)+\z/, shell_output("#{bin}/trusttunnel_endpoint --version").strip)
  end
end
