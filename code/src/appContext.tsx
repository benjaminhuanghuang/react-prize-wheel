import { useEffect, createContext, useContext, useState, ReactNode } from 'react';

import { Email } from './types';
//
import { emails } from './emails';


interface AppContextType {
  mailList:Email[];
  filteredMailList: Email[];
  isLoading: boolean;
  error: string|null;
  toggleMailSelection: (emailAddress: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [mailList, setMailList] = useState<Email[]>([]);
  const [filteredMailList, setFilteredMailList] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function delay(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        delay(3);
        setEmails(emails);
        setFilteredMailList(filterUnselectedMails());
      } catch (error) {
        console.error(error);
        setError('Failed to fetch emails');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const toggleMailSelection = (emailAddress: string) => {
    setMailList(prevMailList =>
      prevMailList.map(mail =>
        mail.emailAddress === emailAddress ? { ...mail, selected: !mail.selected } : mail
      )
    );
    setFilteredMailList(filterUnselectedMails());
  };

  const filterUnselectedMails = () => {
    return mailList.filter(mail => mail.selected);
  };

  const setEmails = (emails: Email[]) => { 
    setMailList(emails);
    setFilteredMailList(filterUnselectedMails());
  };

  return (
    <AppContext.Provider value={{ mailList, filteredMailList, isLoading, error, toggleMailSelection}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
