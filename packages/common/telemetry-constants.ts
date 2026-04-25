/**
 * Event types for in-app telemetry callbacks. Kept minimal to what the app actually uses.
 *
 * @module telemetry-constants
 */

export type TelemetryGroups = {
  project: string
  organization: string
}

/**
 * User opened the command menu.
 */
export interface CommandMenuOpenedEvent {
  action: 'command_menu_opened'
  properties: {
    /** The trigger that opened the command menu */
    trigger_type: 'keyboard_shortcut' | 'search_input'
    /** The location where the command menu was opened */
    trigger_location?: string
    /** In which app the command input was typed */
    app: 'studio' | 'docs' | 'www'
  }
  groups: Partial<TelemetryGroups>
}

/**
 * User typed a search term in the command menu input.
 */
export interface CommandMenuSearchSubmittedEvent {
  action: 'command_menu_search_submitted'
  properties: {
    /** Search term typed into the command menu input */
    value: string
    /** In which app the command input was typed */
    app: 'studio' | 'docs' | 'www'
  }
  groups: Partial<TelemetryGroups>
}

/**
 * User clicked a command from the command menu.
 */
export interface CommandMenuCommandClickedEvent {
  action: 'command_menu_command_clicked'
  properties: {
    command_name: string
    command_value?: string
    command_type: 'action' | 'route'
    search_query?: string
    result_path?: string
    app: 'studio' | 'docs' | 'www'
  }
  groups: Partial<TelemetryGroups>
}

/**
 * User closed the command menu.
 */
export interface CommandMenuClosedEvent {
  action: 'command_menu_closed'
  properties: {
    app: 'studio' | 'docs' | 'www'
  }
  groups: Partial<TelemetryGroups>
}

export type CommandMenuTelemetryEvent =
  | CommandMenuOpenedEvent
  | CommandMenuClosedEvent
  | CommandMenuSearchSubmittedEvent
  | CommandMenuCommandClickedEvent
