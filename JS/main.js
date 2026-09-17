const toggleMenuBtn = document.querySelector(".toggle-menu");
const navMenu = document.querySelector("header .container nav ul");

// Open and close toggle menu
toggleMenuBtn.addEventListener("click", function () {
  navMenu.classList.toggle("show");
  this.classList.toggle("fa-bars");
  this.classList.toggle("fa-xmark");
  this.classList.toggle("active-icon");
});

// Scroll Header Bar
const headerBar = document.querySelector(".header-bar");
if (headerBar) {
  window.addEventListener("scroll", () => {
    headerBar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// up button
const upBtn = document.querySelector(".up-button");
if (upBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 600) {
      upBtn.classList.add("show");
    } else {
      upBtn.classList.remove("show");
    }
  });
  upBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Dark Mode
const darkModeBtn = document.querySelector(".dark-mode");
const body = document.body;
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  body.classList.add("light-theme");
  darkModeBtn.classList.remove("fa-sun");
  darkModeBtn.classList.add("fa-moon");
}

darkModeBtn.addEventListener("click", () => {
  body.classList.toggle("light-theme");

  if (body.classList.contains("light-theme")) {
    darkModeBtn.classList.remove("fa-sun");
    darkModeBtn.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    darkModeBtn.classList.remove("fa-moon");
    darkModeBtn.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

// update the active link in the navbar.
function setActiveNavLink(targetId) {
  document
    .querySelectorAll("header .container nav ul li a.menu-link")
    .forEach((nav) => {
      nav.classList.remove("active");
      if (nav.getAttribute("data-target") === targetId) {
        nav.classList.add("active");
      }
    });
}

// Single Page Application
const navLinks = document.querySelectorAll(".menu-link");
const pages = document.querySelectorAll("main");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("data-target");

    setActiveNavLink(targetId);

    pages.forEach((page) => {
      page.classList.add("d-none");
      page.classList.remove("fade-in");
    });

    const targetPage = document.getElementById(targetId);
    targetPage.classList.remove("d-none");
    targetPage.classList.add("fade-in");

    localStorage.setItem("currentPage", targetId);
    history.pushState({ page: targetId }, "", `#${targetId}`);

    if (navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
      toggleMenuBtn.classList.remove("fa-xmark", "active-icon");
      toggleMenuBtn.classList.add("fa-bars");
    }
  });
});

/* Navigating the Adhkar Section */
const categoryCards = document.querySelectorAll(".category-card");
const azkarPage = document.getElementById("azkar-page");
const azkarDetailsPage = document.getElementById("azkar-details-page");
const backToAzkarBtn = document.getElementById("back-to-azkar");
const azkarCategoryTitle = document.getElementById("azkar-category-title");

const azkarTitles = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  sleep: "أذكار النوم",
  "wake-up": "أذكار الاستيقاظ",
  "after-prayer": "أذكار بعد الصلاة",
  tasbeeh: "التسبيح",
};

categoryCards.forEach((card) => {
  card.addEventListener("click", function () {
    const type = this.getAttribute("data-type");

    azkarCategoryTitle.textContent = azkarTitles[type];

    azkarPage.classList.add("d-none");
    azkarDetailsPage.classList.remove("d-none");

    localStorage.setItem("currentPage", "azkar-details-page");
    localStorage.setItem("currentCategory", type);
    history.pushState(
      { page: "azkar-details-page", category: type },
      "",
      `#azkar-${type}`,
    );

    drawAzkar(type);
  });
});

backToAzkarBtn.addEventListener("click", function () {
  azkarDetailsPage.classList.add("d-none");
  azkarPage.classList.remove("d-none");

  localStorage.setItem("currentPage", "azkar-page");
  history.pushState({ page: "azkar-page" }, "", `#azkar-page`);
});

// Get azkar data form local json
let allAzkar = [];

async function getAzkar() {
  try {
    const response = await fetch("./azkar.json");
    allAzkar = await response.json();
  } catch (err) {
    console.log("Error:", err);
  }
}

const azkarContainer = document.getElementById("azkar-container");
function drawAzkar(categoryType) {
  azkarContainer.innerHTML = "";

  const filteredAzkar = allAzkar.filter((zekrItem) => {
    return zekrItem.category === categoryType;
  });

  filteredAzkar.forEach((zekr) => {
    const descriptionHTML =
      zekr.description !== ""
        ? ` <p class="card min-card p-4"> ${zekr.description}</p>`
        : "";
    azkarContainer.innerHTML += `
  <div class="col-12 mb-4">
    <div class="card category-card p-4 position-relative">
    <!-- دائرة التقدم الفردية لكل ذكر (فوق على اليمين) -->
      <div class="position-absolute top-0 start-40 mt-3 me-3 ">
        <div class="circular-progress card-circle" style="background: conic-gradient(rgb(10 83 58) 0deg, var(--track-small) 0deg);">
          <span class="progress-value text-muted" style="font-size: 10px;">0 / ${zekr.count}</span>
        </div>
      </div>
      <p class="quran-text text-center mb-2 p-2 mt-5" >${zekr.text}</p>
      
      ${descriptionHTML}

      <!-- صندوق الزراير -->
      <div class="d-flex justify-content-center align-items-center mt-3 gap-3">
        
        <!-- زرار الإعادة الجديد -->
        <button class="reset-btn d-flex justify-content-center align-items-center" title="إعادة الذكر">
          <i class="fa-solid fa-rotate-right"></i>
        </button>

        <button class="btn btn-primary-custom zekr-btn px-5 fs-5 py-2" data-current="0" data-max="${zekr.count}" style="border-radius: 25px; min-width: 140px;">
          0 / ${zekr.count}
        </button>

      </div>
      
    </div>
    </div>
    `;
  });

  const zekrBtn = document.querySelectorAll(".zekr-btn");
  const resetBtn = document.querySelectorAll(".reset-btn");

  zekrBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let current = parseInt(this.getAttribute("data-current"));
      let max = parseInt(this.getAttribute("data-max"));

      const card = this.closest(".card");
      const cardCircle = card.querySelector(".card-circle");
      const progressText = card.querySelector(".progress-value");

      if (current < max) {
        current++;
        this.setAttribute("data-current", current);
        this.innerText = `${current} / ${max}`;
        let angle = (current / max) * 360;
        cardCircle.style.background = `conic-gradient(rgb(10 83 58) ${angle}deg, var(--track-small) 0deg)`;
        progressText.innerText = `${current} / ${max}`;
        if (navigator.vibrate) navigator.vibrate(40);
      }
      if (current === max) {
        this.classList.remove("btn-primary-custom");
        this.classList.add("true-mark");
        this.style.cursor = "default";
        this.innerText = `✔`;
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
      updateGlobalProgress();
      saveAzkarProgress(categoryType);
    });
  });

  resetBtn.forEach((reset) => {
    reset.addEventListener("click", function () {
      const targetZekrBtn = reset.parentElement.querySelector(".zekr-btn");
      let max = parseInt(targetZekrBtn.getAttribute("data-max"));
      targetZekrBtn.setAttribute("data-current", 0);
      targetZekrBtn.innerText = `${0} / ${max}`;
      targetZekrBtn.classList.add("btn-primary-custom");
      targetZekrBtn.classList.remove("true-mark");
      targetZekrBtn.style.cursor = "pointer";

      if (navigator.vibrate) navigator.vibrate(40);

      const card = this.closest(".card");
      const cardCircle = card.querySelector(".card-circle");
      const progressText = card.querySelector(".progress-value");

      cardCircle.style.background = `conic-gradient(rgb(10 83 58) 0deg, var(--track-small) 0deg)`;
      progressText.innerText = `0 / ${max}`;
      updateGlobalProgress();
      saveAzkarProgress(categoryType);
    });
  });

  loadAzkarProgress(categoryType);

  function updateGlobalProgress() {
    const allZekrBtns = document.querySelectorAll(".zekr-btn");

    let totalAzkar = allZekrBtns.length;
    let completedAzkar = 0;
    let totalReps = 0;
    let completedReps = 0;

    allZekrBtns.forEach((btn) => {
      let current = parseInt(btn.getAttribute("data-current"));
      let max = parseInt(btn.getAttribute("data-max"));

      totalReps += max;
      completedReps += current;

      if (current === max) {
        completedAzkar++;
      }
    });

    let percentage =
      totalReps === 0 ? 0 : Math.round((completedReps / totalReps) * 100);
    let angle = (percentage / 100) * 360;

    document.getElementById("global-percentage").innerText = `${percentage}%`;
    document.getElementById("global-completed-reps").innerText =
      `${completedReps} / ${totalReps}`;
    document.getElementById("global-total-reps").innerText = totalReps;
    document.getElementById("global-completed-azkar").innerText =
      `${completedAzkar} / ${totalAzkar}`;

    const isLightMode = document.body.classList.contains("light-theme");
    const circleBgColor = isLightMode ? "#e5e7eb" : "#2a2a2a";

    document.getElementById("global-progress-circle").style.background =
      `conic-gradient(rgb(10 83 58) ${angle}deg, var(--track-main) 0deg)`;
  }

  updateGlobalProgress();

  const resetAllBtn = document.getElementById("reset-all-btn");
  resetAllBtn.onclick = function () {
    const allResetBtns = document.querySelectorAll(".reset-btn");
    allResetBtns.forEach((btn) => btn.click());
    saveAzkarProgress(categoryType);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

/* Progress saving and retrieval functions (Local Storage) */
function saveAzkarProgress(categoryType) {
  const allZekrBtns = document.querySelectorAll(".zekr-btn");
  let progressArray = [];

  allZekrBtns.forEach((btn) => {
    progressArray.push(parseInt(btn.getAttribute("data-current")));
  });

  let savedData = JSON.parse(localStorage.getItem("azkarProgress")) || {};
  let today = new Date().toLocaleDateString();

  if (savedData.date !== today) {
    savedData = { date: today };
  }

  savedData[categoryType] = progressArray;
  localStorage.setItem("azkarProgress", JSON.stringify(savedData));
}

function loadAzkarProgress(categoryType) {
  let savedData = JSON.parse(localStorage.getItem("azkarProgress"));
  if (!savedData) return;

  let today = new Date().toLocaleDateString();

  if (savedData.date !== today) {
    localStorage.removeItem("azkarProgress");
    return;
  }

  let categoryProgress = savedData[categoryType];
  if (!categoryProgress) return;

  const allZekrBtns = document.querySelectorAll(".zekr-btn");

  allZekrBtns.forEach((btn, index) => {
    let savedCurrent = categoryProgress[index];

    if (savedCurrent > 0) {
      btn.setAttribute("data-current", savedCurrent);
      let max = parseInt(btn.getAttribute("data-max"));

      const card = btn.closest(".card");
      const cardCircle = card.querySelector(".card-circle");
      const progressText = card.querySelector(".progress-value");

      let angle = (savedCurrent / max) * 360;
      cardCircle.style.background = `conic-gradient(rgb(10 83 58)  ${angle}deg, var(--track-small) 0deg)`;
      progressText.innerText = `${savedCurrent} / ${max}`;
      btn.innerText = `${savedCurrent} / ${max}`;

      if (savedCurrent === max) {
        btn.classList.remove("btn-primary-custom");
        btn.classList.add("true-mark");
        btn.style.cursor = "default";
        btn.innerText = `✔`;
      }
    }
  });
}


/* Restore the last page upon refreshing. */
window.addEventListener("DOMContentLoaded", async () => {
  await getAzkar();

  const savedPage = localStorage.getItem("currentPage") || "home-page";

  pages.forEach((page) => page.classList.add("d-none"));

  const targetPageElement = document.getElementById(savedPage);
  if (targetPageElement) {
    targetPageElement.classList.remove("d-none");
    setActiveNavLink(savedPage);
  } else {
    document.getElementById("home-page").classList.remove("d-none");
    setActiveNavLink("home-page");
  }

  if (savedPage === "azkar-details-page") {
    const savedCategory = localStorage.getItem("currentCategory") || "morning";

    azkarCategoryTitle.textContent = azkarTitles[savedCategory];

    drawAzkar(savedCategory);
  }

  history.replaceState(
    {
      page: savedPage,
      category: localStorage.getItem("currentCategory"),
    },
    "",
    `#${savedPage}`,
  );
  if (savedPage === "quran-details-page") {
    const quranType = localStorage.getItem("currentQuranType") || "surah";
    const quranId = localStorage.getItem("currentQuranId") || 1;
    const quranName = localStorage.getItem("currentQuranName") || "الفاتحة";

    document.getElementById("reading-surah-title").innerText = quranName;

    if (quranType === "surah") {
      getSurahAyahs(quranId);
    } else if (quranType === "juz") {
      getJuzAyahs(quranId);
    }
  }
});

/* Enable browser buttons (Back & Forward) */
window.addEventListener("popstate", function (e) {
  if (e.state) {
    const targetPage = e.state.page;
    const targetCategory = e.state.category;

    pages.forEach((page) => {
      page.classList.add("d-none");
      page.classList.remove("fade-in");
    });

    const pageElement = document.getElementById(targetPage);
    if (pageElement) {
      pageElement.classList.remove("d-none");
      pageElement.classList.add("fade-in");
    }

    setActiveNavLink(targetPage);

    if (targetPage === "azkar-details-page") {
      azkarCategoryTitle.textContent = azkarTitles[targetCategory];

      drawAzkar(targetCategory);
      localStorage.setItem("currentCategory", targetCategory);
    }
    if (targetPage === "quran-details-page") {
      const quranType =
        e.state.quranType || localStorage.getItem("currentQuranType");
      const quranId = e.state.quranId || localStorage.getItem("currentQuranId");
      const quranName =
        e.state.quranName || localStorage.getItem("currentQuranName");

      document.getElementById("reading-surah-title").innerText = quranName;

      if (quranType === "surah") {
        getSurahAyahs(quranId);
      } else if (quranType === "juz") {
        getJuzAyahs(quranId);
      }
    }

    localStorage.setItem("currentPage", targetPage);
  }
});

/* Start Quran page */
const btnSurah = document.getElementById("btn-surah");
const btnJuz = document.getElementById("btn-juz");
const surahGrid = document.getElementById("surah-grid");
const juzGrid = document.getElementById("juz-grid");

if (btnSurah && btnJuz) {
  btnSurah.addEventListener("click", () => {
    btnSurah.classList.add("active");
    btnJuz.classList.remove("active");
    surahGrid.classList.remove("d-none");
    juzGrid.classList.add("d-none");
  });

  btnJuz.addEventListener("click", () => {
    btnJuz.classList.add("active");
    btnSurah.classList.remove("active");
    juzGrid.classList.remove("d-none");
    surahGrid.classList.add("d-none");
  });
}
let allSurahs = [];
async function getSurahs() {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    allSurahs = await response.json();
    surahGrid.innerHTML = "";
    allSurahs.data.forEach((surah) => {
      let typeArabic = surah.revelationType === "Meccan" ? "مكية" : "مدنية";
      surahGrid.innerHTML += `
      <div class=" col-md-4 col-sm-6 mb-4">
            <div class="quran-card p-3" data-id = "${surah.number}">
              <div class="d-flex justify-content-between align-items-center ">
                <div class="surah-number"><span>${surah.number}</span></div>
                <div class="surah-type"><i class="fa-solid fa-kaaba me-1"></i> ${typeArabic}</div>
              </div>
              <div class="text-center">
                <h4 class="quran-text text-white mb-0">${surah.name}</h4>
                <small class="text-muted d-block mb-1">${surah.englishName}</small>
                <span class="ayah-count">${surah.numberOfAyahs} آية</span>
              </div>
            </div>
          </div>
      `;
    });
    const surahCard = document.querySelectorAll("#surah-grid .quran-card");
    surahCard.forEach((card) => {
      card.addEventListener("click", function () {
        let surahId = this.getAttribute("data-id");
        let surahName = this.querySelector("h4").innerText;

        document.getElementById("quran-page").classList.add("d-none");
        document
          .getElementById("quran-details-page")
          .classList.remove("d-none");
        document.getElementById("reading-surah-title").innerText = surahName;

        localStorage.setItem("currentPage", "quran-details-page");
        localStorage.setItem("currentQuranType", "surah");
        localStorage.setItem("currentQuranId", surahId);
        localStorage.setItem("currentQuranName", surahName);
        history.pushState(
          {
            page: "quran-details-page",
            quranType: "surah",
            quranId: surahId,
            quranName: surahName,
          },
          "",
          `#surah-${surahId}`,
        );
        getSurahAyahs(surahId);
      });
    });
  } catch (err) {
    console.log("Error fetching surahs:", err);
  }
}
getSurahs();

async function getSurahAyahs(id) {
  try {
    const ayahsContainer = document.getElementById("ayahs-container");
    ayahsContainer.innerHTML = `
  <div class="text-center my-5">
    <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
    <p class="mt-3 text-muted">جاري تحميل الآيات...</p>
  </div>
`;

    const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
    const surahData = await response.json();

    let ayahsHTML = "";

    if (id != 1 && id != 9) {
      ayahsHTML += `<div class="text-center mb-4" style="
      font-size: 30px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>`;
    }

    surahData.data.ayahs.forEach((ayah, index) => {
      let ayahText = ayah.text;

      if (index === 0 && id != 1 && id != 9) {
        ayahText = ayahText.split(" ").slice(4).join(" ");
      }

      let ayahNumber = `<span style="color: var(--primary-color); 
      font-size: 20px; font-weight: bold; margin: 0 1px; white-space: nowrap;"> ﴿ ${ayah.numberInSurah} ﴾ </span>`;

      ayahsHTML += `${ayahText} ${ayahNumber}`;
    });

    ayahsContainer.innerHTML = ayahsHTML;
  } catch (err) {
    console.log("Error fetching ayahs:", err);
    document.getElementById("ayahs-container").innerHTML =
      "حدث خطأ في تحميل السورة. تأكد من اتصالك بالإنترنت.";
  }
}

function drawJuz() {
  const juzGrid = document.getElementById("juz-grid");
  juzGrid.innerHTML = "";
  const arabicOrdinals = [
    "الأول",
    "الثاني",
    "الثالث",
    "الرابع",
    "الخامس",
    "السادس",
    "السابع",
    "الثامن",
    "التاسع",
    "العاشر",
    "الحادي عشر",
    "الثاني عشر",
    "الثالث عشر",
    "الرابع عشر",
    "الخامس عشر",
    "السادس عشر",
    "السابع عشر",
    "الثامن عشر",
    "التاسع عشر",
    "العشرون",
    "الحادي والعشرون",
    "الثاني والعشرون",
    "الثالث والعشرون",
    "الرابع والعشرون",
    "الخامس والعشرون",
    "السادس والعشرون",
    "السابع والعشرون",
    "الثامن والعشرون",
    "التاسع والعشرون",
    "الثلاثون",
  ];
  for (let i = 1; i <= 30; i++) {
    juzGrid.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="quran-card juz-card p-4" data-id="${i}" data-name="${arabicOrdinals[i - 1]}" style="cursor: pointer; min-height: 60px; ">
          
          <!-- حاوية بتوزع العناصر: واحد يمين وواحد شمال -->
          <div class="d-flex align-items-center justify-content-between h-100 px-2">
            
            <div class="surah-number m-0 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; font-size: 20px;">
              <span>${i}</span>
            </div>
            
            <h4 class="quran-text text-white mx-auto mb-0" style="font-size: 20px; ">الجزء ${arabicOrdinals[i - 1]}</h4>

          </div>

        </div>
      </div>
    `;
  }

  const juzCards = document.querySelectorAll(".juz-card");
  juzCards.forEach((card) => {
    card.addEventListener("click", function () {
      let juzId = this.getAttribute("data-id");
      let juzName = this.getAttribute("data-name");
      document.getElementById("quran-page").classList.add("d-none");
      document.getElementById("quran-details-page").classList.remove("d-none");

      let fullJuzName = `الجزء ${juzName}`;
      document.getElementById("reading-surah-title").innerText = fullJuzName;

      localStorage.setItem("currentPage", "quran-details-page");
      localStorage.setItem("currentQuranType", "juz");
      localStorage.setItem("currentQuranId", juzId);
      localStorage.setItem("currentQuranName", fullJuzName);
      history.pushState(
        {
          page: "quran-details-page",
          quranType: "juz",
          quranId: juzId,
          quranName: fullJuzName,
        },
        "",
        `#juz-${juzId}`,
      );
      getJuzAyahs(juzId);
    });
  });
}
drawJuz();
async function getJuzAyahs(juzId) {
  try {
    const ayahsContainer = document.getElementById("ayahs-container");
    ayahsContainer.innerHTML = `
  <div class="text-center my-5">
    <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
    <p class="mt-3 text-muted">جاري تحميل الآيات...</p>
  </div>
`;

    const response = await fetch(
      `https://api.alquran.cloud/v1/juz/${juzId}/quran-uthmani`,
    );
    const juzData = await response.json();

    let ayahsHTML = "";

    juzData.data.ayahs.forEach((ayah) => {
      let ayahText = ayah.text;

      if (ayah.numberInSurah === 1) {
        ayahsHTML += `<div class="text-center my-4" style="color: var(--primary-color); font-size: 24px; border-bottom: 1px solid rgba(9, 102, 71, 0.3); padding-bottom: 10px;">${ayah.surah.name}</div>`;

        if (ayah.surah.number != 1 && ayah.surah.number != 9) {
          ayahsHTML += `<div class="text-center mb-4" style="color: var(--text-color); font-size: 22px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>`;
        }
      }

      if (
        ayah.numberInSurah === 1 &&
        ayah.surah.number != 1 &&
        ayah.surah.number != 9
      ) {
        if (ayahText.includes("بِسْمِ")) {
          ayahText = ayahText.split(" ").slice(4).join(" ");
        }
      }

      let ayahNumber = `<span style="color: var(--primary-color); font-size: 20px; font-weight: bold; margin: 0 5px; white-space: nowrap;"> ﴿ ${ayah.numberInSurah} ﴾ </span>`;

      ayahsHTML += `${ayahText} ${ayahNumber}`;
    });

    ayahsContainer.innerHTML = ayahsHTML;
  } catch (err) {
    console.log("Error fetching juz ayahs:", err);
    document.getElementById("ayahs-container").innerHTML =
      "حدث خطأ في تحميل الجزء. تأكد من اتصالك بالإنترنت.";
  }
}
const backToQuranBtn = document.getElementById("back-to-quran");
if (backToQuranBtn) {
  backToQuranBtn.addEventListener("click", () => {
    document.getElementById("quran-details-page").classList.add("d-none");
    document.getElementById("quran-page").classList.remove("d-none");

    localStorage.setItem("currentPage", "quran-page");
    history.pushState({ page: "quran-page" }, "", `#quran-page`);
  });
}
/* End Quran page */

/* Start Hadith page */
async function getHadiths() {
  try {
    const hadithGrid = document.getElementById("hadith-grid");
    hadithGrid.innerHTML = `
      <div class="text-center my-5 w-100">
        <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted">جاري تحميل الأحاديث...</p>
      </div>
    `;

    const response = await fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi.json",
    );
    const data = await response.json();

    hadithGrid.innerHTML = "";

    data.hadiths.forEach((hadith) => {
      hadithGrid.innerHTML += `
        <div class="col-12 mb-4">
          <div class="quran-card p-4 p-md-5 position-relative">
            
            <!-- رأسية الكارت: رقم الحديث -->
            <div class="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div class="surah-number me-3" style="width: 45px; height: 45px; font-size: 18px;">
                <span>${hadith.hadithnumber}</span>
              </div>
              <div>
                <h5 class="mb-0 fw-bold">الحديث الشريف</h5>
                <small class="subtitle-gold">الأربعون النووية</small>
              </div>
            </div>
            
            <!-- نص الحديث (تم تعديله ليكون متساوي الحواف وبادئ من اليمين) -->
            <p class="quran-text mb-0" style="text-align: justify; font-size: 22px; line-height: 2.3; color: var(--text-color);">
              ${hadith.text}
            </p>
            
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.log("Error fetching hadiths:", err);
    document.getElementById("hadith-grid").innerHTML =
      "حدث خطأ في تحميل الأحاديث.";
  }
}
getHadiths();
/* End Hadith page */

/* Start Prayer Times Page */

const locationsData = {
  EG: [
    { value: "Cairo", name: "القاهرة" },
    { value: "Alexandria", name: "الإسكندرية" },
    { value: "Gharbia", name: "الغربية" },
    { value: "Dakahlia", name: "الدقهلية" },
  ],
  SA: [
    { value: "Makkah", name: "مكة المكرمة" },
    { value: "Madinah", name: "المدينة المنورة" },
    { value: "Riyadh", name: "الرياض" },
    { value: "Jeddah", name: "جدة" },
  ],
  AE: [
    { value: "Dubai", name: "دبي" },
    { value: "Abu Dhabi", name: "أبو ظبي" },
    { value: "Sharjah", name: "الشارقة" },
  ],
  MA: [
    { value: "Casablanca", name: "الدار البيضاء" },
    { value: "Rabat", name: "الرباط" },
    { value: "Marrakesh", name: "مراكش" },
  ],
  DZ: [
    { value: "Algiers", name: "الجزائر العاصمة" },
    { value: "Oran", name: "وهران" },
    { value: "Constantine", name: "قسنطينة" },
  ],
};

document
  .getElementById("country-select")
  .addEventListener("change", function () {
    const country = this.value;
    const citySelect = document.getElementById("city-select");

    citySelect.innerHTML = "";

    locationsData[country].forEach((city) => {
      citySelect.innerHTML += `<option value="${city.value}">${city.name}</option>`;
    });
  });

async function getPrayerTimes(country, city) {
  const container = document.getElementById("prayer-cards-container");
  container.innerHTML =
    '<div class="col-12"><p class="text-muted">جاري تحميل المواقيت...</p></div>';

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`,
    );
    const data = await response.json();
    const timings = data.data.timings;
    const date = data.data.date;

    document.getElementById("gregorian-date").innerText = date.gregorian.date;
    document.getElementById("hijri-date").innerText =
      `${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year} هـ`;

    const prayers = [
      { id: "Fajr", name: "الفجر", icon: "fa-cloud-moon" },
      { id: "Sunrise", name: "الشروق", icon: "fa-cloud-sun" },
      { id: "Dhuhr", name: "الظهر", icon: "fa-sun" },
      { id: "Asr", name: "العصر", icon: "fa-clock" },
      { id: "Maghrib", name: "المغرب", icon: "fa-moon" },
      { id: "Isha", name: "العشاء", icon: "fa-star-and-crescent" },
    ];

    container.innerHTML = "";

    prayers.forEach((prayer) => {
      let time24 = timings[prayer.id];
      let time12 = formatTime(time24);

      container.innerHTML += `
        <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div class="quran-card p-4 d-flex flex-column align-items-center justify-content-center h-100" style="border-radius: 16px; border: 1px solid rgba(39, 191, 138, 0.15); transition: 0.3s;">
            <i class="fa-solid ${prayer.icon} mb-3" style="font-size: 28px; color: var(--primary-color);"></i>
            <h4 class="text-white mb-2" style="font-size: 22px;">${prayer.name}</h4>
            <p class="mb-0 quran-text" style="color: var(--primary-color); font-size: 22px; font-weight: bold;">${time12}</p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    container.innerHTML =
      '<div class="col-12"><p class="text-danger">حدث خطأ في تحميل المواقيت. تأكد من اتصالك بالإنترنت.</p></div>';
  }
}

function formatTime(time) {
  let [hours, minutes] = time.split(":");
  let ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

document.getElementById("get-prayer-times").addEventListener("click", () => {
  const country = document.getElementById("country-select").value;
  const city = document.getElementById("city-select").value;
  getPrayerTimes(country, city);
});

window.addEventListener("DOMContentLoaded", () => {
  const defaultCountry = document.getElementById("country-select").value;
  const defaultCity = document.getElementById("city-select").value;
  getPrayerTimes(defaultCountry, defaultCity);
});
/* End Prayer Times Page */

/* PWA */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      console.log("Service Worker Registered!", reg);
    });
  });
}

/* PWA Custom Install Button Logic */
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('d-none');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  deferredPrompt = null;
  installBtn.classList.add('d-none');
});

window.addEventListener('appinstalled', () => {
  installBtn.classList.add('d-none');
  deferredPrompt = null;
  console.log('PWA was installed');
});