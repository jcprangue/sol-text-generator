import { createContext, useContext, useMemo, useEffect, useState } from "react";
import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAvatarUrl } from "src/functions/getAvatarUrl";
import { getRandomName } from "src/functions/getRandomName";
import idl from "src/idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const BlogContext = createContext();

const PROGRAM_KEY = new PublicKey(idl.metadata.address)

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider = ({ children }) => {
  // const user = {
  //   name: "Dog",
  //   avatar: "https://img.freepik.com/free-photo/puppy-that-is-walking-snow_1340-37228.jpg"
  // }

  const [user, setUser] = useState({})
  const [initialize, setInitialize] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [lastPostId, setLastPostId] = useState(0)
  const [posts, setPosts] = useState([])

  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions)
      return new anchor.Program(idl,PROGRAM_KEY,provider)
    }
  },[connection,anchorWallet])

  useEffect(() => {
    const start = async () => {
      if (program && publicKey) {
        try {
          const [userPda] = await findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
          const user = await program.account.userAccount.fetch(userPda)
          if (user) {
            setInitialize(true)
            user.avatar = "https://img.freepik.com/free-photo/puppy-that-is-walking-snow_1340-37228.jpg"
            setUser(user)
            setLastPostId(user.lastPostId)

            const postAccount = await program.account.textAccount.all()
            setPosts(postAccount);
            console.log(postAccount)
          }
        } catch (error) {
          console.log("No user")
          setInitialize(false);
        } finally {

        }
      }
      
    }

    start()
  }, [program,publicKey,transactionPending])
  
  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true)
        const name = getRandomName()
        const [userPda] = await findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
       
        await program.methods
          .initUser(name)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId
          })
          .rpc()
        
        setInitialize(true)
      } catch (error) {
        console.log(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  const createPost = async (content) => {
    if (program && publicKey) {
      setTransactionPending(true)
      try {
        const [userPda] = await findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
        const [postPda] = await findProgramAddressSync([utf8.encode('post'),publicKey.toBuffer(),Uint8Array.from([lastPostId])],program.programId)
      
        await program.methods
          .generateText(content)
          .accounts({
            textAccount: postPda,
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId
          })
          .rpc()
        
        setShowModal(false)
        
      } catch (error) {
        console.log(error)

      } finally {
        setTransactionPending(false)
      }
    }
  }

  return (
    <BlogContext.Provider
      value={{
        user,
        initialize,
        initUser,
        showModal,
        setShowModal,
        createPost,
        posts
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
