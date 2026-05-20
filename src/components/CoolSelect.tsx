import React from 'react'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material'
import { styled } from '@mui/material/styles'

interface CoolSelectProps<T> {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T | null) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

// Styled components for a cool look
const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 120,
    margin: 8,
    '& .MuiSelect-select': {
        padding: '12px 16px',
        fontSize: 16,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        '&:focus': {
            background: 'linear-gradient(135deg, #e0e5ec 0%, #a9b6d2 100%)',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: 8,
            borderColor: '#ddd',
        },
        '&:hover fieldset': {
            borderColor: '#bbb',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
        },
    },
}))

const StyledSelect = styled(Select)(({ theme }) => ({
    '&': {
        padding: 0,
    },
    '& .MuiSelect-icon': {
        color: '#1976d2',
    },
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '12px 16px',
    fontSize: 15,
    '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
}))

const CoolSelect = <T extends string | number | boolean>({
    label,
    options,
    value,
    onChange,
    helperText,
    error,
    disabled,
}: CoolSelectProps<T>): JSX.Element => {
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const newValue = event.target.value as T | null
        onChange(newValue)
    }

    return (
        <StyledFormControl
            variant="outlined"
            fullWidth
            error={error}
            disabled={disabled}
        >
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <StyledSelect
                labelId={`${label}-label`}
                id={`${label}-select`}
                value={value}
                label={label}
                onChange={handleChange}
                disabled={disabled}
            >
                {options.map((option) => (
                    <StyledMenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelect>
            {helperText && (
                <FormHelperText error={error}>
                    {helperText}
                </FormHelperText>
            )}
        </StyledFormControl>
    )
}

export default CoolSelect