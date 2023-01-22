import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import { Navbar } from "../../components/Navbar";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Profile_Individual from "@/components/Project/Profile_Individual";
import { Stack } from "@mui/material";

// Individual project page
export default function Volunteer_Id({ user, userProfile }) {
  const router = useRouter()
  const { volunteer_id } = router.query

  const [volunteer, setVolunteer] = useState([])
  const [projects, setProjects] = useState()
  const supabase = getSupabase(userProfile.accessToken)

  useEffect(() => {
    const fetchVolunteer = async () => {
      const { data } = await supabase.from('user').select('*').eq('id', volunteer_id)
      setVolunteer(data[0])
    }

    const fetchProjects = async () => {
      const { data } = await supabase.from('applicants').select('*').eq('user_id', volunteer_id)
      console.log(data)
      setProjects(data)
    }

    fetchProjects();
    fetchVolunteer();
  }, [])

  return (
    <>
      <Head>
        <title>{user.name}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userProfile={userProfile} />
      <main className={styles.main}>
        <Box>
          <h1>Volunteer ID: {volunteer_id}</h1>
          {volunteer != undefined ?
            <Box>
              <Box className={styles.volunteer_id_about}>
                <h3>Name: {volunteer.name}</h3>
                <h4>About: {volunteer.about}</h4>
              </Box>
              <Box className={styles.volunteer_id_events}>
                <h3>I am volunteering at the following events:</h3>
                <Stack spacing={1}>
                  {projects?.length > 0 ? projects.map((project, item) => (

                    <Profile_Individual
                      key={item}
                      project_id={project.project_id}
                      userProfile={userProfile}
                    />

                  )) : <h4>None</h4>}
                </Stack>
              </Box>
            </Box> :
            <h3>No volunteer for this ID was found...</h3>
          }
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

    const { data: projects } = await supabase.from('project').select('*');

    try {
      // if no user has user_id of sub, create new user
      const { data } = await supabase.from('user').upsert({ user_id: sub }, { onConflict: 'user_id' }).select()

      userProfile = data[0];
    }
    catch (e) {
      console.error(e.message)
    }

    return {
      props: { projects, userProfile },
    };
  },
});