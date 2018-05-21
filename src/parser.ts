import { Lexer, TokenType } from './lexer';

enum Operator {
  add,
  subtract,
  multiply,
  divide,
  power,
}

interface NodeVisitor<T> {

  visit(node: MathNode): T;

  visitLiteral(literal: LiteralNode): T;

  visitIdentifier(identifier: IdentifierNode): T;

  visitExpression(expression: ExpressionNode): T;

  visitBinaryExpression(binaryExpression: BinaryExpressionNode): T;

}

interface MathNode {
  accept(visitor: NodeVisitor<void>): void;
}

class ExpressionNode implements MathNode {
  body: Node;

  accept(visitor: NodeVisitor<void>): void {
    visitor.visitExpression(this);
  }
}

class BinaryExpressionNode implements MathNode {
  left: MathNode;
  right: MathNode;
  operator: Operator;

  accept(visitor: NodeVisitor<void>): void {
    visitor.visitBinaryExpression(this);
  }
}

class IdentifierNode implements MathNode {
  name: string;

  accept(visitor: NodeVisitor<void>): void {
    visitor.visitIdentifier(this);
  }
}

class LiteralNode implements MathNode{
  value: string;

  accept(visitor: NodeVisitor<void>): void {
    visitor.visitLiteral(this);
  }
}

// type ParserResult = {

// };

class ExpressionBuilder {

  sum(left: MathNode, right: MathNode) {
    const binary =  new BinaryExpressionNode();
    binary.left = left;
    binary.right = right;
    binary.operator = Operator.add;
    return binary;
  }
}

export class Parser {
  index = 0;

  parseInside() {
    //

  }

  parse(input: string) {
    const lexer = new Lexer();
    const { tokens, errors } = lexer.scan(input);

    if(errors && errors.length > 0) {
      // tslint:disable-next-line:no-console
      console.log('Errors!!!');
    }

    for (const token of tokens) {
      switch (token.type) {
        case TokenType.Identifier:

          break;
        case TokenType.Literal:

          break;
        case TokenType.Operator:

          break;
        case TokenType.Grouping:

          break;
        default:
          throw new Error('Invalid token');
      }

    }
  }
}
