import { useMemo } from "react"
import { BlogProvider } from "src/context/Blog"
import { Router } from "src/router"
import "./App.css"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
export const App = () => {
  const endpoint = "https://red-cosmopolitan-scion.solana-devnet.discover.quiknode.pro/2f1ebe30072eadcff7179b23e4eaba91c8ff2f22/"
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  )
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BlogProvider>
          <Router />
        </BlogProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
