
const THEMES: Themes = {
  dark: {
    textColor: "white",
    backgroundColor: "black",
    modalBackgroundColor: "rgba(0, 0, 0, 0.9)",
    accentColor: "hsl(213, 99%, 50%);",
    closeIcon: "url('../../assets/icons/close-icon-dark.svg')",
    gearIcon: "url('../../assets/icons/gear-icon-dark.svg')",
    patternIcon: "url('../../assets/icons/pattern-icon-dark.svg')",
    speedIcon: "url('../../assets/icons/speed-icon-dark.svg')",
    trailIcon: "url('../../assets/icons/trail-icon-dark.svg')"
},
  light: {
    textColor: "black",
    backgroundColor: "white",
    modalBackgroundColor: "rgba(255, 255, 255, 0.9)",
    accentColor: "hsl(213, 99%, 50%);",
    closeIcon: "url('../../assets/icons/close-icon-light.svg')",
    gearIcon: "url('../../assets/icons/gear-icon-light.svg')",
    patternIcon: "url('../../assets/icons/pattern-icon-light.svg')",
    speedIcon: "url('../../assets/icons/speed-icon-light.svg')",
    trailIcon: "url('../../assets/icons/trail-icon-light.svg')"
  }
};

type Themes = {
  dark: Theme;
  light: Theme;
}

type Theme = {
  textColor: string;
  backgroundColor: string;
  modalBackgroundColor: string;
  accentColor: string;
  closeIcon: string;
  gearIcon: string;
  patternIcon: string;
  speedIcon: string;
  trailIcon: string;
}

export class Themer {
  static updateTheme(isDark: boolean): void {
    Themer.setCSSVariables(isDark ? THEMES.dark : THEMES.light);
  }

  private static setCSSVariables(theme: Theme): void {
    let key: keyof Theme;
    for (key in theme) {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    }
  }
}