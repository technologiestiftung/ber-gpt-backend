![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# BärGPT Backend

This project serves as the backend for the "BärGPT" project, see [BärGPT Frontend](https://github.com/technologiestiftung/ber-gpt-frontend).

It exposes various endpoints which are used to communicate with LLMs.

It allows for communicating with OpenAI API and a self-hosted LLM on Azure.

## Prerequisites

- OpenAI Account and API key (https://platform.openai.com/)
- Azure account and deployed LLM model on Azure (https://azure.com/)
- Node.js (https://nodejs.org/en)
- NVM (https://github.com/nvm-sh/nvm)

## Development setup

- `git clone git@github.com:technologiestiftung/ber-gpt-backend.git`

Prepare env variables by copying `.env.sample` to `.env` and setting the appropriate values:

```
CORS_ALLOWED_ORIGIN=http://localhost:5173
RATE_LIMIT_REQUESTS_PER_MINUTE=30
X_API_KEY="set to a secure api key of your choice"

# config for Azure LLM
AZURE_LLM_API_KEY=...
AZURE_LLM_ENDPOINT="https://<your_hub>.openai.azure.com/openai/deployments/gpt-35-turbo-16k/chat/completions?api-version=2023-03-15-preview"

# config for OpenAI LLM
OPENAI_ENDPOINT="https://api.openai.com/v1/chat/completions"
OPENAI_API_KEY=sk-...
```

Install dependencies:

- `nvm install && nvm use`
- `npm ci`

Run the API:

- `npm run dev`
- API is now running on `http://localhost:3000`

## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Jaszkowic"><img src="https://avatars.githubusercontent.com/u/10830180?v=4?s=100" width="100px;" alt="Jonas Jaszkowic"/><br /><sub><b>Jonas Jaszkowic</b></sub></a><br /><a href="https://github.com/technologiestiftung/ber-gpt-backend/commits?author=Jaszkowic" title="Code">💻</a> <a href="#infra-Jaszkowic" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/technologiestiftung/ber-gpt-backend/commits?author=Jaszkowic" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/raphael-arce"><img src="https://avatars.githubusercontent.com/u/8709861?v=4?s=100" width="100px;" alt="Raphael.A"/><br /><sub><b>Raphael.A</b></sub></a><br /><a href="https://github.com/technologiestiftung/ber-gpt-backend/commits?author=raphael-arce" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Content Licensing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://logos.citylab-berlin.org/logo-berlin-senatskanzelei-de.svg" />
      </a>
    </td>
  </tr>
</table>

## Related Projects

- BärGPT Frontend (https://github.com/technologiestiftung/ber-gpt-frontend)
