/**
 * vscode 配置
 */

const config = {
  "anki.api.hostname": {
    "type": "string",
    "default": "127.0.0.1",
    "description": "API Hostname"
  },
  "anki.api.port": {
    "type": "number",
    "default": 8765,
    "description": "API Port"
  },
  "anki.api.schema": {
    "type": "string",
    "default": "http",
    "description": "http or https"
  },
  "anki.saveStrategy": {
    "type": "string",
    "default": "default",
    "markdownDescription": "Determines the behavior of the command `Anki: Send To Deck`",
    "enum": [
      "default",
      "useDirStructure"
    ],
    "markdownEnumDescriptions": [
      "Send to the deck you specified in the `defaultDeck`",
      "allows you to default to using the file path as the deck name, same as what `Anki: Send to DirName Deck` does"
    ]
  },
  "anki.log": {
    "type": "string",
    "default": "error",
    "description": "Logging level, defaults to error",
    "enum": [
      "off",
      "error",
      "warn",
      "info",
      "trace"
    ]
  },
  "anki.noteType": {
    "type": "string",
    "default": "BasicWithHighlightVSCode",
    "description": "Which noteType should be used when creating a note?",
    "enum": [
      "BasicWithHighlightVSCode",
      "BasicWithHighlightVSCodeRev"
    ]
  },
  "anki.md.card.separator": {
    "type": "string",
    "default": "(?=^##\\s)",
    "description": "Regex for card separator"
  },
  "anki.md.card.convertMath": {
    "type": "boolean",
    "default": true,
    "description": "If set, convert Latex-style $ ... $ tags and blocks to MathJax-style \\( ... \\) tags and blocks"
  },
  "anki.md.card.frontBackSeparator": {
    "type": "string",
    "default": "%",
    "description": "Text to match to split the front and back (not regex)"
  },
  "anki.md.card.tagPattern": {
    "type": "string",
    "default": "^\\[#(.*)\\]",
    "description": "Regex for tags"
  },
  "anki.md.deck.titleSeparator": {
    "type": "string",
    "default": "^#\\s",
    "description": "Parsing for Deck Name"
  },
  "anki.md.createTagForTitle": {
    "type": "boolean",
    "default": true,
    "description": "When you run 'Send To Deck' the title (h1) of the markdown file is stored as a tag. This is useful if you have 'daily' notes, you can use the same deck but separate cards by title"
  },
  "anki.md.updateCards": {
    "type": "boolean",
    "default": true,
    "description": "Opt in to allow parsed noteIDs to be used for updating existing anki cards. Note: Update doesn't care which deck the card with each noteID are, see: https://github.com/jasonwilliams/anki/pull/106#issuecomment-1483743818"
  },
  "anki.md.insertNewCardID": {
    "type": "boolean",
    "default": false,
    "description": "Opt in to allow inserting newly created note IDs."
  }
};

export default config;