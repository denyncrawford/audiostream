import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes";
import { createPinia } from "pinia";
import { addIcons, OhVueIcon } from "oh-vue-icons";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import {
  BiPauseFill,
  BiPlayFill,
  BiRecordCircle,
  BiStopFill,
  HiSelector,
  RiLoader2Fill,
  HiCheck
} from "oh-vue-icons/icons";
import "animate.css";
import "./index.css";

addIcons(
  RiLoader2Fill,
  BiRecordCircle,
  BiPlayFill,
  BiStopFill,
  BiPauseFill,
  HiSelector,
  HiCheck 
);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(Toast, {
  transition: "Vue-Toastification__fade",
  maxToasts: 4,
  newestOnTop: false,
});
app.component("Icon", OhVueIcon);
app.mount("#app");
