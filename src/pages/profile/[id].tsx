import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import React from "react";

import MainContainer from "../../components/profilePage/MainContainer";

type Props = {};

function ProfilePage({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Skimmit</title>
        <meta name="description" content="MITxPRO Student Group Project" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <MainContainer />
    </motion.div>
  );
}

export default ProfilePage;
