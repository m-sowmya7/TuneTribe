import toast from "react-hot-toast";

const baseOptions = {
  duration: 2600,
  style: {
    border: "1px solid #713200",
    padding: "12px 14px",
    color: "#713200",
    background: "#fffaf0",
    borderRadius: "12px",
    fontSize: "13px",
  },
  iconTheme: {
    primary: "#713200",
    secondary: "#FFFAEE",
  },
};

const mergeOptions = (options = {}) => {
  const style = {
    ...baseOptions.style,
    ...(options.style || {}),
  };

  const iconTheme = {
    ...baseOptions.iconTheme,
    ...(options.iconTheme || {}),
  };

  return {
    ...baseOptions,
    ...options,
    style,
    iconTheme,
  };
};

const appToast = {
  success: (message, options = {}) =>
    toast.success(message, mergeOptions(options)),
  error: (message, options = {}) =>
    toast.error(
      message,
      mergeOptions({
        ...options,
        iconTheme: {
          primary: "#991b1b",
          secondary: "#fff1f2",
          ...(options.iconTheme || {}),
        },
        style: {
          border: "1px solid #7f1d1d",
          color: "#7f1d1d",
          background: "#fff1f2",
          ...(options.style || {}),
        },
      }),
    ),
  info: (message, options = {}) => toast(message, mergeOptions(options)),
  loading: (message, options = {}) =>
    toast.loading(message, mergeOptions(options)),
  dismiss: (toastId) => toast.dismiss(toastId),
  options: baseOptions,
};

export default appToast;
