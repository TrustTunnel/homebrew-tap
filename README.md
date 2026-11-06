<!-- markdownlint-disable MD041 -->
<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://cdn.adguardcdn.com/website/github.com/TrustTunnel/logo_dark.svg" width="300px" alt="TrustTunnel" />
<img src="https://cdn.adguardcdn.com/website/github.com/TrustTunnel/logo_light.svg" width="300px" alt="TrustTunnel" />
</picture>
</p>

<p align="center">Homebrew formulas for the TrustTunnel VPN endpoint and command-line client</p>

<p align="center"><a href="#formulas">Formulas</a>
  · <a href="#usage">Usage</a>
  · <a href="https://github.com/TrustTunnel/TrustTunnel">Server</a>
  · <a href="https://github.com/TrustTunnel/TrustTunnelClient">CLI client</a>
  · <a href="https://trusttunnel.org">Website</a>
</p>

---

## Table of Contents

- [Formulas](#formulas)
- [Usage](#usage)
- [Supported platforms](#supported-platforms)
- [How versions are kept up to date](#how-versions-are-kept-up-to-date)
- [Development](#development)
- [License](#license)

---

A [Homebrew tap](https://docs.brew.sh/Taps) that installs the TrustTunnel
server and command-line client as prebuilt binaries. Every formula pins an
**exact** release, and a scheduled workflow automatically bumps the pins when
the upstream projects publish newer versions.

## Formulas

This tap provides prebuilt binaries of the following TrustTunnel tools. Each
tool links to its upstream repository:

| Formula | Tool | License |
| --- | --- | --- |
| `trusttunnel` | [VPN endpoint with the TrustTunnel protocol][trusttunnel] (server) | Apache-2.0 |
| `trusttunnel-client` | [Command-line client for the TrustTunnel VPN protocol][trusttunnel-client] | Apache-2.0 |

[trusttunnel]: https://github.com/TrustTunnel/TrustTunnel
[trusttunnel-client]: https://github.com/TrustTunnel/TrustTunnelClient

The pinned versions are updated automatically — see
[How versions are kept up to date](#how-versions-are-kept-up-to-date).

## Usage

Install the tap:

```sh
brew tap TrustTunnel/tap
```

Then install the tools you need, one command per tool:

```sh
brew install trusttunnel
brew install trusttunnel-client
```

Or install a single formula directly by its fully-qualified name (this also
adds the tap for you):

```sh
brew install TrustTunnel/tap/trusttunnel
brew install TrustTunnel/tap/trusttunnel-client
```

The formulas install these commands:

- `trusttunnel` installs `trusttunnel_endpoint` and
  `trusttunnel-setup-wizard`.
- `trusttunnel-client` installs `trusttunnel_client` and
  `trusttunnel-client-setup-wizard`.

The setup wizards have different names, so the two formulas do not conflict
when you install both.

## Supported platforms

- macOS — one universal binary for Apple Silicon and Intel.
- Linux `x86_64` and `aarch64`.

The tap does not provide armv7, mips, or mipsel binaries.

## How versions are kept up to date

A scheduled workflow checks the upstream GitHub releases daily at 06:00 UTC
and on demand. When a new stable release is available, it updates the pinned
`version`, URLs, and SHA256 digests in `Formula/`, then runs the formula
tests. See [DEVELOPMENT.md](DEVELOPMENT.md) for the implementation details.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for the updater, the Docker flow,
repository setup, and local formula validation.

## License

The tap is licensed under the [Apache License 2.0](LICENSE).

The `trusttunnel` and `trusttunnel-client` formulas install binaries published
by the [TrustTunnel server][trusttunnel] and
[TrustTunnel client][trusttunnel-client] projects, which are also licensed
under the Apache License 2.0.
