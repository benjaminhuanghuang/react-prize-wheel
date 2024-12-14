import { Email } from '@/types';
// Context
import { useAppContext } from '../appContext';

const EmailList = () => {
  const { mailList, filteredMailList, isLoading, toggleMailSelection, selectAll } =
    useAppContext();

  return (
    <div className='bg-slate-400 h-full w-full flex flex-col min-w-[200px] p-4 justify-between'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* items */}
          <div>
            {mailList.map((mail: Email) => (
              <div key={mail.emailAddress}>
                <input
                  type='checkbox'
                  onChange={() => toggleMailSelection(mail.emailAddress)}
                  checked={mail.selected}
                />
                <span>{mail.fullName}</span>
              </div>
            ))}
          </div>
          <div className='buttons'>
            <button
              className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed'
              onClick={() => selectAll()}
              disabled={mailList.length === filteredMailList.length}
            >
              Select All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailList;
