import { toast } from "sonner";

const toastMethods = {
  success: toast.success,
  failure: toast.error,
  error: toast.error,
  alert: toast.warning,
  warning: toast.warning,
  info: toast.info,
  loading: toast.loading,
  message: toast,
  default: toast,
};

export function showToast(msg, type = "info", options = {}) {
  if (msg === null || msg === undefined || msg === "") {
    return null;
  }

  const method = toastMethods[String(type).toLowerCase()] ?? toast.info;

  return method(msg, options);
}

export function dismissToast(toastId) {
  toast.dismiss(toastId);
}
