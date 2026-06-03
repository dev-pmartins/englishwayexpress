import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { to: "/area-do-aluno",                        exact: true,  labelKey: "sidebarHub" },
  { to: "/area-do-aluno/complementary-material", exact: false, labelKey: "sidebarComplementary" },
  { to: "/area-do-aluno/tips",                   exact: false, labelKey: "sidebarTips" },
  { to: "/area-do-aluno/practice",               exact: false, labelKey: "sidebarPractice" },
];

export default function StudentSidebar() {
  const { t } = useTranslation();

  return (
    <nav className="sidebar-section" aria-label={t("sidebarNavTitle")}>
      <h4>{t("sidebarNavTitle")}</h4>
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) => isActive ? "sidebar-link--active" : undefined}
            >
              {t(item.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
