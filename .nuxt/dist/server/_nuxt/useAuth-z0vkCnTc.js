import { ref } from "vue";
function useAuth() {
  const user = ref(null);
  const token = ref(null);
  const isLoggedIn = ref(false);
  const loadSession = () => {
    return;
  };
  const saveSession = (data) => {
    return;
  };
  const logout = () => {
    return;
  };
  return { user, token, isLoggedIn, saveSession, logout, loadSession };
}
export {
  useAuth as u
};
//# sourceMappingURL=useAuth-z0vkCnTc.js.map
