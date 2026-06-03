import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency, formatPercent } from '@Aurapex/shared';

export default function App() {
  const dummyPortfolioValue = 1250000.5;
  const dummyReturns = 0.154;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aurapex Next Mobile</Text>
      <Text style={styles.subtitle}>Portfolio Value: {formatCurrency(dummyPortfolioValue)}</Text>
      <Text style={styles.subtitle}>Annual Returns: {formatPercent(dummyReturns)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#22c55e',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 5,
  }
});
