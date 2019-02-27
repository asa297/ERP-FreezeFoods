export const FindTabs = tab => {
  switch (tab) {
    case "home":
      return 1;
    case "login":
      return 2;
    default:
      return null;
  }
};
