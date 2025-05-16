import { supabase } from 'lib/supabase';

export const HistoricalData = async (
  embalse: string | string[],
  codedEmbalse: string,
  setHData: (data: any) => void
) => {
  const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse;
  const { data } = await supabase
    .from('embalses2025')
    .select()
    .eq('embalse', typeof embalseStr === 'string' ? codedEmbalse : embalseStr)
    .order('fecha', { ascending: false });
  setHData(data);
};

export const LiveData = async (
  embalse: string | string[],
  codedEmbalse: string,
  setLiveData: (data: any) => void
) => {
  const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse;
  const { data } = await supabase
    .from('live_data')
    .select()
    .eq('embalse', typeof embalseStr === 'string' ? codedEmbalse : embalseStr);
  setLiveData(data);
};
