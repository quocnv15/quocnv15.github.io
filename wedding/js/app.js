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

// Ảnh là kỷ niệm cần lưu lâu dài, nhưng ảnh gốc từ điện thoại quá nặng cho cả hai phía:
// thẻ <img> preview phải giải mã bitmap ở độ phân giải đầy đủ (ảnh 12MP ≈ 48MB RAM/ảnh,
// chọn 10 ảnh là đủ để Safari iOS kill tab), và base64 tăng 33% khiến request lên GAS dễ rớt.
// 2048px @ 0.88 vẫn in đẹp khổ 13x18cm và xem TV 4K thoải mái.
// maxDimension là hạn mức BỘ NHỚ, không phải hạn mức chất lượng: preview giải mã bitmap
// theo số điểm ảnh (2048x1536x4B ≈ 12MB/ảnh), nên tăng nó là tăng nguy cơ kill tab.
// jpegQuality chỉ ảnh hưởng dung lượng file, KHÔNG ảnh hưởng bitmap — nâng nó là cách
// tăng chất lượng an toàn nhất khi đã có 17 ảnh chạy ổn ở 2048px.
const IMAGE_UPLOAD_CONFIG = {
  maxOriginalBytes: 1.5 * 1024 * 1024,
  maxDimension: 2048,
  jpegQuality: 0.94,
  maxCompressedBytes: 4 * 1024 * 1024
};

// STATE MANAGEMENT
const state = {
  currentDate: "12-09", // '11-09' (Tiệc Nhà Gái) hoặc '12-09' (Lễ Cưới Chính)
  selectedFiles: [],    // Danh sách ảnh & video đã chọn
  isUploading: false,
  songs: []
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initDateSwitcher();
  initSenderQuickTags();
  initUploadDropzone();
  initImageLightbox();
  initSongAccordion();
  initSongForm();
  loadMockSongs();
});

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
    btn11.setAttribute("aria-selected", "true");
    btn12.setAttribute("aria-selected", "false");
    if (bannerTag) bannerTag.innerHTML = "Đang chọn: <strong>11.09 — Tiệc Nhà Gái</strong>";
    showToast("Đã chuyển sang 11.09 — Tiệc Nhà Gái");
  });

  btn12.addEventListener("click", () => {
    state.currentDate = "12-09";
    btn12.classList.add("active");
    btn11.classList.remove("active");
    btn12.setAttribute("aria-selected", "true");
    btn11.setAttribute("aria-selected", "false");
    if (bannerTag) bannerTag.innerHTML = "Đang chọn: <strong>12.09 — Lễ Thành Hôn</strong>";
    showToast("Đã chuyển sang 12.09 — Lễ Thành Hôn");
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
      // The chip carries its value in data-name so the label can be styled
      // or reworded without the value silently changing.
      senderInput.value = tag.dataset.name || tag.innerText.trim();
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
  // One input handles the whole job: accept="image/*,video/*" multiple makes
  // iOS and Android show their own sheet with "Take Photo" alongside the
  // library, so separate camera and video buttons only duplicated this.
  const mediaInput = document.getElementById("mediaFileInput");

  const btnLibrary = document.getElementById("btnActionLibrary");
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
  if (btnLibrary && mediaInput) {
    btnLibrary.addEventListener("click", () => {
      if (!state.isUploading) mediaInput.click();
    });
    mediaInput.addEventListener("change", (e) => {
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
    compressHint.innerText = `Đang xử lý và tối ưu ${fileList.length} file…`;

    const COMPRESS_CONCURRENCY = 3; // Nén tối đa 3 ảnh đồng thời để bảo toàn RAM trên mobile
    let processedCount = 0;

    await runParallelPool(fileList, COMPRESS_CONCURRENCY, async (file) => {
      if (file.type.startsWith("image/")) {
        const preparedImage = await prepareImageForUpload(file);
        return {
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
          file: file,
          name: file.name,
          mimeType: preparedImage.mimeType,
          base64: preparedImage.base64,
          previewUrl: preparedImage.base64,
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
      compressHint.innerText = `Đang nén tối ưu ${processedCount}/${total} file…`;
      if (result && !result.error) {
        state.selectedFiles.push(result);
        renderMediaPreviews();
      }
    });

    compressHint.innerText = `Đã sẵn sàng ${state.selectedFiles.length} file chất lượng cao để gửi lên Drive`;
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
      uploadBtn.innerHTML = `<span>Gửi lên Google Drive</span>`;
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
          <div class="preview-video-tile">
            Video<span>${item.name.substring(0, 12)}…</span>
          </div>
        `;
      }

      const removeBtnHtml = !state.isUploading
        ? `<button class="remove-btn" onclick="removeMedia(${index})" aria-label="Xóa file này"><span aria-hidden="true">&times;</span></button>`
        : "";

      const overlayHtml = getStatusOverlayHtml(item.status);

      div.innerHTML = `${mediaHtml}${removeBtnHtml}${overlayHtml}`;
      previewGrid.appendChild(div);
    });

    uploadBtn.disabled = state.isUploading || count === 0;
    uploadBtn.innerHTML = `<span>Gửi ${count} ảnh/video lên Drive</span>`;
  }

  function getStatusOverlayHtml(status) {
    if (status === "uploading") {
      return `<div class="preview-overlay status-uploading"><div class="preview-spinner"></div><span>Đang tải...</span></div>`;
    } else if (status === "success") {
      return `<div class="preview-overlay status-success"><span class="status-badge-icon"><svg class="icon-line" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span><span>Đã xong</span></div>`;
    } else if (status === "error") {
      return `<div class="preview-overlay status-error"><span class="status-badge-icon"><svg class="icon-line" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="9"/></svg></span><span>Lỗi</span></div>`;
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
      showToast("Vui lòng chọn ít nhất 1 ảnh từ album");
      return;
    }

    state.isUploading = true;
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = `<span>Đang tải lên Drive…</span>`;
    if (floatingBar) floatingBar.style.display = "none";

    renderMediaPreviews();

    if (progressWrapper) {
      progressWrapper.style.display = "block";
      progressBarFill.style.width = "0%";
      progressPercent.innerText = "0%";
      progressText.innerText = `Đang tải lên Drive… (0/${state.selectedFiles.length})`;
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
          if (progressText) progressText.innerText = `Đang tải lên Drive… (${completed}/${total})`;
        }
      );

      const failedCount = state.selectedFiles.filter(f => f.status === "error").length;

      if (failedCount === 0) {
        if (progressText) progressText.innerText = `Đã tải hoàn tất ${totalFiles}/${totalFiles} file`;
        if (progressBarFill) progressBarFill.style.width = "100%";
        if (progressPercent) progressPercent.innerText = "100%";

        triggerConfetti();
        showToast(`Đã tải thành công ${totalFiles} ảnh lên Google Drive của Lucy & Ariel`);

        setTimeout(() => {
          state.selectedFiles = [];
          state.isUploading = false;
          renderMediaPreviews();
          if (mediaInput) mediaInput.value = "";
          if (compressHint) compressHint.style.display = "none";
          if (progressWrapper) progressWrapper.style.display = "none";
        }, 1500);
      } else {
        state.isUploading = false;
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = `<span>Thử lại (${failedCount} file chưa xong)</span>`;
        if (floatingBar) floatingBar.style.display = "block";
        renderMediaPreviews();
        showToast(`Có ${failedCount} file chưa tải xong. Bấm "Thử lại" để gửi tiếp.`);
      }
    } catch (err) {
      console.error("Lỗi upload:", err);
      state.isUploading = false;
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = `<span>📤 Gửi Lên Google Drive</span>`;
      if (floatingBar) floatingBar.style.display = "block";
      renderMediaPreviews();
      showToast("Có lỗi xảy ra, vui lòng thử lại");
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

  const toggle = () => {
    const isHidden = collapse.style.display === "none";
    collapse.style.display = isHidden ? "block" : "none";
    header.setAttribute("aria-expanded", String(isHidden));
    if (arrow) arrow.classList.toggle("rotated", isHidden);
  };

  header.addEventListener("click", toggle);

  // The header is a div with role="button", so it needs its own key handling.
  header.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
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
      showToast("Vui lòng nhập tên bài hát");
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
    showToast(`Đã gửi bài hát "${title}" tới ban nhạc`);
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
        <span class="feed-sender">${item.title}</span>
        <span class="feed-time">${item.time}</span>
      </div>
      <div class="feed-message"><small>Người gửi:</small> <strong>${item.sender}</strong> ${item.artist ? `(${item.artist})` : ''} ${item.note ? `• <em>"${item.note}"</em>` : ''}</div>
    `;
    container.appendChild(div);
  });
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
  // Champagne, bronze and ivory only — drawn from the couple's portrait.
  const colors = ["#BA9261", "#996F39", "#DAC6AE", "#F4EFE6", "#8C764D"];

  for (let i = 0; i < 44; i++) {
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
 * Chuẩn bị ảnh theo hướng chất lượng cao.
 * File gốc nhỏ được giữ nguyên; chỉ ảnh lớn mới được hạ kích thước/encode JPEG.
 */
async function prepareImageForUpload(file) {
  if (file.size <= IMAGE_UPLOAD_CONFIG.maxOriginalBytes || !canSafelyReencode(file)) {
    return { base64: await fileToBase64(file), mimeType: file.type || "image/jpeg" };
  }

  try {
    const base64 = await compressImage(
      file,
      IMAGE_UPLOAD_CONFIG.maxDimension,
      IMAGE_UPLOAD_CONFIG.jpegQuality,
      IMAGE_UPLOAD_CONFIG.maxCompressedBytes
    );

    return { base64, mimeType: "image/jpeg" };
  } catch (error) {
    console.warn("Không thể nén ảnh; giữ nguyên file gốc:", error);
    return { base64: await fileToBase64(file), mimeType: file.type || "image/jpeg" };
  }
}

function canSafelyReencode(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function compressImage(file, maxDimension, quality, maxBytes) {
  return new Promise((resolve, reject) => {
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
        // Mặc định của canvas là "low" — thu ảnh 4032px xuống 2048px bằng bộ lọc đó
        // gây mờ và răng cưa rõ rệt. "high" dùng bộ lọc tốt hơn, không tốn thêm bộ nhớ.
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Sàn chất lượng 0.82: dưới mức này ảnh bắt đầu lộ khối JPEG trên da người.
        const MIN_QUALITY = 0.82;
        let encodedQuality = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", encodedQuality);
        while (dataUrlByteLength(dataUrl) > maxBytes && encodedQuality > MIN_QUALITY) {
          encodedQuality = Math.max(MIN_QUALITY, encodedQuality - 0.04);
          dataUrl = canvas.toDataURL("image/jpeg", encodedQuality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Trình duyệt không thể đọc ảnh để nén"));
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataUrlByteLength(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.floor((base64.length * 3) / 4);
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
