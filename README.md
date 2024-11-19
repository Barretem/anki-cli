# anki cli

Sync your markdown directory to anki. If you change your markdown, run this command to sync it to anki.

## Requirements
- Anki >= 2.1.21
- [Anki Connect](https://ankiweb.net/shared/info/2055492159) >= 2020-07-13


## Usage

### Install
```shell
pnpm install @barretter/anki-cli
```

### Config

Add a command to your package.json. For example:

```json
{
  "scripts": {
    "sync": "anki sync --dirPath=./docs/demo --rootDeckName=demo --ankiServiceUrl=http://127.0.0.1:8765"
  }
}
```

### Run

```shell
pnpm run sync
```

## Config

| Config | Description | Type | Default |
|:--:|:--:|:--:|:--:|
| --dirPath | sync dirname | string | ./ |
| --rootDeckName | anki root deck name | string | notes |
| --ankiServiceUrl | anki connect HTTP server url | string | http://127.0.0.1:8765 |

## Notes

Fork from [anki](https://github.com/jasonwilliams/anki). Thanks!

## License
MIT