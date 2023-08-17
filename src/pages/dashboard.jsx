import { useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletName } from "@solana/wallet-adapter-wallets"
import { useEffect, useState } from "react"
import { Button } from "src/components/Button"
import { PostForm } from "src/components/PostForm"
import { useBlog } from "src/context/Blog"
import { useHistory } from 'react-router-dom'



export const Dashboard = () => {
  const history = useHistory()
  const [connecting, setConnecting] = useState(false)
  const { connected, select } = useWallet()
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")

  const { user,initialize, initUser, showModal, setShowModal, createPost, posts } = useBlog()


  const onConnect = () => {
    setConnecting(true)
    select(PhantomWalletName)
  }

  useEffect(() => {
    if (user) {
      setConnecting(false)
    }
  }, [user])

  return (
    <div className="dashboard overflow-auto h-screen">
      <header className="fixed z-10 w-full h-14 shadow-md text-black px-10">
        <div className="flex justify-between items-center h-full container">
          <h2 className="text-2xl font-bold">
            <div className="bg-clip-text bg-gradient-to-br"
            >
              Solana
            </div>
          </h2>
          {connected ? (
            <div className="flex items-center">
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
              />
              <p className=" font-bold text-sm ml-2 capitalize">
                {user?.name}
              </p>
              {initialize ? (
                
                <Button
                  className="ml-3 mr-2"
                  onClick={() => {
                    setShowModal(true)
                  }}
                >
                  Create Text
                </Button>
              ) : (
                  
                <Button
                  className="ml-3 mr-2"
                  onClick={() => {
                    initUser()
                  }}
                >
                  Initialize User
                </Button>
              )}
            </div>
          ) : (
            <Button
              loading={connecting}
              className="w-28"
              onClick={onConnect}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
            >
              Connect
            </Button>
          )}
        </div>
      </header>
      <main className="dashboard-main pb-4 container flex relative">
        <div className="pt-3 px-10  w-full">
          <div className="row">
            <div className="overflow-x-auto text-black">
        <table className="min-w-full border border-gray-300">
            <thead>
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Original Text</th>
                    <th className="border p-2">Generated Text</th>
                    <th className="border p-2">Author</th>
                </tr>
            </thead>
            <tbody>
              {posts.map((item) => {
                console.log(item)
                return (
                  <tr key={item.account.id}>
                    <td className="border p-2">{item.account.id}</td>
                    <td className="border p-2">{item.account.text}</td>
                    <td className="border p-2">{item.account.text.replace(/ /g, "🤸‍♀️")}</td>
                    <td className="border p-2">{item.account.user.toString() }</td>
                  </tr>
                )
              })}
              
            </tbody>
        </table>
    </div>
            
          </div>
        </div>
        <div className={`modal ${showModal && 'show-modal'}`} >
          <div className="modal-content">
            <span className="close-button"
              onClick={() => setShowModal(false)}
            >×</span>
            <PostForm
              postTitle={postTitle}
              postContent={postContent}
              setPostTitle={setPostTitle}
              setPostContent={setPostContent}
              onSubmit={() => createPost(postContent)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
