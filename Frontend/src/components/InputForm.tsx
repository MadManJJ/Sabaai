import React from 'react'

const InputForm = ({onInputChange, labelText} : {onInputChange:Function, labelText:string}) => {
  return (
    <div>
        <label htmlFor={labelText} className="block text-sm font-medium text-emerald-700">
            {labelText}
        </label>
        <div className="mt-1">
        <input
            id={labelText}
            name={labelText}
            type={labelText.toLowerCase().includes('password') ? 'password' : 'text'}
            required
            className="block w-full rounded-lg border border-emerald-300 px-3 py-2 text-emerald-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            onChange={(e) => onInputChange(e.target.value)}
        />
        </div>
    </div>
  )
}

export default InputForm