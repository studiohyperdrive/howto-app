export const parseJSON = (input: string): any => {
  try {
    return JSON.parse(input);
  } catch (e) {
    return {};
  }
};
