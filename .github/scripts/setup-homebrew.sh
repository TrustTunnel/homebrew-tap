#!/usr/bin/env bash
#
# Finds and updates Homebrew on a CI runner.
#
# This script uses the Homebrew installation that the runner image provides.
# It does not download or install Homebrew. The script is idempotent: it makes
# sure Homebrew is on the PATH and up to date.
#
# Exit codes:
#   0 - Homebrew is installed and ready.
#   1 - Homebrew could not be located.
#
set -euo pipefail

# Common Homebrew installation prefixes, in order of preference.
prefix=""
for candidate in /opt/homebrew /usr/local /home/linuxbrew/.linuxbrew; do
  if [[ -x "${candidate}/bin/brew" ]]; then
    prefix="${candidate}"
    break
  fi
done

if [[ -z "${prefix}" || ! -x "${prefix}/bin/brew" ]]; then
  echo "::error::Homebrew is not installed on this runner." >&2
  exit 1
fi

# Make `brew` available to the current shell and to every later job step.
eval "$("${prefix}/bin/brew" shellenv)"
if [[ -n "${GITHUB_PATH:-}" ]]; then
  echo "${prefix}/bin" >> "${GITHUB_PATH}"
fi

# Catch-up: refresh the local Homebrew installation and recipe index.
echo "::group::Homebrew update"
HOMEBREW_NO_ENV_HINTS=1 "${prefix}/bin/brew" update
echo "::endgroup::"

"${prefix}/bin/brew" --version

# Subsequent `brew` invocations in this job should not trigger an implicit
# auto-update of its own (we already did that above).
if [[ -n "${GITHUB_ENV:-}" ]]; then
  echo "HOMEBREW_NO_AUTO_UPDATE=1" >> "${GITHUB_ENV}"
fi
