import '@/styles/globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <main className="container mx-auto flex h-screen max-h-[1080px] flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  )
}
