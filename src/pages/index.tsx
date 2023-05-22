import SdfCanvas from '@/components/sdf-canvas'
import { CreateGroupNode, CreateSphereNode } from '@/lib/sdf-node'
import Head from 'next/head'

export default function Home() {
  return (
    <main className="container mx-auto my-6">
      <Head>
        <title>SDF Playground</title>
      </Head>
      <SdfCanvas root={CreateGroupNode([CreateSphereNode(1)])} />
    </main>
  )
}
