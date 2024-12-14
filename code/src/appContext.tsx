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
  selectAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [mailList, setMailList] = useState<Email[]>([]);
  const [filteredMailList, setFilteredMailList] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function delay(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        delay(5);
        setEmails(emails);
        setFilteredMailList(emails.filter(mail => mail.selected));
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
    const newMailList = mailList.map(mail =>
      mail.emailAddress === emailAddress ? { ...mail, selected: !mail.selected } : mail
    );

    setMailList(newMailList);
    setFilteredMailList(newMailList.filter(mail => mail.selected));
  };
  const selectAll = () => {
    if (mailList.length === filteredMailList.length) return;
    const newMailList = mailList.map(mail => ({ ...mail, selected: true }));
    setMailList(newMailList);
    setFilteredMailList(newMailList);
  };

  const setEmails = (emails: Email[]) => { 
    setMailList(emails);
    setFilteredMailList(emails.filter(mail => mail.selected));
  };

  return (
    <AppContext.Provider value={{ mailList, filteredMailList, isLoading, error, toggleMailSelection, selectAll}}>
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
