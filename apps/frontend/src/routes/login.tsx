import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginInput, userLoginSchema } from '@hospital/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../component/form/form-input';
import { useLoginMutation } from '../component/user-query';
import { HOSPITAL_ID } from '../env';
import { useAccountConfig } from '../provider/account/use-account-config';

const getErrorMessage = (error: any) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An error occurred';
};

export const Component = () => {
  const formProvider = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  });
  const { data } = useAccountConfig();
  const { mutateAsync, isPending, error } = useLoginMutation({
    onSuccess: () => {
      window.location.href = '/';
    },
  });
  return (
    <div className="flex flex-col gap-16 md:flex-row md:gap-0 h-screen">
      {/* Left Side (Aesthetics and Logo) */}
      <div className="bg-blue-100 flex flex-col items-center justify-center w-full md:w-1/2 p-6">
        <img
          src={data?.hospitalImg}
          alt={data?.hospitalName}
          className="mb-4 w-2/3"
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to HMS</h1>
          <p className="mt-2 text-gray-400">Built in ❤️ with CK</p>
        </div>
      </div>

      {/* Right Side (Login Form) */}
      <div className="bg-white flex items-center justify-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-sm">
          <FormProvider {...formProvider}>
            <form
              onSubmit={formProvider.handleSubmit((data) => {
                mutateAsync({ ...data, hospitalId: HOSPITAL_ID });
              })}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
              <div className="mb-4">
                <FormInput<UserLoginInput>
                  labelName="User Id"
                  placeholder="Enter your user id"
                  id="email"
                  autoComplete="off"
                />
              </div>
              <div className="mb-6">
                <FormInput<UserLoginInput>
                  labelName="Password"
                  placeholder="Password"
                  id="password"
                  autoComplete="off"
                  type="password"
                />
              </div>
              {error ? (
                <div className="text-red-500 text-sm mb-4">
                  {getErrorMessage(error)}
                </div>
              ) : null}
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isPending}
              >
                Login
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
