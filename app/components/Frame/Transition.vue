<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-in-out"
    leave-active-class="transition-all duration-300 ease-in-out"
    enter-from-class="opacity-0 max-h-0"
    enter-to-class="opacity-100 max-h-[500px]"
    leave-from-class="opacity-100 max-h-[500px]"
    leave-to-class="opacity-0 max-h-0"
  >
    <slot />
  </Transition>
</template>
