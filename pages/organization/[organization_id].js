import Head from "next/head";
import styles from "@/styles/Organization.module.css";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabase";
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Navbar } from "../../components/Navbar";
import Link from 'next/link';

// Individual organization page
export default function organization_id({ userProfile }) {
  const router = useRouter()
  const { organization_id } = router.query

  const [org, setOrg] = useState([]);
  const [projects, setProjects] = useState([]);
  const supabase = getSupabase()

  useEffect(() => {
    const fetchOrg = async () => {
      const { data } = await supabase.from('user').select('*').eq('id', organization_id);
      setOrg(data[0]);
      console.log(data[0]);
    }

    const fetchProjects = async () => {
      const { data } = await supabase.from('').select('*').eq('user_id', organization_id);
      console.log(data)
      setProjects(data)
    }

    fetchOrg()
    // fetchProjects()
  }, [])

  return (

    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userProfile={userProfile} />
      <main className={styles.main}>
        {org != undefined
          ? <>
            <h1>{org.name}</h1>
            <p>{org.about}</p>
            <Link href={encodeURI(org.website)}>Vist the org.name website!</Link>
            <div>
              <h3>{`View ${org.name}'s current Projects`}</h3>
              {projects != undefined
                ? <p>projects mapped over</p>
                : null
              }
            </div>
          </>
          : null
        }
      </main>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const {
      user: { accessToken, sub },
    } = await getSession(req, res)

    const supabase = getSupabase(accessToken)
    let userProfile = null;

    try {
      // if no user has user_id of sub, create new user
      const { data } = await supabase.from('user').upsert({ user_id: sub }, { onConflict: 'user_id' }).select()

      userProfile = data[0];
    }
    catch (e) {
      console.error(e.message)
    }

    return {
      props: { userProfile },
    }
  },
});