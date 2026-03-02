import { useState, type ChangeEvent } from "react";

export const useForm = <T>(initialValues: T) => {

    const [values, setValues] = useState<T>(initialValues);
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setValues((prev) => ({...prev, [name]: value}));
    };

    const reset = () => {
        setValues(initialValues);
    }; 

    const setFormValues = (newValues: T) => {
        setValues(newValues);
    };

    return {values, handleChange, reset, setFormValues};

};
