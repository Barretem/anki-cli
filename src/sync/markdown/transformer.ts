import { dirname, relative } from "path";
import { Card } from "../models/Card";
import { Deck } from "../models/Deck";
import { MarkdownFile } from "../models/MarkdownFile";
import { Media } from "../models/Media";
import { SendDiff } from "../models/SendDiff";
import { DeckNameStrategy, Serializer } from "./Serializer";
import { NodeHtmlMarkdown } from "node-html-markdown";
import config from "../config";
import { AnkiService, getAnkiService } from "../AnkiService";
import { getLogger } from "../logger";
import { DEFAULT_DECK_NAME } from "../../util/constant";
/**
 * Create anki cards from markdown files
 */
export class Transformer {
  private source: MarkdownFile;
  private deck: Deck | null;
  private defaultDeck: string;
  private strategy: DeckNameStrategy;
  private ankiService: AnkiService;
  /** 根分组名 */
  private rootDeckName: string;
  /** md文件路径 */
  private mdFilePath: string;
  /** md文件夹根目录 */
  private dirPath: string;

  /**
   * @param {string} source markdown file
   * @param {DeckNameStrategy} strategy how to get the deck name
   */
  constructor(source: MarkdownFile, strategy: DeckNameStrategy = DeckNameStrategy.UseDefault, mdFilePath: string, dirPath: string, rootDeckName: string) {
    this.deck = null;
    this.source = source;
    this.ankiService = getAnkiService();
    this.strategy = strategy;
    this.defaultDeck = DEFAULT_DECK_NAME;
    this.mdFilePath = mdFilePath;
    this.dirPath = dirPath;
    this.rootDeckName = rootDeckName;
  }

  async transform(): Promise<SendDiff | undefined> {
    return await this.transformToDeck();
  }

  async transformToDeck(): Promise<SendDiff | undefined> {
    const serializer = new Serializer(this.source, this.strategy);

    const { cards, deckName, media } = await serializer.transform();

    if (!cards.length) {
      getLogger().error(`No cards found in ${this.mdFilePath}. Check your markdown file`);
      return;
    }

    this.deck = new Deck(this.calculateDeckName(deckName)).setAnkiService(this.ankiService);

    // If strategy is UseDefault then the title will be the default Deck
    // For daily markdown files it's still useful to have a tag (we can use the title for this)
    if (
      deckName &&
      this.strategy === DeckNameStrategy.UseDefault &&
      (config["anki.md.createTagForTitle"])
    ) {
      cards.forEach((v) => v.addTag(deckName));
    }

    // Either create a new Deck on Anki or get back the ID of the same-named Deck
    await this.deck.createOnAnki();
    await this.pushMediaItems(media);
    // this.exportCards will return a list of Cards that were just created. Thus we need to insert their note IDs into the markdown
    const newCards = await this.exportCards(cards);
    // Call to insert noteID into markdown
    if (config["anki.md.insertNewCardID"]) {
      this.insertNoteIDs(newCards);
    }

    return new SendDiff(); // dummy return for the first pull request
  }
  insertNoteIDs(cards: Card[]) {
    let lines = this.source.cachedContent.split("\n");
    let match = new RegExp(config["anki.md.card.separator"].default);

    // https://stackoverflow.com/questions/6946466/line-number-of-the-matched-characters-in-js-node-js
    let headerLineNumbers: number[] = [];
    lines.map((element, index) => {
      if (match.exec(element)) {
        headerLineNumbers.push(index);
      }
    });

    // Now need to correlate the header lines with which card they match
    // I have to have a line number such that I can create a position
    // https://code.visualstudio.com/api/references/vscode-api#Position
    // https://code.visualstudio.com/api/references/vscode-api#TextEditorEdit

    // https://codereview.stackexchange.com/questions/153691/escape-user-input-for-use-in-js-regex
    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }

    // For each of the indexes, try and match one of the card fronts
    const nhm = new NodeHtmlMarkdown();
    let lineIndexToNoteID = new Map();
    headerLineNumbers.forEach((lineIndex) => {
      cards.forEach((card) => {
        let front = nhm.translate(card.question);
        let matchFront = new RegExp(`^##\\s+${escapeRegExp(front)}\\s*$`, "m");
        let matched = matchFront.exec(lines[lineIndex]);

        if (matched) {
          lineIndexToNoteID.set(lineIndex, card.noteId);
        }
      });
    });

  }

  async pushMediaItems(media: Media[]) {
    if (!media.length) {
      return;
    }

    const files = media.map((v) => ({
      filename: v.fileName,
      data: v.data,
    }));

    await this.ankiService.storeMultipleFiles(files);
  }

  calculateDeckName(generatedName: string | null = null): string {
    if (this.strategy === DeckNameStrategy.UseDefault) {
      return this.defaultDeck;
    } else if (this.strategy === DeckNameStrategy.ParseTitle) {
      return generatedName || this.defaultDeck;
    } else {
      const fileUri = this.mdFilePath;
      if (fileUri === undefined) {
        return this.defaultDeck;
      }
      const rootPath = this.dirPath;
      const rootDeckName = this.rootDeckName;
      const filePath = fileUri || this.defaultDeck;
      const fileName = filePath.split("/").pop()?.replace(".md", "");
      let deckName = "";
      if (rootPath && filePath) {
        deckName = `${rootDeckName}::${relative(rootPath, dirname(filePath)).replace(/[\/\\]/g, "::")}::${fileName}`;
      }
      return deckName || this.defaultDeck;
    }
  }

  async exportCards(cards: Card[]): Promise<Card[]> {
    this.addCardsToDeck(cards);
    if (!this.deck) {
      throw new Error("No Deck exists for current cards");
    }

    return await this.deck.createAndUpdateCards();
  }

  addCardsToDeck(cards: Card[]) {
    cards.forEach((card: Card) => {
      if (!this.deck) {
        throw new Error("No Deck exists for current cards");
      }

      this.deck.addCard(card);
    });
  }
}
