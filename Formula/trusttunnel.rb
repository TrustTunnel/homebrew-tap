class Trusttunnel < Formula
  desc "VPN endpoint with the TrustTunnel protocol"
  homepage "https://github.com/TrustTunnel/TrustTunnel"
  license "Apache-2.0"

  # Pinned to the latest release by scripts/update-versions.js, which runs on a
  # schedule (see .github/workflows/update-versions.yml). Do not edit the
  # managed block by hand — run `npm run update-versions` instead.
  # --- BEGIN MANAGED ---
  version "1.1.0"

  url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz"
  sha256 "126a5688e922ce8f83d4de2d8a2659b3aab97820184d30f2edbecc0ec4a32ae5"

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz"
      sha256 "c2aee17a1ced349283cba4775202e2baba053b8ea835d4cc23dc67d16c6b9686"
    else
      url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz"
      sha256 "91c2ea3db7416a01b5258a4c047ec22890490bc55e1b194206031aa75144f0e7"
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
