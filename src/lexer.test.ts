import { Lexer } from "./lexer";

it('sums numbers', () => {
    expect(3).toEqual(3);
});

it('lex dont explode', () => {
  const lexer = new Lexer();
  const results = lexer.scan('x + 2');
  // expect(3).toEqual(3);
  // tslint:disable-next-line:no-console
  console.log(results.tokens);
  expect(3).toEqual(3);
});
