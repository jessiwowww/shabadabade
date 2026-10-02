"use client";

import CustomCursor from "@/components/CustomCursor.jsx";
import ClickBurst from "@/components/ClickBurst.jsx";
import ThemeSwitcher from "@/components/ThemeSwitcher.jsx";
import { useThemeContext } from "@/components/ThemeProvider.jsx";

export default function SiteChrome() {
  const { mode, setMode } = useThemeContext();

  return (
    <>
      <CustomCursor />
      <ClickBurst />
      <ThemeSwitcher mode={mode} setMode={setMode} />
    </>
  );
}
