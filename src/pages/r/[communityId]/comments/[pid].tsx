import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Post } from "../../../../atoms/PostAtom";
import About from "../../../../components/Community/About";
import PageContent from "../../../../components/Layout/PageContent";
import Comments from "../../../../components/posts/Comments/Comments";
import PostItem from "../../../../components/posts/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { communityStateValue } = useCommunityData();
  const { postStateValue, setPostStateValue, onVote, onDeletePost } =
    usePosts();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {}
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

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
      <PageContent>
        <>
          {postStateValue.selectedPost && (
            <PostItem
              post={postStateValue.selectedPost}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find(
                  (item) => item.postId === postStateValue.selectedPost?.id
                )?.voteValue
              }
              userIsCreator={
                user?.uid === postStateValue.selectedPost?.creatorId
              }
            />
          )}
          <Comments
            user={user as User}
            selectedPost={postStateValue.selectedPost}
            communityId={postStateValue.selectedPost?.communityId as string}
          />
        </>
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContent>
    </motion.div>
  );
};
export default PostPage;
