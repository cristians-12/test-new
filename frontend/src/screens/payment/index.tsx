import { styles } from './styles';
import { PaymentTemplate } from '../../templates';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function PaymentScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <PaymentTemplate />
    </SafeAreaView>
  );
}
