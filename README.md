# setup-deno

[![Test the action](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml/badge.svg)](https://github.com/nekowinston/setup-deno/actions/workflows/test.yml)

### Deno Setup action with integrated cache.

- Based on:
  - [`denoland/setup-deno@v1`](https://github.com/denoland/setup-deno),
  - [`actions/cache@v3`](https://github.com/actions/cache)
- Handles restoring and caching to `DENO_DIR` for you.
- Annotates your source code from `deno lint --compact` output.\
  See the summary of the most recent
  [Problem Matcher worflow](https://github.com/nekowinston/setup-deno/actions/workflows/problem-matcher.yml)
  to see it in action.
- Works on Ubuntu, macOS & Windows runners.

### A note on Deno caching

Deno only caches the deps it needs to run a single script, and does so on the
fly. This is great UX/DX! But it does make effective caching in GitHub actions
harder.

[v1](https://github.com/nekowinston/setup-deno/tree/v1) of this repo used to run
`find . -regex '.*\.[jt]sx*' -exec deno cache {} \;` to prefetch all
dependencies for all scripts more reliably. In case of a non-standard repo
layout (e.g. monorepo), the action had another input to specify a single
directory to cache.

[v2](https://github.com/nekowinston/setup-deno/tree/v2) now offers an extension
to the `deno.json` config! Simply specify which paths to _include_ or _exclude_:

```jsonc
{
  "tasks": {
    // add a task to easily call `deno task cache`
    "cache": "deno run --no-lock --allow-read --allow-run=deno --allow-env=CI,DENO_DIR https://esm.sh/gh/nekowinston/setup-deno/dist/cache.js"
  },
  // the task will respect both `.exclude`
  "exclude": ["dist", "foo/*"],
  // and new `.cache.include` & `.cache.exclude` fields
  "cache": {
    "include": "foo/bar.ts",
    "exclude": "scripts/some_rarely_run_script.ts"
  }
}
```

These fields get combined, and cached accordingly:

```console
$ deno task cache -v
caching main.ts
ignored dist/main.js
ignored foo/qux.ts
caching foo/bar.ts
ignored foo/baz.ts
ignored scripts/some_rarely_run_script.ts
```

> [!NOTE] This script is completely optional for this action.

### Action Usage

#### Basic:

```yaml
- uses: nekowinston/setup-deno@v1
```

#### All options:

```yaml
- uses: nekowinston/setup-deno@v1
  with:
    deno-version: "~1.38"
    deno-json-path: ./subdirectory/deno.json
```

### Inputs

- `deno-version`:\
  The Deno version to install. Can be a semver version of a stable release,
  `'canary'` for the latest canary, or the Git hash of a specific canary
  release.\
  See [`setup-deno`](https://github.com/marketplace/actions/setup-deno) for
  examples.\
  Defaults to `1.x`.
- `deno-json-path`:\
  The path to the Deno config file to use for caching.\
  Defaults to an empty string, using the built-in CLI default.

### Outputs:

- `deno-version`: The Deno version that was installed.
- `is-canary`: If the installed Deno version was a canary version.
- `cache-hit`: A boolean value to indicate an exact match was found for the key.
