(function () {
  var intro = document.getElementById("intro");
  var main = document.getElementById("main-content");
  var statusEl = document.getElementById("intro-status");
  var rail = document.getElementById("intro-rail");
  var lottieContainer = document.getElementById("intro-lottie");
  if (!intro) return;

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var INTRO_MS = reduced ? 700 : 21000;

  var stages = [
    {
      n: 1,
      at: 0,
      phase: "1 / 5",
      text: "Analiz: taş yüzeyi, derzler ve çatlaklar haritalanıyor."
    },
    {
      n: 2,
      at: 4200,
      phase: "2 / 5",
      text: "Plan: ölçüm, güçlendirme ve uygulama adımları netleşiyor."
    },
    {
      n: 3,
      at: 8400,
      phase: "3 / 5",
      text: "Örgü: geleneksel taş işçiliği ve harçla yüzey yeniden kuruluyor."
    },
    {
      n: 4,
      at: 12800,
      phase: "4 / 5",
      text: "Yüzey: temizlik, derz ve renk dengesiyle cephe açılıyor."
    },
    {
      n: 5,
      at: 17200,
      phase: "5 / 5",
      text: "Teslim: taş ev nefes alan, özgün dokusuna kavuştu — hoş geldiniz."
    }
  ];

  /* Lordicon tabanlı Lottie JSON (https://lordicon.com — CC / ücretsiz kullanım) */
  var lottieByStage = {
    1: "animations/msoeawqm.json",
    2: "animations/nocovwne.json",
    3: "animations/xhebrhsj.json",
    4: "animations/wxnxiano.json",
    5: "animations/lupuorrc.json"
  };

  var timeouts = [];
  var lottieAnim = null;

  function destroyLottie() {
    if (lottieAnim && typeof lottieAnim.destroy === "function") {
      lottieAnim.destroy();
      lottieAnim = null;
    }
    if (lottieContainer) lottieContainer.innerHTML = "";
  }

  function setStageLottie(n) {
    if (reduced || typeof lottie === "undefined" || !lottieContainer) return;
    var url = lottieByStage[n];
    if (!url) return;
    destroyLottie();
    try {
      lottieAnim = lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: url
      });
    } catch (e) {
      destroyLottie();
    }
  }

  function setRail(stageNum) {
    if (!rail) return;
    var items = rail.querySelectorAll("li");
    items.forEach(function (li, i) {
      li.classList.remove("is-done", "is-current");
      if (i + 1 < stageNum) li.classList.add("is-done");
      else if (i + 1 === stageNum) li.classList.add("is-current");
    });
  }

  function updateStatus(phase, text) {
    if (!statusEl) return;
    var p = statusEl.querySelector(".intro__status-phase");
    var t = statusEl.querySelector(".intro__status-text");
    if (p) p.textContent = phase;
    if (t) t.textContent = text;
  }

  function startHeroCarousel() {
    var el = document.getElementById("heroCarousel");
    if (!el || typeof bootstrap === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      var c = bootstrap.Carousel.getOrCreateInstance(el, {
        interval: 3000,
        pause: false,
        wrap: true,
        touch: true,
        ride: false
      });
      c.cycle();
    } catch (e) {}
  }

  function finishIntro() {
    timeouts.forEach(function (id) {
      clearTimeout(id);
    });
    timeouts = [];
    destroyLottie();
    intro.classList.add("intro--done");
    if (main) main.classList.add("is-visible");
    requestAnimationFrame(function () {
      startHeroCarousel();
    });
  }

  setRail(1);

  if (reduced) {
    intro.setAttribute("data-stage", "5");
    updateStatus("5 / 5", "Marya Mimarlık — Taş ev restorasyonu");
    setRail(5);
    timeouts.push(setTimeout(finishIntro, INTRO_MS));
  } else {
    setStageLottie(1);
    stages.forEach(function (s) {
      var id = setTimeout(function () {
        intro.setAttribute("data-stage", String(s.n));
        updateStatus(s.phase, s.text);
        setRail(s.n);
        setStageLottie(s.n);
      }, s.at);
      timeouts.push(id);
    });
    timeouts.push(setTimeout(finishIntro, INTRO_MS));
  }

  var skip = intro.querySelector(".intro__skip");
  if (skip) {
    skip.addEventListener("click", finishIntro);
  }
})();
