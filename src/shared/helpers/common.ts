export const scrollToTop = (selector: string): void => {
  const element = document.querySelector(selector) as HTMLDivElement | null;

  if (element) {
    element.scrollTo({ top: 0, behavior: "smooth" });
  }
};
