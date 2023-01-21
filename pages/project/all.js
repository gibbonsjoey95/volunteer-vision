import Head from "next/head";
import styles from "@/styles/Project.module.css";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabase";
import { Navbar } from "../components/navbar";
import { Box } from "@mui/material";
import Link from "next/link";
import { Stack } from "@mui/system";
import All_Individual from "../components/Project/All_Individual";

// All projects
const all = ({ user, projects }) => {
  return (
    <>
      <Head>
        <title>All Projects</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1>All Projects</h1>
        <Box className={styles.all_projects_box}>
          <Stack spacing={2} my={2}>
          {projects?.length > 0 ? (
            projects.map((project) => (
              <All_Individual 
                key={project.project_id}
                project_id={project.project_id}
                name={project.name}
                description={project.description}
              />
            ))
          ) : (
            <p>No Projects Available...</p>
          )}
          </Stack>
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const {
      user: { accessToken },
    } = await getSession(req, res);

    const supabase = getSupabase(accessToken);

    const { data: projects } = await supabase.from('project').select('*');

    return {
      props: { projects },
    };
  },
});

export default all;
