export interface DevTelemetryToolbarContextType {
  isEnabled: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  dismissToolbar: () => void
}
