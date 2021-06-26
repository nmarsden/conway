
const THEMES: Themes = {
  dark: {
    textColor: "white",
    backgroundColor: "black",
    modalBackgroundColor: "rgba(0, 0, 0, 0.9)",
    accentColor: "hsl(213, 99%, 50%);",
},
  light: {
    textColor: "black",
    backgroundColor: "white",
    modalBackgroundColor: "rgba(255, 255, 255, 0.9)",
    accentColor: "hsl(213, 99%, 50%);",
  }
};

const ICONS = ["closeIcon", "gearIcon", "patternIcon", "speedIcon", "trailIcon"];

type Themes = {
  dark: Theme;
  light: Theme;
}

type Theme = {
  textColor: string;
  backgroundColor: string;
  modalBackgroundColor: string;
  accentColor: string;
}

export class Themer {
  static updateTheme(isDark: boolean): void {
    Themer.setCSSVariables(isDark);
  }

  private static setCSSVariables(isDark: boolean): void {
    const theme = isDark ? THEMES.dark : THEMES.light
    let key: keyof Theme;
    for (key in theme) {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    }
    // Set icon CSS variables
    const themeSuffix = isDark ? "Dark" : "Light";
    ICONS.forEach(icon => {
      const iconValue = getComputedStyle(document.documentElement).getPropertyValue(`--${icon}${themeSuffix}`);
      document.documentElement.style.setProperty(`--${icon}`, iconValue);
    });
  }
}