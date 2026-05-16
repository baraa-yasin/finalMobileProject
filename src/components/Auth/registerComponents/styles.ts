import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1 },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#14450B', textAlign: 'right' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'right', marginBottom: 40 },
  inputContainer: { gap: 15 },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 18,
    borderRadius: 12,
    textAlign: 'right',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#14450B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 20, color: '#666' },
  link: { color: '#14450B', fontWeight: 'bold' },
  errorText: { color: '#C62828', textAlign: 'right', marginTop: -8 },
});

export default styles;
