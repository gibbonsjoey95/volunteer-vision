import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../utils/supabase";
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Navbar } from "../components/Navbar";
import { Signup } from "../components/Signup/Signup";
import Image from "next/image";
import { Box } from "@mui/system";

import { Navbar } from '../components/Navbar';
import { Signup } from '../components/Signup/Signup';

export default function Home({ userProfile }) {

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar userProfile={userProfile} />
      <main className={styles.main}>
        <Image
          width={700}
          height={450}
          src="/integration.jpg"
          quality={75}
          priority
        />
        <Box my={2}>
          {!userProfile.role
            ? <>
              <h1>Create your account</h1>
              <Signup userProfile={userProfile} />
            </>
          ) : (
            <>
              <h1>Volunteer Vision</h1>
              <h2>Welcome, {userProfile.name}!</h2>
            </>}
        </Box>
      </main>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const {
      user: { accessToken, sub },
    } = await getSession(req, res);

    const supabase = getSupabase(accessToken);
    let userProfile = null;

    try {
      // if no user has user_id of sub, create new user
      const { data } = await supabase
        .from('user')
        .upsert({ user_id: sub }, { onConflict: 'user_id' })
        .select();

      userProfile = data[0];
    } catch (e) {
      console.error(e.message);
    }

    return {
      props: { userProfile },
    };
  },
});
