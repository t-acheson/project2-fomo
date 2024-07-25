export const customTagStyles = {
    control: (base) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      '&:hover': { border: 'none' }
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#ffce97',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#333',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#333',
      ':hover': {
        backgroundColor: '#ff8800',
        color: '#000',
      },
    }),
    option: (styles) => ({
      ...styles,
      color: '#333',
    }),
  };
  