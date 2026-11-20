class TrusttunnelClient < Formula
  desc "Command-line client for the TrustTunnel VPN protocol"
  homepage "https://github.com/TrustTunnel/TrustTunnelClient"
  license "Apache-2.0"

  # Pinned to the latest release by scripts/update-versions.js, which runs on a
  # schedule (see .github/workflows/update-versions.yml). Do not edit the
  # managed block by hand — run `npm run update-versions` instead.
  # --- BEGIN MANAGED ---
  version "1.3.0"

  url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.3.0/trusttunnel_client-v1.3.0-macos-universal.tar.gz"
  sha256 "2896dd6e0ddeed6b379c5a7be72b26ba1bbc7ad830182ebc2d1f880965925186"

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.3.0/trusttunnel_client-v1.3.0-linux-aarch64.tar.gz"
      sha256 "837ec64520d546cdf8e7a327614589f64dc6c4f30e408e3788de7bfaef05b52b"
    else
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.3.0/trusttunnel_client-v1.3.0-linux-x86_64.tar.gz"
      sha256 "99e764bb2c080f7a60c441b51ad75fa7ec00e6c8a80afe36030af37201ba32f7"
    end
  end
  # --- END MANAGED ---

  def install
    bin.install "trusttunnel_client"
  end

  test do
    assert_match(/\Atrusttunnel_client \d+(\.\d+)+\z/, shell_output("#{bin}/trusttunnel_client --version").strip)
  end
end
