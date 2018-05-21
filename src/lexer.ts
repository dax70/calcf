
export enum TokenType {
  Literal,
  Identifier,
  Number,
  Operator,
  Grouping
}

const special = ['(',')','+','-','*','/','=','^','.',','];

const [
  leftParen,
  rightParen,
  plus, minus,
  multiply,
  divide,
  equals,
  power,
  decimal,
  coma
] = special;


export type Token = {
  type: TokenType,
  value: string
}

export type Rune = string | null;

export type LexerResult = {
  tokens: Array<Token>;
  errors: Array<string>;
}

type LexerFn = (lexer: Lexer) => LexerFn | null;

function isSpace(char: string) {
  return char === ' ';
}

function isAlphaNumeric(char: string) {
  const code = char.charCodeAt(0);
  return ((code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123)); // lower alpha (a-z)
}

function isAlpha(char: string) {
  const code = char.charCodeAt(0);
  return ((code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123)); // lower alpha (a-z)
}

function isNumeric(char: string) {
  const code = char.charCodeAt(0);
  return (code > 47 && code < 58); // numeric (0-9)
}

function isOperator(char: string) {
  return (char === equals ||
          char === plus ||
          char === minus ||
          char === multiply ||
          char === divide ||
          char === power);
}

function isGrouping(char: string) {
  return (char === leftParen ||
          char === rightParen);
}

const lexIdentifier: LexerFn = (lexer) => {
  lexer.start = lexer.pos;
  let c = lexer.next();

  while (c && isAlphaNumeric(c)) {
      c = lexer.next();
  }

  lexer.backup();
  lexer.emitToken(TokenType.Identifier);
  return lexFn;
}

const lexLiteral: LexerFn = (lexer) => {
  lexer.start = lexer.pos;
  let c = lexer.next();

  // TODO: look for quotes?
  while (c && (isNumeric(c) || c === coma || c === decimal)) {
      c = lexer.next();
  }

  lexer.backup();
  lexer.emitToken(TokenType.Literal);
  return lexFn;
}

const lexOperator: LexerFn = (lexer) => {
  lexer.start = lexer.pos;
  let c = lexer.next();

  // TODO: look for quotes?
  while (c && isOperator(c)) {
      c = lexer.next();
  }

  lexer.backup();
  lexer.emitToken(TokenType.Operator);
  return lexFn;
}

const lexFn: LexerFn = (lexer) => {
  const c = lexer.next();
  if (c) {
    if(isSpace(c)) {
      lexer.ignore();
      return lexFn;
    }
    else if (isAlpha(c)) {
      lexer.backup();
      return lexIdentifier;
    }
    else if(isNumeric(c)) {
      lexer.backup();
      return lexLiteral;
    }
    else if(isOperator(c)) {
      lexer.backup();
      return lexOperator;
    }
    else if(isGrouping(c)) {
      lexer.start = lexer.pos -1;
      lexer.emitToken(TokenType.Grouping);
      return lexFn;
    }
  }

  // tslint:disable-next-line:no-console
  console.log('EOF');
  return null;
}

const bodyFn: LexerFn = (lexer) => {
  return null;
}

export class Lexer {

  name: string; // use for errors
  input: string; // the string being scanned
  start: number; // start position of this token
  pos: number = 0; // current position in the input
  width: number = 0; // width of last rune read
  tokens: Array<Token> = []; // scanned tokens

  scan(input: string): LexerResult {
    this.input = input;

    let stateFn: LexerFn | null = lexFn;
    while (stateFn) {
      stateFn = stateFn(this);
    }

    return {
      errors: [],
      tokens: this.tokens
    }
  }

  // backup steps back one rune
  // Can be called only once per call of next
  backup() {
    if(this.pos > 0 && this.width > 0) {
      this.pos--; // -= this.width; // on the lexer
      this.width--;
    }
  }

  // next returns the next rune in the input
  next(): Rune /*| int (utf8?) - rune */ {
    const { pos, input } = this;
    if (pos > input.length) {
      this.width = 0;
      return null; // (special rune))
    }

    const rune = input.charAt(pos);
    this.width ++;
    this.pos ++;
    return rune;
  }

  // peek returns but does not consume
  // the next rune in the input
  peek(): Rune {
    const rune = this.next();
    this.backup();
    return rune;
  }

  // ignore skips over the pending input before this point
  ignore() {
    this.start = this.pos; // just absorb and ignore the space, etc
  }

  emitToken(type: TokenType) {
    // Token becomes the substring between start and pos
    const { input, start, pos } = this;
    this.width = 0;
    this.tokens.push({
      type,
      value: input.slice(start, pos)
    });
  }

  error(str: string) {
    // TODO: make this a stateFn
    this.name = str;
    // tslint:disable-next-line:no-console
    console.log(str);
  }

  accept(valid: string) {
    const c = this.next();
    if(c && valid.indexOf(c) > -1) {
      return true;
    }

    this.backup();
    return false;
  }

  acceptRun(valid: string) {
    const iter = valid[Symbol.iterator]();
    let result = iter.next();
    while (!result.done && result.value === this.next()) {
      result = iter.next();
    }

    this.backup();
  }
}

export function printToken(token: Token) {
  return `value: ${token.value}, type: ${TokenType[token.type]}`;
}

