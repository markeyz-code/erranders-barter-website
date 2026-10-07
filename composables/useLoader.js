export const useLoader = () => {
  const isGlobalLoading = useState('global_loading', () => false)
  const loadingText = useState('global_loading_text', () => 'Loading...')

  const showLoader = (text = 'Loading...') => {
    loadingText.value = text
    isGlobalLoading.value = true
  }

  const hideLoader = () => {
    isGlobalLoading.value = false
  }

  return {
    isGlobalLoading,
    loadingText,
    showLoader,
    hideLoader
  }
}
