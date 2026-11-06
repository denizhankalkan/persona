import { Redirect, useLocalSearchParams } from 'expo-router';

/** Personas live as editor lists now: /persona/hande → /liste/dolap-hande (old links keep working). */
export default function PersonaRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/liste/dolap-${String(id)}`} />;
}
