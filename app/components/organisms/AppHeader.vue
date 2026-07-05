<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '@lucide/vue'

const { loggedIn, clear: clearSession } = useUserSession()

interface LoginSignUpProp {
  isAuth?: boolean
}

const props = withDefaults(defineProps<LoginSignUpProp>(), {
  isAuth: false,
})

const isOpen = ref(false)

const logout = async () => {
  await clearSession()
  await navigateTo('/login')
}

const navLinks = [
  { name: 'Current Weather', href: '/' },
  { name: 'Weather Lists', href: '/weather-lists' },
]
</script>

<template>
  <header class="bg-background z-50 h-16 w-full border-b">
    <div class="container mx-auto flex h-full items-center justify-between px-4">
      <h1 class="text-2xl font-bold">
        <NuxtLink to="/">GWeather</NuxtLink>
      </h1>

      <nav class="hidden items-center gap-4 sm:flex">
        <template v-if="isAuth">
          <NuxtLink to="/" class="hover:text-primary text-sm font-medium">Landing Page</NuxtLink>
          <ThemeToggle />
        </template>
        <template v-else>
          <NuxtLink to="/" class="hover:text-primary text-sm font-medium">Current Weather</NuxtLink>
          <NuxtLink to="/weather-lists" class="hover:text-primary text-sm font-medium"
            >Weather Lists</NuxtLink
          >
          <Button v-if="loggedIn" variant="outline" class="cursor-pointer" @click.prevent="logout">
            Logout
          </Button>
          <NuxtLink v-else to="/login" class="hover:text-primary text-sm font-medium"
            >Login & Signup</NuxtLink
          >
          <ThemeToggle />
        </template>
      </nav>

      <div class="flex items-center gap-2 sm:hidden">
        <ThemeToggle />
        <Drawer v-model:open="isOpen" direction="right">
          <DrawerTrigger as-child>
            <Button variant="ghost" size="icon">
              <Menu class="h-6 w-6" />
              <span class="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>

          <DrawerContent class="right-0 left-auto h-full w-[80%] max-w-75 rounded-l-xl border-l">
            <div class="bg-background flex h-full flex-col">
              <DrawerHeader class="border-b text-left">
                <DrawerTitle>GWeather</DrawerTitle>
              </DrawerHeader>

              <div class="flex-1 overflow-y-auto p-4">
                <nav class="flex flex-col gap-4">
                  <template v-if="isAuth">
                    <DrawerClose as-child>
                      <NuxtLink to="/" class="hover:text-primary block py-2 text-lg font-medium">
                        Landing Page
                      </NuxtLink>
                    </DrawerClose>
                  </template>
                  <template v-else>
                    <DrawerClose v-for="link in navLinks" :key="link.name" as-child>
                      <NuxtLink
                        :to="link.href"
                        class="hover:text-primary text-md block py-2 font-medium"
                      >
                        {{ link.name }}
                      </NuxtLink>
                    </DrawerClose>

                    <div class="mt-4 flex flex-col gap-2 border-t pt-4">
                      <Button
                        v-if="loggedIn"
                        variant="outline"
                        class="w-full justify-start"
                        @click="logout"
                      >
                        Logout
                      </Button>
                      <DrawerClose v-else as-child>
                        <NuxtLink
                          to="/login"
                          class="hover:text-primary block py-2 text-lg font-medium"
                        >
                          Login & Signup
                        </NuxtLink>
                      </DrawerClose>
                    </div>
                  </template>
                </nav>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  </header>
</template>
