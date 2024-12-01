import { Dispatch, SetStateAction } from 'react';
import { ZodObject, ZodRawShape, ZodEffects } from 'zod';


const useValidation = (
  schema: ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  data: object,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  return (): boolean => {
    setErrors({});
    const validation = schema.safeParse(data);

    if (!validation.success) {
      const errMess: { [key: string]: string; } = {};
      validation.error.errors.forEach((err) => {
        errMess[err.path[0]] = err.message;
      });
      setErrors(errMess);
      return false;
    } else {
      return true;
    }
  };
};

export default useValidation;