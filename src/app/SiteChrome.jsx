"use client";

import SiteNav from "@/components/SiteNav.jsx";
import CustomCursor from "@/components/CustomCursor.jsx";
import ClickBurst from "@/components/ClickBurst.jsx";
import ThemeSwitcher from "@/components/ThemeSwitcher.jsx";
import { useThemeContext } from "@/components/ThemeProvider.jsx";

export default function SiteChrome({ haProgetti }) {
  const { mode, setMode } = useThemeContext();

  return (
    <>
      <SiteNav haProgetti={haProgetti} />
      <CustomCursor />
      <ClickBurst />
      <ThemeSwitcher mode={mode} setMode={setMode} />
    </>
  );
}
