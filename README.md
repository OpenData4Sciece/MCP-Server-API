# MCP Server: A Metadata Content Provider API for Machine Learning Apps

MCP Server is a structured, standards-compliant API for serving metadata, service discovery endpoints, and machine learning content. It's designed to help AI and data science applications discover model context, training artefacts, research notebooks, and statistical methods efficiently.

This server is based on the [MCP specification](https://www.modelcontext.org/spec) and is production-ready with clean TypeScript code and modular design.


## Features 🚀

- `.well-known/model-context` for model-level context resolution
- Service discovery endpoint at `/v1/discovery`
- `/v1/content` endpoint to list data science and ML resources
- Clean Fastify setup, with plugin structure and async loading
- Environment variable support via `.env`


## Get Started

1. `npm install` to install all the dependencies.
2. `npm run dev` to launch the server with auto-reload (via `nodemon`).
3. Copy `.env.dist` to `.env` and configure the variables for your environment.


### Other Commands

- `npm run start` - start the server in standard mode (without auto-reload).
- `npm run prod` - optimised production run. This compiles the TS files then runs the server.
- `npm run build` - compile the TypeScript source code into JavaScript.


### Utility

- `npm run prettier:check` – check formatting issues using Prettier.
- `npm run prettier:fix` – fix formatting issues automatically.


## Author

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me "Pierre-Henry Soria, Software Developer")

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)**. A super passionate & enthusiastic Problem-Solver / Senior Software Engineer. Also a true cheese 🧀, ristretto ☕️, and dark chocolate lover! 😋

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay "Follow Me on X")  [![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 "My GitHub")  [![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@pH7Programming "YouTube SucceedAI Video")  [![Bluesky](https://img.shields.io/badge/bluesky-1e90ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjI0cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMwIDZsLTIuOTk5LTEuNjY2TDMyIDMuMzQgMjMuMTg5IDAgMTYuMDA2IDUuMzQgOC44MTMgMCAwIDMuMzQgNC45OTkgNC4zMzQgMCA2bDUuMDAxIDQuODAzTDQgMjAuODFWMjRsNS4wMDEtMS42NjZMMTYgMjhMMjIuOTk5IDIyLjM0IDMyIDI0di0zLjE4OUwyNy4wMDIgMTIgMzAgNiIgLz48L3N2Zz4=)](https://bsky.app/profile/ph7s.bsky.social "Bluesky Profile")


## About the Project

**MCP Server** is part of the `#AI-Free-Projects` challenge – a collection of **7 open source AI projects** shared publicly on GitHub and YouTube. The goal is to contribute back to the community while practising 20-hour/week transparency commitment.


## License

Distributed under the [MIT License](LICENSE) 🎉 Happy hacking! 🤠