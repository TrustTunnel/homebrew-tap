class TrusttunnelClient < Formula
  desc "Command-line client for the TrustTunnel VPN protocol"
  homepage "https://github.com/TrustTunnel/TrustTunnelClient"
  license "Apache-2.0"

  # Pinned to the latest release by scripts/update-versions.js, which runs on a
  # schedule (see .github/workflows/update-versions.yml). Do not edit the
  # managed block by hand — run `npm run update-versions` instead.
  # --- BEGIN MANAGED ---
  version "1.1.12"

  url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.12/trusttunnel_client-v1.1.12-macos-universal.tar.gz"
  sha256 "932dff4f396811e31c64644bca422808bf3b79c45877aae7956429082a2c7214"

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.12/trusttunnel_client-v1.1.12-linux-aarch64.tar.gz"
      sha256 "10402be7e715f35380e8bcf67e2d8f2ceb9fad81eef8274a472e3a085a0d5cc1"
    else
      url "https://github.com/TrustTunnel/TrustTunnelClient/releases/download/v1.1.12/trusttunnel_client-v1.1.12-linux-x86_64.tar.gz"
      sha256 "75b7df59351e26462487464de5f3462153e00195f2d40677872fb93a5b44c488"
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
