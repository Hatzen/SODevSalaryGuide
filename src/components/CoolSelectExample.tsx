import React from 'react'
import CoolSelect from './CoolSelect'

const ExampleUsage = (): JSX.Element => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null)
  
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]
  
  return (
    <div>
      <h2>Cool Select Example</h2>
      <CoolSelect
        label="Select an option"
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        helperText="Choose an option from the dropdown"
      />
      <p>Selected value: {selectedValue || 'None'}</p>
    </div>
  )
}

export default ExampleUsage