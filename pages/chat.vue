<template>
  <main class="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full bg-white flex flex-col overflow-hidden select-none">
    
    <!-- Call Interface (No Heavy Overlays, Tap to Swap Bigger Area on Video Calls) -->
    <div v-if="activeCall" class="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden select-none">
      
      <!-- Video Call Mode -->
      <div v-if="callType === 'video'" class="relative w-full h-full inset-0">
        
        <!-- Video 1: Remote Video -->
        <div
          @click="isRemoteMain ? null : setVideoFocus('remote')"
          :class="[
            isRemoteMain
              ? 'fixed inset-0 w-full h-full z-0 bg-slate-950 flex items-center justify-center'
              : 'fixed top-4 right-4 sm:top-6 sm:right-6 w-28 h-40 sm:w-36 sm:h-52 z-30 rounded-2xl shadow-2xl border-2 border-white/90 overflow-hidden cursor-pointer active:scale-95 hover:border-brand-400 transition-all duration-300'
          ]"
        >
          <video
            ref="remoteVideo"
            autoplay
            playsinline
            class="w-full h-full object-cover pointer-events-none"
          ></video>
          <!-- PiP overlay badge when smaller -->
          <div
            v-if="!isRemoteMain"
            class="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/65 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1 shadow-sm whitespace-nowrap"
          >
            <ArrowRightLeft class="w-2.5 h-2.5" />
            <span>Tap for bigger</span>
          </div>
          <div
            v-if="!isRemoteMain"
            class="absolute top-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none"
          >
            {{ headerTitle }}
          </div>
        </div>

        <!-- Video 2: Local Camera Video -->
        <div
          @click="!isRemoteMain ? null : setVideoFocus('local')"
          :class="[
            !isRemoteMain
              ? 'fixed inset-0 w-full h-full z-0 bg-slate-950 flex items-center justify-center'
              : 'fixed top-4 right-4 sm:top-6 sm:right-6 w-28 h-40 sm:w-36 sm:h-52 z-30 rounded-2xl shadow-2xl border-2 border-white/90 overflow-hidden cursor-pointer active:scale-95 hover:border-brand-400 transition-all duration-300'
          ]"
        >
          <video
            ref="localVideo"
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover pointer-events-none"
          ></video>
          <!-- PiP overlay badge when smaller -->
          <div
            v-if="isRemoteMain"
            class="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/65 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1 shadow-sm whitespace-nowrap"
          >
            <ArrowRightLeft class="w-2.5 h-2.5" />
            <span>Tap for bigger</span>
          </div>
          <div
            v-if="isRemoteMain"
            class="absolute top-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none"
          >
            You
          </div>
        </div>

        <!-- Floating Top Status Pill (No Dark Full-Width Overlay) -->
        <div class="fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/15 shadow-xl">
          <span class="w-2 h-2 rounded-full" :class="callStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-amber-400 animate-ping'"></span>
          <span>{{ callStatus }}</span>
          <span class="opacity-40">•</span>
          <span class="text-[11px] text-slate-300 font-medium">Tap small video to swap</span>
        </div>

        <!-- Floating Bottom Call Control Bar (Minimalist, Floating, No Murky Overlay) -->
        <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/15 shadow-2xl">
          <!-- Flip who is in bigger area -->
          <button
            type="button"
            @click.stop="toggleVideoFocus"
            class="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Swap video focus"
          >
            <ArrowRightLeft class="w-5 h-5" />
          </button>

          <!-- Toggle Audio Mute -->
          <button
            type="button"
            @click.stop="toggleAudioMute"
            class="w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
            :class="isAudioMuted ? 'bg-amber-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'"
            title="Mute microphone"
          >
            <MicOff v-if="isAudioMuted" class="w-5 h-5" />
            <Mic v-else class="w-5 h-5" />
          </button>

          <!-- Incoming Call Answer Button -->
          <button
            v-if="callStatus === 'Incoming Call...'"
            type="button"
            @click.stop="answerCall"
            class="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-green-500/30 active:scale-95 animate-bounce cursor-pointer"
            title="Answer call"
          >
            <Phone class="w-6 h-6" />
          </button>

          <!-- End Call Button -->
          <button
            type="button"
            @click.stop="endCall"
            class="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
            title="End call"
          >
            <PhoneOff class="w-6 h-6" />
          </button>
        </div>

      </div>

      <!-- Voice Call Mode (No Heavy Overlay) -->
      <div v-else-if="callType === 'voice'" class="relative w-full h-full flex flex-col items-center justify-between p-8 sm:p-12 z-10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        
        <!-- Top Status -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/10 mt-6">
          <span class="w-2 h-2 rounded-full" :class="callStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-amber-400 animate-ping'"></span>
          <span>{{ callStatus }}</span>
        </div>

        <!-- Center Caller Avatar & Audio Pulse -->
        <div class="flex flex-col items-center text-center space-y-4 my-auto">
          <div class="relative">
            <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-brand-500/20 animate-ping absolute inset-0"></div>
            <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-brand-600 text-white flex items-center justify-center font-black text-4xl sm:text-5xl shadow-2xl border-4 border-white/20 relative z-10">
              {{ headerInitial }}
            </div>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">{{ headerTitle }}</h2>
            <p class="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Decluttered Escrow Voice Call</p>
          </div>
        </div>

        <!-- Voice Call Bottom Controls (Clean, Minimalist) -->
        <div class="flex items-center gap-5 mb-8">
          <!-- Toggle Audio Mute -->
          <button
            type="button"
            @click.stop="toggleAudioMute"
            class="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
            :class="isAudioMuted ? 'bg-amber-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'"
            title="Mute microphone"
          >
            <MicOff v-if="isAudioMuted" class="w-6 h-6" />
            <Mic v-else class="w-6 h-6" />
          </button>

          <!-- Incoming Answer -->
          <button
            v-if="callStatus === 'Incoming Call...'"
            type="button"
            @click.stop="answerCall"
            class="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-green-500/30 active:scale-95 animate-bounce cursor-pointer"
            title="Answer call"
          >
            <Phone class="w-7 h-7" />
          </button>

          <!-- End Call -->
          <button
            type="button"
            @click.stop="endCall"
            class="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
            title="End call"
          >
            <PhoneOff class="w-7 h-7" />
          </button>
        </div>

      </div>

      <!-- Native audio element for bulletproof iOS Safari WebRTC voice call playback -->
      <audio ref="remoteAudio" autoplay playsinline class="hidden"></audio>

    </div>

    <!-- Main Chat Workspace (Strict Flex Column: Fixed Header, Scrollable Body, Fixed Footer) -->
    <div class="flex flex-col h-full w-full overflow-hidden relative">
      
      <!-- Fixed Header (Never scrolls with chat) -->
      <header class="shrink-0 z-20 bg-white border-b border-slate-100 shadow-xs">
        <div class="p-3 sm:p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button @click="router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft class="w-5 h-5 text-slate-600" />
            </button>
            <div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200 shrink-0">
              {{ headerInitial }}
            </div>
            <div>
              <h2 class="font-bold text-slate-900 leading-tight">{{ headerTitle }}</h2>
              <p v-if="isRemoteTyping" class="text-xs sm:text-sm font-bold text-brand-600 flex items-center gap-1.5 animate-pulse">
                <span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                typing...
              </p>
              <p v-else-if="remoteMediaUploading?.isUploading" class="text-xs sm:text-sm font-bold text-amber-600 flex items-center gap-1.5 animate-pulse">
                <Loader2 class="w-3 h-3 animate-spin text-amber-600" />
                uploading {{ remoteMediaUploading.assetType || 'media' }}...
              </p>
              <p v-else class="text-xs sm:text-sm font-bold flex items-center gap-1" :class="isConnected ? 'text-green-500' : 'text-slate-400'">
                <span class="w-2 h-2 rounded-full block" :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'"></span>
                {{ isConnected ? 'Online' : 'Connecting...' }}
              </p>
            </div>
          </div>
          
          <div v-if="activeChatId" class="flex items-center gap-1 sm:gap-2 text-slate-500">
            <button @click="startCall('voice')" class="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Voice Call">
              <Phone class="w-5 h-5 text-brand-600" />
            </button>
            <button @click="startCall('video')" class="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Video Call">
              <Video class="w-5 h-5 text-brand-600" />
            </button>
          </div>
        </div>

        <!-- Escrow Anti-Circumvention Protection Banner -->
        <div v-if="activeChatId && !conversationUnavailable" class="bg-amber-50/90 border-t border-amber-200/80 px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-amber-950">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
            <span class="font-medium text-[11px] sm:text-xs">
              <strong class="font-black">Escrow Protected:</strong> Direct room pickup coordinates unlock after payment is secured in Escrow. Do not transfer money outside the app.
            </span>
          </div>
          <NuxtLink v-if="activeChat?.item" :to="'/checkout?itemId=' + (activeChat.item._id || activeChat.item)" class="px-2.5 py-1 bg-brand-600 text-white rounded-lg font-black hover:bg-brand-700 transition-colors shrink-0 ml-2 text-[11px]">
            Pay via Escrow 🔒
          </NuxtLink>
        </div>
      </header>

      <!-- Network Upload Indicator (Top Floating Pill for Sender) -->
      <div v-if="isUploading" class="absolute top-[80px] left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl shadow-slate-900/20">
        <Loader2 class="w-3.5 h-3.5 animate-spin text-brand-400" />
        <span>{{ uploadingLabel || 'Sending Media...' }}</span>
      </div>

      <!-- Chat Area (ONLY SCROLLABLE BODY: flex-1 min-h-0 overflow-y-auto overscroll-contain) -->
      <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-slate-50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 relative" ref="chatContainer" @click="showActionTray = false; showEmojis = false">
          <!-- No conversation resolved from the URL -->
          <div v-if="conversationUnavailable" class="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageSquare class="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{{ notice.title }}</h3>
              <p class="text-slate-500 font-medium max-w-sm">{{ notice.message }}</p>
            </div>
            <NuxtLink to="/messages" class="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-brand-600 transition-colors text-sm">
              View my messages
            </NuxtLink>
          </div>

          <div v-else-if="loadingConversation" class="flex-1 flex items-center justify-center">
            <Loader2 class="w-6 h-6 text-slate-400 animate-spin" />
          </div>

          <div v-else-if="!messages.length && !isUploading && !remoteMediaUploading?.isUploading" class="flex-1 flex items-center justify-center text-center">
            <p class="text-slate-500 font-medium">No messages yet — say hello.</p>
          </div>

          <div v-for="msg in messages" :key="msg._id" :class="isMine(msg) ? 'self-end' : 'self-start'" class="max-w-[85%] group">
            
            <!-- Message Actions (Reply) -->
            <div class="flex items-center gap-2 mb-1" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
              <button @click="setReply(msg)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-opacity">
                <Reply class="w-4 h-4" />
              </button>
            </div>

            <!-- Tagged Reply Context -->
            <div v-if="msg.replyTo" class="mb-1 p-2 bg-black/5 border-l-4 border-brand-500 rounded text-sm text-slate-500 truncate" :class="isMine(msg) ? 'text-right' : 'text-left'">
              Reply to: "{{ replyPreview(msg) }}"
            </div>

            <!-- Message Bubble -->
            <div :class="isMine(msg) ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'" class="p-3 rounded-2xl shadow-sm text-sm break-words relative overflow-hidden">
              
              <div v-if="msg.type === 'image' && msg.assetUrl">
                <img :src="msg.assetUrl" class="w-full max-w-[250px] rounded-xl object-cover mb-2 bg-black/5" loading="lazy" />
                <span v-if="msg.content && msg.content !== '📷 Photo sent'" class="block mt-1">{{ msg.content }}</span>
              </div>

              <div v-else-if="msg.type === 'video' && msg.assetUrl">
                <video :src="msg.assetUrl" controls playsinline class="w-full max-w-[280px] rounded-xl object-cover mb-2 bg-black/5"></video>
                <span v-if="msg.content" class="block mt-1">{{ msg.content }}</span>
              </div>

              <div v-else-if="(msg.type === 'voice' || msg.type === 'audio') && msg.assetUrl" class="flex items-center gap-2">
                <audio :src="msg.assetUrl" controls class="h-10 w-[200px] sm:w-[250px] outline-none filter drop-shadow-sm"></audio>
              </div>

              <div v-else-if="msg.type === 'file' && msg.assetUrl" class="flex items-center gap-2">
                <a :href="msg.assetUrl" target="_blank" download class="underline font-bold text-xs flex items-center gap-1.5 py-1">
                  <Paperclip class="w-4 h-4 shrink-0" />
                  <span>{{ msg.content || 'Download attached file' }}</span>
                </a>
              </div>

              <!-- Call Record Bubble (Saved in Chat Thread for Both Parties) -->
              <div v-else-if="msg.type === 'call'" class="flex items-center gap-3 py-1">
                <div
                  :class="[
                    isMissedCall(msg.content)
                      ? 'bg-red-500/15 text-red-500 border border-red-500/20'
                      : isMine(msg)
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                  ]"
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                >
                  <PhoneMissed v-if="isMissedCall(msg.content)" class="w-5 h-5 text-red-500" />
                  <Video v-else-if="isVideoCall(msg.content)" class="w-5 h-5" />
                  <Phone v-else class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-extrabold text-xs sm:text-sm leading-tight flex items-center gap-1.5"
                    :class="isMissedCall(msg.content) ? (isMine(msg) ? 'text-white' : 'text-red-600') : ''"
                  >
                    <span>{{ msg.content }}</span>
                  </p>
                  <p class="text-[10px] opacity-75 font-semibold mt-0.5">
                    {{ isMissedCall(msg.content) ? 'No answer • Tap Call back to retry' : 'Decluttered Escrow Call' }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="startCall(isVideoCall(msg.content) ? 'video' : 'voice')"
                  :class="isMine(msg) ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20' : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'"
                  class="text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
                >
                  Call back
                </button>
              </div>

              <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>

            </div>
            <p :class="isMine(msg) ? 'text-right mr-1' : 'ml-1'" class="text-[10px] text-slate-400 font-bold mt-1">
              {{ formatTime(msg.createdAt) }}
            </p>
          </div>

          <!-- SENDER IN-FLIGHT ASSET LOADER (Sender sees their file/voice/video is uploading) -->
          <div v-if="isUploading" class="self-end max-w-[85%] sm:max-w-md bg-brand-50 border border-brand-200/90 rounded-2xl rounded-tr-xs p-3.5 shadow-sm flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Loader2 class="w-5 h-5 animate-spin text-brand-600" />
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800">{{ uploadingLabel || 'Sending asset...' }}</p>
              <p class="text-[11px] text-brand-600 font-semibold animate-pulse">Uploading file to chat...</p>
            </div>
          </div>

          <!-- RECEIVER INCOMING ASSET LOADER (Receiver sees other party is uploading an asset) -->
          <div v-if="remoteMediaUploading?.isUploading" class="self-start max-w-[85%] sm:max-w-md bg-white border border-amber-200/90 rounded-2xl rounded-tl-xs p-3.5 shadow-sm flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Loader2 class="w-5 h-5 animate-spin text-amber-600" />
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800">{{ headerTitle }} is sending {{ remoteMediaUploading.assetType || 'a file' }}...</p>
              <p class="text-[11px] text-amber-600 font-semibold animate-pulse">Incoming asset arriving shortly</p>
            </div>
          </div>

          <!-- TYPING INDICATOR (Receiver sees other party is typing) -->
          <div v-if="isRemoteTyping" class="self-start flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-xs">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <span class="text-xs font-bold text-slate-500">{{ headerTitle }} is typing...</span>
          </div>
        </div>
        
        <!-- Fixed Footer (Never scrolls with page/chat) -->
        <footer class="shrink-0 z-20 bg-white border-t border-slate-100 relative">
          <!-- Active Reply Banner -->
          <div v-if="replyingTo" class="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
            <div class="text-sm text-slate-600 truncate border-l-4 border-brand-500 pl-2">
              <span class="font-bold text-brand-600 block">Replying to</span>
              {{ replyPreview(replyingTo) }}
            </div>
            <button @click="replyingTo = null" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
          </div>

          <!-- Attachment Preview -->
          <div v-if="pendingAsset" class="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img :src="pendingAsset" class="w-full h-full object-cover" />
              </div>
              <span class="text-sm font-bold text-slate-600">Attachment Ready</span>
            </div>
            <button @click="cancelAttachment" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
          </div>
          
          <!-- Plus Action Tray (Preview option for Camera, File Upload, Emojis, Voice Note) -->
          <Transition name="tray-slide">
          <div
            v-if="showActionTray"
            class="bg-white border-t border-slate-200/90 shadow-2xl p-3 sm:p-5 z-20 backdrop-blur-md"
          >
            <div class="max-w-md mx-auto">
              <div class="flex items-center justify-between mb-2.5 px-1">
                <span class="text-[11px] font-black uppercase tracking-wider text-slate-400">Share Media & Quick Actions</span>
                <button
                  type="button"
                  @click="showActionTray = false"
                  class="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div class="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <!-- 1. Take Photo / Camera -->
                <button
                  type="button"
                  @click="triggerCameraAction"
                  class="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Camera class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span class="text-xs font-bold text-slate-800">Camera</span>
                  <span class="text-[10px] text-slate-400 -mt-1 font-medium">Take photo</span>
                </button>

                <!-- 2. Upload File / Gallery -->
                <button
                  type="button"
                  @click="triggerUploadAction"
                  class="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Paperclip class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span class="text-xs font-bold text-slate-800">Upload</span>
                  <span class="text-[10px] text-slate-400 -mt-1 font-medium">Photo / file</span>
                </button>

                <!-- 3. Emojis -->
                <button
                  type="button"
                  @click="triggerEmojiAction"
                  class="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group cursor-pointer"
                  :class="{ 'bg-amber-50/70 ring-1 ring-amber-300': showEmojis }"
                >
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Smile class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span class="text-xs font-bold text-slate-800">Emojis</span>
                  <span class="text-[10px] text-slate-400 -mt-1 font-medium">Stickers</span>
                </button>

                <!-- 4. Voice Note -->
                <button
                  type="button"
                  @click="triggerVoiceNoteAction"
                  class="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Mic class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span class="text-xs font-bold text-slate-800">Voice Note</span>
                  <span class="text-[10px] text-slate-400 -mt-1 font-medium">Record mic</span>
                </button>
              </div>

              <!-- Expanded Emoji Tray if opened -->
              <div v-if="showEmojis" class="mt-3 pt-3 border-t border-slate-100">
                <div class="flex items-center justify-between mb-2 px-1">
                  <span class="text-[11px] font-bold text-slate-500">Tap to insert emoji</span>
                </div>
                <div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1">
                  <button
                    v-for="emoji in richEmojis"
                    :key="emoji"
                    type="button"
                    @click="appendEmoji(emoji)"
                    class="text-2xl hover:bg-slate-100 rounded-xl p-1.5 transition-transform hover:scale-125 active:scale-95 flex items-center justify-center cursor-pointer"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Input Area (Clutter-Free, Wide Input, Anti-Zoom Font Size, Safe Area Padding) -->
        <div v-if="!conversationUnavailable" class="p-2 sm:p-3 bg-white border-t border-slate-100 relative pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2 max-w-4xl mx-auto">
            
            <!-- Plus Action Toggle Button -->
            <button
              v-if="!isRecording"
              type="button"
              @click="toggleActionTray"
              class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shrink-0 mb-0.5 border cursor-pointer active:scale-95"
              :class="showActionTray
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 border-slate-200/80'"
              title="Share photo, file, emoji, or voice note"
            >
              <Plus class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-45': showActionTray }" />
            </button>
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" class="hidden" />

            <!-- While Recording: Voice Bar -->
            <div v-if="isRecording" class="flex-1 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between px-3 sm:px-4 py-2 min-h-[44px] animate-pulse">
              <div class="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0"></span>
                <span>Recording... {{ formatRecordingTime(recordingSeconds) }}</span>
              </div>
              <button type="button" @click="cancelRecording" class="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
            </div>

            <!-- Normal Input Area (Generous width, anti-zoom 16px font-size) -->
            <div v-else class="flex-1 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center min-h-[44px] focus-within:border-brand-500 focus-within:bg-white transition-all px-3 py-1">
              <textarea 
                v-model="newMessage" 
                placeholder="Type a message..." 
                class="w-full bg-transparent text-[16px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none max-h-32 py-1 leading-relaxed"
                rows="1"
                @input="handleInput"
                @keydown.enter.exact.prevent="sendMessage"
                ref="messageInput"
              ></textarea>
            </div>
            
            <!-- Stop & Send Voice Note Button -->
            <button v-if="isRecording" type="button" @click="stopRecording" :disabled="isUploading" class="w-10 h-10 sm:w-11 sm:h-11 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all shadow-md shrink-0 mb-0.5 active:scale-95" title="Send Voice Note">
              <Send v-if="!isUploading" class="w-4 h-4 ml-0.5" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
            </button>

            <!-- Send Text/Image Message Button -->
            <button v-else-if="newMessage.trim() || pendingAsset" type="submit" :disabled="isUploading || sending" class="w-10 h-10 sm:w-11 sm:h-11 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-md shadow-brand-600/25 mb-0.5 active:scale-95" title="Send Message">
              <Send v-if="!isUploading && !sending" class="w-4 h-4 ml-0.5" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
            </button>
            
            <!-- Start Voice Recording Mic Button -->
            <button v-else type="button" @click="startRecording" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shrink-0 mb-0.5 bg-brand-50 hover:bg-brand-100 text-brand-600 active:scale-95 cursor-pointer" title="Record Voice Note">
              <Mic class="w-5 h-5" />
            </button>

          </form>
        </div>
      </footer>

      <!-- Camera Overlay -->
      <div v-if="showCamera" class="absolute inset-0 bg-black z-50 flex flex-col">
        <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 w-full z-10">
          <button @click="stopCamera" class="text-white p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur">
            <X class="w-6 h-6" />
          </button>
          <button @click="switchCamera" class="text-white p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur">
            <RefreshCw class="w-6 h-6" />
          </button>
        </div>
        
        <video ref="videoElement" class="w-full h-full object-cover flex-1" autoplay playsinline></video>
        <canvas ref="canvasElement" class="hidden"></canvas>
        
        <div class="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center">
          <button @click="capturePhoto" :disabled="isUploading" class="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center p-1 active:scale-95 transition-transform disabled:opacity-50">
            <div v-if="isUploading" class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div v-else class="w-full h-full bg-white rounded-full"></div>
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ArrowLeft, Send, Paperclip, Mic, X, Reply, Phone, Video, Smile, Loader2, PhoneOff, PhoneMissed, Camera, RefreshCw, MessageSquare, Plus, ArrowRightLeft, MicOff, ShieldCheck } from 'lucide-vue-next'
import { startRingtone, startRingbackTone, stopRingtone, initAudioUnlock } from '@/composables/core/useSound'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useChat } from '@/composables/modules/chat/useChat'
import { upload_api } from '@/api_factory/modules/upload'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const { token } = useAuth()
const { showToast } = useCustomToast()

// Shared chat state/logic (conversation list, history, gateway socket, sending)
const {
  chats,
  activeChatId,
  messages,
  sending,
  isConnected,
  socket,
  connectSocket,
  loadChats,
  openChat,
  startChat,
  sendMessage: sendChatMessage,
  ensureMyUserId,
  isMine,
  otherParticipant,
  chatTitle,
} = useChat()

const newMessage = ref('')
const replyingTo = ref(null)
const pendingAsset = ref(null)
const pendingFile = ref(null)
const chatContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)
const isRecording = ref(false)
const isUploading = ref(false)
const uploadingLabel = ref('')
const isRemoteTyping = ref(false)
const remoteMediaUploading = ref(null)
let typingDebounceTimer = null
let remoteTypingTimeout = null
let remoteMediaTimeout = null

const handleInput = (e) => {
  resizeTextarea(e)
  emitTyping(true)
}

const emitTyping = (isTyping) => {
  if (!socket.value || !activeChatId.value) return
  socket.value.emit('typing', { chatId: activeChatId.value, isTyping })
  
  if (isTyping) {
    if (typingDebounceTimer) clearTimeout(typingDebounceTimer)
    typingDebounceTimer = setTimeout(() => {
      emitTyping(false)
    }, 2500)
  } else {
    if (typingDebounceTimer) {
      clearTimeout(typingDebounceTimer)
      typingDebounceTimer = null
    }
  }
}

const setLocalUploading = (uploading, type = 'file', label = 'Sending file...') => {
  isUploading.value = uploading
  uploadingLabel.value = uploading ? label : ''
  if (socket.value && activeChatId.value) {
    socket.value.emit('media-uploading', {
      chatId: activeChatId.value,
      isUploading: uploading,
      assetType: type,
    })
  }
}

const showEmojis = ref(false)
const showActionTray = ref(false)
const loadingConversation = ref(true)
const conversationUnavailable = ref(false)

const toggleActionTray = () => {
  showActionTray.value = !showActionTray.value
  if (!showActionTray.value) showEmojis.value = false
}

const triggerCameraAction = () => {
  showActionTray.value = false
  startCamera()
}

const triggerUploadAction = () => {
  showActionTray.value = false
  triggerFileInput()
}

const triggerEmojiAction = () => {
  showEmojis.value = !showEmojis.value
}

const triggerVoiceNoteAction = () => {
  showActionTray.value = false
  startRecording()
}

const richEmojis = [
  '😀','😂','🥰','😍','😎','🤝','🔥','✨','❤️','👍',
  '🙌','🎉','💸','💰','📦','🚚','🚀','💯','⚡','🛒',
  '😊','😅','😋','🤗','🤔','😏','😌','😴','🥺','😭',
  '👏','💪','🙏','✌️','👌','🤙','👀','💡','🛡️','⭐'
]

const activeCall = ref(null)
const peerConnection = ref(null)
const localStream = ref(null)
const remoteStream = ref(null)
const callStatus = ref('')
const callType = ref('voice')
const remoteVideo = ref(null)
const localVideo = ref(null)
const remoteAudio = ref(null)
let callTimeoutTimer = null
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const callStartTime = ref(null)
const hasLoggedCall = ref(false)
const callInitiator = ref(false)

const isMissedCall = (content) => /missed|declined/i.test(content || '')
const isVideoCall = (content) => /video/i.test(content || '')
const formatCallDuration = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

const recordCallEvent = async (statusOverride) => {
  if (hasLoggedCall.value || !activeChatId.value) return
  hasLoggedCall.value = true

  let summary = ''
  if (statusOverride) {
    summary = statusOverride
  } else if (callStartTime.value) {
    const elapsed = Math.max(1, Math.floor((Date.now() - callStartTime.value) / 1000))
    summary = `${callType.value === 'video' ? 'Video' : 'Voice'} call • ${formatCallDuration(elapsed)}`
  } else {
    summary = `Missed ${callType.value === 'video' ? 'video' : 'voice'} call`
  }

  try {
    await sendChatMessage(summary, {
      type: 'call',
    })
  } catch (err) {
    console.debug('Failed to record call event', err)
  }
}

const isRemoteMain = ref(true)
const isAudioMuted = ref(false)

const setVideoFocus = (target) => {
  if (target === 'remote') {
    isRemoteMain.value = true
  } else if (target === 'local') {
    isRemoteMain.value = false
  } else {
    isRemoteMain.value = !isRemoteMain.value
  }
}

const toggleVideoFocus = () => {
  isRemoteMain.value = !isRemoteMain.value
}

const toggleAudioMute = () => {
  if (localStream.value) {
    const audioTrack = localStream.value.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      isAudioMuted.value = !audioTrack.enabled
    }
  }
}

const recordingSeconds = ref(0)
let recordingTimer = null
let mediaRecorder = null
let audioChunks = []
let mediaStreamRef = null

const activeChat = computed(() => chats.value.find(c => String(c._id) === String(activeChatId.value)) || null)
const headerTitle = computed(() => (activeChat.value ? chatTitle(activeChat.value) : 'Secure Chat'))
const headerInitial = computed(() => {
  const participant = activeChat.value ? otherParticipant(activeChat.value) : null
  return String(participant?.firstName?.[0] || participant?.email?.[0] || 'S').toUpperCase()
})

const notice = computed(() => {
  if (!token.value) {
    return {
      title: 'Log in to chat',
      message: 'Conversations with other traders need a signed-in account.',
    }
  }
  return {
    title: 'No conversation selected',
    message: 'Open one of your conversations, or start a new one from an item listing.',
  }
})

onMounted(async () => {
  if (!token.value) {
    conversationUnavailable.value = true
    loadingConversation.value = false
    return
  }

  const rawChatId = route.query.chatId || route.query.chat || route.query.id
  const rawSellerId = route.query.sellerId || route.query.providerId || route.query.userId
  const chatIdFromQuery = rawChatId ? String(rawChatId) : ''
  const sellerId = rawSellerId ? String(rawSellerId) : ''
  const itemId = route.query.itemId ? String(route.query.itemId) : undefined

  connectSocket()
  attachCallListeners()
  initAudioUnlock()

  try {
    await ensureMyUserId()
    if (chatIdFromQuery) {
      await openChat(chatIdFromQuery)
      if (!chats.value.length) await loadChats()
    } else if (sellerId) {
      await startChat(sellerId, itemId)
    } else {
      await loadChats()
      if (chats.value.length > 0) {
        await openChat(chats.value[0]._id)
      } else {
        conversationUnavailable.value = true
      }
    }
  } catch (err) {
    console.error('Failed to open conversation', err)
    conversationUnavailable.value = true
  } finally {
    loadingConversation.value = false
    scrollToBottom()
  }

  // Check for pending incoming call answered from GlobalIncomingCallModal
  const pending = typeof window !== 'undefined' ? window.__PENDING_CALL_OFFER__ : null
  if (pending && String(pending.chatId) === String(activeChatId.value)) {
    delete window.__PENDING_CALL_OFFER__
    callType.value = pending.type
    activeCall.value = true
    isRemoteMain.value = true
    isAudioMuted.value = false
    callStatus.value = 'Connecting...'
    callInitiator.value = false
    hasLoggedCall.value = false
    
    try {
      peerConnection.value = new RTCPeerConnection(config)
      peerConnection.value.ontrack = (event) => {
        remoteStream.value = event.streams[0]
        if (pending.type === 'video') nextTick(() => { if (remoteVideo.value) remoteVideo.value.srcObject = remoteStream.value })
        nextTick(() => {
          if (remoteAudio.value) {
            remoteAudio.value.srcObject = remoteStream.value
            remoteAudio.value.play().catch(() => {})
          }
        })
      }
      peerConnection.value.onicecandidate = (event) => {
        if (event.candidate && socket.value) {
          socket.value.emit('call-ice-candidate', { chatId: activeChatId.value, candidate: event.candidate })
        }
      }
      if (pending.offer) {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(pending.offer))
        await answerCall()
      }
    } catch (err) {
      console.error('Failed to answer pending incoming call', err)
    }
  } else if (route.query.call === 'voice' || route.query.call === 'video') {
    // Auto-start call if requested via query parameter and not auto-answering
    if (route.query.autoAnswer !== 'true') {
      setTimeout(() => {
        startCall(route.query.call)
      }, 1000)
    }
  }
})

onUnmounted(() => {
  stopRingtone()
  stopCamera()
  if (recordingTimer) clearInterval(recordingTimer)
  if (typingDebounceTimer) clearTimeout(typingDebounceTimer)
  if (remoteTypingTimeout) clearTimeout(remoteTypingTimeout)
  if (remoteMediaTimeout) clearTimeout(remoteMediaTimeout)
  if (mediaStreamRef) mediaStreamRef.getTracks().forEach((track) => track.stop())
  const s = socket.value
  if (s) {
    s.off('call-offer')
    s.off('call-answer')
    s.off('call-ice-candidate')
    s.off('call-end')
    s.off('user-typing')
    s.off('typing')
    s.off('stopTyping')
    s.off('media-uploading')
  }
})

const attachCallListeners = () => {
  const s = socket.value
  if (!s) return

  s.off('call-offer')
  s.off('call-answer')
  s.off('call-ice-candidate')
  s.off('call-end')

  s.on('call-offer', async (data) => {
    callType.value = data.type
    activeCall.value = true
    isRemoteMain.value = true
    isAudioMuted.value = false
    callStatus.value = 'Incoming Call...'
    callStartTime.value = null
    hasLoggedCall.value = false
    callInitiator.value = false

    // Ring out audibly with melodic chime and vibration
    startRingtone()

    peerConnection.value = new RTCPeerConnection(config)
    
    peerConnection.value.ontrack = (event) => {
      remoteStream.value = event.streams[0]
      if (data.type === 'video') nextTick(() => { if (remoteVideo.value) remoteVideo.value.srcObject = remoteStream.value })
      nextTick(() => {
        if (remoteAudio.value) {
          remoteAudio.value.srcObject = remoteStream.value
          remoteAudio.value.play().catch(() => {})
        }
      })
    }
    
    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        s.emit('call-ice-candidate', { chatId: activeChatId.value, candidate: event.candidate })
      }
    }
    
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.offer))
  })

  s.on('call-answer', async (data) => {
    if (callTimeoutTimer) {
      clearTimeout(callTimeoutTimer)
      callTimeoutTimer = null
    }
    stopRingtone()
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.answer))
    callStatus.value = 'Connected'
    callStartTime.value = Date.now()
  })

  s.on('call-ice-candidate', async (data) => {
    if (peerConnection.value) {
      await peerConnection.value.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  })

  s.on('call-end', () => {
    if (callTimeoutTimer) {
      clearTimeout(callTimeoutTimer)
      callTimeoutTimer = null
    }
    stopRingtone()
    if (callInitiator.value && !hasLoggedCall.value) {
      recordCallEvent()
    }
    cleanupCall()
  })

  s.on('user-typing', (data) => {
    if (String(data.chatId) === String(activeChatId.value)) {
      isRemoteTyping.value = !!data.isTyping
      if (data.isTyping) {
        if (remoteTypingTimeout) clearTimeout(remoteTypingTimeout)
        remoteTypingTimeout = setTimeout(() => {
          isRemoteTyping.value = false
        }, 4000)
        nextTick(() => scrollToBottom())
      }
    }
  })

  s.on('typing', (data) => {
    if (String(data.chatId) === String(activeChatId.value)) {
      isRemoteTyping.value = true
      if (remoteTypingTimeout) clearTimeout(remoteTypingTimeout)
      remoteTypingTimeout = setTimeout(() => {
        isRemoteTyping.value = false
      }, 4000)
      nextTick(() => scrollToBottom())
    }
  })

  s.on('stopTyping', (data) => {
    if (String(data.chatId) === String(activeChatId.value)) {
      isRemoteTyping.value = false
    }
  })

  s.on('media-uploading', (data) => {
    if (String(data.chatId) === String(activeChatId.value)) {
      if (data.isUploading) {
        remoteMediaUploading.value = {
          isUploading: true,
          assetType: data.assetType || 'file'
        }
        if (remoteMediaTimeout) clearTimeout(remoteMediaTimeout)
        remoteMediaTimeout = setTimeout(() => {
          remoteMediaUploading.value = null
        }, 45000)
        nextTick(() => scrollToBottom())
      } else {
        remoteMediaUploading.value = null
      }
    }
  })
}

// Watch socket reactively to guarantee call listeners are attached when socket connects
watch(socket, (s) => {
  if (s) attachCallListeners()
}, { immediate: true })

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const formatTime = (value) => {
  try {
    return value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  } catch {
    return ''
  }
}

const replyPreview = (msg) => {
  if (!msg) return 'Attachment'
  if (typeof msg.replyTo === 'object' && msg.replyTo) return msg.replyTo.content || 'Attachment'
  return msg.content || 'Attachment'
}

const setReply = (msg) => {
  replyingTo.value = msg
}

const appendEmoji = (emoji) => {
  newMessage.value += emoji
  resizeTextarea()
  if (messageInput.value) messageInput.value.focus()
}

const resizeTextarea = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = (messageInput.value.scrollHeight) + 'px'
    }
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFile = (e) => {
  const file = e.target.files[0]
  // The Message schema type enum is text | image | voice — video is not supported.
  if (file) {
    pendingFile.value = file
    pendingAsset.value = URL.createObjectURL(file)
  }
}

const cancelAttachment = () => {
  pendingAsset.value = null
  pendingFile.value = null
}

const formatRecordingTime = (secs) => {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

const cancelRecording = () => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
  isRecording.value = false
  recordingSeconds.value = 0
  if (mediaRecorder) {
    mediaRecorder.onstop = null
    try {
      if (mediaRecorder.state !== 'inactive') mediaRecorder.stop()
    } catch {}
  }
  if (mediaStreamRef) {
    mediaStreamRef.getTracks().forEach((track) => track.stop())
    mediaStreamRef = null
  }
  audioChunks = []
  showToast({
    title: 'Cancelled',
    message: 'Voice note cancelled.',
    toastType: 'info'
  })
}

const startRecording = async () => {
  if (!activeChatId.value || isUploading.value || isRecording.value) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStreamRef = stream

    // Choose supported MIME type cross-browser (Chrome, Safari, Firefox, Edge, iOS)
    const mimeCandidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ]
    let selectedMime = ''
    if (typeof MediaRecorder !== 'undefined') {
      selectedMime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || ''
    }

    mediaRecorder = selectedMime ? new MediaRecorder(stream, { mimeType: selectedMime }) : new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunks.push(e.data)
      }
    }

    mediaRecorder.onstop = async () => {
      if (mediaStreamRef) {
        mediaStreamRef.getTracks().forEach((track) => track.stop())
        mediaStreamRef = null
      }
      if (recordingTimer) {
        clearInterval(recordingTimer)
        recordingTimer = null
      }

      if (!activeChatId.value || !audioChunks.length) {
        recordingSeconds.value = 0
        return
      }

      const mimeType = mediaRecorder?.mimeType || selectedMime || 'audio/webm'
      const audioBlob = new Blob(audioChunks, { type: mimeType })
      audioChunks = []
      recordingSeconds.value = 0

      if (audioBlob.size < 200) {
        showToast({
          title: 'Too short',
          message: 'Voice note was too short to send.',
          toastType: 'warning'
        })
        return
      }

      setLocalUploading(true, 'voice note', 'Sending voice note...')
      try {
        const res = await upload_api.uploadFile(audioBlob, 'audio')
        const url = res?.data?.url || res?.data?.data?.url
        if (!url) throw new Error('No URL returned from the upload server')
        await sendChatMessage('Voice note', { type: 'voice', assetUrl: url })
      } catch (err) {
        console.error('Audio upload failed', err)
        showToast({
          title: 'Upload failed',
          message: err?.response?.data?.message || err?.message || 'Could not send the voice note.',
          toastType: 'error'
        })
      } finally {
        setLocalUploading(false)
      }
    }

    // 250ms chunk timeslice for immediate availability
    mediaRecorder.start(250)
    isRecording.value = true
    recordingSeconds.value = 0
    recordingTimer = setInterval(() => {
      recordingSeconds.value++
    }, 1000)
  } catch (err) {
    console.error('Mic access error', err)
    showToast({
      title: 'Microphone permission needed',
      message: 'Please allow microphone access in your browser to record voice notes.',
      toastType: 'error'
    })
  }
}

const stopRecording = () => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
  if (mediaRecorder && isRecording.value) {
    isRecording.value = false
    try {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
    } catch (err) {
      console.warn('Error stopping media recorder', err)
    }
  }
}

const sendMessage = async (e) => {
  if (e && e.shiftKey) return; // Allow Shift+Enter for new line
  if (!newMessage.value.trim() && !pendingFile.value) return
  if (!activeChatId.value) return

  emitTyping(false)

  const fileToSend = pendingFile.value
  let uploadedUrl = ''
  let messageType = 'text'

  if (fileToSend) {
    const mime = fileToSend.type || ''
    const isVideo = mime.startsWith('video/')
    const isAudio = mime.startsWith('audio/')
    const isImage = mime.startsWith('image/')
    const assetKind = isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'photo' : 'file'
    messageType = isVideo ? 'video' : isAudio ? 'voice' : isImage ? 'image' : 'file'

    setLocalUploading(true, assetKind, `Sending ${assetKind}...`)
    try {
      const res = await upload_api.uploadFile(fileToSend, isVideo ? 'video' : isAudio ? 'audio' : 'image')
      uploadedUrl = res?.data?.url || res?.data?.data?.url || ''
      if (!uploadedUrl) throw new Error('No URL returned from the upload server')
    } catch (err) {
      console.error('Upload failed', err)
      showToast({
        title: 'Upload failed',
        message: err?.response?.data?.message || err?.message || 'Could not upload the attachment.',
        toastType: 'error'
      })
      setLocalUploading(false)
      return
    } finally {
      setLocalUploading(false)
    }
  }

  const content = newMessage.value.trim() || (fileToSend ? (fileToSend.name || 'Attachment') : '')
  const replyTo = replyingTo.value?._id

  // Warn student if message appears to bypass escrow with phone numbers or direct bank transfers
  const nigerianPhoneRegex = /(?:0[789][01]\d{8}|\+?234\s?[789][01]\d{8})/
  const offPlatformKeywords = /(?:whatsapp|dm on ig|transfer to my account|pay outside|send account number|pay to my opay|pay cash)/i
  if (nigerianPhoneRegex.test(content) || offPlatformKeywords.test(content)) {
    showToast({
      title: '🛡️ Safety Reminder',
      message: 'Never pay directly or share payment details outside Decluttered. Pay through Escrow so your money is 100% protected!',
      toastType: 'warning',
      duration: 6000
    })
  }

  newMessage.value = ''
  cancelAttachment()
  replyingTo.value = null
  showEmojis.value = false
  if (messageInput.value) messageInput.value.style.height = 'auto'

  try {
    await sendChatMessage(content, {
      type: uploadedUrl ? messageType : 'text',
      assetUrl: uploadedUrl || undefined,
      replyTo,
    })
  } catch (err) {
    // The composable has already surfaced the failure.
  }
}

const startCall = async (type) => {
  if (!socket.value) {
    showToast({ title: 'Notice', message: 'Still connecting to chat. Please try again in a moment.', toastType: 'error' })
    return
  }
  initAudioUnlock()
  callType.value = type
  activeCall.value = true
  isRemoteMain.value = true
  isAudioMuted.value = false
  callStatus.value = 'Calling...'
  callStartTime.value = null
  hasLoggedCall.value = false
  callInitiator.value = true

  // Play ringback tone so caller hears phone ringing out
  startRingbackTone()

  // Auto-timeout if call is not answered within 35 seconds
  if (callTimeoutTimer) clearTimeout(callTimeoutTimer)
  callTimeoutTimer = setTimeout(() => {
    if (activeCall.value && (!callStartTime.value || callStatus.value === 'Calling...')) {
      showToast({ title: 'Call Unanswered', message: 'No answer from trader.', toastType: 'warning' })
      endCall()
    }
  }, 35000)
  
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
    if (type === 'video') nextTick(() => { if (localVideo.value) localVideo.value.srcObject = localStream.value })
    
    peerConnection.value = new RTCPeerConnection(config)
    localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value))
    
    peerConnection.value.ontrack = (event) => {
      remoteStream.value = event.streams[0]
      if (type === 'video') nextTick(() => { if (remoteVideo.value) remoteVideo.value.srcObject = remoteStream.value })
      nextTick(() => {
        if (remoteAudio.value) {
          remoteAudio.value.srcObject = remoteStream.value
          remoteAudio.value.play().catch(() => {})
        }
      })
    }
    
    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        socket.value.emit('call-ice-candidate', { chatId: activeChatId.value, candidate: event.candidate })
      }
    }
    
    const offer = await peerConnection.value.createOffer()
    await peerConnection.value.setLocalDescription(offer)
    socket.value.emit('call-offer', {
      chatId: activeChatId.value,
      offer,
      type,
      callerName: activeChat.value ? (otherParticipant(activeChat.value)?.firstName || 'Trader') : 'Trader'
    })
  } catch (err) {
    if (callTimeoutTimer) {
      clearTimeout(callTimeoutTimer)
      callTimeoutTimer = null
    }
    stopRingtone()
    showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
    cleanupCall()
  }
}

const answerCall = async () => {
  if (callTimeoutTimer) {
    clearTimeout(callTimeoutTimer)
    callTimeoutTimer = null
  }
  stopRingtone()
  callStatus.value = 'Connecting...'
  isRemoteMain.value = true
  isAudioMuted.value = false
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: callType.value === 'video', audio: true })
    if (callType.value === 'video') nextTick(() => { if (localVideo.value) localVideo.value.srcObject = localStream.value })
    
    localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value))
    
    const answer = await peerConnection.value.createAnswer()
    await peerConnection.value.setLocalDescription(answer)
    socket.value.emit('call-answer', { chatId: activeChatId.value, answer })
    callStatus.value = 'Connected'
    callStartTime.value = Date.now()
  } catch (err) {
    stopRingtone()
    showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
    endCall()
  }
}

const endCall = () => {
  if (callTimeoutTimer) {
    clearTimeout(callTimeoutTimer)
    callTimeoutTimer = null
  }
  stopRingtone()
  const currentChatId = activeChatId.value
  if (socket.value && currentChatId) {
    socket.value.emit('call-end', { chatId: currentChatId })
  }
  if (!hasLoggedCall.value) {
    recordCallEvent()
  }
  cleanupCall()
}

const cleanupCall = () => {
  if (callTimeoutTimer) {
    clearTimeout(callTimeoutTimer)
    callTimeoutTimer = null
  }
  stopRingtone()
  activeCall.value = false
  callStatus.value = ''
  isRemoteMain.value = true
  isAudioMuted.value = false
  callStartTime.value = null
  if (remoteAudio.value) {
    try {
      remoteAudio.value.srcObject = null
    } catch {}
  }
  if (localStream.value) localStream.value.getTracks().forEach(t => t.stop())
  if (peerConnection.value) peerConnection.value.close()
  localStream.value = null
  remoteStream.value = null
  peerConnection.value = null
  if (typeof window !== 'undefined') {
    delete window.__PENDING_CALL_OFFER__
  }
}
// --- Camera Logic ---
const showCamera = ref(false)
const videoElement = ref(null)
const canvasElement = ref(null)
const cameraStream = ref(null)
const facingMode = ref('environment')

const startCamera = async () => {
  showCamera.value = true;
  try {
    if (cameraStream.value) {
      cameraStream.value.getTracks().forEach(track => track.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value }
    });
    cameraStream.value = stream;
    nextTick(() => {
      if (videoElement.value) {
        videoElement.value.srcObject = stream;
      }
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
    showToast({ title: 'Camera Error', message: 'Could not access the camera.', toastType: 'error' });
    showCamera.value = false;
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop());
    cameraStream.value = null;
  }
  showCamera.value = false;
}

const switchCamera = () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment';
  startCamera(); // Restart with new facing mode
}

const capturePhoto = async () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  const video = videoElement.value;
  const canvas = canvasElement.value;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    
    // Stop camera immediately after capture to show we're processing
    stopCamera();
    
    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    setLocalUploading(true, 'photo', 'Sending captured photo...');
    try {
      const res = await upload_api.uploadFile(file, 'image');
      const url = res?.data?.url || res?.data?.data?.url;
      if (url) {
        await sendChatMessage('📷 Photo sent', { type: 'image', assetUrl: url });
      }
    } catch (err) {
      console.error('Failed to upload captured photo', err);
      showToast({ title: 'Upload Failed', message: 'Failed to upload photo. Please try again.', toastType: 'error' });
    } finally {
      setLocalUploading(false);
    }
  }, 'image/jpeg', 0.8);
}

// Keep the view pinned to the newest message and clear transient live indicators.
watch(messages, async () => {
  isRemoteTyping.value = false;
  remoteMediaUploading.value = null;
  await nextTick();
  scrollToBottom();
}, { deep: true })
</script>

<style scoped>
/* Tray Slide Animation */
.tray-slide-enter-active,
.tray-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.tray-slide-enter-from,
.tray-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
