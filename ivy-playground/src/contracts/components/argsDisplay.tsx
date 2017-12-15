// external imports
import { typeToString } from "ivy-bitcoin"
import React from "react"
import { connect } from "react-redux"
import {
  computeDataForInput,
  getGenerateBytesInputValue,
  getParameterIdentifier
} from "../../inputs/data"
import {
  BlockheightTimeInput,
  BlocksDurationInput,
  BooleanInput,
  BytesInput,
  ComplexInput,
  GenerateBytesInput,
  GenerateHashInput,
  GeneratePublicKeyInput,
  getChild,
  HashInput,
  Input,
  InputType,
  NumberInput,
  ParameterInput,
  ProvideBytesInput,
  ProvideHashInput,
  ProvidePublicKeyInput,
  PublicKeyInput,
  SecondsDurationInput,
  TimeInput,
  TimestampTimeInput,
  ValueInput
} from "../../inputs/types"
import { getInputMap, getInputSelector, getParameterIds } from "../selectors"

function getChildWidget(input: ComplexInput) {
  return getWidget(getChild(input))
}

function ParameterWidget(props: { input: ParameterInput }) {
  // handle the fact that unknown input types end up here
  if (props.input.valueType === undefined) {
    throw new Error("invalid input for ParameterWidget: " + props.input.name)
  }
  return (
    <div key={props.input.name}>
      <label>
        {getParameterIdentifier(props.input)}:
        <span className="type-label">
          {typeToString(props.input.valueType)}
        </span>
      </label>
      <div>{getChildWidget(props.input)}</div>
    </div>
  )
}

function GeneratePublicKeyWidget(props: {
  input: GeneratePublicKeyInput
  computedValue: string
}) {
  return (
    <div>
      <pre>{props.computedValue}</pre>
      <div className="nested">
        <div className="description">derived from:</div>
        <label className="type-label">PrivateKey</label>
        {getChildWidget(props.input)}
      </div>
    </div>
  )
}

// function ValueWidget(props: { input: ValueInput }) {
//   return <div>
//     {getWidget(props.input.name + ".amountInput")}
//   </div>
// }

// function AmountWidget(props: { input: Input }) {
// return <div className="form-group">
//   <div className="input-group">
//     <div className="input-group-addon">Amount</div>
//     <input type="text" className="form-control" value={props.input.value} disabled />
//   </div>
// </div>
// }

function TextWidget(props: { input: Input }) {
  return (
    <div>
      <pre>{props.input.value}</pre>
    </div>
  )
}

function GenerateHashWidget(props: {
  input: GenerateHashInput
  computedValue: string
}) {
  return (
    <div>
      <pre>{props.computedValue}</pre>
      <div className="nested">
        <div className="description">
          {props.input.hashType.hashFunction} of:
        </div>
        <label className="type-label">
          {typeToString(props.input.hashType.inputType)}
        </label>
        {getChildWidget(props.input)}
      </div>
    </div>
  )
}

function ParentWidget(props: { input: ComplexInput }) {
  return getChildWidget(props.input)
}

function BlocksDurationWidget(props: { input: BlocksDurationInput }) {
  return <pre>{props.input.value}</pre>
}

function SecondsDurationWidget(props: { input: SecondsDurationInput }) {
  const numIncrements = parseInt(props.input.value, 10)
  return <div>{numIncrements * 512} seconds</div>
}

function BlockheightTimeWidget(props: { input: BlockheightTimeInput }) {
  return <pre>{props.input.value}</pre>
}

function TimestampTimeWidget(props: { input: TimestampTimeInput }) {
  return <pre>{props.input.value}</pre> // super lazy for now!
}

function GenerateBytesWidget(props: { input: GenerateBytesInput }) {
  return (
    <div>
      <pre>{getGenerateBytesInputValue(props.input)}</pre>
    </div>
  )
}

function ValueWidget(props: { input: ValueInput }) {
  return (
    <div>
      <pre>{props.input.value} BTC</pre>
    </div>
  )
}

function getWidgetType(
  type: InputType
): ((props: { input: Input }) => JSX.Element) {
  switch (type) {
    case "publicKeyInput":
    case "bytesInput":
    case "hashInput":
    case "durationInput":
    case "timeInput":
      return ParentWidget
    case "generatePublicKeyInput":
      return GeneratePublicKeyWidget
    case "generateHashInput":
      return GenerateHashWidget
    case "blocksDurationInput":
      return BlocksDurationWidget
    case "secondsDurationInput":
      return SecondsDurationWidget
    case "timestampTimeInput":
      return TimestampTimeWidget
    case "blockheightTimeInput":
      return BlockheightTimeWidget
    case "generateBytesInput":
      return GenerateBytesWidget
    case "valueInput":
      return ValueWidget
    case "numberInput":
    case "booleanInput":
    case "provideBytesInput":
    case "providePublicKeyInput":
    case "provideHashInput":
    case "generatePrivateKeyInput":
    case "providePrivateKeyInput":
      return TextWidget
    default:
      return ParameterWidget
  }
}

function getWidget(id: string): JSX.Element {
  const type = id.split(".").pop() as InputType
  let widgetTypeConnected = connect(state => ({
    input: getInputSelector(id)(state)
  }))(getWidgetType(type))
  if (type === "generateHashInput" || type === "generatePublicKeyInput") {
    widgetTypeConnected = connect(state => {
      return {
        input: getInputSelector(id)(state),
        computedValue: computeDataForInput(id, getInputMap(state))
      }
    })(getWidgetType(type))
  }
  return React.createElement(widgetTypeConnected, {
    key: "connect(" + id + ")",
    id
  })
}
function SpendInputsUnconnected(props: { spendInputIds: string[] }) {
  if (props.spendInputIds.length === 0) {
    return <div />
  }
  const spendInputWidgets = props.spendInputIds.map(id => {
    return (
      <div key={id} className="argument">
        {getWidget(id)}
      </div>
    )
  })
  return (
    <section style={{ wordBreak: "break-all" }}>
      <h4>Contract Arguments</h4>
      <form className="form">{spendInputWidgets}</form>
    </section>
  )
}

const SpendInputs = connect(state => ({
  spendInputIds: getParameterIds(state)
}))(SpendInputsUnconnected)

export default SpendInputs
