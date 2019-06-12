import { CallbackToContentWithKeywords, CMS, Text } from '../cms';
import { MatchType } from '../nlp/keywords';
import { SearchByKeywords } from './search_by_keywords';

export class Keywords {
  readonly search: SearchByKeywords;
  /**
   * @param maxButtons Some providers only support 3 buttons
   */
  constructor(
    private readonly cms: CMS,
    search?: SearchByKeywords,
    readonly maxButtons: number = 3
  ) {
    this.search =
      search || new SearchByKeywords(cms, MatchType.ONLY_KEYWORDS_FOUND);
  }

  async searchByKeywords(
    inputText: string
  ): Promise<CallbackToContentWithKeywords[]> {
    let tokens = this.search.tokenize(inputText);
    let contents = await this.search.searchContentsFromInput(tokens);
    return this.search.filterChitchat(tokens, contents);
  }

  async respondFoundContents(
    contents: CallbackToContentWithKeywords[],
    confirmKeywordsFoundTextId: string,
    noKeywordsFoundTextId: string
  ): Promise<Text> {
    if (contents.length == 0) {
      return this.cms.text(noKeywordsFoundTextId);
    }
    let chitchatCallback = contents[0].getCallbackIfChitchat();
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id);
    }
    let buttons = contents.map(callback => callback.toButton());
    buttons = buttons.slice(0, this.maxButtons);
    let text = await this.cms.text(confirmKeywordsFoundTextId);
    return text.cloneWithButtons(buttons);
  }
}

export * from './search_by_keywords';