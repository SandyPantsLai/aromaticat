'use client'

import { useEffect, useState } from 'react'

import { IS_PROD } from '../constants'

const defaultLight: { [name: string]: string } = {
  '--brand-accent': '152.9deg 60% 52.9%',
  '--brand-default': '152.9deg 60% 52.9%',
  '--brand-600': '153.2deg 49.7% 33.5%',
  '--brand-500': '148.7deg 42.7% 69.2%',
  '--brand-400': '149.1deg 59.3% 88.4%',
  '--brand-300': '148.6deg 77.8% 94.7%',
  '--brand-200': '156deg 71.4% 98.6%',
  '--border-stronger': '205deg 10.7% 78%',
  '--border-strong': '210deg 11.1% 85.9%',
  '--border-secondary': '210deg 11.8% 93.3%',
  '--border-alternative': '216deg 11.1% 91.2%',
  '--border-control': '205.7deg 12.3% 88.8%',
  '--border-overlay': '216deg 11.1% 91.2%',
  '--border-muted': '210deg 11.8% 93.3%',
  '--border-default': '216deg 11.1% 91.2%',
  '--background-overlay-hover': '210deg 16.7% 95.3%',
  '--background-overlay-default': '210deg 33.3% 98.8%',
  '--background-surface-300': '210deg 11.8% 93.3%',
  '--background-surface-200': '210deg 16.7% 95.3%',
  '--background-surface-100': '210deg 33.3% 98.8%',
  '--background-control': '210deg 16.7% 95.3%',
  '--background-selection': '210deg 11.8% 93.3%',
  '--background-muted': '210deg 10% 93%',
  '--background-alternative': '210deg 10% 100%',
  '--background-default': '210deg 16.7% 97.6%',
  '--foreground-muted': '205.7deg 6.3% 56.1%',
  '--foreground-lighter': '205.7deg 5.7% 52.2%',
  '--foreground-light': '205.7deg 6.3% 43.5%',
  '--foreground-default': '201.8deg 24.4% 8.8%',
}

/**
 * Shows a GUI to test color tokens in dev and preview env.
 *
 * To access sandbox mode:
 * - append "#theme-sandbox" to the url
 * - select "Apply Theme" to apply preset (localStorage will keep track of changes so you don't lose new values)
 * - select "Reset localStorage" and refresh page to restart
 */
export const useThemeSandbox = (): any => {
  const isWindowUndefined = typeof window === 'undefined'
  if (isWindowUndefined || IS_PROD) return null
  const hash = window.location.hash
  const defaultConfig = defaultLight
  const localPreset = localStorage.getItem('theme-sandbox')
  const isSandbox = hash.includes('#theme-sandbox') || localPreset !== null
  const [themeConfig, setThemeConfig] = useState(
    localPreset ? JSON.parse(localPreset) : defaultConfig
  )
  const styles = document.querySelector(':root') as any

  const handleSetThemeConfig = (name: string, value: any) => {
    updateCSSVariables()
    setThemeConfig((prevConfig: any) => ({ ...prevConfig, [name]: value }))
  }

  const updateCSSVariables = () => {
    Object.entries(themeConfig).map(([key, value]) => styles.style.setProperty(key, value))
    localStorage.setItem('theme-sandbox', JSON.stringify(themeConfig))
  }

  const init = async () => {
    if (!isSandbox) return
    const dat = await import('dat.gui')
    const gui = new dat.GUI()

    gui.width = 500

    Object.entries(defaultConfig).map(([key, _value]) => {
      if (!themeConfig[key]) return localStorage.removeItem('theme-sandbox')
      const folderName = key.split('-')[2]
      const folder = gui.__folders[folderName] ?? gui.addFolder(folderName)

      return folder
        .add(themeConfig, key)
        .name(key)
        .onChange((newValue) => {
          handleSetThemeConfig(key, newValue)
        })
    })

    var obj = {
      'Apply Theme': function () {
        updateCSSVariables()
      },
      'Exit Sandbox': function () {
        gui.destroy()
      },
      'Reset localStorage': function () {
        localStorage.removeItem('theme-sandbox')
        setThemeConfig(defaultConfig)
      },
    }

    gui.add(obj, 'Apply Theme')
    gui.add(obj, 'Reset localStorage')
    gui.add(obj, 'Exit Sandbox')
    gui.load
  }

  useEffect(() => {
    init()
  }, [])

  return { themeConfig, handleSetThemeConfig, isSandbox }
}

export default useThemeSandbox
