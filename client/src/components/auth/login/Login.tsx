import { useEffect, useState } from "react";
import { ButtonForm } from "@/components/Buttons";
import { NavLink } from "react-router-dom";
import { Input } from "../../Input";
import { useFormik } from "formik";
import { loginSchema } from "./schema";
import { Auth } from "@/services/auth";
import { useAuth } from "@/components/hooks/useAuth";

const initialValues = {
  email: '',
  password: '',
}
export default function Login() {
  const {login} = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues,
    validateOnChange: false,
    validationSchema: loginSchema(),
    onSubmit: async (values) => {
      setLoading(true);
      const [error, data] = await Auth.login(values);

      if (error) {
        setError(error.message);
      }
      if (data) {
        Auth.AccessToken.set(data.token);
        await login(data.token);
      }
      setLoading(false)
    }
  });

  const {errors, values} = formik;

  const handleChangeText = ( value: string, field: keyof typeof initialValues) => {
    setError('');
    formik.setFieldValue(field, value);
  }

  const handleSubmit = () => {
    formik.handleSubmit();
  }

  useEffect(() => {
    if (errors.email) return setError(errors.email);

    if (errors.email) return setError(errors.email);

    if (errors.password) {
      return setError(errors.password)
    }
  }, [errors.email, errors.password])

  return (
    <form>
      <div className='grid p-6 gap-5 w-96 rounded-2xl bg-[#FFCB71] '>
        <div className=' grid gap-5 w-full'>
          <Input
            type='email'
            placeholder='Email'
            value={values.email}
            onChange={({target}) => handleChangeText(target.value, 'email')}
          />
          <Input
            type='password'
            placeholder='Password'
            value={values.password}
            onChange={({target}) => handleChangeText(target.value, 'password')}
          />
        </div>
        <p className='text-red-500 p-1 rounded-lg'>
          {error}
        </p>
        <div className='grid gap-1 '>
          <ButtonForm
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </ButtonForm>
          <div className='flex gap-1 justify-center w-full text-zinc-700 font-bold'>
            <p>Dont have Account?</p>
            <NavLink to='/signup'>Signup</NavLink>
          </div>
        </div>
      </div>
      {/* <div className='text-blue-600 font-bold'>
        <p>Validacion</p>
        <p>{user.username}</p>

        <p>{user.password}</p>
      </div> */}
    </form>
  );
}