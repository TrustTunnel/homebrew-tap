# Development

This document covers the implementation and maintenance of the TrustTunnel
Homebrew tap. For installation and usage, see [README.md](README.md).

## Contents

- [How the formulas work](#how-the-formulas-work)
- [How versions are kept up to date](#how-versions-are-kept-up-to-date)
- [Development](#development)
    - [Repository setup](#repository-setup)
    - [Local validation](#local-validation)

## How the formulas work

Every formula in this tap is **pinned**: it declares an exact `version`, plus a
`url` and `sha256` for macOS and for each supported Linux architecture, all
inside a marked metadata block:

```ruby
# --- BEGIN MANAGED ---
version "1.1.0"

url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-macos-universal.tar.gz"
sha256 "126a5688..."

on_linux do
  if Hardware::CPU.arm?
    url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-aarch64.tar.gz"
    sha256 "c2aee17a..."
  else
    url "https://github.com/TrustTunnel/TrustTunnel/releases/download/v1.1.0/trusttunnel-v1.1.0-linux-x86_64.tar.gz"
    sha256 "91c2ea3d..."
  end
end
# --- END MANAGED ---
```

The example above shows the `trusttunnel` formula with truncated digests. Only
the content between the managed markers is generated. Do not edit the block by
hand. Run `npm run update-versions` instead.

Pinning an exact version means `brew install` and `brew upgrade` fetch a
specific release. Installs are reproducible, and Homebrew caches each version
separately.

## How versions are kept up to date

The [`update-versions`](.github/workflows/update-versions.yml) workflow runs on
a GitHub-hosted `ubuntu-latest` runner. It runs daily at 06:00 UTC and on demand
through `workflow_dispatch`. It checks whether the upstream repositories have
published newer releases:

1. The multi-stage [`Dockerfile`](Dockerfile) runs the `test` stage, which runs
   the unit tests, then the `update` stage, which runs
   [`scripts/update-versions.js`](scripts/update-versions.js). The script
   queries `GET https://api.github.com/repos/{owner}/{repo}/releases/latest`
   for every formula and rewrites only the managed block above when a newer
   version is available. Nothing else in the formula file changes. The
   `export` stage returns the updated `Formula/` directory plus `scripts/` and
   `package.json`. The workflow copies only `Formula/` back into the checkout.
2. If anything changed, the workflow commits `Formula/` directly to `master`
   with the built-in `GITHUB_TOKEN`. The commit message is
   `chore: bump homebrew formula versions`. Because a `GITHUB_TOKEN` push does
   not trigger workflows, the workflow then dispatches `test.yml`, which
   installs and tests both formulas.

## Development

The version-bump logic is plain Node.js with **no dependencies** and is
unit-tested with Node's built-in test runner (hermetic — no network access):

```sh
npm test                              # run the unit tests
npm run update-versions               # check for new releases and bump the pins
npm run update-versions -- --dry-run  # print what would change, write nothing
```

The scripts require Node.js `>=18`.

The scheduled workflow runs on a GitHub-hosted `ubuntu-latest` runner and does
not install Node there. Instead, it builds the multi-stage
[`Dockerfile`](Dockerfile) (which runs `npm test` in the `test` stage and the
bump script in the `update` stage inside a `node:24-bookworm-slim` image) and
copies `Formula/` back from Docker's local output (see "How versions are kept
up to date"). The runner only needs Docker.

### Repository setup

The update workflow uses the built-in `GITHUB_TOKEN` with `contents: write`
and `actions: write`. It commits `Formula/` directly to `master`, then
dispatches `test.yml`.

- The tap needs no GitHub App and no app secret.
- The repository must allow direct pushes to `master`. The private and public
  phases have no ruleset.
- The public phase keeps the direct `GITHUB_TOKEN` push. There is no pull
  request flow. The test runs after the push. This is the accepted trade-off
  for a fully automatic update.
- The default branch is `master`.
- `test.yml` runs on `workflow_dispatch` after the update push.

### Local validation

Formulas are validated locally with Homebrew by registering this checkout as a
tap (a Homebrew formula must live in a tap, path installs are not allowed):

```sh
brew tap TrustTunnel/tap "$PWD"
brew install TrustTunnel/tap/trusttunnel
brew install TrustTunnel/tap/trusttunnel-client
brew test TrustTunnel/tap/trusttunnel
brew test TrustTunnel/tap/trusttunnel-client
```

The CI workflow (`.github/workflows/test.yml`) does the same thing on every
push, pull request, and manual dispatch on GitHub-hosted `macos-latest`
runners.
