import {
  Calendar,
  ChartArea,
  ChartBar,
  ChartNoAxesCombined,
  Home,
  ListChecks,
  User,
  Zap,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Hedefte",
  description: "Make beautiful websites regardless of your design experience.",
  dashboardNavItems: [
    {
      label: "Anasayfa",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "TYT Analizlerim",
      href: "/dashboard/analiz?exam=TYT",
      icon: ChartArea,
    },
    {
      label: "AYT SAY Analizlerim",
      href: "/dashboard/analiz?exam=AYT_SAY",
      icon: ChartNoAxesCombined,
    },
    {
      label: "AYT EA Analizlerim",
      href: "/dashboard/analiz?exam=AYT_EA",
      icon: ChartBar,
    },

    {
      label: "Konu Takibi",
      href: "/dashboard/takip",
      icon: ListChecks,
    },
    {
      label: "Çalışma Programı",
      href: "/dashboard/program",
      icon: Calendar,
    },

    {
      label: "Hızlı Okuma",
      href: "/dashboard/okuma",
      icon: Zap,
    },
  ],
  sidebarFooterItems: [
    {
      label: "Profil",
      href: "/dashboard/profil",
      icon: User,
    },
  ],
  navItems: [
    {
      label: "Anasayfa",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Forum",
      href: "/forum",
    },

    {
      label: "Bize Ulaşın",
      href: "/contact",
    },
    {
      label: "SSS",
      href: "/faq",
    },
  ],
  navMenuItems: [
    {
      label: "Anasayfa",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Forum",
      href: "/forum",
    },

    {
      label: "Bize Ulaşın",
      href: "/contact",
    },
    {
      label: "SSS",
      href: "/faq",
    },
    {
      label: "Giriş Yap",
      href: "/login",
    },
    {
      label: "Üye Ol",
      href: "/register",
    },
  ],
  legal: [
    {
      label: "Kullanım Sözleşmesi",
      href: "#kullanım",
    },
    {
      label: "Gizlilik Politikası",
      href: "#gizlilik",
    },
    {
      label: "KVKK Aydınlatma Metni",
      href: "#kvkk",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
