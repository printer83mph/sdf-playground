import Head from 'next/head'

import SdfCanvas from '@/components/sdf-canvas'
import { CreateGroupNode, CreateSphereNode } from '@/lib/sdf-node'

export default function Home() {
  return (
    <main className="container mx-auto flex h-screen max-h-[1080px] flex-col items-center justify-center">
      <Head>
        <title>SDF Playground</title>
      </Head>
      <SdfCanvas root={CreateGroupNode([CreateSphereNode(1)])} />
    </main>
  )
}
