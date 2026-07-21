import gsap from "gsap";

export const fadeUp = (element) => {
  gsap.fromTo(
    element,

    {
      opacity: 0,
      y: 40,
    },

    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    },
  );
};

export const fadeIn = (element) => {
  gsap.fromTo(
    element,

    {
      opacity: 0,
    },

    {
      opacity: 1,
      duration: 0.5,
    },
  );
};
