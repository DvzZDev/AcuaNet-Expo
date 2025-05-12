import { supabase } from 'lib/supabase';

export const fetchData = async (
  embalse: string | string[],
  codedEmbalse: string,
  setData: (data: any) => void
) => {
  const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse;
  const { data } = await supabase
    .from('embalses2025')
    .select()
    .eq('embalse', typeof embalseStr === 'string' ? codedEmbalse : embalseStr)
    .order('fecha', { ascending: false })
    .limit(1);
  setData(data);
};
