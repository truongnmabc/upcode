import { IAppInfo } from "@/models/AppInfo";
import { getKeyTheme } from "@/utils/web";
import { useTheme } from "next-themes";
import * as ga from "../../services/ga";
import "./SwitchTheme.scss";
import useThemeCustom from "../v4-material/useThemeCustom";

export default function SwitchTheme({ appInfo }: { appInfo: IAppInfo }) {
    const { theme, setTheme } = useThemeCustom();

    const onclick = (e) => {
        const key = getKeyTheme(appInfo);

        ga.event({
            action: "switch_light_dark_mode",
            params: {
                value: theme == "light" ? "dark" : "light",
            },
        });

        if ("dark" == theme) {
            setTheme("light");
            localStorage.setItem(key, "light");
        } else {
            setTheme("dark");
            localStorage.setItem(key, "dark");
        }
    };

    return (
        <div
            className={"switch-theme " + (theme == "dark" ? "dark" : "light")}
            onClick={(e) => {
                onclick(e);
            }}
        >
            <div id="switch-theme-switch-thumb"></div>
        </div>
    );
}
