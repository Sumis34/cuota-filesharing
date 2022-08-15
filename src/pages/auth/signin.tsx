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
      <main className="relative z-10 pt-32">
        {Object.values(providers).map((provider) =>
          provider.name === "Google" ? (
            <GoogleButton
              onClick={() => signIn(provider.id)}
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
        <Button onClick={() => signOut()}>UnOk</Button>
        {JSON.stringify(data)}
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
