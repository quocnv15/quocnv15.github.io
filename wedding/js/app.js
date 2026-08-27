/**
 * =========================================================================
 * WEDDING QR GUESTBOOK & MEDIA HUB — CLIENT-SIDE JAVASCRIPT LOGIC
 * =========================================================================
 * Tương thích 100% Mobile Safari (iOS) & Chrome (Android)
 * Không cần đăng nhập — Hỗ trợ nén ảnh client-side & Upload Google Drive API
 * Google Drive Target Folder ID (Thư mục TEST): 1DepYTCjsYJL-rUqdfV9_WknzQTgzHsyz
 * Cô dâu & Chú rể: Lucy & Andrew
 * =========================================================================
 */

// CẤU HÌNH GOOGLE APPS SCRIPT WEBHOOK URL
// (Sau khi deploy theo file setup_guide.md, dán URL vào đây. Nếu để trống, app sẽ chạy chế độ Mock Preview)
const GAS_ENDPOINT_URL = ""; 

// STATE MANAGEMENT
const state = {
  currentDate: "12-09", // '11-09' (Tiệc Nhà Gái) hoặc '12-09' (Lễ Cưới Chính)
  activeTab: "upload",
  selectedFiles: [], // Danh sách ảnh/video
  voiceBlob: null, // Audio blob ghi âm
  voiceBase64: null,
  isRecording: false,
  mediaRecorder: null,
  voiceTimerInterval: null,
  recordSeconds: 0,
  currentTheme: "rose_gold",
  wishes: [],
  songs: []
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initPetals();
  initDateSwitcher();
  initTabs();
  initUploadDropzone();
  initVoiceRecorder();
  initWishForm();
  initSongForm();
  initPhotoFrameTool();
  initLuckyModal();
  loadMockData();
});

/**
 * 🌸 Hiệu ứng cánh hoa rơi lãng mạn
 */
function initPetals() {
  const container = document.getElementById("petalsContainer");
  if (!container) return;
  const count = 16;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${8 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.width = `${12 + Math.random() * 10}px`;
    petal.style.height = `${16 + Math.random() * 12}px`;
    container.appendChild(petal);
  }
}

/**
 * 📅 Chuyển đổi ngày sự kiện (11/09 Tiệc Nhà Gái <-> 12/09 Lễ Cưới Chính)
 */
function initDateSwitcher() {
  const btn11 = document.getElementById("btnDate11");
  const btn12 = document.getElementById("btnDate12");
  const bannerTag = document.getElementById("currentDateTag");

  if (!btn11 || !btn12) return;

  btn11.addEventListener("click", () => {
    state.currentDate = "11-09";
    btn11.classList.add("active");
    btn12.classList.remove("active");
    if (bannerTag) bannerTag.innerHTML = "🌸 Đang chọn: <strong>11/09 — Tiệc Nhà Gái</strong>";
    showToast("Đã chọn sự kiện: 11/09 (Tiệc Nhà Gái) 🌸");
  });

  btn12.addEventListener("click", () => {
    state.currentDate = "12-09";
    btn12.classList.add("active");
    btn11.classList.remove("active");
    if (bannerTag) bannerTag.innerHTML = "💍 Đang chọn: <strong>12/09 — Lễ Cưới Chính</strong>";
    showToast("Đã chọn sự kiện: 12/09 (Lễ Cưới Chính) 💍");
  });
}

/**
 * 📑 Điều hướng Tab
 */
function initTabs() {
  const tabPills = document.querySelectorAll(".tab-pill");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const targetTab = pill.getAttribute("data-tab");
      state.activeTab = targetTab;

      tabPills.forEach(p => p.classList.remove("active"));
      tabPanes.forEach(pane => pane.classList.remove("active"));

      pill.classList.add("active");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

/**
 * 📸 Upload Media (Ảnh & Video) + Nén ảnh tại Client
 */
function initUploadDropzone() {
  const dropzone = document.getElementById("mediaDropzone");
  const fileInput = document.getElementById("mediaFileInput");
  const previewGrid = document.getElementById("mediaPreviewGrid");
  const uploadBtn = document.getElementById("btnSubmitMedia");
  const compressHint = document.getElementById("compressHint");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files) handleFiles(e.target.files);
  });

  async function handleFiles(files) {
    if (!files.length) return;
    compressHint.style.display = "block";
    compressHint.innerText = "⚡ Đang tối ưu hóa & nén ảnh để gửi nhanh...";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const compressedBase64 = await compressImage(file, 1600, 0.82);
        state.selectedFiles.push({
          file: file,
          name: file.name,
          mimeType: "image/jpeg",
          base64: compressedBase64,
          previewUrl: compressedBase64
        });
      } else if (file.type.startsWith("video/")) {
        const base64 = await fileToBase64(file);
        state.selectedFiles.push({
          file: file,
          name: file.name,
          mimeType: file.type || "video/mp4",
          base64: base64,
          previewUrl: ""
        });
      }
    }

    compressHint.innerText = `✅ Đã sẵn sàng ${state.selectedFiles.length} file để gửi`;
    renderMediaPreviews();
  }

  function renderMediaPreviews() {
    previewGrid.innerHTML = "";
    state.selectedFiles.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      if (item.mimeType.startsWith("image/")) {
        div.innerHTML = `
          <img src="${item.previewUrl}" alt="Preview" />
          <button class="remove-btn" onclick="removeMedia(${index})">✕</button>
        `;
      } else {
        div.innerHTML = `
          <div style="background: #2C1810; color: #fff; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.75rem; text-align: center; padding: 4px;">
            🎥 Clip<br><span style="font-size: 0.65rem; opacity: 0.8;">${item.name.substring(0, 10)}...</span>
          </div>
          <button class="remove-btn" onclick="removeMedia(${index})">✕</button>
        `;
      }
      previewGrid.appendChild(div);
    });

    uploadBtn.disabled = state.selectedFiles.length === 0;
  }

  window.removeMedia = function(index) {
    state.selectedFiles.splice(index, 1);
    renderMediaPreviews();
  };

  uploadBtn.addEventListener("click", async () => {
    const senderName = document.getElementById("mediaSenderName").value.trim() || "Khách mời";

    if (state.selectedFiles.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 ảnh hoặc video! 📷");
      return;
    }

    uploadBtn.disabled = true;
    uploadBtn.innerHTML = `⏳ Đang tải lên Drive (${state.selectedFiles.length} file)...`;

    try {
      if (GAS_ENDPOINT_URL) {
        for (const item of state.selectedFiles) {
          await fetch(GAS_ENDPOINT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
              action: "uploadMedia",
              eventDate: state.currentDate,
              senderName: senderName,
              fileName: item.name,
              mimeType: item.mimeType,
              fileData: item.base64
            })
          });
        }
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }

      triggerConfetti();
      showLuckyTicketModal(senderName);
      showToast("🎉 Tải ảnh lên Google Drive thành công! Cảm ơn bạn!");
      state.selectedFiles = [];
      renderMediaPreviews();
      document.getElementById("mediaFileInput").value = "";
      compressHint.style.display = "none";
    } catch (err) {
      console.error(err);
      showToast("❌ Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = `📤 Gửi Lên Google Drive`;
    }
  });
}

/**
 * 🎙️ Voice Guestbook (Ghi âm lời chúc bằng giọng nói)
 */
function initVoiceRecorder() {
  const btnToggle = document.getElementById("btnRecordToggle");
  const pulseRing = document.getElementById("pulseRing");
  const statusText = document.getElementById("voiceStatus");
  const timerText = document.getElementById("voiceTimer");
  const audioPreviewContainer = document.getElementById("audioPreviewContainer");
  const audioPreview = document.getElementById("audioPreview");
  const btnReset = document.getElementById("btnResetVoice");
  const btnSubmit = document.getElementById("btnSubmitVoice");

  if (!btnToggle) return;

  let audioChunks = [];

  btnToggle.addEventListener("click", async () => {
    if (!state.isRecording) {
      // Bắt đầu ghi âm
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        state.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };

        state.mediaRecorder.onstop = async () => {
          const mimeType = state.mediaRecorder.mimeType || "audio/webm";
          state.voiceBlob = new Blob(audioChunks, { type: mimeType });
          state.voiceBase64 = await fileToBase64(state.voiceBlob);
          
          const audioUrl = URL.createObjectURL(state.voiceBlob);
          audioPreview.src = audioUrl;
          audioPreviewContainer.style.display = "block";
          btnSubmit.disabled = false;
          statusText.innerText = "✅ Đã ghi âm xong! Bạn có thể nghe lại bên dưới:";
        };

        state.mediaRecorder.start();
        state.isRecording = true;
        btnToggle.classList.add("recording");
        pulseRing.classList.add("active");
        statusText.innerText = "🔴 Đang ghi âm... Hãy nói lời chúc của bạn!";
        timerText.style.display = "block";
        audioPreviewContainer.style.display = "none";
        btnSubmit.disabled = true;

        state.recordSeconds = 0;
        timerText.innerText = "00:00";
        state.voiceTimerInterval = setInterval(() => {
          state.recordSeconds++;
          const mins = String(Math.floor(state.recordSeconds / 60)).padStart(2, '0');
          const secs = String(state.recordSeconds % 60).padStart(2, '0');
          timerText.innerText = `${mins}:${secs}`;
          if (state.recordSeconds >= 60) {
            btnToggle.click();
          }
        }, 1000);

      } catch (err) {
        console.error("Mic error:", err);
        showToast("⚠️ Vui lòng cấp quyền Micro trong trình duyệt để ghi âm!");
      }
    } else {
      // Dừng ghi âm
      state.isRecording = false;
      btnToggle.classList.remove("recording");
      pulseRing.classList.remove("active");
      clearInterval(state.voiceTimerInterval);
      if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
        state.mediaRecorder.stop();
        state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      }
    }
  });

  btnReset.addEventListener("click", () => {
    state.voiceBlob = null;
    state.voiceBase64 = null;
    audioPreview.src = "";
    audioPreviewContainer.style.display = "none";
    timerText.style.display = "none";
    statusText.innerText = "Bấm vào biểu tượng Micro để bắt đầu ghi âm lại";
    btnSubmit.disabled = true;
  });

  btnSubmit.addEventListener("click", async () => {
    const sender = document.getElementById("voiceSender").value.trim() || "Khách mời";

    if (!state.voiceBase64) {
      showToast("Vui lòng ghi âm trước khi gửi nhé! 🎙️");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "⏳ Đang gửi ghi âm lên Drive...";

    try {
      if (GAS_ENDPOINT_URL) {
        await fetch(GAS_ENDPOINT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "uploadMedia",
            eventDate: state.currentDate,
            senderName: sender,
            fileName: `Voice_LoiChuc_${Date.now()}.webm`,
            mimeType: state.voiceBlob.type || "audio/webm",
            fileData: state.voiceBase64
          })
        });
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }

      triggerConfetti();
      showLuckyTicketModal(sender);
      showToast("🎉 Đã gửi lời chúc giọng nói lên Google Drive của Lucy & Andrew!");
      btnReset.click();
    } catch (err) {
      console.error(err);
      showToast("❌ Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = "💌 Gửi Đoạn Ghi Âm Lên Drive";
    }
  });
}

/**
 * 💌 Sổ Lưu Bút & Gửi Lời Chúc
 */
function initWishForm() {
  const wishForm = document.getElementById("wishForm");
  const wishInput = document.getElementById("wishMessage");
  const chips = document.querySelectorAll(".wish-chip");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      wishInput.value = chip.innerText.replace(/^[^\s]+\s/, "");
      wishInput.focus();
    });
  });

  if (!wishForm) return;

  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sender = document.getElementById("wishSender").value.trim() || "Ẩn danh";
    const message = wishInput.value.trim();

    if (!message) {
      showToast("Vui lòng nhập lời chúc nhé! ❤️");
      return;
    }

    const luckyNum = generateLuckyNumber();

    const newWish = {
      senderName: sender,
      message: message,
      luckyNumber: luckyNum,
      eventDate: state.currentDate,
      time: "Vừa xong"
    };

    state.wishes.unshift(newWish);
    renderWishesFeed();

    if (GAS_ENDPOINT_URL) {
      try {
        fetch(GAS_ENDPOINT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "sendWish",
            eventDate: state.currentDate,
            senderName: sender,
            message: message,
            luckyNumber: luckyNum
          })
        });
      } catch (err) {
        console.error(err);
      }
    }

    wishInput.value = "";
    triggerConfetti();
    showLuckyTicketModal(sender, luckyNum);
    showToast("💌 Lời chúc của bạn đã được gửi tới Lucy & Andrew!");
  });
}

/**
 * 🎵 Yêu cầu bài hát (Request Song)
 */
function initSongForm() {
  const songForm = document.getElementById("songForm");
  if (!songForm) return;

  songForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("songTitle").value.trim();
    const artist = document.getElementById("songArtist").value.trim();
    const sender = document.getElementById("songSender").value.trim() || "Khách mời";
    const note = document.getElementById("songNote").value.trim();

    if (!title) {
      showToast("Vui lòng nhập tên bài hát! 🎶");
      return;
    }

    const newSong = {
      title: title,
      artist: artist,
      sender: sender,
      note: note,
      time: "Vừa xong"
    };

    state.songs.unshift(newSong);
    renderSongsFeed();

    if (GAS_ENDPOINT_URL) {
      try {
        fetch(GAS_ENDPOINT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "requestSong",
            songTitle: title,
            artist: artist,
            senderName: sender,
            note: note
          })
        });
      } catch (err) {
        console.error(err);
      }
    }

    songForm.reset();
    showToast(`🎶 Đã gửi yêu cầu bài hát "${title}" tới ban nhạc!`);
  });
}

/**
 * 🖼️ Khung ảnh kỷ niệm đám cưới đa phong cách (Multi-Theme Frame)
 */
let cachedUploadedImage = null;

function initPhotoFrameTool() {
  const frameInput = document.getElementById("framePhotoInput");
  const canvas = document.getElementById("frameCanvas");
  const downloadBtn = document.getElementById("btnDownloadFrame");
  const themeBtns = document.querySelectorAll(".theme-btn");

  if (!frameInput || !canvas) return;

  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentTheme = btn.getAttribute("data-theme");
      if (cachedUploadedImage) {
        drawWeddingFrame(cachedUploadedImage, canvas, state.currentTheme);
      }
    });
  });

  frameInput.addEventListener("change", (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        cachedUploadedImage = img;
        drawWeddingFrame(img, canvas, state.currentTheme);
        downloadBtn.style.display = "flex";
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `Wedding_Lucy_Andrew_${state.currentTheme}_${state.currentDate}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
    showToast("💾 Đã tải ảnh kỷ niệm có khung về máy!");
  });
}

function drawWeddingFrame(img, canvas, theme = "rose_gold") {
  const ctx = canvas.getContext("2d");
  const targetWidth = 1080;
  const targetHeight = 1350; // Tỉ lệ 4:5 chuẩn Instagram/Facebook Story
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Background Styles according to theme
  if (theme === "burgundy") {
    ctx.fillStyle = "#2B0A16";
  } else if (theme === "botanical") {
    ctx.fillStyle = "#F4F7F4";
  } else if (theme === "luxury_gold") {
    ctx.fillStyle = "#1E1A16";
  } else {
    // rose_gold default
    ctx.fillStyle = "#FFF9F6";
  }
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Photo Area
  const margin = 55;
  const photoW = targetWidth - margin * 2;
  const photoH = targetHeight - 260;
  
  const imgRatio = img.width / img.height;
  const targetRatio = photoW / photoH;
  let sx, sy, sWidth, sHeight;
  if (imgRatio > targetRatio) {
    sHeight = img.height;
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, margin, margin, photoW, photoH);

  // Border & Badges
  if (theme === "burgundy") {
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 6;
    ctx.strokeRect(margin + 10, margin + 10, photoW - 20, photoH - 20);

    ctx.fillStyle = "#F3E5AB";
    ctx.font = "bold 46px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("💍 LUCY & ANDREW 💍", targetWidth / 2, targetHeight - 120);

    ctx.fillStyle = "#FFAAA6";
    ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("11.09.2026 — 12.09.2026 • Trăm Năm Hòa Hợp", targetWidth / 2, targetHeight - 70);

  } else if (theme === "botanical") {
    ctx.strokeStyle = "#4A7C59";
    ctx.lineWidth = 4;
    ctx.strokeRect(margin + 10, margin + 10, photoW - 20, photoH - 20);

    ctx.fillStyle = "#2D5A3A";
    ctx.font = "bold 46px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("🌿 Happy Wedding Lucy & Andrew 🌿", targetWidth / 2, targetHeight - 120);

    ctx.fillStyle = "#6B8E23";
    ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("11.09.2026 — 12.09.2026 • Sweet Love", targetWidth / 2, targetHeight - 70);

  } else if (theme === "luxury_gold") {
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 5;
    ctx.strokeRect(margin + 10, margin + 10, photoW - 20, photoH - 20);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 46px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ THE WEDDING CELEBRATION ✨", targetWidth / 2, targetHeight - 120);

    ctx.fillStyle = "#F3E5AB";
    ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Lucy & Andrew • 11.09 — 12.09.2026", targetWidth / 2, targetHeight - 70);

  } else {
    // Rose Gold
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 4;
    ctx.strokeRect(margin + 8, margin + 8, photoW - 16, photoH - 16);

    ctx.fillStyle = "#8B263E";
    ctx.font = "bold 46px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("🌸 Happy Wedding Lucy & Andrew 🌸", targetWidth / 2, targetHeight - 120);

    ctx.fillStyle = "#735D55";
    ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("11.09.2026 — 12.09.2026 | Trăm Năm Hạnh Phúc", targetWidth / 2, targetHeight - 70);
  }
}

/**
 * 🎟️ Lucky Ticket Number & Modal
 */
function generateLuckyNumber() {
  const rand = Math.floor(100 + Math.random() * 900);
  return `LUCKY-${rand}`;
}

function initLuckyModal() {
  const modal = document.getElementById("luckyModal");
  const closeBtn = document.getElementById("btnCloseLuckyModal");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });
}

function showLuckyTicketModal(sender, luckyNumber) {
  const modal = document.getElementById("luckyModal");
  const numDisplay = document.getElementById("luckyNumberText");
  const infoDisplay = document.getElementById("luckyGuestInfo");
  if (!modal || !numDisplay) return;

  const num = luckyNumber || generateLuckyNumber();
  numDisplay.innerText = num;
  infoDisplay.innerText = `Khách mời: ${sender}`;
  modal.classList.add("show");
}

/**
 * 🎊 Confetti Canvas Animation
 */
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#E29578", "#8B263E", "#D4AF37", "#FFD1CD", "#FF3366", "#FFFFFF"];

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rSpeed;
      p.alpha -= 0.015;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

/**
 * 📦 Dữ liệu mẫu (Mock Data)
 */
function loadMockData() {
  state.wishes = [
    { senderName: "Hội Bạn Đại Học", message: "Chúc bạn Lucy và Andrew trăm năm hòa hợp, sớm đón thiên thần nhỏ nha! 🎉💐", time: "10 phút trước" },
    { senderName: "Anh Tuấn & Chị Lan", message: "Chúc hai em luôn hạnh phúc và yêu thương nhau như ngày đầu tiên! ❤️", time: "25 phút trước" },
    { senderName: "Nhóm Bạn Thân Cấp 3", message: "Mãi mãi bên nhau bạn nhé! Nay cô dâu xinh đẹp tuyệt trần! 👰✨", time: "1 giờ trước" }
  ];

  state.songs = [
    { title: "Cưới Nhau Đi (Yes I Do)", artist: "Bùi Anh Tuấn", sender: "Hội bạn thân", note: "Hát tặng Lucy & Andrew", time: "15 phút trước" },
    { title: "Ánh Nắng Của Anh", artist: "Đức Phúc", sender: "Minh Quân", note: "Nhạc ngọt ngào", time: "30 phút trước" }
  ];

  renderWishesFeed();
  renderSongsFeed();
}

function renderWishesFeed() {
  const container = document.getElementById("wishesFeed");
  if (!container) return;
  container.innerHTML = "";
  state.wishes.forEach(item => {
    const div = document.createElement("div");
    div.className = "feed-card";
    div.innerHTML = `
      <div class="feed-header">
        <span class="feed-sender">💌 ${item.senderName}</span>
        <span class="feed-time">${item.time}</span>
      </div>
      <div class="feed-message">${item.message}</div>
    `;
    container.appendChild(div);
  });
}

function renderSongsFeed() {
  const container = document.getElementById("songsFeed");
  if (!container) return;
  container.innerHTML = "";
  state.songs.forEach(item => {
    const div = document.createElement("div");
    div.className = "feed-card";
    div.innerHTML = `
      <div class="feed-header">
        <span class="feed-sender">🎵 ${item.title}</span>
        <span class="feed-time">${item.time}</span>
      </div>
      <div class="feed-message"><small>Người gửi:</small> <strong>${item.sender}</strong> ${item.artist ? `(${item.artist})` : ''} ${item.note ? `• <em>"${item.note}"</em>` : ''}</div>
    `;
    container.appendChild(div);
  });
}

/**
 * ⚡ Tiện ích nén ảnh phía Client (Canvas Downscale)
 */
function compressImage(file, maxDimension = 1600, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 💬 Toast thông báo
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}
