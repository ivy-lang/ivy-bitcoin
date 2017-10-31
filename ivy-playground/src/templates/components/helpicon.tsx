import React from "react"
import ReactTooltip from "react-tooltip"

export const HelpIcon = (props: { identifier: string }) => {
  const iconId = props.identifier + "-question-mark"
  return (
    <a data-tip data-for={iconId}>
      <small>
        <span
          className="glyphicon glyphicon-question-sign"
          aria-hidden="true"
        />
      </small>
    </a>
  )
}

export const HelpMessage = (props: { identifier: string; message: string }) => {
  const iconId = props.identifier + "-question-mark"
  return (
    <ReactTooltip id={iconId} place="right" effect="solid">
      <span>{props.message}</span>
    </ReactTooltip>
  )
}
