import React from 'react'
import { Radio } from '@mantine/core'

const CustomRadioButton = ({ name, id, onClick, htmlFor, className, btnText }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={className}
        >
            <Radio
                name={name}
                // className=
                id={id}
                onClick={() => onClick()}
            />
            {btnText}
        </label>
    )
}

export default CustomRadioButton