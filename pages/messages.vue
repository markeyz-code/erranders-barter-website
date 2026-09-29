<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <div class="bg-white p-4 shadow-sm border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
      <NuxtLink to="/" class="text-slate-500 font-bold">←</NuxtLink>
      <h1 class="text-xl font-black text-slate-900">Messages</h1>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div class="flex flex-col gap-4">
        <div class="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] shadow-sm">
          Is the fridge still available?
        </div>
        <div class="bg-white border border-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] shadow-sm">
          Yes it is! Are you on campus?
        </div>
      </div>
    </div>
    
    <div class="bg-white p-4 border-t border-slate-100 sticky bottom-0">
      <div class="flex gap-2">
        <input type="text" class="flex-1 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Type a message..." />
        <button class="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">↑</button>
      </div>
    </div>
  </div>
</template>