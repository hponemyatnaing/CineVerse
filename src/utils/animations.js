import gsap from "gsap";

export const fadeUp = (element) => {
  if (!element) return;

  gsap.fromTo(
    element,

    {
      opacity: 0,

      y: 40,
    },

    {
      opacity: 1,

      y: 0,

      duration: 0.8,

      stagger: 0.15,

      ease: "power3.out",
    },
  );
};
