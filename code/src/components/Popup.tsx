interface PopupProps {
  title: string;
  message: string;
  isOpen: boolean;
  closePopup: () => void;
}

const Popup = ({ title, message, isOpen, closePopup }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10'>
      <div className='bg-white p-6 rounded-lg w-80 max-w-full'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-bold'>{title}</h3>
        </div>
        {/* Content */}
        <div className='mt-4'>
          <p>{message}</p>
        </div>
        <div className='mt-6 text-right'>
          <button
            onClick={closePopup}
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
