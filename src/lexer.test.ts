import { Lexer } from "./lexer";

it('sums numbers', () => {
    expect(3).toEqual(3);
});

it('lex dont explode', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 2');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('2').toEqual(tokens[1].value);
});

it('lex number', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 25');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('25').toEqual(tokens[1].value);
});

it('lex longer number', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 257');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('257').toEqual(tokens[1].value);
});

it('lex long number', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 25734264902874');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('25734264902874').toEqual(tokens[1].value);
});

it('lex number with decimal', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 2.57');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('2.57').toEqual(tokens[1].value);
});

it('lex number with coma', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x 2,057');
  expect(2).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('2,057').toEqual(tokens[1].value);
});

it('lex with +', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x + 2');
  expect(3).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('+').toEqual(tokens[1].value);
  expect('2').toEqual(tokens[2].value);
});

it('lex with -', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('x - 2');
  expect(3).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('x').toEqual(tokens[0].value);
  expect('-').toEqual(tokens[1].value);
  expect('2').toEqual(tokens[2].value);
});

it('lex with ()', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x + 2)');
  expect(5).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('+').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
});

it('lex with multiply', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x * 2)');
  expect(5).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('*').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
});

it('lex with divide', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x / 2)');
  expect(5).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('/').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
});

it('lex with group followed by +', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x * 2) + 3');
  expect(7).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('*').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
  expect('+').toEqual(tokens[5].value);
  expect('3').toEqual(tokens[6].value);
});

it('lex with 2 groups', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x * 2) (y + 3)');
  expect(10).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('*').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
  expect('(').toEqual(tokens[5].value);
  expect('y').toEqual(tokens[6].value);
  expect('+').toEqual(tokens[7].value);
  expect('3').toEqual(tokens[8].value);
  expect(')').toEqual(tokens[9].value);
});

it('lex with 2 groups without spaces', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x * 2)(y + 3)');
  expect(10).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('*').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
  expect('(').toEqual(tokens[5].value);
  expect('y').toEqual(tokens[6].value);
  expect('+').toEqual(tokens[7].value);
  expect('3').toEqual(tokens[8].value);
  expect(')').toEqual(tokens[9].value);
});

it('lex with power without spaces', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x^2)(y + 3)');
  expect(10).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('^').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
  expect('(').toEqual(tokens[5].value);
  expect('y').toEqual(tokens[6].value);
  expect('+').toEqual(tokens[7].value);
  expect('3').toEqual(tokens[8].value);
  expect(')').toEqual(tokens[9].value);
});

it('lex with power with spaces', () => {
  const lexer = new Lexer();
  const {tokens, errors} = lexer.scan('(x ^ 2)(y + 3)');
  expect(10).toEqual(tokens.length);
  expect(0).toEqual(errors.length);
  expect('(').toEqual(tokens[0].value);
  expect('x').toEqual(tokens[1].value);
  expect('^').toEqual(tokens[2].value);
  expect('2').toEqual(tokens[3].value);
  expect(')').toEqual(tokens[4].value);
  expect('(').toEqual(tokens[5].value);
  expect('y').toEqual(tokens[6].value);
  expect('+').toEqual(tokens[7].value);
  expect('3').toEqual(tokens[8].value);
  expect(')').toEqual(tokens[9].value);
});
