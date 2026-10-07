const fs = require('fs');

const filesToUpdate = [
  'pages/login.vue',
  'pages/signup.vue',
  'components/AuthModal.vue'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add firebaseLogin to useAuth destructuring if not present
    if (content.includes('const { saveSession } = useAuth()') && !content.includes('firebaseLogin')) {
      content = content.replace('const { saveSession } = useAuth()', 'const { saveSession, firebaseLogin } = useAuth()');
    }
    // AuthModal might just have `const auth = useAuth()` or similar, let's just make it robust
    if (content.includes('const { saveSession, login') && !content.includes('firebaseLogin')) {
        content = content.replace('const { saveSession, login', 'const { saveSession, login, firebaseLogin');
    }
    
    // AuthModal specific replace for useAuth
    if (content.includes('const { login, register, guestCheckout } = useAuth()')) {
        content = content.replace('const { login, register, guestCheckout } = useAuth()', 'const { login, register, guestCheckout, firebaseLogin } = useAuth()');
    }

    // Replace googleLogin body
    const loginPattern1 = /const googleLogin = \(\) => {\n\s*window\.location\.href = `\$\{config\.public\.apiBaseUrl\}\/auth\/google`\n\s*}/g;
    const replacement1 = `const googleLogin = async () => {
  try {
    loading.value = true;
    await firebaseLogin(false);
    if (typeof emit === 'function') {
        emit('close');
    } else if (router && typeof router.push === 'function') {
        router.push('/explore');
    }
  } catch (err) {
    if (error) error.value = err.message;
    console.error('Google login failed:', err);
  } finally {
    loading.value = false;
  }
}`;
    
    content = content.replace(loginPattern1, replacement1);
    
    // For AuthModal which might have it differently:
    const loginPattern2 = /const googleLogin = async \(\) => {\n\s*window\.location\.href = `\$\{config\.public\.apiBaseUrl\}\/auth\/google`\n\s*}/g;
    content = content.replace(loginPattern2, replacement1);
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
