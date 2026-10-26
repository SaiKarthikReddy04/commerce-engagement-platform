import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { store } from "../store.js";


export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>

      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "14px 16px",
            boxShadow: "0 16px 40px rgba(7, 26, 51, 0.14)",
          },
        }}
      />
    </Provider>
  );
}
