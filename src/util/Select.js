export const customDarkStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--dark-gray)',
      border: '0',
      color: 'var(--white)',
      minHeight: '38px',
      padding: '0',
      boxShadow: state.isFocused ? '0 0 0 1px var(--white)' : 'none',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 8px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--dark-gray)',
      color: 'var(--white)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--light-gray)'
        : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : 'var(--dark-gray)',
      color: 'var(--white)',
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--light-gray)',
      color: 'var(--white)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--white)',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--white)',
      ':hover': {
        backgroundColor: 'var(--white)',
        color: 'var(--dark-gray)',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--white)',
      margin: '0',
      padding: '0'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--white)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '38px',
    })
};
  