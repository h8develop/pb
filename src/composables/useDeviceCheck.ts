// src/composables/useDeviceCheck.ts
import { ref, onMounted, onUnmounted } from "vue";

export function useDeviceCheck() {
  const isMobile = ref(false);
  const showQRCode = ref(false);

  const checkDevice = () => {
    // Detect mobile devices
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    isMobile.value = mobileRegex.test(navigator.userAgent);
    showQRCode.value = !isMobile.value;
  };

  onMounted(() => {
    checkDevice();
    window.addEventListener("resize", checkDevice);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkDevice);
  });

  return {
    isMobile,
    showQRCode,
  };
}
