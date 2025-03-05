# setup-deno

[![Test the action](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml/badge.svg)](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml)

### Deno Setup action with integrated cache.

- Based on: 
  - [`denoland/setup-deno@v2`](https://github.com/denoland/setup-deno),
  - [`actions/cache@v4`](https://github.com/actions/cache)
- Handles restoring and caching to `DENO_DIR` for you.
- Annotates your source code from `deno lint --compact` output.\
  See the summary of the most recent [Problem Matcher worflow](https://github.com/nekowinston/setup-deno/actions/workflows/problem-matcher.yml) for an example.
- Works on Ubuntu, macOS & Windows runners.

### Usage

#### Basic:

```yaml
- uses: nekowinston/setup-deno@v2
```

#### All options:

```yaml
- uses: nekowinston/setup-deno@v2
  with:
    deno-version: "~2.2"
    deno-json-path: ./subdirectory/deno.json
    deno-lock-path: ./subdirectory/deno.lock
    directory: ./subdirectory
```

### Inputs
- `deno-version`:\
  The Deno version to install. Can be a semver version of a stable release, `'canary'` for the latest canary, or the Git hash of a specific canary release.\
  See [`setup-deno`](https://github.com/marketplace/actions/setup-deno) for examples.\
  Defaults to `2.x`.
- `deno-json-path`:\
  The path to the Deno config file to use for caching.\
  Defaults to an empty string, using the built-in CLI default.
- `deno-lock-path`:\
  The path to the lock file to use for caching.\
  Defaults to `./deno.lock`.
- `directory`:\
  The path to the scripts to cache. This can be useful if Deno is only part of your repo, and stored in a subdirectory.\
  Defaults to the repo root.

### Outputs:
- `deno-version`: The Deno version that was installed.
- `is-canary`: If the installed Deno version was a canary version.
- `cache-hit`: A boolean value to indicate an exact match was found for the key.
