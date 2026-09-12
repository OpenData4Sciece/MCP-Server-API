# ML Service Metadata API

A small Fastify and TypeScript **REST prototype** for exploring machine-readable ML service descriptions. The repository keeps its historical `MCP-Server-API` name.

**This is not a Model Context Protocol implementation.** The [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25/basic) requires JSON-RPC messages and lifecycle negotiation; this project exposes ordinary HTTP routes with an experimental JSON-LD context. It does not support MCP client connections, inference, model training or automatic discovery by AI services.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
cp .env.dist .env
npm run build
npm start
```

The server binds to `127.0.0.1:3000` by default. `npm run dev` reloads TypeScript during development; `npm run prod` builds and starts the same server. `npm start` uses the existing compiled output.

```sh
curl http://127.0.0.1:3000/v1/discovery
curl http://127.0.0.1:3000/v1/content
```

## Implemented routes

| Route                            | Behaviour                                                                |
| -------------------------------- | ------------------------------------------------------------------------ |
| `GET /.well-known/model-context` | Configured service name, description, version, tags and contact          |
| `GET /v1/discovery`              | Alias for the same metadata                                              |
| `GET /.well-known/v1.json`       | The single experimental JSON-LD context definition                       |
| `GET /v1/content`                | Four static example service descriptions; no datasets or model artefacts |
| `GET /v1/model/churn` or `/eda`  | Illustrative input/output descriptions with `example: true`              |
| `GET /v1/model/:unknown`         | 404                                                                      |
| `POST /v1/strava/activities`     | Retrieves the caller's Strava activities using the supplied access token |

The model examples do not link to nonexistent prediction or notebook endpoints. Replace examples with verified resources before presenting them as delivered services.

## Strava request contract

The body is JSON: `accessToken` is a nonempty string without whitespace; optional integer `page` is 1–10,000 (default 1), and `per_page` is 1–200 (default 30). Unknown fields, custom destinations and malformed values return 400. The whole request body is limited to 16 KB; tokens are limited to 4,096 characters.

The destination is fixed to [Strava's athlete activities endpoint](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities). Requests have a 10-second timeout, a 2 MB response limit and no redirects. Success returns the upstream activity JSON; upstream failures return a generic 502. Responses use `Cache-Control: no-store`.

Tokens and activity data are sensitive. Use only your own authorised token over localhost or a trusted HTTPS deployment. The proxy forwards it only to Strava; it does not obtain, refresh, store or grant scopes to tokens. Tests mock every upstream call and do not access a real athlete's account.

## Configuration

Copy `.env.dist` before starting. Metadata is read after environment loading, when routes are registered.

- `APP_PORT`: integer 1–65,535; defaults to 3000.
- `APP_HOST`: defaults to `127.0.0.1`. Public exposure requires separate deployment controls.
- `APP_VERSION`: metadata version; defaults to 1.1.0.
- `MCP_NAME`, `MCP_DESCRIPTION`, `MCP_TAGS`: display metadata; tags are trimmed and deduplicated.
- `MCP_CONTACT_EMAIL`, `MCP_CONTACT_WEBSITE`: optional public contact values.

The `MCP_*` names are retained for compatibility and do not imply protocol support. Previously documented `MCP_VERSION` and `BASE_URL` were unused and are not supported.

## Validation and boundaries

```sh
npm test
npm run prettier:check
npm audit
```

Tests use Fastify injection with synthetic data for metadata, discovery, model examples, input validation and outbound-request restrictions. The build checks TypeScript; no AI model, database or external account is required.

This is not a production service: it has no per-user authentication, application-level rate limit, OAuth flow, persistent storage or deployment automation. CORS is permissive for local experimentation. Before public hosting, define the audience, add access and abuse controls, and verify real Strava scopes and quotas. Restricting the upstream URL is not a substitute for those controls.

## Historical material

[Original walkthrough](https://youtu.be/DEaSz8kVPH8) and [original illustration](assets/images/machine-consumable-protocol-mcp-compliant-api-for-ml-services.png) are preserved as project history. Their protocol/compliance claims are superseded by the implementation description above. `threads.txt` is a historical draft, not evidence of AI-platform indexing, deployment or delivered ML models.

A future real MCP implementation should be a separately specified change using the official protocol and SDK, with lifecycle and client interoperability tests.

## The Baker

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me 'Pierre-Henry Soria, Software Developer')

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)**. A super passionate & enthusiastic Problem-Solver / Senior Software Engineer. Also a true cheese 🧀, ristretto ☕️, and dark chocolate lover! 😋

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay 'Follow Me on X') [![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 'My GitHub') [![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@pH7Programming 'Pierre-Henry Soria programming channel') [![BlueSky](https://img.shields.io/badge/BlueSky-00A8E8?style=for-the-badge&logo=bluesky&logoColor=white)](https://bsky.app/profile/ph7s.bsky.social 'Follow Me on BlueSky')

## License

Distributed under the [MIT License](LICENSE.md) 🎉 Happy hacking! 🤠
