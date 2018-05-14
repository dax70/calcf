
export enum TokenType {
  Literal,
  Identifier,
  Number,
  Operator
}

const leftParen = '(';
const rightParen = ')';
const plus = '-';
const minus = '-';
const equals = '=';


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

function isSymbol(char: string) {
  return (char === leftParen ||
          char === rightParen ||
          char === plus ||
          char === minus ||
          char === equals);
}

const lexIdentifier: LexerFn = (lexer) => {
  let c = lexer.next();
  while (c) {
    if(isAlphaNumeric(c)) {
      c = lexer.next();
    }
    else if(isSpace(c) || isSymbol(c)) {
      lexer.backup();
      lexer.emitToken(TokenType.Identifier);
      return lexFn;
    }
  }

  return null;
}

const lexLiteral: LexerFn = (lexer) => {
  let c = lexer.next();
  while (c) {
    // TODO: look for quotes?
    if(isNumeric(c)) {
      c = lexer.next();
    }
    else if(isSpace(c)) {
      lexer.backup();
      return lexFn;
    }
  }

  lexer.emitToken(TokenType.Identifier);
  return lexFn;
}

const lexFn: LexerFn = (lexer) => {
  let c = lexer.next();
  while (c) {
    if(isSpace(c)) {
      lexer.ignore();
      c = lexer.next();
    }
    else if (isAlpha(c)) {
      lexer.backup();
      return lexIdentifier;
    }
    else if(isNumeric(c)) {
      lexer.backup();
      return lexLiteral;
    }
  }

  lexer.error('Error!');
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
      errors: [this.name],
      tokens: this.tokens
    }
  }

  // backup steps back one rune
  // Can be called only once per call of next
  backup() {
    this.pos -= this.width; // on the lexer
  }

  emitToken(type: TokenType) {
    // Token becomes the substring between start and pos
    const { input, start, pos } = this;
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

  // ignore skips over the pending input before this point
  ignore() {
    this.start = this.pos; // just absorb and ignore the space, etc
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
    this.pos += this.width;
    return rune;
  }

  // peek returns but does not consume
  // the next rune in the input
  peek(): Rune {
    const rune = this.next();
    this.backup();
    return rune;
  }
}
