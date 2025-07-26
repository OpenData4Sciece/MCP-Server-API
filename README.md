# MCP Server – Machine-Consumable Protocol Compliant API for ML Services

**MCP Server** is a Fastify-based TypeScript API that follows the [Machine-Consumable Protocol (MCP)](https://machineconsumable.org/) standard. It provides structured discovery and service definition endpoints to help clients (AI/ML tools, agents, LLMs, or apps) understand and interact with your ML APIs in a fully structured and machine-readable way.

At the moment, it includes the following MCP endpoints ⚙️

- **`/.well-known/model-context`** – JSON-LD context for schema discovery.
- **`/v1/discover`** – Programmatic introspection and metadata for ML services.
- **`/v1/content`** – Declares the ML services provided by your API.

It’s built cleanly and efficiently using Fastify and TypeScript for reliability, speed, and full developer happiness 😎


## Get Started

1. `npm install` – install the dependencies.
2. `npm run dev` – start the server in development mode (with automatic restarts using `tsnd`).
3. Rename `.env.dist` to `.env` and configure your environment if needed.


### Other Commands

- `npm run start` – start the server in standard mode without file watching.
- `npm run prod` – production-ready execution (runs `build` then `node`).
- `npm run build` – compile the TypeScript files into JavaScript.


### Utility

- `npm run prettier:check` – check formatting issues in codebase.
- `npm run prettier:fix` – automatically fix code formatting issues.


## Author

[![Pierre-Henry Soria](https://avatars0.githubusercontent.com/u/1325411?s=200)](https://ph7.me "Pierre-Henry Soria, Software Developer")

Made with ❤️ by **[Pierre-Henry Soria](https://pierrehenry.be)** – Senior Software Engineer, passionate about machine learning, elegant code, solving complex problems, and living the sweet life with cheese 🧀, ristretto ☕️, and dark chocolate 🍫.

[![@phenrysay](https://img.shields.io/badge/x-000000?style=for-the-badge&logo=x)](https://x.com/phenrysay "Follow Me on X")  
[![pH-7](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pH-7 "My GitHub")  
[![YouTube Video](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@pH7Programming "YouTube SucceedAI Video")  
[![Bluesky](https://img.shields.io/badge/Bluesky-0061FF?style=for-the-badge&logoColor=white)](https://bsky.app/profile/ph7s.bsky.social "Follow me on Bluesky")


# About the Project

**MCP Server** is part of the initiative **#AI-Free-Projects**, a public commitment to building and sharing open, practical AI/data infra for developers and ML builders.  

It supports the emerging **MCP standard** and helps bridge the gap between model consumers and API infrastructure.

Feel free to connect or reach out on **[LinkedIn](https://www.linkedin.com/in/ph7enry/)** 🚀


## License

Distributed under the [MIT](https://opensource.org/license/mit) license.  
Happy hacking and ML building! 🤠
