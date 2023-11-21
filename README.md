# setup-deno

[![Test the action](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml/badge.svg)](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml)

### Deno Setup action with integrated cache.

Based on `denoland/setup-deno@v1`, & `actions/cache@v3`, handles `DENO_DIR` and caching for you.\
Works on Ubuntu, macOS & Windows runners.

### Inputs
- `deno-version`:\
  The Deno version to install. Can be a semver version of a stable release, `'canary'` for the latest canary, or the Git hash of a specific canary release.
  Defaults to `1.x`.
- `deno-json-path`:\
  The path to the Deno config file to use for caching.\
  Defaults to an empty string, using the built-in CLI default.
- `deno-lock-path`:\
  The path to the lock file to use for caching.\
  Defaults to `./deno.lock`.
- `scripts-dir`:\
  The path to the scripts to cache. This can be useful if Deno is only part of your repo, and stored in a subdirectory.\
  Defaults to the repo root.

### Outputs:
- `deno-version`: The Deno version that was installed.
- `is-canary`: If the installed Deno version was a canary version.
- `cache-hit`: A boolean value to indicate an exact match was found for the key.