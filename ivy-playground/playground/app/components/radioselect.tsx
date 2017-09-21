import React from "react"

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  selected: string
  name: string
  handleChange: (e) => undefined
}

export default function RadioSelect(props: Props) {
  return (
    <div className="radio">
      {props.options.map(option => {
        const checked = props.selected === option.value
        return (
          <label className="radio-inline" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={props.handleChange}
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
