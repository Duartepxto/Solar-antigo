# Orbit agent notes

Read [`PRODUCT.md`](PRODUCT.md) before building or porting a screen: it holds
the rules Orbit's interface follows (the canvas is the app, nothing opens over
it, one character per bot, Orbit's tokens, every string through `t()`, no
hosted services). Work that ignores them is not done.

Before claiming a server or conversation change works, follow
[`docs/verification/README.md`](docs/verification/README.md). Always launch an
isolated fixture; never verify mutations against the user's live app or data.

More specific `AGENTS.md` files override this note within their directories.
