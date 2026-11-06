class TrusttunnelClient < Formula
  desc "Command-line client for the TrustTunnel VPN protocol"
  homepage "https://github.com/TrustTunnel/TrustTunnelClient"
  license "Apache-2.0"

  # Pinned to the latest release by scripts/update-versions.js, which runs on a
  # schedule (see .github/workflows/update-versions.yml). Do not edit the
  # managed block by hand — run `npm run update-versions` instead.
  # --- BEGIN MANAGED ---
  version "1.1.11"

  url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-macos-universal.tar.gz"
  sha256 "e2c67aaea941fcdcfc24ec9868164462fcea8d1f731f6928c49bbef300dcf1a3"

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-aarch64.tar.gz"
      sha256 "880e9c8afd5cce7ff38c53978f0ea530ff95e679bcfef69c5127b26b3692d110"
    else
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.11/trusttunnel_client-v1.1.11-linux-x86_64.tar.gz"
      sha256 "00e0546a6b35840dbb92b741dff3da6732a74bf2d6c581e044bb4567c0d96825"
    end
  end
  # --- END MANAGED ---

  def install
    bin.install "trusttunnel_client"
    bin.install "setup_wizard" => "trusttunnel-client-setup-wizard"
  end

  test do
    assert_match(/\Atrusttunnel_client \d+(\.\d+)+\z/, shell_output("#{bin}/trusttunnel_client --version").strip)
  end
end
