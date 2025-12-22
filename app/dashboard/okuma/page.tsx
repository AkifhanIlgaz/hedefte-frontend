"use client";

import { Button } from "@heroui/button";
import confetti from "canvas-confetti";

export default function Page() {
  // 1. Klasik Patlama
  const classicBurst = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // 2. Yanlardaki Sürekli Confetti
  const sideCannons = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 3. Gökyüzünden Yağmur
  const confettiRain = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 90,
        spread: 45,
        origin: { x: Math.random(), y: 0 },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 4. Havai Fişek
  const fireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    (function frame() {
      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: {
          x: randomInRange(0.1, 0.9),
          y: randomInRange(0.2, 0.6),
        },
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 5. Yıldız Patlaması
  const starBurst = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };

  // 6. Okul Konfeti (Renkli Serpantinler)
  const schoolPride = () => {
    const end = Date.now() + 3 * 1000;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#bb0000", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#bb0000", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 7. Kar Yağışı
  const snow = () => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 200,
        origin: {
          x: Math.random(),
          y: 0,
        },
        colors: ["#ffffff"],
        shapes: ["circle"],
        gravity: 0.4,
        scalar: 0.8,
        drift: Math.random() - 0.5,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 8. Emoji Patlaması
  const emojiExplosion = () => {
    const scalar = 2;
    const emoji = confetti.shapeFromText({ text: "🎉", scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [emoji],
      scalar,
    };

    confetti({
      ...defaults,
      particleCount: 30,
    });

    confetti({
      ...defaults,
      particleCount: 5,
      flat: true,
    });
  };

  // 9. Gerçekçi Confetti
  const realistic = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: any) {
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
  };

  // 10. Spiral Confetti
  const spiral = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    let angle = 0;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: angle,
        spread: 55,
        origin: {
          x: 0.5 + Math.cos((angle * Math.PI) / 180) * 0.3,
          y: 0.5 + Math.sin((angle * Math.PI) / 180) * 0.3,
        },
        colors: ["#ff0080", "#00ff80", "#0080ff"],
      });

      angle = (angle + 10) % 360;

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 11. Altından Yukarı Patlama
  const bottomBurst = () => {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 1, x: 0.5 },
      startVelocity: 70,
      colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
    });
  };

  // 12. Gökkuşağı Dalgası
  const rainbowWave = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 90,
        spread: 45,
        startVelocity: 45,
        origin: { x: Math.random(), y: 0.5 },
        colors: [
          "#ff0000",
          "#ff7f00",
          "#ffff00",
          "#00ff00",
          "#0000ff",
          "#4b0082",
          "#9400d3",
        ],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 13. Kalp Yağmuru
  const heartRain = () => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });

    (function frame() {
      confetti({
        particleCount: 1,
        angle: 90,
        spread: 0,
        startVelocity: 15,
        origin: { x: Math.random(), y: 0 },
        shapes: [heart],
        scalar: 2,
        gravity: 0.5,
        drift: Math.random() - 0.5,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 14. Çılgın Kaos
  const chaos = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: Math.random() * 10 + 5,
        angle: Math.random() * 360,
        spread: Math.random() * 100 + 50,
        origin: {
          x: Math.random(),
          y: Math.random(),
        },
        colors: ["#" + Math.floor(Math.random() * 16777215).toString(16)],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 15. Çift Sarmal
  const doubleHelix = () => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    let t = 0;

    (function frame() {
      const x1 = 0.5 + Math.sin(t) * 0.3;
      const y1 = t / 20;
      const x2 = 0.5 + Math.sin(t + Math.PI) * 0.3;
      const y2 = t / 20;

      confetti({
        particleCount: 2,
        angle: 90,
        spread: 50,
        origin: { x: x1, y: y1 },
        colors: ["#ff0080"],
      });

      confetti({
        particleCount: 2,
        angle: 90,
        spread: 50,
        origin: { x: x2, y: y2 },
        colors: ["#00ff80"],
      });

      t += 0.3;

      if (Date.now() < end && y1 < 1) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 16. Yıldırım Çarpması
  const lightning = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0, x: 0.5 },
          startVelocity: 80,
          colors: ["#ffff00", "#ffffff", "#ffaa00"],
        });
      }, i * 200);
    }
  };

  // 17. Köşe Saldırısı
  const cornerAttack = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      // Sol üst
      confetti({
        particleCount: 3,
        angle: 315,
        spread: 45,
        origin: { x: 0, y: 0 },
      });
      // Sağ üst
      confetti({
        particleCount: 3,
        angle: 225,
        spread: 45,
        origin: { x: 1, y: 0 },
      });
      // Sol alt
      confetti({
        particleCount: 3,
        angle: 45,
        spread: 45,
        origin: { x: 0, y: 1 },
      });
      // Sağ alt
      confetti({
        particleCount: 3,
        angle: 135,
        spread: 45,
        origin: { x: 1, y: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 18. Parti Topu
  const partyBall = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: Math.random() * 360,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        startVelocity: 30,
        colors: [
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#ff00ff",
          "#00ffff",
        ],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 19. Nabız Etkisi
  const pulse = () => {
    let size = 0.5;
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      size += 0.1;
      if (size > 1.5) size = 0.5;

      confetti({
        particleCount: 5,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        startVelocity: size * 20,
        scalar: size,
        colors: ["#ff0080", "#8000ff"],
      });

      if (Date.now() < end) {
        setTimeout(() => requestAnimationFrame(frame), 100);
      }
    })();
  };

  // 20. Meteor Yağmuru
  const meteorShower = () => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 1,
        angle: 60,
        spread: 0,
        origin: { x: Math.random(), y: 0 },
        startVelocity: 60,
        colors: ["#ff6600", "#ffaa00", "#ffcc00"],
        ticks: 100,
        gravity: 1.5,
        scalar: 1.5,
      });

      if (Date.now() < end) {
        setTimeout(() => requestAnimationFrame(frame), 100);
      }
    })();
  };

  // 21. Neon Dalga
  const neonWave = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    let pos = 0;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 30,
        origin: { x: pos / 100, y: 0.5 },
        colors: ["#00ffff", "#ff00ff", "#ffff00"],
        ticks: 50,
        gravity: 0.8,
      });

      pos = (pos + 5) % 100;

      if (Date.now() < end) {
        setTimeout(() => requestAnimationFrame(frame), 50);
      }
    })();
  };

  // 22. Şampanya Patlaması
  const champagne = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    confetti({
      particleCount: 100,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 0.9 },
      startVelocity: 60,
      colors: ["#ffdd00", "#ffffaa", "#ffffff"],
    });

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 90,
        spread: 30,
        origin: { x: 0.5, y: 0.9 },
        startVelocity: 50,
        colors: ["#ffdd00", "#ffffaa"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 23. Galaksi Spirali
  const galaxy = () => {
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    let angle = 0;
    let radius = 0;

    (function frame() {
      const x = 0.5 + Math.cos(angle) * radius;
      const y = 0.5 + Math.sin(angle) * radius;

      confetti({
        particleCount: 3,
        spread: 360,
        origin: { x, y },
        colors: ["#0000ff", "#4b0082", "#9400d3", "#ff00ff"],
        scalar: 0.8,
        gravity: 0.5,
      });

      angle += 0.2;
      radius = (angle / 20) % 0.4;

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // 24. Renkli Tünel
  const tunnel = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    let scale = 0;

    (function frame() {
      scale = (scale + 0.05) % 1;

      confetti({
        particleCount: 10,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        startVelocity: scale * 50,
        colors: ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff"],
        scalar: 0.5 + scale,
      });

      if (Date.now() < end) {
        setTimeout(() => requestAnimationFrame(frame), 100);
      }
    })();
  };

  // 25. Kutlama Patlaması (Hepsi Birden!)
  const ultimate = () => {
    // İlk büyük patlama
    confetti({
      particleCount: 200,
      spread: 200,
      origin: { y: 0.6 },
    });

    // Yan toplar
    setTimeout(() => {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }, 250);

    // Yıldızlar
    setTimeout(() => {
      const star = confetti.shapeFromText({ text: "⭐", scalar: 2 });
      confetti({
        particleCount: 50,
        spread: 360,
        shapes: [star],
        scalar: 2,
        origin: { y: 0.4 },
      });
    }, 500);
  };

  return (
    <div className="flex flex-col items-start gap-3 p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">🎉 25 Farklı Confetti Stili</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
        <Button onPress={classicBurst}>1. 💥 Klasik Patlama</Button>
        <Button onPress={sideCannons}>2. 🎯 Yan Toplar</Button>
        <Button onPress={confettiRain}>3. 🌧️ Yağmur</Button>
        <Button onPress={fireworks}>4. 🎆 Havai Fişek</Button>
        <Button onPress={starBurst}>5. ⭐ Yıldız</Button>
        <Button onPress={schoolPride}>6. 🏫 Okul Konfeti</Button>
        <Button onPress={snow}>7. ❄️ Kar Yağışı</Button>
        <Button onPress={emojiExplosion}>8. 🎉 Emoji</Button>
        <Button onPress={realistic}>9. 🎨 Gerçekçi</Button>
        <Button onPress={spiral}>10. 🌀 Spiral</Button>
        <Button onPress={bottomBurst}>11. ⬆️ Alttan Patlama</Button>
        <Button onPress={rainbowWave}>12. 🌈 Gökkuşağı</Button>
        <Button onPress={heartRain}>13. 💖 Kalp Yağmuru</Button>
        <Button onPress={chaos}>14. 😵 Kaos</Button>
        <Button onPress={doubleHelix}>15. 🧬 Çift Sarmal</Button>
        <Button onPress={lightning}>16. ⚡ Yıldırım</Button>
        <Button onPress={cornerAttack}>17. 📐 Köşe Saldırısı</Button>
        <Button onPress={partyBall}>18. 🪩 Parti Topu</Button>
        <Button onPress={pulse}>19. 💓 Nabız</Button>
        <Button onPress={meteorShower}>20. ☄️ Meteor</Button>
        <Button onPress={neonWave}>21. 🌊 Neon Dalga</Button>
        <Button onPress={champagne}>22. 🍾 Şampanya</Button>
        <Button onPress={galaxy}>23. 🌌 Galaksi</Button>
        <Button onPress={tunnel}>24. 🌀 Tünel</Button>
        <Button onPress={ultimate}>25. 🏆 ULTIMATE! </Button>
      </div>
    </div>
  );
}
