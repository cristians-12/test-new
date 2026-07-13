import { styles } from './styles';
import { PaymentHistoryTemplate } from '../../templates';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentHistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PaymentHistoryTemplate />
    </SafeAreaView>
  );
}
