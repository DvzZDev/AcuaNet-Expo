import { useLocalSearchParams } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';

export default function Embalse() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('embalses2025').select('*');
      setData(data);
      console.log(data);
    };
    fetchData();
  }, []);
  console.log(data);
  const { embalse } = useLocalSearchParams();
  console.log(embalse);
}
