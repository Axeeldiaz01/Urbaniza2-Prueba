//scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const pasos = document.querySelectorAll(".paso");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  pasos.forEach(paso => observer.observe(paso));
});