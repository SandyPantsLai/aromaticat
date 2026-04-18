import Layout from '~/layouts/doc'

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
}
