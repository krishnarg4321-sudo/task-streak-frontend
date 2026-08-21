import confetti from 'canvas-confetti';

export function triggerTaskCelebration() {
  // Fire high-energy geometric particle burst with neo-brutal candy colors
  const count = 75;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#000000', '#FEF08A', '#FBCFE8', '#BAE6FD', '#BBF7D0', '#DDD6FE', '#F43F5E'],
    shapes: ['square', 'circle'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}