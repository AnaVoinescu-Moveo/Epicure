export const unstable_cache = <T extends (...args: unknown[]) => unknown>(
  fn: T,
): T => fn;
export const revalidatePath = jest.fn();
export const revalidateTag = jest.fn();
