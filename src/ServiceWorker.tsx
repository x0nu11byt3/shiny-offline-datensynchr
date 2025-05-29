const isLocalhost: boolean = Boolean( 
    window.location.hostname === 'localhost' ||  
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

interface Config {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

function registerValidServiceWorker(serviceWorkerURL: string, config?: Config): void {
    navigator.serviceWorker
      .register(serviceWorkerURL)
      .then((registration: ServiceWorkerRegistration) => {
        registration.onupdatefound = () => {
          const installingWorker: ServiceWorker | null = registration.installing
          if (installingWorker == null) { return }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available and will be used when all ' )
                if (config && config.onUpdate) {
                  config.onUpdate(registration)
                }
              } else {
                console.log('Content is cached for offline use.')
  
                if (config && config.onSuccess) {
                  config.onSuccess(registration)
                }
              }
            }
          }
        }
      })
      .catch((error: Error) => {
        console.error('Error during service worker registration:', error)
      })
  }
  

function checkValidServiceWorker(serviceWorkerURL: string, config?: Config): void {
    fetch(serviceWorkerURL, { headers: { 'Service-Worker': 'script' } })
      .then((response: Response) => {
        const contentType: string | null = response.headers.get('content-type')
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
            registration.unregister().then(() => {
              window.location.reload()
            })
          })
        } else {
          registerValidServiceWorker(serviceWorkerURL, config)
        }
      })
      .catch(() => {
        console.log(
          'No internet connection found. App is running in offline mode.'
        )
      })
  }

export function register(config?: Config): void {
  if ('serviceWorker' in navigator) {
    const publicUrl: URL = new URL(import.meta.env.PUBLIC_URL as string, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    window.addEventListener('load', () => {
      const serviceWorkerURL: string = `${import.meta.env.PUBLIC_URL}/ServiceWorker.ts`

      if (isLocalhost) {
        checkValidServiceWorker(serviceWorkerURL, config)
        navigator.serviceWorker.ready.then(() => {
          console.log('This app is being served cache-first by a service')
        })
      } else {
        registerValidServiceWorker(serviceWorkerURL, config)
      }
    })
  }
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration: ServiceWorkerRegistration) => {
        registration.unregister()
      })
      .catch((error: Error) => {
        console.error(error.message)
      })
  }
}