export const mockRoute = {
  snapshot: {
    paramMap: {
      get(name: string): string | null {
        if (name != undefined) {
          return '';
        } else {
          return null;
        }
      },
    },
  },
};
