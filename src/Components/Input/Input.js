import React from 'react';
import InputContainer from '../InputContainer/InputContainer';
import classes from './Input.module.css';
function Input({ label, type, defaultValue, onChange, onBlur, name, error}, ref) {
  const getErrorMessage = () => {
    if(!error) return ;
    if(error.message) return error.message;
    switch(error.type){
        case 'required':
            return 'This field is required';
        case 'minLength':
            return 'Field is too short';
        case 'min':
            return "Must be larger than 1";
        case 'max':
            return "Must be smaller than 5";
        default:
            return '*';
    }
  }

//   return (
//     <InputContainer label={label}>
//       <input
//         defaultValue={defaultValue}
//         className={classes.input}
//         type={type}
//         placeholder={label}
//         ref={ref}
//         name={name}
//         onChange={onChange}
//         onBlur={onBlur}
//       />
//       {error && <div className={classes.error}>{getErrorMessage()}</div>}
//     </InputContainer>
//  );

  return (
    <InputContainer label={label}>
      {type !== "select" ? (
        <input
          defaultValue={defaultValue}
          className={classes.input}
          type={type}
          placeholder={label}
          ref={ref}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <select
          defaultValue={defaultValue}
          className={classes.input}
          ref={ref}
          name={name} 
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="">Select Tags</option>
          <option value="Appertizer & Salad">Appertizer & Salad</option>
          <option value="Pizza">Pizza</option>
          <option value="Pasta & Main Dishes">Pasta & Main Dishes</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>
      )}
      {error && <div className={classes.error}>{getErrorMessage()}</div>}
    </InputContainer>
  );

}

export default React.forwardRef(Input);

