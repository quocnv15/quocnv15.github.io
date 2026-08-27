/**
 * =========================================================================
 * WEDDING QR GUESTBOOK & MEDIA HUB — CLIENT-SIDE JAVASCRIPT LOGIC
 * =========================================================================
 * Chuẩn UI/UX Mobbin & Apple Photos — Tối ưu hóa tải song song lên Google Drive
 * Tương thích 100% Mobile Safari (iOS) & Chrome (Android)
 * Không cần đăng nhập — Nén ảnh client-side & Upload Google Drive API
 * Google Drive Target: Lucy & Ariel Wedding 2026
 * =========================================================================
 */

// CẤU HÌNH GOOGLE APPS SCRIPT WEBHOOK URL
const GAS_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwoHOMQde92r4LciK_DVYuY0sWw8LEOCFi7NGA5_kh6luTUIgqEdhEyuW4cLm6xIKst/exec";

// STATE MANAGEMENT
const state = {
  currentDate: "12-09", // '11-09' (Tiệc Nhà Gái) hoặc '12-09' (Lễ Cưới Chính)
  selectedFiles: [],    // Danh sách ảnh & video đã chọn
  isUploading: false,
  songs: []
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initPetals();
  initDateSwitcher();
  initSenderQuickTags();
  initUploadDropzone();
  initImageLightbox();
  initSongAccordion();
  initSongForm();
  initLuckyModal();
  loadMockSongs();
});

/**
 * 🌸 Hiệu ứng cánh hoa rơi lãng mạn
 */
function initPetals() {
  const container = document.getElementById("petalsContainer");
  if (!container) return;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${9 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.width = `${12 + Math.random() * 8}px`;
    petal.style.height = `${16 + Math.random() * 10}px`;
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
    showToast("Đã chuyển sang: 11/09 (Tiệc Nhà Gái) 🌸");
  });

  btn12.addEventListener("click", () => {
    state.currentDate = "12-09";
    btn12.classList.add("active");
    btn11.classList.remove("active");
    if (bannerTag) bannerTag.innerHTML = "💍 Đang chọn: <strong>12/09 — Lễ Cưới Chính</strong>";
    showToast("Đã chuyển sang: 12/09 (Lễ Cưới Chính) 💍");
  });
}

/**
 * 🏷️ Quick Sender Tags (Chạm 1 lần để điền nhanh nhóm/mối quan hệ)
 */
function initSenderQuickTags() {
  const senderInput = document.getElementById("mediaSenderName");
  const tags = document.querySelectorAll(".sender-tag-chip");

  if (!senderInput || !tags.length) return;

  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      tags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      senderInput.value = tag.innerText.replace(/^[^\s]+\s/, "");
      senderInput.focus();
    });
  });
}

/**
 * ⚡ Tiện ích thực thi tác vụ bất đồng bộ song song có kiểm soát số luồng (Worker Pool)
 */
async function runParallelPool(items, concurrency, taskFn, onProgress) {
  let currentIndex = 0;
  let completedCount = 0;
  const total = items.length;
  const results = new Array(total);

  if (total === 0) return results;

  const workerCount = Math.min(concurrency, total);
  const workers = Array.from({ length: workerCount }, async () => {
    while (currentIndex < total) {
      const idx = currentIndex++;
      const item = items[idx];
      try {
        results[idx] = await taskFn(item, idx);
      } catch (err) {
        results[idx] = { error: err };
      }
      completedCount++;
      if (typeof onProgress === "function") {
        onProgress(completedCount, total, item, idx, results[idx]);
      }
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * 📸 Upload Media (Ảnh & Video) — Chuẩn Mobbin Action Buttons & Parallel Drive Upload
 */
function initUploadDropzone() {
  const cameraInput = document.getElementById("cameraFileInput");
  const mediaInput = document.getElementById("mediaFileInput");
  const videoInput = document.getElementById("videoFileInput");

  const btnCamera = document.getElementById("btnActionCamera");
  const btnLibrary = document.getElementById("btnActionLibrary");
  const btnVideo = document.getElementById("btnActionVideo");
  const btnAddMore = document.getElementById("btnAddMoreMedia");
  const btnClearAll = document.getElementById("btnClearAllMedia");

  const previewGrid = document.getElementById("mediaPreviewGrid");
  const uploadBtn = document.getElementById("btnSubmitMedia");
  const floatingSubmitBtn = document.getElementById("btnFloatingSubmit");
  const floatingBar = document.getElementById("floatingBottomBar");
  const floatingCountText = document.getElementById("floatingCountText");

  const selectedHeader = document.getElementById("selectedMediaHeader");
  const mediaCountText = document.getElementById("mediaCountText");
  const addMoreWrapper = document.getElementById("addMoreWrapper");
  const compressHint = document.getElementById("compressHint");

  const progressWrapper = document.getElementById("uploadProgressWrapper");
  const progressText = document.getElementById("uploadProgressText");
  const progressPercent = document.getElementById("uploadProgressPercent");
  const progressBarFill = document.getElementById("uploadProgressBarFill");

  if (!mediaInput || !previewGrid || !uploadBtn) return;

  // 1. Action Button Triggers
  if (btnCamera && cameraInput) {
    btnCamera.addEventListener("click", () => {
      if (!state.isUploading) cameraInput.click();
    });
    cameraInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length) handleFiles(e.target.files);
    });
  }

  if (btnLibrary && mediaInput) {
    btnLibrary.addEventListener("click", () => {
      if (!state.isUploading) mediaInput.click();
    });
    mediaInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length) handleFiles(e.target.files);
    });
  }

  if (btnVideo && videoInput) {
    btnVideo.addEventListener("click", () => {
      if (!state.isUploading) videoInput.click();
    });
    videoInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length) handleFiles(e.target.files);
    });
  }

  if (btnAddMore && mediaInput) {
    btnAddMore.addEventListener("click", () => {
      if (!state.isUploading) mediaInput.click();
    });
  }

  if (btnClearAll) {
    btnClearAll.addEventListener("click", () => {
      if (state.isUploading) return;
      state.selectedFiles = [];
      renderMediaPreviews();
      showToast("Đã xóa danh sách ảnh đã chọn");
    });
  }

  // 2. Xử lý nén & chuẩn bị file song song để render preview siêu tốc
  async function handleFiles(files) {
    const fileList = Array.from(files);
    if (!fileList.length) return;

    compressHint.style.display = "block";
    compressHint.innerText = `⚡ Đang xử lý & tối ưu ${fileList.length} file...`;

    const COMPRESS_CONCURRENCY = 3; // Nén tối đa 3 ảnh đồng thời để bảo toàn RAM trên mobile
    let processedCount = 0;

    await runParallelPool(fileList, COMPRESS_CONCURRENCY, async (file) => {
      if (file.type.startsWith("image/")) {
        const compressedBase64 = await compressImage(file, 1600, 0.82);
        return {
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
          file: file,
          name: file.name,
          mimeType: "image/jpeg",
          base64: compressedBase64,
          previewUrl: compressedBase64,
          status: "pending" // 'pending' | 'uploading' | 'success' | 'error'
        };
      } else if (file.type.startsWith("video/")) {
        const base64 = await fileToBase64(file);
        return {
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
          file: file,
          name: file.name,
          mimeType: file.type || "video/mp4",
          base64: base64,
          previewUrl: "",
          status: "pending"
        };
      } else {
        const base64 = await fileToBase64(file);
        return {
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
          file: file,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          base64: base64,
          previewUrl: "",
          status: "pending"
        };
      }
    }, (completed, total, file, idx, result) => {
      processedCount++;
      compressHint.innerText = `⚡ Đang nén tối ưu: ${processedCount}/${total} file...`;
      if (result && !result.error) {
        state.selectedFiles.push(result);
        renderMediaPreviews();
      }
    });

    compressHint.innerText = `✅ Đã sẵn sàng ${state.selectedFiles.length} file để gửi lên Drive`;
    renderMediaPreviews();
  }

  // 3. Render lưới ảnh preview chuẩn Apple Photos Grid
  function renderMediaPreviews() {
    previewGrid.innerHTML = "";
    const count = state.selectedFiles.length;

    if (count === 0) {
      if (selectedHeader) selectedHeader.style.display = "none";
      if (addMoreWrapper) addMoreWrapper.style.display = "none";
      if (compressHint) compressHint.style.display = "none";
      if (floatingBar) floatingBar.style.display = "none";
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = `<span>📤 Gửi Lên Google Drive</span>`;
      return;
    }

    if (selectedHeader) selectedHeader.style.display = "flex";
    if (mediaCountText) mediaCountText.innerText = `${count} file đã chọn`;
    if (addMoreWrapper) addMoreWrapper.style.display = "block";
    if (floatingBar && !state.isUploading) {
      floatingBar.style.display = "block";
      if (floatingCountText) floatingCountText.innerText = `${count} ảnh`;
    }

    state.selectedFiles.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      div.id = `preview-item-${index}`;

      let mediaHtml = "";
      if (item.mimeType.startsWith("image/")) {
        mediaHtml = `<img src="${item.previewUrl}" alt="Preview" onclick="openLightbox(${index})" style="cursor: zoom-in;" />`;
      } else {
        mediaHtml = `
          <div style="background: #2C1810; color: #fff; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.75rem; text-align: center; padding: 4px;">
            🎬 Video<br><span style="font-size: 0.65rem; opacity: 0.8;">${item.name.substring(0, 10)}...</span>
          </div>
        `;
      }

      const removeBtnHtml = !state.isUploading
        ? `<button class="remove-btn" onclick="removeMedia(${index})" title="Xóa ảnh này">✕</button>`
        : "";

      const overlayHtml = getStatusOverlayHtml(item.status);

      div.innerHTML = `${mediaHtml}${removeBtnHtml}${overlayHtml}`;
      previewGrid.appendChild(div);
    });

    uploadBtn.disabled = state.isUploading || count === 0;
    uploadBtn.innerHTML = `<span>📤 Gửi ${count} Ảnh/Video Lên Drive</span>`;
  }

  function getStatusOverlayHtml(status) {
    if (status === "uploading") {
      return `<div class="preview-overlay status-uploading"><div class="preview-spinner"></div><span>Đang tải...</span></div>`;
    } else if (status === "success") {
      return `<div class="preview-overlay status-success"><span class="status-badge-icon">✅</span><span>Đã xong</span></div>`;
    } else if (status === "error") {
      return `<div class="preview-overlay status-error"><span class="status-badge-icon">⚠️</span><span>Lỗi</span></div>`;
    }
    return "";
  }

  // Cập nhật trạng thái từng thumbnail theo thời gian thực
  function updateItemStatusUI(index, status) {
    const itemEl = document.getElementById(`preview-item-${index}`);
    if (!itemEl) return;

    const oldOverlay = itemEl.querySelector(".preview-overlay");
    if (oldOverlay) oldOverlay.remove();

    const newOverlayHtml = getStatusOverlayHtml(status);
    if (newOverlayHtml) {
      itemEl.insertAdjacentHTML("beforeend", newOverlayHtml);
    }
  }

  window.removeMedia = function (index) {
    if (state.isUploading) return;
    state.selectedFiles.splice(index, 1);
    renderMediaPreviews();
    if (state.selectedFiles.length === 0) {
      if (progressWrapper) progressWrapper.style.display = "none";
    }
  };

  window.openLightbox = function (index) {
    const item = state.selectedFiles[index];
    if (!item || !item.previewUrl) return;
    const modal = document.getElementById("imageLightboxModal");
    const img = document.getElementById("lightboxImage");
    const cap = document.getElementById("lightboxCaption");
    if (modal && img) {
      img.src = item.previewUrl;
      if (cap) cap.innerText = item.name || "Ảnh kỷ niệm";
      modal.classList.add("show");
    }
  };

  // 4. Bắt đầu quá trình Tải song song lên Google Drive
  async function triggerStartUpload() {
    const senderName = document.getElementById("mediaSenderName").value.trim() || "Khách mời";

    if (state.selectedFiles.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 ảnh từ Album! 🖼️");
      return;
    }

    state.isUploading = true;
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = `<span>⏳ Đang tải lên Drive...</span>`;
    if (floatingBar) floatingBar.style.display = "none";

    renderMediaPreviews();

    if (progressWrapper) {
      progressWrapper.style.display = "block";
      progressBarFill.style.width = "0%";
      progressPercent.innerText = "0%";
      progressText.innerText = `⚡ Đang tải lên Drive... (0/${state.selectedFiles.length})`;
    }

    const UPLOAD_CONCURRENCY = 3; // 🚀 Tải 3 kết nối song song
    const totalFiles = state.selectedFiles.length;

    try {
      await runParallelPool(
        state.selectedFiles,
        UPLOAD_CONCURRENCY,
        async (item, index) => {
          if (item.status === "success") {
            return { success: true };
          }

          item.status = "uploading";
          updateItemStatusUI(index, "uploading");

          let isSuccess = false;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              if (GAS_ENDPOINT_URL) {
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
              } else {
                await new Promise(r => setTimeout(r, 600 + Math.random() * 700));
              }
              isSuccess = true;
              break;
            } catch (err) {
              console.warn(`[Retry ${attempt + 1}/2] Lỗi tải file ${item.name}:`, err);
              if (attempt === 0) await new Promise(r => setTimeout(r, 500));
            }
          }

          if (isSuccess) {
            item.status = "success";
            updateItemStatusUI(index, "success");
            return { success: true };
          } else {
            item.status = "error";
            updateItemStatusUI(index, "error");
            return { success: false };
          }
        },
        (completed, total) => {
          const pct = Math.round((completed / total) * 100);
          if (progressBarFill) progressBarFill.style.width = `${pct}%`;
          if (progressPercent) progressPercent.innerText = `${pct}%`;
          if (progressText) progressText.innerText = `⚡ Đang tải lên Drive... (${completed}/${total})`;
        }
      );

      const failedCount = state.selectedFiles.filter(f => f.status === "error").length;

      if (failedCount === 0) {
        if (progressText) progressText.innerText = `🎉 Đã tải hoàn tất ${totalFiles}/${totalFiles} file!`;
        if (progressBarFill) progressBarFill.style.width = "100%";
        if (progressPercent) progressPercent.innerText = "100%";

        triggerConfetti();
        showLuckyTicketModal(senderName);
        showToast(`🎉 Tải thành công ${totalFiles} ảnh lên Google Drive của Lucy & Ariel!`);

        setTimeout(() => {
          state.selectedFiles = [];
          state.isUploading = false;
          renderMediaPreviews();
          if (mediaInput) mediaInput.value = "";
          if (cameraInput) cameraInput.value = "";
          if (videoInput) videoInput.value = "";
          if (compressHint) compressHint.style.display = "none";
          if (progressWrapper) progressWrapper.style.display = "none";
        }, 1500);
      } else {
        state.isUploading = false;
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = `<span>🔄 Thử Lại (${failedCount} file chưa xong)</span>`;
        if (floatingBar) floatingBar.style.display = "block";
        renderMediaPreviews();
        showToast(`⚠️ Có ${failedCount} file tải chưa thành công. Bấm 'Thử Lại' để gửi tiếp nhé!`);
      }
    } catch (err) {
      console.error("Lỗi upload:", err);
      state.isUploading = false;
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = `<span>📤 Gửi Lên Google Drive</span>`;
      if (floatingBar) floatingBar.style.display = "block";
      renderMediaPreviews();
      showToast("❌ Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  uploadBtn.addEventListener("click", triggerStartUpload);
  if (floatingSubmitBtn) floatingSubmitBtn.addEventListener("click", triggerStartUpload);
}

/**
 * 🖼️ Image Lightbox (Phóng to ảnh khi chạm vào thumbnail)
 */
function initImageLightbox() {
  const modal = document.getElementById("imageLightboxModal");
  const overlay = document.getElementById("lightboxOverlay");
  const closeBtn = document.getElementById("btnCloseLightbox");

  if (!modal) return;

  const closeModal = () => modal.classList.remove("show");

  if (overlay) overlay.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });
}

/**
 * 🎵 Song Accordion Toggle (Mở rộng/Thu gọn form tặng bài hát)
 */
function initSongAccordion() {
  const header = document.getElementById("songToggleHeader");
  const collapse = document.getElementById("songFormCollapse");
  const arrow = document.getElementById("songAccordionArrow");

  if (!header || !collapse) return;

  header.addEventListener("click", () => {
    const isHidden = collapse.style.display === "none";
    collapse.style.display = isHidden ? "block" : "none";
    if (arrow) arrow.classList.toggle("rotated", isHidden);
  });
}

/**
 * 🎶 Yêu cầu bài hát (Request Song Form)
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
    showToast(`🎶 Đã gửi bài hát "${title}" tới ban nhạc!`);
  });
}

function loadMockSongs() {
  state.songs = [
    { title: "Cưới Nhau Đi (Yes I Do)", artist: "Bùi Anh Tuấn", sender: "Hội bạn thân", note: "Hát tặng Lucy & Ariel", time: "10 phút trước" },
    { title: "Ánh Nắng Của Anh", artist: "Đức Phúc", sender: "Minh Quân", note: "Nhạc ngọt ngào", time: "25 phút trước" }
  ];
  renderSongsFeed();
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
 * 🎟️ Lucky Ticket Modal (Hiển thị vé số may mắn & Copy mã)
 */
function generateLuckyNumber() {
  const rand = Math.floor(100 + Math.random() * 900);
  return `LUCKY-${rand}`;
}

function initLuckyModal() {
  const modal = document.getElementById("luckyModal");
  const closeBtn = document.getElementById("btnCloseLuckyModal");
  const copyBtn = document.getElementById("btnCopyLuckyCode");
  const numDisplay = document.getElementById("luckyNumberText");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });

  if (copyBtn && numDisplay) {
    copyBtn.addEventListener("click", () => {
      const code = numDisplay.innerText.trim();
      navigator.clipboard.writeText(code).then(() => {
        showToast("📋 Đã sao chép mã vé số may mắn!");
      }).catch(() => {
        showToast("Mã của bạn: " + code);
      });
    });
  }
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

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
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
      p.vy += 0.35;
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
 * ⚡ Tiện ích nén ảnh phía Client (Canvas Downscale)
 */
function compressImage(file, maxDimension = 1600, quality = 0.82) {
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
      img.onerror = () => {
        fileToBase64(file).then(resolve).catch(() => resolve(e.target.result));
      };
      img.src = e.target.result;
    };
    reader.onerror = () => resolve("");
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
