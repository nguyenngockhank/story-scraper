export async function withTryCatch(fn: () => any) {
  try {
    await fn();
  } catch (err) {
    console.warn(err);
  }
}
