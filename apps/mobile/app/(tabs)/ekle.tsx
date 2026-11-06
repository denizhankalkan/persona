import { Redirect } from 'expo-router';

/** The tab slot is only a button; the flow itself is the /ekle modal. */
export default function AddTab() {
  return <Redirect href="/ekle" />;
}
