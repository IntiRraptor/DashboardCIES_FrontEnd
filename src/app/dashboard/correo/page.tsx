import { cookies } from "next/headers"
import Image from "next/image"



import { Mail } from "@/components/mail/mail"
import { accounts, mails } from "@/components/mail/data"

export default function MailPage() {    
    const layout = cookies().get("react-resizable-panels:layout")
    
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={accounts}
          mails={mails}
          navCollapsedSize={4} defaultLayout={undefined}        />
      </div>
    </>
  )
}