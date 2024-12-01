const useInputChange = <T extends Record<string, string>>(
  key: string,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrorsForm: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  errorsForm: Record<string, string>,
  cb: () => void = () => { }
) => {
  return (value: string) => {
    // Update the form state
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear the error message if the user corrects the input
    if (errorsForm[key]) {
      setErrorsForm((prev) => ({
        ...prev,
        [key]: "",
      }));
    }

    if (typeof cb === 'function') cb();
  };
};

export default useInputChange;