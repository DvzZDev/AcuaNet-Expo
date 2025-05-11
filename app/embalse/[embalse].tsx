import { useLocalSearchParams } from 'expo-router';

export default function Embalse() {
  const { embalse } = useLocalSearchParams();
  console.log(embalse);
}
