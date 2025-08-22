export default function processError(
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError(String(error));
  }
}
