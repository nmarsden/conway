import {h} from 'preact';
import {ThemeToggle, ThemeToggleProps} from '../components/themeToggle';
import {Meta, Story} from "@storybook/preact";
import { useArgs } from '@storybook/client-api';

export default {
  title: 'ThemeToggle',
  component: ThemeToggle,
  args: {
    isDark: true
  }
} as unknown as Meta;

type ThemeToggleStoryArgs = Omit<ThemeToggleProps, "onThemeChanged">;

const backgroundStyles = (isDark: boolean): h.JSX.CSSProperties => {
  return {
    backgroundColor: isDark ? 'black' : 'white',
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0'
  }
}

const Template: Story<ThemeToggleStoryArgs> = (args) => {
  const [{ isDark }, updateArgs] = useArgs();
  const onThemeChanged = (): void => updateArgs({ isDark: !isDark });
  const props = {
    isDark: args.isDark,
    onThemeChanged
  };
  return <div style={backgroundStyles(args.isDark)}><ThemeToggle {...props} /></div>;
}

export const Example = Template.bind({});
