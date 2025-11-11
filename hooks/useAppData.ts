'use client';

import { useState, useEffect } from 'react';
import { AppData } from '@/types';
import { loadData } from '@/lib/storage';

export const useAppData = () => {
  const [data, setData] = useState<AppData>({
    medications: [],
    medicationLogs: [],
    sideEffectLogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // データの読み込み
  const refreshData = () => {
    const loadedData = loadData();
    setData(loadedData);
  };

  useEffect(() => {
    refreshData();
    setIsLoading(false);
  }, []);

  return { data, refreshData, isLoading };
};
