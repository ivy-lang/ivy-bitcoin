{
let BugError = require("./errors").BugError

let ast = require("./ast")

let types = require("./btc/types")
let instructions = require("./btc/instructions")

let createInstructionExpression = ast.createInstructionExpression
let createBinaryExpression = ast.createBinaryExpression

let isPrimitive = types.isPrimitive
let isHashTypeName = types.isHashTypeName
let typeNameToHashFunction = types.typeNameToHashFunction
let isDeclarableUnaryOperator = instructions.isDeclarableUnaryOperator
let isComparisonOperator = instructions.isComparisonOperator
let isArithmeticOperator = instructions.isArithmeticOperator

function trimText(text) {
  return text.trim().replace("\n", "").replace(/[\s]+/g, " ")
}

}

Contract
  = __ "contract" _ name:Identifier "(" parameters:Parameters ")" __ "{" __ clauses:Clause+ "}" __ { return { type: "rawcontract", location: location(), name: name, parameters: parameters, clauses: clauses, imports: imports } }

Clause
  = "clause" _ name:Identifier "(" parameters:Parameters ")" __ "{" __ statements:Statement+ "}" __ { return { type: "clause", location: location(), name: name, parameters: parameters, statements: statements} }

Statement
  = Assertion / Unlock

Assertion
  = "verify" _ exp:Expression1 __ { return { type: "assertion", location: location(), expression: exp} }

Unlock
  = "unlock" _ value:VariableExpression __ { return { type: "unlock", location: location(), value: value } }

// need to handle precedence

Expression1 "expression"
  = ComparisonExpression
  / Expression2

Expression2
  = BinaryExpression
  / Expression3

Expression3
  = UnaryExpression
  / Expression4

Expression4
  = CallExpression
  / Literal
  / VariableExpression
  / "(" exp:Expression1 ")" { return exp }

Literal
  = ListLiteral
  / IntegerLiteral
  / BooleanLiteral

ComparisonExpression // not associative
  = left:Expression2 __ operator:ComparisonOperator __ right:Expression2 { return createBinaryExpression([{left: left, operator: operator}], right) }

ComparisonOperator
  = (operator:Operator & { return isComparisonOperator(operator) }) { return text() }

BinaryExpression // left associative
  = partials:PartialBinaryExpression+ right:Expression3 { return createBinaryExpression(partials, right) }

PartialBinaryExpression
  = left:Expression3 __ operator:BinaryOperator __ { return { type: "partial", location: location(), left: left, operator: operator } }

BinaryOperator
  = (operator:Operator & { return isArithmeticOperator(operator) }) { return text() }

CallExpression
  = name:FunctionIdentifier "(" args:Expressions ")" { return createInstructionExpression("callExpression", location(), name, args) }

UnaryExpression
  = operator:Operator arg:Expression4 { return createInstructionExpression("unaryExpression", location(), operator, [arg]) }

UnaryOperator
  = (operator:Operator & { isDeclarableUnaryOperator(operator) }) { return text() }

VariableExpression
  = identifier:Identifier { return { type: "variable", location: location(), name: identifier} }

Expressions "expressions"
  = __ first:Expression1 "," __ rest:Expressions { rest.unshift(first); return rest }
  / exp:Expression1 __ { return [exp] }
  / Nothing __ { return [] }

ListLiteral "listLiteral"
  = "[" values:Expressions "]" { return { type: "listLiteral", location: location(), text: text(), values: values } }

IntegerLiteral "integer"
  = [-]?[0-9]+ { return { type: "literal", literalType: "Integer", location: location(), value: text() } }

BooleanLiteral "boolean"
  = ("true" / "false") { return { type: "literal", literalType: "Boolean", location: location(), value: text() } }

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

HashableType
  = "Bytes" / "PublicKey" / HashType

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
