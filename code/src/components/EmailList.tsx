import { Email

 } from '@/types';
// Context
import { useAppContext } from '../appContext';

const EmailList = () => {
  const { mailList } = useAppContext();

  return (
    <div className="bg-slate-400 h-full w-full grid place-items-center relative min-w-[200px]">
      {mailList.map((mail:Email) => (
        <div key={mail.emailAddress}>
          <span>{mail.fullName}</span>
        </div>
      ))}    
    </div>
  )
}

export default EmailList
