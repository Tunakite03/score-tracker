# Hướng dẫn Test PWA (Progressive Web App)

## ✅ PWA đã được cấu hình

Web app của bạn đã được thiết lập đầy đủ các tính năng PWA:

- ✓ Service Worker
- ✓ Web App Manifest
- ✓ PWA Icons (192x192, 512x512, maskable)
- ✓ Install Prompt Component
- ✓ Offline Support

## 📱 Cách test trên máy tính (Chrome)

1. Mở Chrome và truy cập `http://localhost:5173`
2. Mở DevTools (F12) → Application tab → Service Workers
3. Kiểm tra service worker đã active chưa
4. Vào tab Manifest, xem thông tin PWA
5. Thanh địa chỉ Chrome sẽ có icon ⊕ (install) → Click để cài đặt

## 📱 Cách test trên điện thoại THẬT

**⚠️ QUAN TRỌNG:** Popup cài đặt PWA chỉ xuất hiện khi:

- ✅ Truy cập qua **HTTPS** (không phải HTTP)
- ✅ Service Worker đã được đăng ký thành công
- ✅ Manifest hợp lệ
- ✅ User chưa cài đặt app
- ✅ User chưa dismiss popup trong 3 tháng gần đây

### Phương án 1: Deploy lên hosting (KHUYẾN NGHỊ)

Deploy app lên một trong các dịch vụ sau:

- **Netlify** (miễn phí): `pnpm run build` → kéo thả folder `dist` vào Netlify
- **Vercel** (miễn phí): Connect GitHub repo
- **Cloudflare Pages** (miễn phí)

Sau khi deploy, truy cập URL HTTPS từ điện thoại.

### Phương án 2: Sử dụng ngrok (cho test local)

```bash
# Cài ngrok (nếu chưa có): https://ngrok.com/download
# Chạy dev server
pnpm dev

# Trong terminal khác, chạy ngrok
ngrok http 5173
```

Ngrok sẽ cho bạn URL HTTPS (ví dụ: `https://abc123.ngrok.io`). Truy cập URL này từ điện thoại.

### Phương án 3: Test với Chrome Remote Debugging

1. Kết nối điện thoại Android với máy tính qua USB
2. Bật USB Debugging trên điện thoại
3. Mở Chrome trên máy tính → `chrome://inspect`
4. Truy cập localhost từ Chrome mobile
5. Popup vẫn không hiện vì localhost không trigger `beforeinstallprompt`

## 🔍 Debug PWA trên mobile

### Chrome DevTools (Remote Debugging)

1. Kết nối điện thoại qua USB
2. Mở `chrome://inspect` trên máy tính
3. Chọn device → Inspect
4. Vào Console, gõ:

```javascript
// Kiểm tra service worker
navigator.serviceWorker.getRegistrations();

// Test beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
   console.log('beforeinstallprompt fired!', e);
});
```

### Kiểm tra trên Safari iOS

1. Mở Safari trên iPhone
2. Truy cập website (phải HTTPS)
3. Nhấn nút Share (biểu tượng chia sẻ)
4. Cuộn xuống chọn **"Add to Home Screen"**
5. PWA sẽ được cài như app native

**Lưu ý:** Safari iOS không hỗ trợ `beforeinstallprompt` event, nên component InstallPWA sẽ không hiển thị. User phải cài manual qua Share button.

## 🚀 Test nhanh trên Desktop Chrome

Để test ngay trên máy tính:

1. Chạy `pnpm dev`
2. Mở Chrome: `http://localhost:5173`
3. Mở DevTools (F12)
4. Console sẽ hiện "Service Worker registered successfully"
5. Vào Application → Manifest → Xem thông tin PWA
6. Click icon install ⊕ trên thanh địa chỉ

## ⚙️ Production Build

Để build cho production:

```bash
pnpm run build
pnpm run preview  # Test production build locally
```

Manifest và service worker sẽ được tối ưu cho production.

## 📋 Checklist PWA

- [x] Service Worker đăng ký thành công
- [x] manifest.webmanifest có link trong HTML
- [x] Icons PWA đã tạo (192, 512, maskable)
- [x] Meta tags cho iOS Safari
- [x] Install prompt component
- [ ] Deploy lên HTTPS để test trên mobile thật
- [ ] Test cài đặt trên Chrome Android
- [ ] Test cài đặt trên Safari iOS

## 🎯 Kết luận

PWA của bạn đã sẵn sàng! Để thấy popup cài đặt trên điện thoại:

1. **Deploy lên Netlify/Vercel** (cách dễ nhất)
2. Truy cập URL HTTPS từ điện thoại
3. Popup "Cài đặt" sẽ xuất hiện ở góc dưới màn hình

Nếu không thấy popup, bạn vẫn có thể cài manual:

- **Android Chrome:** Menu → Add to Home Screen
- **iOS Safari:** Share → Add to Home Screen
