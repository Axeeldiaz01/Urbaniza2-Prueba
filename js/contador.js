document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".stat-number");

  const startCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    let count = 0;
    const increment = target / 120;

    const updateCounter = () => {
      count += increment;

      if (count < target) {
        counter.textContent = Math.floor(count);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (target === 100 ? "%" : "+");
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => startCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const section = document.querySelector(".confianza");
  if (section) {
    observer.observe(section);
  }
});