# python-ast

Python (3) Parser for JavaScript/TypeScript, based on [antlr4ts](https://www.npmjs.com/package/antlr4ts), grammar taken from [antlr4's python grammar](https://github.com/antlr/grammars-v4/tree/master/python/python3-ts) too (so please report bugs and open pull requests related to grammars upstream)

[![npm version](https://img.shields.io/npm/v/python-ast.svg)](https://www.npmjs.com/package/python-ast)

<!-- [![Build Status](https://travis-ci.org/urish/java-ast.png?branch=master)](https://travis-ci.org/urish/java-ast) -->

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Singificantly based on [java-ast](https://github.com/urish/java-ast) - all credit to [Urish](https://github.com/urish)

## Usage Example

```typescript
import { parse, createVisitor } from 'python-ast';

const countMethods = (source: string) => {
  let ast = parse(source);

  return createVisitor({
    visitFuncdef: () => 1,
    defaultResult: () => 0,
    aggregateResult: (a, b) => a + b,
  }).visit(ast);
};

console.log(
  countMethods(`
class A:
    a: int

    def b(self):
        pass
    
    def c(self):
        pass
class B:
    def z(self, i):
        pass
  `),
); // logs 3
```
