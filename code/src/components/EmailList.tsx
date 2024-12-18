import { Email } from '@/types';
// Context
import { useAppContext } from '../appContext';

const EmailList = () => {
  const { mailList, filteredMailList, isLoading, toggleMailSelection, selectAll , isSpinning } =
    useAppContext();

  return (
    <div className='h-full w-full flex flex-col min-w-[200px] p-4 justify-between'>
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
                  disabled={isSpinning}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <span>{mail.fullName}</span>
              </div>
            ))}
          </div>
          <div className='buttons'>
            <button
              className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed'
              onClick={() => selectAll()}
              disabled={mailList.length === filteredMailList.length || isSpinning}
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
