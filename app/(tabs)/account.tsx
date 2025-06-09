import { supabase } from "lib/supabase"
import { Text, TouchableOpacity, View } from "react-native"

export default function Account() {
  return (
    <View>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text>Cerrar</Text>
      </TouchableOpacity>
    </View>
  )
}
