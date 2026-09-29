<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />
    <main class="flex-grow pt-28">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>