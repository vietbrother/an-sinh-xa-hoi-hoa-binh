import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocialRecord } from './types';
import { fetchRecordsFromSheets } from './services/dataService';
import { MOCK_RECORDS } from './data/mockData';

interface RecordContextType {
  records: SocialRecord[];
  isLoading: boolean;
  refreshRecords: () => Promise<void>;
}

const RecordContext = createContext<RecordContextType | undefined>(undefined);

export const RecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<SocialRecord[]>(MOCK_RECORDS); // Default to mock, then fetch
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const liveData = await fetchRecordsFromSheets();
      if (liveData && liveData.length > 0) {
        setRecords(liveData);
      } else {
        setRecords(MOCK_RECORDS);
      }
    } catch (error) {
      console.error("Failed to load records from sheets:", error);
      setRecords(MOCK_RECORDS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <RecordContext.Provider value={{ records, isLoading, refreshRecords: loadData }}>
      {children}
    </RecordContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordContext);
  if (context === undefined) {
    throw new Error('useRecords must be used within a RecordProvider');
  }
  return context;
};
