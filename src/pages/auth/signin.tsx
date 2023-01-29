import { GetServerSideProps } from "next";
import { Provider } from "next-auth/providers";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import GoogleButton from "../../components/GoogleButton";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { NextPageWithLayout } from "../_app";

const Login: NextPageWithLayout<{ providers: Provider[] }> = ({
  providers,
}) => {
  const { data, status } = useSession();

  useEffect(() => {
    console.log(data, status);
  }, [data, status]);

  return (
    <div className="my-32 relative">
      <main className="relative z-10 pt-32 flex justify-center items-center">
        <div className="text-center w-80 flex-col flex items-center p-10">
          <h2>Sign in to Cuota</h2>
          <p className="text-sm opacity-70 mt-1">
            Sing up or login to Cuota with the following providers
          </p>
          <div className="mt-4">
            {Object.values(providers).map((provider) =>
              provider.name === "Google" ? (
                <GoogleButton
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  key={provider.name}
                />
              ) : (
                <div key={provider.name}>
                  <button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <div className="absolute h-screen inset-y-0 pointer-events-none">
          <img
            src="/assets/shapes/grid.svg"
            className="relative top-[-15%] left-[60%] w-[130vh] rotate-[41deg]"
            alt="background"
          />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

Login.getLayout = getDefaultLayout();

export default Login;
