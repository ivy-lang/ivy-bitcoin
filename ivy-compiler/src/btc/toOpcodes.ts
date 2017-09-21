import { FinalOperation } from "../intermediate"

import { getOpcodes } from "./instructions"

export default function toOpcodes(ops: FinalOperation[]): string[] {
  const newOps: string[] = []

  const emit = (o: string) => {
    newOps.push(o)
  }

  for (const op of ops) {
    switch (op.type) {
      case "pick": {
        emit(op.depth.toString())
        emit("PICK")
        break
      }
      case "roll": {
        emit(op.depth.toString())
        emit("ROLL")
        break
      }
      case "instructionOp": {
        const instructionOpcodes = getOpcodes(op.expression.instruction)
        instructionOpcodes.map(emit)
        break
      }
      case "verify": {
        emit("VERIFY")
        break
      }
      case "push": {
        if (op.literalType === "Boolean") {
          emit(op.value === "true" ? "1" : "0")
        } else {
          emit(op.value)
        }
        break
      }
      case "beginIf": {
        emit("IF")
        break
      }
      case "else": {
        emit("ELSE")
        break
      }
      case "endIf": {
        emit("ENDIF")
        break
      }
      case "pushParameter": {
        emit("PUSH(" + op.name + ")")
        break
      }
      case "drop": {
        emit("DROP")
      }
    }
  }

  return newOps
}
