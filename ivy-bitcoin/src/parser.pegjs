{
let BugError = require("./errors").BugError

let ast = require("./ast")

let types = require("./btc/types")
let instructions = require("./btc/instructions")

let createInstructionExpression = ast.createInstructionExpression
let createBinaryExpression = ast.createBinaryExpression
let createUnaryExpression = ast.createUnaryExpression

let isPrimitive = types.isPrimitive
let isHashTypeName = types.isHashTypeName
let typeNameToHashFunction = types.typeNameToHashFunction
let isDeclarableUnaryOperator = instructions.isDeclarableUnaryOperator
let isComparisonOperator = instructions.isComparisonOperator

function trimText(text) {
  return text.trim().replace("\n", "").replace(/[\s]+/g, " ")
}

}

Contract
  = __ "contract" _ name:Identifier "(" parameters:Parameters ")" __ "{" __ clauses:Clause+ "}" __ { return { type: "rawcontract", location: location(), name: name, parameters: parameters, clauses: clauses } }

Clause
  = "clause" _ name:Identifier "(" parameters:Parameters ")" __ "{" __ statements:Statement+ "}" __ { return { type: "clause", location: location(), name: name, parameters: parameters, statements: statements} }

Statement
  = Assertion / Unlock

Assertion
  = "verify" _ exp:Expression1 __ { return { type: "assertion", location: location(), expression: exp} }

Unlock
  = "unlock" _ value:VariableExpression __ { return { type: "unlock", location: location(), value: value } }


Expression1 "expression"
  = ComparisonExpression
  / Expression2

Expression2
  = CallExpression
  / Literal
  / VariableExpression
  / "(" exp:Expression1 ")" { return exp }

Literal
  = ListLiteral
  / BooleanLiteral
  / NumberLiteral


UnaryExpression
  = Expression2 / operator:UnaryOperator expression:UnaryExpression {return createUnaryExpression(operator, expression, location())}

MultiplicativeExpression
  = head:UnaryExpression tail:(__ MultiplicativeOperator __ UnaryExpression)* {return createBinaryExpression(head, tail)}

ArithmeticExpression
  = head:MultiplicativeExpression tail:(__ ArithmeticOperator __ MultiplicativeExpression)* {return createBinaryExpression(head, tail)}

BitwiseExpression
 = head:ArithmeticExpression tail:(__ BitwiseOperator __ ArithmeticExpression)* {return createBinaryExpression(head, tail)}

ComparisonExpression
= head:BitwiseExpression tail:(__ ComparisonOperator __ BitwiseExpression)* {return createBinaryExpression(head, tail)}

CallExpression
  = name:FunctionIdentifier "(" args:Expressions ")" { return createInstructionExpression("callExpression", location(), name, args) }

VariableExpression
  = identifier:Identifier { return { type: "variable", location: location(), name: identifier} }

Expressions "expressions"
  = __ first:Expression1 "," __ rest:Expressions { rest.unshift(first); return rest }
  / exp:Expression1 __ { return [exp] }
  / Nothing __ { return [] }

ListLiteral "listLiteral"
  = "[" values:Expressions "]" { return { type: "listLiteral", location: location(), text: text(), values: values } }

BooleanLiteral "booleanLiteral"
  = "true" / "false" { return { type: "literal", literalType: "boolean", location: location(), text: text(), value: text() } }

Identifiers "identifiers"
  = first:Identifier "," __ rest:Identifiers { rest.unshift(first); return rest }
  / Identifier { return [text()] }
  / Nothing

Parameters "parameters"
  = __ first:Parameter "," __ rest:Parameters { rest.unshift(first); return rest }
  / param:Parameter __ { return [param] }
  / Nothing __ { return [] }

Parameter "parameter"
  = id:Identifier __ ":" __ type:Type { return { type: "parameter", location: location(), itemType: type, name: id } }

Type "type"
  = PrimitiveType / HashType

PrimitiveType
  = (id:Identifier & { return isPrimitive(id) }) { return text() }

HashFunctionType =
  (hashType:Identifier & { return isHashTypeName(hashType) }) { return text() }

HashType
  = hashFunctionType:HashFunctionType "(" inputType:HashableType ")" { return { type: "hashType",
                                                                                hashFunction: typeNameToHashFunction(hashFunctionType),
                                                                                inputType: inputType
                                                                               } }

BitwiseOperator
  = "^" / "&" / "|"

ArithmeticOperator
  = "+" / "-"

MultiplicativeOperator
  = "/" / "%"

UnaryOperator
  = "-" / "!"

ComparisonOperator
  = "==" / "!=" / "<" / ">" / "<=" / ">="

HashableType
  = "Bytes" / "PublicKey" / HashType

NumberLiteral "integer"
  = "0" { return { type: "literal", literalType: "Integer", location: location(), value: text() } }
  / [1-9][0-9]* { return { type: "literal", literalType: "Integer", location: location(), value: text() } }

Identifier "identifier"
  = [_A-Za-z] [_A-Za-z0-9]* { return text() }

FunctionIdentifier "functionIdentifier"
  = Identifier "." Identifier { return text() }
  / Identifier

Nothing "nothing"
  = __ { return [] }

__ "optional whitespace"
  = _?

_ "whitespace"
  = [ \t\n\r;]+ (Comment)? __
  / Comment __

Comment "comment"
  = "//" [^\n\r]* /
    "/*" (!"*/" .)* "*/"

Operator
  = [^ \t\n\rA-Za-z1-9\[\]\(\)]+ { return text() }
