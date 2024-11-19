/**
 * Base parser which should be inherited
 */

export class BaseParser {
  public options: any;

  constructor(options = {}) {
    this.options = options;
  }
  //   /**
  //    * Create a new instance of parser and run parse() method
  //    * parse() method should be implemented in the inherited class
  //    * @param {string} data
  //    * @param {Object} options
  //    */
  //   static parse(data: string, options = {}) {
  //     return new this(options).parse(data);
  //   }
}
